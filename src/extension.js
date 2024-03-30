// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

var VsCode = require('vscode');
var Window = VsCode.window;
var commands = VsCode.commands;
var workspace = VsCode.workspace;
var Position = VsCode.Position;

var path = require('path');
var fs = require('fs');
var open = require('open');
var gitRev = require('git-rev-2');
var findParentDir = require('find-parent-dir');
var ini = require('ini');

const gitProvider = require('./gitProvider');
const requireSelectionForLines = workspace.getConfiguration('openInGitHub').get('requireSelectionForLines');

function getGitProviderLink(cb, fileFsPath, lines, pr) {
    var repoDir = findParentDir.sync(fileFsPath, '.git');
    if (!repoDir) {
        throw 'Cant locate .git repository for this file';
    }

    locateGitConfig(repoDir)
        .then(readConfigFile)
        .then(config => {

            gitRev.long(repoDir, function (branchErr, sha) {
                var rawUri,
                    configuredBranch,
                    provider = null,
                    remoteName;

                gitRev.branch(repoDir, function (branchErr, branch) {
                    // Check to see if the branch has a configured remote
                    configuredBranch = config[`remote "${branch}"`];

                    if (configuredBranch) {
                        // Use the current branch's configured remote
                        remoteName = configuredBranch.remote;
                        rawUri = config[`remote "${remoteName}"`].url;
                    } else {
                        const remotes = Object.keys(config).filter(k => k.startsWith('remote '));
                        if (remotes.length > 0) {
                            rawUri = config[remotes[0]].url;
                        }
                    }

                    if (!rawUri) {
                        Window.showWarningMessage(`No remote found on branch.`);
                        return;
                    }

                    try {
                        provider = gitProvider(rawUri, sha);
                    } catch (e) {
                        let errmsg = e.toString();
                        Window.showWarningMessage(`Unknown Git provider. ${errmsg}`);
                        return;
                    }

                    let formattedFilePath = path.relative(repoDir, fileFsPath).replace(/\\/g, '/');
                    formattedFilePath = formattedFilePath.replace(/\s{1}/g, '%20');

                    let subdir = repoDir !== fileFsPath ? '/' + formattedFilePath : '';

                    if (pr) {
                        try {
                            cb(provider.prUrl(branch));
                        } catch (e) {
                            Window.showWarningMessage(e.toString());
                            return;
                        }
                    } else {
                        if (lines) {
                            if (lines[0] == lines[1]) {
                                cb(provider.webUrl(sha, subdir, lines[0]));
                            } else {
                                cb(provider.webUrl(sha, subdir, lines[0], lines[1]));
                            }
                        } else {
                            cb(provider.webUrl(sha, subdir));
                        }
                    }
                });
            });
        });
}

function locateGitConfig(repoDir) {
    return new Promise((resolve, reject) => {
        fs.lstat(path.join(repoDir, '.git'), (err, stat) => {
            if (err) {
                reject(err);
                return;
            }

            if (stat.isFile()) {
                // .git may be a file, similar to symbolic link, containing "gitdir: <relative path to git dir>""
                // this happens in gitsubmodules
                fs.readFile(path.join(repoDir, '.git'), 'utf-8', (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    var match = data.match(/gitdir: (.*)/)[1];
                    if (!match) {
                        reject('Unable to find gitdir in .git file');
                        return;
                    }

                    // set a fallback path
                    var configPath = path.isAbsolute(match) ? path.join(match, 'config') : path.join(repoDir, match, 'config');

                    // for worktrees traverse up to the main .git folder
                    var standardWorkTreeMatch = match.match(/\/\.git\/worktrees\//);
                    if(standardWorkTreeMatch) {
                        var mainGitFolder = match.slice(0, standardWorkTreeMatch.index);

                        resolve(path.join(mainGitFolder, '.git', 'config'));
                        return;
                    }

                    // for worktrees in a bare repository check every worktrees folder
                    var bareWorkTreeMatches = match.matchAll(/\/worktrees\//g);
                    if(bareWorkTreeMatches) {
                        // generate promises to look for a file named config beside each matched worktrees folder
                        var fileCheckPromises = [...bareWorkTreeMatches]
                            .map((bareWorkTreeMatch) =>
                                new Promise((innerResolve, innerReject) => {
                                    var mainGitFolder = match.slice(0, bareWorkTreeMatch.index);

                                    fs.lstat(path.join(mainGitFolder, 'HEAD'), (err, stat) => {
                                        if (!err && stat.isFile()) {
                                            fs.lstat(path.join(mainGitFolder, 'config'), (err, stat) => {
                                                if (!err && stat.isFile()) {
                                                    innerResolve(path.join(mainGitFolder, 'config'));
                                                }
                                                else {
                                                    innerReject();
                                                }
                                            });
                                        }
                                        else {
                                            innerReject();
                                        }
                                    });
                                })
                            );

                        return Promise
                            .allSettled(fileCheckPromises)
                            .then((results) => {
                                var lastConfigPath = results
                                    .filter((result) => result.status === 'fulfilled')
                                    .pop();

                                // prefer the most deeply nested 'config' file that is beside a 'worktrees' folder
                                if (lastConfigPath) {
                                    resolve(lastConfigPath.value);
                                }
                                else {
                                    resolve(configPath);
                                }
                            });
                    }
                    else {
                        resolve(configPath);
                    }
                });
            } else {
                resolve(path.join(repoDir, '.git', 'config'));
            }
        });
    });
}

function readConfigFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(ini.parse(data));
        });
    });
}

function getGitProviderLinkForFile(fileFsPath, cb) {
    getGitProviderLink(cb, fileFsPath);
}

function getGitProviderLinkForCurrentEditorLines(cb) {
    var editor = Window.activeTextEditor;
    var fileFsPath = editor.document.uri.fsPath;

    if (includeLines(editor)) {
        getGitProviderLink(cb, fileFsPath, getSelectedLines(editor));
    } else {
        getGitProviderLinkForFile(fileFsPath, cb);
    }
}

function includeLines(editor) {
    return !requireSelectionForLines || !editor.selection.isEmpty;
}

function getSelectedLines(editor) {
    var anchorLineIndex = editor.selection.anchor.line + 1;
    var activeLineIndex = editor.selection.active.line + 1;

    return [anchorLineIndex, activeLineIndex].sort(function (a, b) {
        return a - b
    });
}

function getGitProviderLinkForRepo(cb) {
    getGitProviderLink(cb, workspace.rootPath);
}

function getGitProviderPullRequest(args, cb) {
    let fsPath;

    if (args && args.fsPath) {
        fsPath = args.fsPath;
    } else if (Window.activeTextEditor) {
        fsPath = Window.activeTextEditor.document.uri.fsPath;
    }

    getGitProviderLink(cb, fsPath, undefined, true);
}

function branchOnCallingContext(args, cb, pr) {
    if (pr) {
        return getGitProviderPullRequest(args, cb);
    }

    if (Window.activeTextEditor) {
        getGitProviderLinkForCurrentEditorLines(cb);
    } else if (args && args.fsPath) {
        getGitProviderLinkForFile(args.fsPath, cb);
    } else {
        // TODO: This missed in code review so should be refactored, it is broken.
        getGitProviderLinkForRepo(cb);
    }
}


function openInGitProvider(args) {
    branchOnCallingContext(args, open);
}

function copyGitProviderLinkToClipboard(args) {
    branchOnCallingContext(args, (content) => { VsCode.env.clipboard.writeText(content); });
}

function openPrGitProvider(args) {
    branchOnCallingContext(args, open, true);
}

function activate(context) {
    commands.registerCommand('extension.openInGitHub', openInGitProvider);
    commands.registerCommand('extension.copyGitHubLinkToClipboard', copyGitProviderLinkToClipboard);
    commands.registerCommand('extension.openPrGitProvider', openPrGitProvider);
}

exports.activate = activate;
