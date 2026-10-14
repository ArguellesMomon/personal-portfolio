import { mkdir, writeFile } from 'node:fs/promises';

const owner = 'ArguellesMomon';
const headers = { 'User-Agent': 'Portfolio-Project-Review', Accept: 'application/vnd.github+json' };
const directory = new URL('../.cache/project-review/', import.meta.url);
await mkdir(directory, { recursive: true });

async function request(url, json = true) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return json ? response.json() : response.text();
}

// Discover every public repository so newly added projects are reviewed too.
const repos = [];
for (let page = 1; ; page++) {
  const batch = await request(
    `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&page=${page}`,
  );
  if (!Array.isArray(batch)) throw new Error('Could not load repositories');
  repos.push(...batch);
  if (batch.length < 100) break;
}
const reviewedAt = new Date().toISOString();
await writeFile(
  new URL('repositories.json', directory),
  JSON.stringify({ reviewedAt, repos }, null, 2),
);
const summary = [];
for (const repo of repos) {
  const { name } = repo;
  const tree = await request(
    `https://api.github.com/repos/${owner}/${name}/git/trees/${repo.default_branch}?recursive=1`,
  );
  if (tree.truncated) throw new Error(`Repository tree is incomplete: ${name}`);
  const paths = (tree.tree || [])
    .filter((item) => item.type === 'blob')
    .map((item) => item.path)
    .filter((path) => !/node_modules|package-lock|yarn.lock|\.git\//.test(path));
  const shallowest = (pattern) =>
    paths
      .filter((path) => pattern.test(path))
      .sort((a, b) => a.split('/').length - b.split('/').length)[0];
  const readmePath = shallowest(/(^|\/)readme\.md$/i);
  const packagePath = shallowest(/(^|\/)package\.json$/);
  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${repo.default_branch}/`;
  const readme = readmePath ? await request(rawBase + readmePath, false) : '';
  const packageJson = packagePath ? await request(rawBase + packagePath, false) : '';
  await writeFile(
    new URL(`${name}.json`, directory),
    JSON.stringify(
      {
        name,
        url: repo.html_url,
        homepage: repo.homepage,
        branch: repo.default_branch,
        pushedAt: repo.pushed_at,
        reviewedAt,
        readmePath,
        packagePath,
        paths,
        readme,
        packageJson,
      },
      null,
      2,
    ),
  );
  summary.push({
    name,
    pushedAt: repo.pushed_at,
    homepage: repo.homepage,
    paths: paths
      .filter((path) =>
        /README|screen|image|\.png$|\.jpg$|\.webp$|(^|\/)App\.|pages\/|screens\//i.test(path),
      )
      .slice(0, 45),
    readme: readme.slice(0, 12000),
    packageJson,
  });
}
await writeFile(new URL('summary.json', directory), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
