import achievements from './achievements.json';

// Vite emits every original PDF/photo as an asset with a production-safe URL.
const originals = import.meta.glob('../Certificates/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

export default achievements.map((item) => ({
  ...item,
  documentUrl: originals['../Certificates/' + item.sourceFile],
}));
