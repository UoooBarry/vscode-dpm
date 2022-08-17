const vscode = require('vscode');
const ListTreeViewProvider = require('./views/listTreeViewProvider');
const packageRepository = require('./repositories/packageRepository');
const { startPackage, stopPackage } = require('./dpm/index');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const packageRepo = new packageRepository(context);
	const treeViewProvider = new ListTreeViewProvider(context);
	const treeViewView = vscode.window.registerTreeDataProvider('packageList', treeViewProvider);

	let disposable = vscode.commands.registerCommand('dpm-vscode.container-status', () => {
		vscode.window.showInformationMessage('Hello World from dpm-vscode!');
	});

	let savePackageCmd = vscode.commands.registerCommand('dpm-vscode.add-package', () => {
		vscode.window.showInputBox({
			title: 'Save Package',
			placeHolder: 'Package Tag.(e.g. mysql:5.7)',
			validateInput: (text) => {
				let valid = text.match(/[a-zA-Z]:[a-zA0-9.]/)
				return valid ? null : 'Invalid Package Tag, please use format: [packageName]:[version]';
			}
		}).then((tag) => {
			packageRepo.savePackage(tag);
			treeViewProvider.refresh();
		})
	})

	let removePackageCmd = vscode.commands.registerCommand('dpm-vscode.remove-package', (params) => {
		params.then((data) => {
			const { fullPackageName, isRunning } = data;
			if (isRunning) {
				vscode.window.showErrorMessage('Cannot remove running package');
				return false;
			}

			packageRepo.removePackage(fullPackageName);
			treeViewProvider.refresh();
		})
	})

	let execPackageCmd = vscode.commands.registerCommand('dpm-vscode.exec-package', (params) => {
		params.then((data) => {
			const { fullPackageName } = data;

			startPackage(fullPackageName).then(() => {
				treeViewProvider.refresh();
			}).catch((err) => {
				vscode.window.showWarningMessage(err);
			})
		})
	})

	let refreshPackagesCmd = vscode.commands.registerCommand('dpm-vscode.refresh-packages', () => {
		treeViewProvider.refresh();
	})

	let stopPackageCmd = vscode.commands.registerCommand('dpm-vscode.stop-package', (params) => {
		params.then((data) => {
			const { fullPackageName } = data;
	
			stopPackage(fullPackageName).then(() => {
				treeViewProvider.refresh();
			}).catch((err) => {
				vscode.window.showWarningMessage(err);
			})
		})
	})

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
	deactivate
}
