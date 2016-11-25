'use strict';

const workspace = require('vscode').workspace
const querystring = require('querystring');
const gitUrlParse = require('git-url-parse');

class BaseProvider {
    constructor(gitUrl) {
        this.gitUrl = gitUrl;
    }

    get baseUrl() {
        return this.gitUrl.toString('https').replace(/\.git/, '');
    }

    /**
     * Get the Web URL.
     *
     * @param {string} branch
     * @param {string} filePath The file path relative to repository root, beginning with '/'.
     * @param {number} line
     * @return {string} The URL to be opened with the browser.
     */
    webUrl(branch, filePath, line) {
        return '';
    }
}

class GitHub extends BaseProvider {
    webUrl(branch, filePath, line) {
        if (filePath) {
            return `${this.baseUrl}/blob/${branch}${filePath}` + (line ? '#L' + line : '');
        }
        return `${this.baseUrl}/tree/${branch}`;
    }
}

class Bitbucket extends BaseProvider {
    webUrl(branch, filePath, line) {
        return `${this.baseUrl}/src/${branch}` + (filePath ? `${filePath}` : '') + (line ? `#cl-${line}` : '');
    }
}

class GitLab extends GitHub {
}

class VisualStudio extends BaseProvider {
    get baseUrl() {
        return `https://${this.gitUrl.resource}${this.gitUrl.pathname}`.replace(/\.git/, '');
    }

    webUrl(branch, filePath, line) {
        let query = {
            version: `GB${branch}`,
        };
        if (filePath) {
            query['path'] = filePath;
        }
        if (line) {
            query['line'] = line;
        }
        return `${this.baseUrl}?${querystring.stringify(query)}`;
    }
}

const gitHubDomain = workspace.getConfiguration('openInGitHub').get('gitHubDomain', 'github.com');

const providers = {
    [gitHubDomain]: GitHub,
    'bitbucket.org': Bitbucket,
    'gitlab.com': GitLab,
    'visualstudio.com': VisualStudio,
};

/**
 * Get the Git provider of the remote URL.
 *
 * @param {string} remoteUrl
 * @return {BaseProvider|null}
 */
function gitProvider(remoteUrl) {
    const gitUrl = gitUrlParse(remoteUrl);
    for (const domain of Object.keys(providers)) {
        if (domain === gitUrl.resource || domain === gitUrl.source) {
            return new providers[domain](gitUrl);
        }
    }
    return null;
}

module.exports = gitProvider;
