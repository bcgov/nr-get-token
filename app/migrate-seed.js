const exec = require('child_process').exec;

/**
 * @function execShellCommand
 * Executes a shell command and returns it as a Promise.
 * @param {string} cmd The command to execute
 * @return {Promise} A promise
 */
function execShellCommand(cmd) {
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) throw(error);
      console.log(stdout ? stdout : stderr); // eslint-disable-line no-console
      resolve();
    });
  });
}

(async () => {
  const basePath = process.env.SERVER_BASEPATH;

  // Run DB Migration - This always happens
  await execShellCommand('npm run migrate');

  // If this is a PR, clear any seed data and re-seed the DB
  if (basePath && typeof basePath === 'string' && basePath.startsWith('/pr-')) {
    await execShellCommand('npm run seed:dev:undo');
    await execShellCommand('npm run seed:dev');
  }
})();
