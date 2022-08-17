const execShell = require('../utils/execShell');

const startPackage = (packageName) => {
  let cmd = `dpm start ${packageName}`;
  return execShell(cmd);
}

const stopPackage = (packageName) => {
  let cmd = `dpm stop ${packageName}`;
  return execShell(cmd);
}

const getPackageStatus = (packageName) => {
  let cmd = `dpm status ${packageName}`;

  return execShell(cmd);
}

const getIsPackageUp = (packageName) => {
  let cmd = `dpm status ${packageName} | grep 'Up'`;

  return execShell(cmd);
}

module.exports = { startPackage, stopPackage, getIsPackageUp, getPackageStatus }
