const execShell = require('../utils/execShell');

const startPackage = (packageName, isRaw = false) => {
  const cmd = `dpm start ${isRaw ? '-r' : ''} ${packageName}`;

  return execShell(cmd, true);
};

const stopPackage = (packageName) => {
  const cmd = `dpm stop ${packageName}`;
  return execShell(cmd, true);
};

const getPackageStatus = (packageName) => {
  const cmd = `dpm status ${packageName}`;

  return execShell(cmd);
};

const getIsPackageUp = (packageName) => {
  const cmd = `dpm status ${packageName} | grep 'Up'`;

  return execShell(cmd);
};

const dryRunPackage = (packageName, isRaw = false) => {
  const cmd = `dpm start ${isRaw ? '-r' : ''} -d ${packageName}`;

  return execShell(cmd);
};

const listPackages = () => {
  const cmd = 'dpm packages';

  return execShell(cmd);
};

const listTags = (packageName) => {
  const cmd = `dpm tags ${packageName}`;

  return execShell(cmd);
};

module.exports = {
  startPackage,
  stopPackage,
  getIsPackageUp,
  getPackageStatus,
  dryRunPackage,
  listPackages,
  listTags,
};
