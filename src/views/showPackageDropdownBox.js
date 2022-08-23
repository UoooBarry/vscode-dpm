const vscode = require('vscode');
const data = require('../preload/data');

const showPackageDropdownBox = () => vscode.window.showQuickPick(data.supportedPackages, {
  title: 'Add Package',
  placeHolder: 'Package',
  ignoreFocusOut: true,
});

const showTagDropDownBox = async (packageName) => {
  if (!packageName) return false;

  const supportedTags = data.supportedTags[packageName];
  const prompt = `Supported version (${supportedTags.join(',')})`;

  return vscode.window.showInputBox({
    title: 'Select a tag version',
    placeHolder: 'Select a tag version, leave blank for latest',
    prompt,
    validateInput: (tag) => {
      // blank for latest
      if (!tag || tag === 'latest') return null;
      // get the first integer, '123abc' => '123'
      if (!supportedTags.includes(tag.match(/\d+/g)[0])) return prompt;
      return null;
    },
  });
};

module.exports = { showPackageDropdownBox, showTagDropDownBox };
