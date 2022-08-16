// save data to vscode global state
const savePackage = (context, packageName) => {
  if(!packageName) return;

  context.globalState.update(packageName, true);
}

const removePackage = (context, packageName) => {
  if(!packageName) return;

  context.globalState.update(packageName, undefined);
}

const removeGroup = (context, group) => {
  const packages = context.globalState.keys();

  packages.filter((p) => p.split(':')[0] == group).forEach((key) => {
    context.globalState.update(key, undefined)
  })
}

module.exports = { savePackage, removePackage, removeGroup };
