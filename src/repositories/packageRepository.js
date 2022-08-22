const vscode = require('vscode');
const stateManager = require('./stateManager');
const { testPackage } = require('../dpm/index');

class PackageRepository extends stateManager {
  async savePackage(packageName) {
    if (!packageName) return;

    const validation = await PackageRepository.ifPackageValid(packageName);
    if (validation.error) {
      vscode.window.showErrorMessage(validation.message);

      return;
    }

    let processPackageName = packageName;

    if (!packageName.includes(':')) {
      processPackageName = `${packageName}:latest`;
    }
    this.context.globalState.update(processPackageName, true);
  }

  removePackage(packageName) {
    if (!packageName) return;

    this.context.globalState.update(packageName, undefined);
  }

  removeGroup(group) {
    const packages = this.getAllPackages();

    packages.filter((p) => p.split(':')[0] === group).forEach((key) => {
      this.context.globalState.update(key, undefined);
    });
  }

  getPackageGroups() {
    const packages = this.getAllPackages();

    return [...new Set(packages.map((p) => p.split(':')[0]))];
  }

  getAllPackages() {
    const packages = this.context.globalState.keys();

    return packages;
  }

  getPackageTags(packageName) {
    const pattern = new RegExp(`^${packageName}:[a-zA-Z0-9.]`, 'g');
    return this.getAllPackages().filter((p) => p.match(pattern));
  }

  static async ifPackageValid(packageName) {
    const out = await testPackage(packageName);

    return { error: out.includes('Error'), message: out };
  }
}

module.exports = PackageRepository;
