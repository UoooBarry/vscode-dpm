const execShell = require('../utils/execShell');

const startPackage = (packageName) => {
  const cmd = `dpm start ${packageName}`;
  return execShell(cmd);
};

const stopPackage = (packageName) => {
  const cmd = `dpm stop ${packageName}`;
  return execShell(cmd);
};

const getPackageStatus = (packageName) => {
  const cmd = `dpm status ${packageName}`;

  return execShell(cmd);
};

const getIsPackageUp = (packageName) => {
  const cmd = `dpm status ${packageName} | grep 'Up'`;

  return execShell(cmd);
};

const testPackage = (packageName) => {
  const cmd = `dpm start -d ${packageName}`;

  return execShell(cmd);
};

module.exports = {
  startPackage, stopPackage, getIsPackageUp, getPackageStatus, testPackage,
};
