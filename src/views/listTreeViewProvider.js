const vscode = require('vscode');
const packageRepository = require('../repositories/packageRepository');
const { getIsPackageUp } = require('../dpm/index');

class ListTreeViewProvider {
  constructor(context) {
    this.context = context;

    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.packageRepo = new packageRepository(context);
  }
  
  getChildren(element) {
    if (element) {
      const filtered = this.packageRepo.getPackageTags(element.label);
      const result = filtered.map(async (p) => {
        const item = new Data(p.split(':')[1], vscode.TreeItemCollapsibleState.None, 'dpm-vscode.container-status', p);
        await item.refreshStatus();

        return item;
      });
 
      return Promise.resolve(result)
    } else {
      // return root
      const uniqPackageName = this.packageRepo.getPackageGroups();
      return Promise.resolve(uniqPackageName.map((name) => new vscode.TreeItem(name, vscode.TreeItemCollapsibleState.Collapsed)));
    }
  }

  getTreeItem(element) {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

class Data extends vscode.TreeItem {
  constructor(label, collapsibleState, commandId, fullPackageName) {
    super(label, collapsibleState);
    const command = {
      'command': commandId
    };
    this.command = command;
    this.fullPackageName = fullPackageName;
    this.contextValue = 'dpm-package';
  }

  getStatusLabel(isRunning) {
    return isRunning ? 'Running' : ''
  }
  
  /* Checking if the container is running or not. */
  getDockerPS() {
    return new Promise((resolve) => {
      getIsPackageUp(this.fullPackageName).then((out) => {
        resolve(out.length > 0);
      }).catch(() => {
        resolve(false)
      })
    })
  }

  refreshStatus() {
    return new Promise((resolve) => {
      this.getDockerPS().then((isRunning) => {
        this.description = this.getStatusLabel(isRunning);
        resolve(this.description);
      })
    })
  }
}

module.exports = ListTreeViewProvider;
