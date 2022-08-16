const vscode = require('vscode');
const execShell = require('../utils/execShell');

class ListTreeViewProvider{
  constructor(context) {
    this.context = context;

    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  
  getChildren(element) {
    if (element) {
      const packages = this.context.globalState.keys();
      const filtered =  packages.filter((p) => {
        const packageName = p.split(':')[0];

        return packageName == element.label && this.context.globalState.get(p) === true;
      })
      const result = filtered.map((p) => {
        let running = false
        return execShell(`dpm status ${p} | grep 'Up'`).then((out) => {
          running = out ? out.length > 0 : false
          return new Data(p.split(':')[1], vscode.TreeItemCollapsibleState.None, 'dpm-vscode.container-status', p, running)
        })
        .catch(() => {
          return new Data(p.split(':')[1], vscode.TreeItemCollapsibleState.None, 'dpm-vscode.container-status', p, running)
        })
      });
 
      return Promise.resolve(result)

    } else {
      // return root
      const packages = this.context.globalState.keys();
      const uniqPackageName = [...new Set(packages.map((p) => {
        const packageName = p.split(':')[0];
        return packageName;
      }))];
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
  constructor(label, collapsibleState, commandId, fullPackageName, isRunning) {
    super(label, collapsibleState);
    const command = {
      'command': commandId
    };
    this.command = command;
    this.fullPackageName = fullPackageName;
    this.contextValue = 'dpm-package'
    this.isRunning = isRunning

    this.description = this.getStatusLabel;
  }

  get getStatusLabel() {
    return this.isRunning ? 'Running' : ''
  }
}

module.exports = ListTreeViewProvider;
