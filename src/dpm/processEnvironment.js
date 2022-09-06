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
  const cmd = 'dpm help';
  await execShell(cmd).catch(() => {
    throw new EnvironmentError('Cannot detect DPM, please install', ['Open In Github']);
  });

  await execShell('dpm -v').then(async (installedVersion) => {
    const latest = await execShell("gem search 'dpmrb' | GREP -o '[0-9.]' | tr -d '\n'");

    if (installedVersion.trim() !== latest.trim()) {
      throw new EnvironmentError('DPM has a new release, please update', ['Update DPM', 'Open In Github']);
    }
  }).catch((e) => {
    // If catch EnvironmentError throw from version different, throw it
    if (e instanceof EnvironmentError) throw e;

    // unknown error throw a not detect message
    throw new EnvironmentError('Cannot detect DPM, please install', ['Open In Github']);
  });
};

const updateDPM = () => {
  const cmd = 'gem update dpm';

  return execShell(cmd, true);
};

const processEnvironment = async () => {
  await checkRubyVersion();
  await checkDockerRunning();
  await checkDPMVersion();
};

module.exports = { processEnvironment, EnvironmentError, updateDPM };
