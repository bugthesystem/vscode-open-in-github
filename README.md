![vscode-open-in-github](images/icon_200.png?raw=true "Open in GitHub / Bitbucket / visualstudio.com")  
**Supports :** GitHub, Bitbucket, Visualstudio.com

> Extension for Visual Studio Code which can be used to jump to a source code line in Github / Bitbucket

## Install

**Tested with VsCode 0.10.1**  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![](https://raw.githubusercontent.com/ziyasal/vscode-open-in-github/master/screenshots/install.png)

Simply pick the `Open in GitHub / Bitbucket` extension from the list

##Install Manual

**Mac & Linux**
```sh
cd $HOME/.vscode/extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

**Windows**
```
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

## Usage

**Command**  

Press <kbd>F1</kbd> and type `Open in GitHub`.

![](https://raw.githubusercontent.com/ziyasal/vscode-open-in-github/master/screenshots/open-in-github.png)


**Keybord Shortcut**  

 Press <kbd>Ctrl+L G</kbd> to activate.
 Press <kbd>Ctrl+L C</kbd> to copy active line link to clipboard.
 
 **Configure custom github server url**  
 
 Add follolowing line into workspace settings 
 ```json
{
	"openInGitHub.gitHubAddress":"your custom github url here"
}
```  
Have fun..

## License

MIT © [Ziya SARIKAYA @ziyasal](https://github.com/ziyasal)
