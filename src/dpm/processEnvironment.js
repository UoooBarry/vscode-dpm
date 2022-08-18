const execShell = require('../utils/execShell');

class EnvironmentError extends Error {
  constructor(message, items = []) {
    super(message);

    this.items = items;
  }
}

const checkRubyVersion = async () => {
  const cmd = 'ruby -v';
  const rubyVersion = await execShell(cmd);

  if (!rubyVersion) {
    throw new EnvironmentError('Cannot detect ruby version');
  }
};

const checkDockerRunning = async () => {
  const cmd = 'docker ps';
  await execShell(cmd).catch(() => {
    throw new EnvironmentError('Cannot detect docker');
  });
};

const checkDPMVersion = async () => {
  const cmd = 'dpm';
  await execShell(cmd).catch(() => {
    throw new EnvironmentError('Cannot detect DPM, please install', ['Open In Github']);
  });
};

const processEnvironment = async () => {
  await checkRubyVersion();
  await checkDockerRunning();
  await checkDPMVersion();
};

module.exports = { processEnvironment, EnvironmentError };
