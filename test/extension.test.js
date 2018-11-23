//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
var VsCode = require('vscode');
var Window = VsCode.window;
var commands = VsCode.commands;
var workspace = VsCode.workspace;
var Position = VsCode.Position;
var selection = VsCode.Selection;
var extensions = VsCode.extensions;

var expect = require("chai").expect;
var copy = require('copy-paste').copy;
var paste = require('copy-paste').paste;
var fs = require("fs");

var extensionID = 'ziyasal.vscode-open-in-github';
var extension = extensions.getExtension(extensionID);
var testsPath = extension.extensionPath + '/test/';
var fakeRepoPath = testsPath + 'sampleTestData/';
var relativeSampleFilePath = 'sampleDirectory/sampleTestFile.txt';
var absoluteSampleFilePath = fakeRepoPath + relativeSampleFilePath;

var fakeUserName = "testUser";
var fakeRepoName = "testRepo";
var fakeSHA = "a9b854f5131a863ad47d3b6c6bbca8cd17a8aff3";

function testClipboard(expectedClipboardContent) {
	expect(paste()).to.be.equal(expectedClipboardContent, "Clipboard content doest not match.");
}

function timeOut() {
	return new Promise(function (done) { setTimeout(done, 600) });
}

function setClipboardTo(content) {
	return function (done) {
		copy(content, done);
	};
}
var clearClipboard = setClipboardTo("");
var restoreClipboardContent = setClipboardTo;

suite('GitHub Tests', function () {
	var originalClipboardContent;

	suiteSetup(function () {
		fs.renameSync(`${fakeRepoPath}git`, `${fakeRepoPath}.git`);
		originalClipboardContent = paste();
		return extension.activate()
	});

	suiteTeardown(function () {
		fs.renameSync(`${fakeRepoPath}.git`, `${fakeRepoPath}git`);
		restoreClipboardContent(originalClipboardContent);
	});

	setup(clearClipboard);


	test('Line', function () {
		var expectedLineResult = `https://github.com/${fakeUserName}/${fakeRepoName}/blob/${fakeSHA}/${relativeSampleFilePath}#L2`;

		return workspace.openTextDocument(absoluteSampleFilePath).then(function (workingDocument) {
			return Window.showTextDocument(workingDocument);
		})
			.then(function (editor) {
				editor.selection = new selection(new Position(1, 0), new Position(1, 0));
			})
			.then(function () {
				return commands.executeCommand("extension.copyGitHubLinkToClipboard");
			})
			.then(timeOut)
			.then(function () {
				testClipboard(expectedLineResult);
			});
	});

	test('File', function () {
		var expectedFileResult = `https://github.com/${fakeUserName}/${fakeRepoName}/blob/master/${relativeSampleFilePath}`;
		//"workbench.files.action.focusFileExplorer"
		// How to get focus on file in explorer and call the command from context menu?
		this.skip();
	});

	test('Repo', function () {
		var expectedRepoResult = `https://github.com/${fakeUserName}/${fakeRepoName}/tree/master`;

		return commands.executeCommand("workbench.action.closeAllEditors")
			.then(timeOut)
			.then(function () {
				return commands.executeCommand("extension.copyGitHubLinkToClipboard");
			})
			.then(timeOut)
			.then(function () {
				testClipboard(expectedRepoResult);
			});
	});

	test('Directory', function () {
		var expectedDirResult = `https://github.com/${fakeUserName}/${fakeRepoName}/blob/master/sampleDirectory`;
		// How to get focus on directory in explorer and call the command from context menu?
		this.skip();
	});
});
