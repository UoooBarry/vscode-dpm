const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class PackageTreeGroup extends vscode.TreeItem {
  get iconPath() {
    const packageIcon = path.join(__filename, '..', '..', '..', 'assets', 'packages', `${this.label}.png`);
    const defaultIcon = path.join(__filename, '..', '..', '..', 'assets', 'packages', 'container.png');

    return fs.existsSync(packageIcon) ? packageIcon : defaultIcon;
  }
}

module.exports = PackageTreeGroup;
