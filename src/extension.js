// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

var VsCode = require('vscode');
var Window = VsCode.window;
var commands = VsCode.commands;
var workspace = VsCode.workspace;
var Position = VsCode.Position;

var path = require('path');
var fs = require('fs');
var git = require('parse-git-config');
var open = require('open');
var copy = require('copy-paste').copy;
var gitRev = require('git-rev-2');
var findParentDir = require('find-parent-dir');

const gitProvider = require('./gitProvider');

function getGitProviderLink(cb, fileFsPath, line) {
    var cwd = workspace.rootPath;
    var repoDir = findParentDir.sync(workspace.rootPath, '.git') || cwd;

    git({
        cwd: repoDir
    }, function (err, config) {
        const rawUri = config['remote \"origin\"'].url;
        const provider = gitProvider(rawUri);

        if (!provider) {
            Window.showWarningMessage('Unknown Git provider.');
            return;
        }

        gitRev.branch(cwd, function (branchErr, branch) {
            if (branchErr || !branch)
                branch = 'master';

            let subdir = fileFsPath ? fileFsPath.substring(workspace.rootPath.length).replace(/\"/g, "") : undefined;

            if (repoDir !== cwd) {
                // The workspace directory is a subdirectory of the git repo folder so we need to prepend the the nested path
                var repoRelativePath = cwd.replace(repoDir, "/");
                subdir = repoRelativePath + subdir;
            }

            cb(provider.webUrl(branch, subdir, line));
        });
    });
}

function getGitProviderLinkForFile(fileFsPath, cb) {
    getGitProviderLink(cb, fileFsPath);
}

function getGitProviderLinkForCurrentEditorLine(cb) {
    var editor = Window.activeTextEditor;
    if (editor) {
        var lineIndex = editor.selection.active.line + 1;
        var fileFsPath = editor.document.uri.fsPath;
        getGitProviderLink(cb, fileFsPath, lineIndex);
    }
}

function getGitProviderLinkForRepo(cb) {
    getGitProviderLink(cb);
}

function branchOnCallingContext(args, cb) {
    if (args && args.fsPath) {
        getGitProviderLinkForFile(args.fsPath, cb);
    }
    else if (Window.activeTextEditor) {
        getGitProviderLinkForCurrentEditorLine(cb);
    }
    else {
        getGitProviderLinkForRepo(cb);
    }
}

function openInGitProvider(args) {
    branchOnCallingContext(args, open);
}

function copyGitProviderLinkToClipboard(args) {
    branchOnCallingContext(args, copy);
}

//TODO: rename openInGitHub to openInGitProvider
function activate(context) {
    context.subscriptions.push(commands.registerCommand('extension.openInGitHub', openInGitProvider));
    context.subscriptions.push(commands.registerCommand('extension.copyGitHubLinkToClipboard', copyGitProviderLinkToClipboard));
}

exports.activate = activate;
