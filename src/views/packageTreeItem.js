const vscode = require('vscode');
const { getIsPackageUp } = require('../dpm/index');

class PackageTreeItem extends vscode.TreeItem {
  constructor(label, collapsibleState, commandId, fullPackageName) {
    super(label, collapsibleState);
    const command = {
      command: commandId,
    };
    this.command = command;
    this.fullPackageName = fullPackageName;
    this.contextValue = 'dpm-package';
  }

  /* Checking if the container is running or not. */
  getDockerPS() {
    return new Promise((resolve) => {
      getIsPackageUp(this.fullPackageName).then((out) => {
        resolve(out.length > 0);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  refreshStatus() {
    return new Promise((resolve) => {
      this.getDockerPS().then((isRunning) => {
        this.description = PackageTreeItem.getStatusLabel(isRunning);
        resolve(this.description);
      });
    });
  }

  static getStatusLabel(isRunning) {
    return isRunning ? 'Running' : '';
  }
}

module.exports = PackageTreeItem;
