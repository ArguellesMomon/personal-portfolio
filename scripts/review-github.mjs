import { mkdir, writeFile } from 'node:fs/promises';

const owner = 'ArguellesMomon';
const headers = { 'User-Agent': 'Portfolio-Project-Review', Accept: 'application/vnd.github+json' };
const wanted = [
  'Pickleball-Locator-App',
  'pinoy-recipe-finder',
  'study-spot-ph',
  'AedesCapella-Dashboard',
  'C4A-Dashboard',
  'Photobooth-app',
  'MedTech-Internship-App',
  'travel-diary',
  'online-ordering-system-react-native',
  'job-finder-app',
  'Arguelles-Richmond-mobile-portfolio',
];
const directory = new URL('../.cache/project-review/', import.meta.url);
await mkdir(directory, { recursive: true });
const repos = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100`, {
  headers,
}).then((response) => response.json());
if (!Array.isArray(repos)) throw new Error(repos.message || 'Could not load repositories');
const summary = [];
for (const name of wanted) {
  const repo = repos.find((item) => item.name === name);
  if (!repo) continue;
  const tree = await fetch(
    `https://api.github.com/repos/${owner}/${name}/git/trees/${repo.default_branch}?recursive=1`,
    { headers },
  ).then((response) => response.json());
  const paths = (tree.tree || [])
    .map((item) => item.path)
    .filter((path) => !/node_modules|package-lock|yarn.lock|\.git\//.test(path));
  const readmePath = paths.find((path) => /^readme\.md$/i.test(path));
  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${repo.default_branch}/`;
  const readme = readmePath
    ? await fetch(rawBase + readmePath).then((response) => response.text())
    : '';
  const packageJson = paths.includes('package.json')
    ? await fetch(rawBase + 'package.json').then((response) => response.text())
    : '';
  await writeFile(
    new URL(`${name}.json`, directory),
    JSON.stringify(
      {
        name,
        url: repo.html_url,
        homepage: repo.homepage,
        branch: repo.default_branch,
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
    homepage: repo.homepage,
    paths: paths
      .filter((path) =>
        /README|screen|image|\.png$|\.jpg$|\.webp$|(^|\/)App\.|pages\/|screens\//i.test(path),
      )
      .slice(0, 45),
    readme: readme.slice(0, 7000),
    packageJson,
  });
}
console.log(JSON.stringify(summary, null, 2));
