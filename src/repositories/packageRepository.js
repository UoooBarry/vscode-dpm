const stateManager = require('./stateManager');
const { dryRunPackage } = require('../dpm/index');

class PackageRepository extends stateManager {
  static get OPTIONS_SYMBOL() {
    return '|';
  }

  async savePackage(packageName, isRaw = false) {
    if (!packageName) return;

    const validation = await PackageRepository.isPackageValid(packageName, isRaw);
    if (validation.error) throw new Error(validation.message);

    let processPackageName = packageName;

    if (!packageName.includes(':')) {
      processPackageName = `${packageName}:latest`;
    }

    this.context.globalState.update(`${processPackageName}${PackageRepository.OPTIONS_SYMBOL}raw`, isRaw);
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
    // eslint-disable-next-line max-len
    const packages = this.context.globalState.keys().filter((key) => !key.includes(PackageRepository.OPTIONS_SYMBOL));

    return packages;
  }

  getPackageRaw(packageName) {
    return this.context.globalState.get(`${packageName}|raw`);
  }

  getPackageTags(packageName) {
    const pattern = new RegExp(`^${packageName}:[a-zA-Z0-9.]`, 'g');
    return this.getAllPackages().filter((p) => p.match(pattern));
  }

  static async isPackageValid(packageName, isRaw) {
    const out = await dryRunPackage(packageName, isRaw);

    return { error: out.includes('Error'), message: out };
  }
}

module.exports = PackageRepository;
