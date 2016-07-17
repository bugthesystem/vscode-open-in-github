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
var parse = require('github-url-from-git');
var open = require('open');
var copy = require('copy-paste').copy;
var gitRev = require('git-rev-2');

function formGitHubLink(parsedUri, branch, subdir, line) {
    if (subdir) {
        return parsedUri + "/blob/" + branch + subdir + (line ? "#L" + line : "");
    }

    return parsedUri + "/tree/" + branch;
}


function formBitBucketLink(parsedUri, branch, subdir, line) {
    return parsedUri + "/src/" + branch + (subdir ? subdir : "") + (line ? "#cl-" + line : "");
}

function formVisualStudioLink(parsedUri, subdir, branch, line) {
    return parsedUri + "#" + (subdir ? "path=" + subdir : "") + "&version=GB" + branch + (line ? "&line=" + line : "");
}

function getGitHubLink(cb, fileFsPath, line) {
    var cwd = workspace.rootPath;

    git({
        cwd: cwd
    }, function (err, config) {
        var rawUri, parseOpts, parsedUri, branch, projectName,
            subdir, gitLink, scUrls, workspaceConfiguration;

        workspaceConfiguration = VsCode.workspace.getConfiguration("openInGitHub");
        scUrls = {
            github: 'https://' + workspaceConfiguration.gitHubDomain,
            bitbucket: 'https://bitbucket.org',
            visualstudiocom: /^https:\/\/[\w\d-]*\.visualstudio.com\//
        }

        rawUri = config['remote \"origin\"'].url;
        parseOpts = {
            extraBaseUrls: [
                'bitbucket.org',
                workspaceConfiguration.gitHubDomain
            ]
        }

        rawUri = rawUri.replace('bitbucket.org:', 'bitbucket.org/')

        parsedUri = parse(rawUri, parseOpts);
        if (!parsedUri) {
            parsedUri = rawUri;
        }

        gitRev.branch( cwd, function (branchErr, branch) {
            if (branchErr || !branch)
                branch = 'master';

            projectName = parsedUri.substring(parsedUri.lastIndexOf("/") + 1, parsedUri.length);

            subdir = fileFsPath ? fileFsPath.substring(workspace.rootPath.length).replace(/\"/g, "") : undefined;

            if (parsedUri.startsWith(scUrls.github)) {
                gitLink = formGitHubLink(parsedUri, branch, subdir, line);
            } else if (parsedUri.startsWith(scUrls.bitbucket)) {
                gitLink = formBitBucketLink(parsedUri, branch, subdir, line);
            } else if (scUrls.visualstudiocom.test(parsedUri)) {
                gitLink = formVisualStudioLink(parsedUri, subdir, branch, line);
            } else {
                Window.showWarningMessage('Unknown Git provider.');
            }

            if (gitLink)
                cb(gitLink);
        });
    });
}

function getGitHubLinkForFile(fileFsPath, cb) {
    getGitHubLink(cb, fileFsPath);
}

function getGitHubLinkForCurrentEditorLine(cb) {
    var editor = Window.activeTextEditor;
    if (editor) {
        var lineIndex = editor.selection.active.line + 1;
        var fileFsPath = editor.document.uri.fsPath;
        getGitHubLink(cb, fileFsPath, lineIndex);
    }
}

function getGitHubLinkForRepo(cb) {
    getGitHubLink(cb);
}

function branchOnCallingContext(args, cb){
    if (args && args.fsPath) {
        getGitHubLinkForFile(args.fsPath, cb);
    }
    else if (Window.activeTextEditor) {
        getGitHubLinkForCurrentEditorLine(cb);
    }
    else {
        getGitHubLinkForRepo(cb);
    }
}

function openInGitHub(args) {
    branchOnCallingContext(args, open);
}

function copyGitHubLinkToClipboard(args) {
    branchOnCallingContext(args, copy);
}

function activate(context) {
    context.subscriptions.push(commands.registerCommand('extension.openInGitHub', openInGitHub));
    context.subscriptions.push(commands.registerCommand('extension.copyGitHubLinkToClipboard', copyGitHubLinkToClipboard));
}

exports.activate = activate;