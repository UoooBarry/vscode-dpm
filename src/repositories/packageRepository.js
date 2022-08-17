const stateManager = require('./stateManager');

class PackageRepository extends stateManager {
  savePackage(packageName) {
    if (!packageName) return;

    this.context.globalState.update(packageName, true);
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
    const pattern = new RegExp(`^${packageName}:[0-9.]`, 'g');
    return this.getAllPackages().filter((p) => p.match(pattern));
  }
}

module.exports = PackageRepository;
