/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const vscode = require('vscode');
const PackageTreeItem = require('./packageTreeItem');

const PackageRepository = require('../repositories/packageRepository');

class ListTreeViewProvider {
  constructor(context) {
    this.context = context;

    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.packageRepo = new PackageRepository(context);
  }

  getChildren(element) {
    if (element) {
      const filtered = this.packageRepo.getPackageTags(element.label);
      const result = filtered.map(async (p) => {
        const item = new PackageTreeItem(p.split(':')[1], vscode.TreeItemCollapsibleState.None, 'dpm-vscode.container-status', p);
        await item.refreshStatus();

        return item;
      });

      return Promise.resolve(result);
    }
    // return root
    const uniqPackageName = this.packageRepo.getPackageGroups();
    // eslint-disable-next-line max-len
    const items = uniqPackageName.map((name) => new vscode.TreeItem(name, vscode.TreeItemCollapsibleState.Collapsed));
    return Promise.resolve(items);
  }

  getTreeItem(element) {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

module.exports = ListTreeViewProvider;
