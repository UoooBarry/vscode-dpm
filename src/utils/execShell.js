/* eslint-disable import/no-unresolved */
const cp = require('child_process');
const vscode = require('vscode');

const execShell = (cmd) => new Promise((resolve, reject) => {
  cp.exec(cmd, (err, out) => {
    vscode.window.showInformationMessage(out);

    if (err) {
      reject(err);
    }
    resolve(out);
  });
});

module.exports = execShell;
