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
var exec = require('child_process').exec;
var parse = require('github-url-from-git');

function findBranch(config) {
    for (var prop in config) {
        if (prop.indexOf("branch \"") > -1) {
            return prop.replace(/branch \"/g, "").replace(/\"/g, "");
        }
    }

    return "master";
}

function openInGitHub() {
    var cwd = workspace.rootPath;
    
    git({
        cwd: cwd
    }, function (err, config) {

        var rawUrl = config['remote \"origin\"'].url;
        var opt = {
            extraBaseUrls : ['bitbucket.org']
        }
        rawUrl = rawUrl.replace('bitbucket.org:', 'bitbucket.org/')
        var lineIndex = 0;
        var parsedUri = parse(rawUrl, opt);
        var branch = findBranch(config);
        
        var editor = Window.activeTextEditor;        
        var selection = editor.selection;
        var currentDocumentUri = JSON.stringify(editor._document._uri);
        lineIndex = selection._active._line;
        var projectName = parsedUri.substring(parsedUri.lastIndexOf("/") + 1, parsedUri.length);
        
        var subdir = currentDocumentUri.substring(currentDocumentUri.indexOf(projectName)
            + projectName.length, currentDocumentUri.length).replace(/\"/g, "");
        var githubLink;
        if (parsedUri.startsWith("https://bitbucket.org")) {
            githubLink = parsedUri + "/src/" + branch + subdir + "#cl-" + lineIndex;
        } else {
            githubLink = parsedUri + "/blob/" + branch + subdir + "#L" + lineIndex;
        }

        exec("start " + githubLink);
    });
}

function activate(context) {
    context.subscriptions.push(commands.registerCommand('extension.openInGitHub', openInGitHub));
}

exports.activate = activate;
