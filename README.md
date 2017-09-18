![vscode-open-in-github](images/icon_200.png?raw=true "Open in GitHub / Bitbucket / visualstudio.com")  

**Supports :** GitHub, Bitbucket, Visualstudio.com and GitLab

> Extension for Visual Studio Code which can be used to jump to a source code line in Github, Bitbucket, Visualstudio.com and GitLab

[![Build Status](https://travis-ci.org/ziyasal/vscode-open-in-github.svg?branch=master)](https://travis-ci.org/ziyasal/vscode-open-in-github) [![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)

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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/759811?v=4" width="75px;"/><br /><sub>Brady Holt</sub>](https://www.geekytidbits.com)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=bradyholt "Code") [📖](https://github.com/ziyasal/vscode-open-in-github/commits?author=bradyholt "Documentation") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=bradyholt "Tests") | [<img src="https://avatars3.githubusercontent.com/u/8547855?v=4" width="75px;"/><br /><sub>Grzegorz Dziadkiewicz</sub>](https://github.com/gdziadkiewicz)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Code") [📖](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Documentation") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=gdziadkiewicz "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1145226?v=4" width="75px;"/><br /><sub>Yuichi Tanikawa</sub>](http://itiut.hatenablog.com/)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=itiut "Code") [📖](https://github.com/ziyasal/vscode-open-in-github/commits?author=itiut "Documentation") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=itiut "Tests") | [<img src="https://avatars2.githubusercontent.com/u/192727?v=4" width="75px;"/><br /><sub>Suan Yeo</sub>](http://suanaikyeo.com)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=suan "Code") | [<img src="https://avatars3.githubusercontent.com/u/900690?v=4" width="75px;"/><br /><sub>Benjamin Pasero</sub>](http://code.visualstudio.com)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=bpasero "Code") | [<img src="https://avatars1.githubusercontent.com/u/1824461?v=4" width="75px;"/><br /><sub>Stuart Leeks</sub>](http://blogs.msdn.com/stuartleeks)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=stuartleeks "Code") | [<img src="https://avatars2.githubusercontent.com/u/1062408?v=4" width="75px;"/><br /><sub>Marvin Hagemeister</sub>](https://marvinhagemeister.github.io)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=marvinhagemeister "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/649067?v=4" width="75px;"/><br /><sub>linarnan</sub>](https://github.com/linarnan)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=linarnan "Code") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=linarnan "Tests") | [<img src="https://avatars1.githubusercontent.com/u/11202705?v=4" width="75px;"/><br /><sub>Dan Seethaler</sub>](https://github.com/danseethaler)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=danseethaler "Code") [⚠️](https://github.com/ziyasal/vscode-open-in-github/commits?author=danseethaler "Tests") | [<img src="https://avatars1.githubusercontent.com/u/7483101?v=4" width="75px;"/><br /><sub>John Arthur</sub>](https://github.com/johnpaularthur)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=johnpaularthur "Code") | [<img src="https://avatars2.githubusercontent.com/u/1424663?v=4" width="75px;"/><br /><sub>Eduardo Diaz</sub>](https://github.com/ziluvatar)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=ziluvatar "Code") | [<img src="https://avatars3.githubusercontent.com/u/815236?v=4" width="75px;"/><br /><sub>Tom Esterez</sub>](https://github.com/testerez)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=testerez "Code") | [<img src="https://avatars2.githubusercontent.com/u/2149559?v=4" width="75px;"/><br /><sub>Anthony Brown</sub>](https://github.com/antxxxx)<br />[💻](https://github.com/ziyasal/vscode-open-in-github/commits?author=antxxxx "Code") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!


## License

MIT © [Ziya SARIKAYA @ziyasal](https://github.com/ziyasal) & Contributors
