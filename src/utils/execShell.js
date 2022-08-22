/* eslint-disable import/no-unresolved */
const cp = require('child_process');
const vscode = require('vscode');

const execShell = (cmd, print = true) => new Promise((resolve, reject) => {
  cp.exec(cmd, (err, out) => {
    if (print) vscode.window.showInformationMessage(out);

    if (err) {
      reject(err);
    }
    resolve(out);
  });
});

module.exports = execShell;
