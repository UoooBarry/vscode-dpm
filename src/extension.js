const vscode = require('vscode');
const ListTreeViewProvider = require('./views/listTreeViewProvider');
const PackageRepository = require('./repositories/packageRepository');
const { startPackage, stopPackage, getPackageStatus } = require('./dpm/index');
const { processEnvironment, EnvironmentError } = require('./dpm/processEnvironment');
const { showPackageDropdownBox, showTagDropDownBox } = require('./views/showPackageDropdownBox');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // Check all the environment variables
  try {
    await processEnvironment();
  } catch (e) {
    if (e instanceof EnvironmentError) {
      vscode.window.showErrorMessage(e.message, ...e.items)
        .then((selection) => {
          switch (selection) {
            case 'Open In Github':
              vscode.env.openExternal(vscode.Uri.parse('https://github.com/songhuangcn/dpm'));
              break;
            default:
              break;
          }
        });
    } else {
      throw e;
    }
  }

  const packageRepo = new PackageRepository(context);
  const treeViewProvider = new ListTreeViewProvider(context);
  const treeViewView = vscode.window.registerTreeDataProvider('packageList', treeViewProvider);

  const disposable = vscode.commands.registerCommand('dpm-vscode.container-status', (params) => {
    params.then((data) => {
      const { fullPackageName } = data;

      getPackageStatus(fullPackageName).then((out) => vscode.window.showInformationMessage(out));
    });
  });

  const savePackageCmd = vscode.commands.registerCommand('dpm-vscode.add-package', () => {
    showPackageDropdownBox()
      .then((packageName) => {
        showTagDropDownBox(packageName).then(async (tag) => {
          if (!tag) return;

          try {
            await packageRepo.savePackage(`${packageName}:${tag}`);
            treeViewProvider.refresh();
            vscode.showInformationMessage(`${packageName}:${tag} is saved`);
          } catch (e) {
            vscode.window.showErrorMessage(e.message);
          }
        });
      });
  });

  const removePackageCmd = vscode.commands.registerCommand('dpm-vscode.remove-package', (params) => {
    params.then((data) => {
      const { fullPackageName, isRunning } = data;
      if (isRunning) {
        vscode.window.showErrorMessage('Cannot remove running package');
        return false;
      }

      packageRepo.removePackage(fullPackageName);
      treeViewProvider.refresh();

      return true;
    });
  });

  const execPackageCmd = vscode.commands.registerCommand('dpm-vscode.exec-package', (params) => {
    params.then((data) => {
      const { fullPackageName } = data;

      startPackage(fullPackageName).then(() => {
        treeViewProvider.refresh();
      }).catch((err) => {
        vscode.window.showWarningMessage(err);
      });
    });
  });

  const refreshPackagesCmd = vscode.commands.registerCommand('dpm-vscode.refresh-packages', async () => {
    treeViewProvider.refresh();
  });

  const stopPackageCmd = vscode.commands.registerCommand('dpm-vscode.stop-package', (params) => {
    params.then((data) => {
      const { fullPackageName } = data;

      stopPackage(fullPackageName).then(() => {
        treeViewProvider.refresh();
      }).catch((err) => {
        vscode.window.showWarningMessage(err);
      });
    });
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(savePackageCmd);
  context.subscriptions.push(removePackageCmd);
  context.subscriptions.push(treeViewView);
  context.subscriptions.push(refreshPackagesCmd);
  context.subscriptions.push(execPackageCmd);
  context.subscriptions.push(stopPackageCmd);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
