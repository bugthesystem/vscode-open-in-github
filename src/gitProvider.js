'use strict';

const workspace = require('vscode').workspace
const querystring = require('querystring');
const gitUrlParse = require('git-url-parse');
const path = require('path');
const useCommitSHAInURL = workspace.getConfiguration('openInGitHub').get('useCommitSHAInURL');

class BaseProvider {
    constructor(gitUrl, sha) {
        this.gitUrl = gitUrl;
        this.sha = sha;
    }

    get baseUrl() {
        return this.gitUrl.toString(providerProtocol).replace(/(\.git)$/, '');
    }

    /**
     * Get the Web URL.
     *
     * @param {string} branch
     * @param {string} filePath The file path relative to repository root, beginning with '/'.
     * @param {number} line
     * @param {number} endLine The last line in a multi-line selection
     * @return {string} The URL to be opened with the browser.
     */
    webUrl(branch, filePath, line, endLine) {
        return '';
    }
    prUrl(branch) {
        return '';
    }
}

class GitHub extends BaseProvider {
    webUrl(branch, filePath, line, endLine) {
        let blob = branch;
        if (useCommitSHAInURL) {
            blob = this.sha;
        }
        if (filePath) {
            return `${this.baseUrl}/blob/${blob}${filePath}` + (line ? '#L' + line : '') + (endLine ? '-L' + endLine : '');
        }
        return `${this.baseUrl}/tree/${blob}`;
    }
    prUrl(branch) {
        return `${this.baseUrl}/pull/new/${branch}`;
    }
}

class Bitbucket extends BaseProvider {
    webUrl(branch, filePath, line, endLine) {
        const fileName = path.basename(filePath)
        return `${this.baseUrl}/src/${this.sha}` + (filePath ? `${filePath}` : '') + (line ? `#${fileName}-${line}` : '');
    }
    prUrl(branch) {
        const repo = this.baseUrl.replace(`${providerProtocol}://bitbucket.org/`, '')
        return `${this.baseUrl}/pull-requests/new?source=${repo}%3A%3A${branch}&dest=${repo}%3A%3Aintegration`;
        // looks like this:
        // https://bitbucket.org/${org/repo}/pull-requests/new?source=${org/repo}%3A%3A${branch}&dest=${org/repo}%3A%3A${destBranch}
    }
}

class GitLab extends BaseProvider {
    webUrl(branch, filePath, line, endLine) {
        if (filePath) {
            return `${this.baseUrl}/blob/${branch}` + (filePath ? `${filePath}` : '') + (line ? `#L${line}` : '');
        }
        return `${this.baseUrl}/tree/${branch}`;
    }
    prUrl(branch) {
        //https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
        //`${this.baseUrl}/pull-requests/new?source_branch=${branch}&target_branch=${????}&title=${????}`
        throw new Error(`Doesn't support Merge Request from URL in GitLab yet`);
    }
}

class VisualStudio extends BaseProvider {
    get baseUrl() {
        return `https://${this.gitUrl.resource}${this.gitUrl.pathname}`.replace(/\.git/, '');
    }

    webUrl(branch, filePath, line, endLine) {
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

    prUrl(branch) {
        throw new Error(`Doesn't support Merge Request from URL in VisualStudio.com yet`);
    }
}

const gitHubDomain = workspace.getConfiguration('openInGitHub').get('gitHubDomain', 'github.com');
const providerType = workspace.getConfiguration('openInGitHub').get('providerType', 'unknown');
const providerProtocol = workspace.getConfiguration('openInGitHub').get('providerProtocol', 'https');
const defaultPrBranch = workspace.getConfiguration('openInGitHub').get('defaultPullRequestBranch', 'integration')

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
function gitProvider(remoteUrl, sha) {
    const gitUrl = gitUrlParse(remoteUrl);
    for (const domain of Object.keys(providers)) {
        if (domain === gitUrl.resource || domain === gitUrl.source) {
            return new providers[domain](gitUrl, sha);
        } else if (domain.indexOf(providerType) > -1) {
            return new providers[domain](gitUrl, sha);
        }
    }
    throw new Error('unknown Provider');
}

module.exports = gitProvider;
