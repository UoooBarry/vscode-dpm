const vscode = require('vscode');
const ListTreeViewProvider = require('./views/listTreeViewProvider');
const { savePackage, removePackage } = require('./utils/packages');
const execShell = require('./utils/execShell');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const treeViewProvider = new ListTreeViewProvider(context);
	const treeViewView = vscode.window.registerTreeDataProvider('packageList', treeViewProvider);

	let disposable = vscode.commands.registerCommand('dpm-vscode.container-status', (params) => {
		console.log(params)
		vscode.window.showInformationMessage('Hello World from dpm-vscode!');
	});

	let savePackageCmd = vscode.commands.registerCommand('dpm-vscode.add-package', () => {
		vscode.window.showInputBox({
			title: 'Save Package',
			placeHolder: 'Package Tag'
		}).then((tag) => {
			savePackage(context, tag);
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

			removePackage(context, fullPackageName);
			treeViewProvider.refresh();
		})
	})

	let execPackageCmd = vscode.commands.registerCommand('dpm-vscode.exec-package', (params) => {
		params.then((data) => {
			const { fullPackageName } = data;
			let cmd = `dpm start ${fullPackageName}`;
			execShell(cmd).then(() => {
				treeViewProvider.refresh();
			}).catch((err) => {
				vscode.window.showWarningMessage(err)
			})
		})
	})

	let refreshPackagesCmd = vscode.commands.registerCommand('dpm-vscode.refresh-packages', () => {
		treeViewProvider.refresh();
	})

	let stopPackageCmd = vscode.commands.registerCommand('dpm-vscode.stop-package', (params) => {
		params.then((data) => {
			const { fullPackageName } = data;
			let cmd = `dpm stop ${fullPackageName}`;
	
			execShell(cmd).then(() => {
				treeViewProvider.refresh();
			}).catch((err) => {
				vscode.window.showWarningMessage(err)
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
