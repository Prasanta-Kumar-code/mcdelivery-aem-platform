const { startServer } = require('/c/Users/pkhatei/cloud-sdk/MCDONALD/frontend/node_modules/next/dist/server/lib/start-server.js');

async function main() {
  await startServer({
    dir: '/c/Users/pkhatei/cloud-sdk/MCDONALD/frontend',
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
