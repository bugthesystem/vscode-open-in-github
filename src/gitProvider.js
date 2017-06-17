'use strict';

const workspace = require('vscode').workspace
const querystring = require('querystring');
const gitUrlParse = require('git-url-parse');

const customBaseUrl = workspace.getConfiguration('openInGitHub').get('customBaseUrl');

class BaseProvider {
    constructor(gitUrl) {
        this.gitUrl = gitUrl;
    }

    get baseUrl() {
        if (customBaseUrl) {
            return customBaseUrl;
        }
        return this.gitUrl.toString('https').replace(/\.git/, '');
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
        if (filePath) {
            return `${this.baseUrl}/blob/${branch}${filePath}` + (line ? '#L' + line : '') + (endLine ? '-L' + endLine : '');
        }
        return `${this.baseUrl}/tree/${branch}`;
    }
    prUrl(branch){
        return `${this.baseUrl}/pull/new/${branch}`;
    }
}

class Bitbucket extends BaseProvider {
    webUrl(branch, filePath, line, endLine) {
        return `${this.baseUrl}/src/${branch}` + (filePath ? `${filePath}` : '') + (line ? `#cl-${line}` : '');
    }
    prUrl(branch){
        return `${this.baseUrl}/pull-requests/new?source=${branch}`;
    }
}

class GitLab extends GitHub {
    webUrl(branch, filePath, line, endLine) {
        if (filePath) {
            return `${this.baseUrl}/blob/${branch}` + (filePath ? `${filePath}` : '') + (line ? `#L${line}` : '');
        }
        return `${this.baseUrl}/tree/${branch}`;
    }
    prUrl(branch){
        //https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
        // doesn't support yet, require target_branch, title to supply further
        throw new Error(`doesn't support Merge Request from URL in gitlab provider yet`);
        //TODO
        //return `${this.baseUrl}/merge-requests/new?source_branch=${branch}&target_branch=${????}&title=${????}`;
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
}

const gitHubDomain = workspace.getConfiguration('openInGitHub').get('gitHubDomain', 'github.com');
const providerType = workspace.getConfiguration('openInGitHub').get('providerType', 'unknown');

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
    console.log(providerType);
    const gitUrl = gitUrlParse(remoteUrl);
    for (const domain of Object.keys(providers)) {
        if (domain === gitUrl.resource || domain === gitUrl.source) {
            return new providers[domain](gitUrl);
        }else if( domain.indexOf(providerType) > -1 ){
            return new providers[domain](gitUrl);
        }
    }
    throw new Error('unknown Provider');
}

module.exports = gitProvider;
