import allProjects from './projects.json';

// Keep older detail URLs working while curating the public collection.
export { allProjects };
export default allProjects
  .filter((project) => !project.archived)
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
