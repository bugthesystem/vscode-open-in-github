![vscode-open-in-github](images/icon_200.png?raw=true "Open in GitHub / Bitbucket / visualstudio.com")  

**Supports :** GitHub, Bitbucket, Visualstudio.com and GitLab

> Extension for Visual Studio Code which can be used to jump to a source code line in Github, Bitbucket, Visualstudio.com and GitLab

[![Build Status](https://travis-ci.org/ziyasal/vscode-open-in-github.svg?branch=master)](https://travis-ci.org/ziyasal/vscode-open-in-github) [![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

## Install

**Tested with VsCode 0.10.1**  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![installation](screenshots/install.png?raw=true "installation")

Simply pick the `Open in GitHub / Bitbucket` extension from the list

## Install Manual

### Mac & Linux

```sh
cd $HOME/.vscode/extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

### Windows

```sh
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

## Usage

### Command

Press <kbd>F1</kbd> and type `Open in GitHub`.

![open](screenshots/open-in-github.png?raw=true "Open function")

Press <kbd>F1</kbd> and type `Copy GitHub link to clipboard`.

![copy](screenshots/copy.png?raw=true "Copy function")

(The URL for Github will also include line ranges if there are lines selected in the editor)

Press <kbd>F1</kbd> and type `Open Pull Request`.

![copy](screenshots/pull-req-cmd.png?raw=true "Copy function")

### Keybord Shortcut

 Press <kbd>Ctrl+L G</kbd> to activate.
 Press <kbd>Ctrl+L C</kbd> to copy active line link to clipboard.

### Context menu

Right click on explorer item and choose `Open in GitHub` or `Copy GitHub link to clipboard`.

![context](screenshots/context-menu.png?raw=true "Context menu options")

### Configure custom github domain

Add following line into workspace settings;

```js
{
  "openInGitHub.gitHubDomain":"your custom github domain here",
  "openInGitHub.requireSelectionForLines":false   // If enabled, the copied or opened URL won't include line number(s) unless there's an active selection
  "openInGitHub.providerType": "gitlab" //github, gitlab, bitbucket, ...
}
```

Have fun..

## License

MIT © [Ziya SARIKAYA @ziyasal](https://github.com/ziyasal) & Contributors

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/759811?v=4" width="75px;"/><br /><sub>Brady Holt</sub>](https://www.geekytidbits.com)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=bradyholt "Code") [📖](https://github.com/ziyasal/vscode-open-in-github/commits?author=bradyholt "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/8547855?v=4" width="75px;"/><br /><sub>Grzegorz Dziadkiewicz</sub>](https://github.com/gdziadkiewicz)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Code") [📖](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Documentation") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!