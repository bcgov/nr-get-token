const exec = require('child_process').exec;

/**
 * @function execShellCommand
 * Executes a shell command and returns it as a Promise.
 * @param {string} cmd The command to execute
 * @return {Promise} A promise
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error); // eslint-disable-line no-console
        reject(error);
      } else {
        console.log(stdout ? stdout : stderr); // eslint-disable-line no-console
        resolve();
      }
    });
  });
}

(async () => {
  const basePath = process.env.SERVER_BASEPATH;

  // Run DB Migration - This always happens
  await execShellCommand('npm run migrate');

  // If this is a PR, clear any seed data and re-seed the DB
  if (basePath && typeof basePath === 'string' && basePath.startsWith('/pr-')) {
    try {
      await execShellCommand('npm run seed:dev');
    } catch (error) {
      console.log('Dev data already seeded'); // eslint-disable-line no-console
      process.exit(0);
    }
  }
})();
