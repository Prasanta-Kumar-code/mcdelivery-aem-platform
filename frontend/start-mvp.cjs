const { startServer } = require('./node_modules/next/dist/server/lib/start-server.js');

async function main() {
  await startServer({
    dir: __dirname,
    isDev: false,
    hostname: '0.0.0.0',
    port: 4200,
    keepAliveTimeout: 5000,
  });
}
main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
