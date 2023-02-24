/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./public'],
  server:
    process.env.NODE_ENV === 'development' ? './server-dev.ts' : './server.ts',
  serverPlatform: 'neutral',
  serverModuleFormat: 'esm',
  serverConditions: ['worker', process.env.NODE_ENV],
  serverMainFields: ['browser', 'module', 'main'],
  assetsBuildDirectory: 'dist/client/build',
  serverBuildPath: 'dist/worker/index.js',
  serverDependenciesToBundle: 'all',
  serverBuildTarget: 'vercel',
};
