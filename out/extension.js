"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const turndown_1 = __importDefault(require("turndown"));
function cleanHtmlContent(html) {
    // Remove script and style tags with their content
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    // Remove noscript, iframe, embed, object tags
    html = html.replace(/<noscript\b[^>]*>.*?<\/noscript>/gi, '');
    html = html.replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '');
    html = html.replace(/<embed\b[^>]*>/gi, '');
    html = html.replace(/<object\b[^>]*>.*?<\/object>/gi, '');
    // Remove meta, link tags (except for important ones)
    html = html.replace(/<(?:meta|link)\b[^>]*>/gi, '');
    // Remove HTML comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    // Remove inline styles and event handlers
    html = html.replace(/\sstyle\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
    // Remove data attributes
    html = html.replace(/\sdata-\w+\s*=\s*["'][^"']*["']/gi, '');
    return html.trim();
}
function activate(context) {
    console.log('Pandocs extension is now active!');
    let disposable = vscode.commands.registerCommand('pandocs.openUrl', async () => {
        const url = await vscode.window.showInputBox({
            prompt: 'Enter document URL',
            placeHolder: 'https://example.com/document.txt'
        });
        if (!url) {
            return;
        }
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Fetching document...',
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: 'Downloading...' });
                const response = await axios_1.default.get(url, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Pandocs/1.0'
                    }
                });
                progress.report({ increment: 50, message: 'Processing...' });
                let content = response.data;
                const contentType = response.headers['content-type'] || '';
                let language = 'plaintext';
                // Convert HTML to Markdown for better readability
                if (contentType.includes('html')) {
                    // First, clean HTML content by removing unwanted elements
                    content = cleanHtmlContent(content);
                    const turndownService = new turndown_1.default({
                        headingStyle: 'atx',
                        bulletListMarker: '-',
                        codeBlockStyle: 'fenced',
                        preformattedCode: true
                    });
                    // Remove unwanted elements completely
                    turndownService.remove(['script', 'style', 'noscript', 'iframe', 'embed', 'object']);
                    // Custom rules for better conversion
                    turndownService.addRule('strikethrough', {
                        filter: ['del', 's', 'strike'],
                        replacement: (content) => `~~${content}~~`
                    });
                    turndownService.addRule('highlight', {
                        filter: ['mark'],
                        replacement: (content) => `==${content}==`
                    });
                    content = turndownService.turndown(content);
                    language = 'markdown';
                }
                else if (contentType.includes('json')) {
                    language = 'json';
                }
                else if (contentType.includes('xml')) {
                    language = 'xml';
                }
                else if (contentType.includes('javascript')) {
                    language = 'javascript';
                }
                const document = await vscode.workspace.openTextDocument({
                    content: content,
                    language: language
                });
                progress.report({ increment: 100, message: 'Complete!' });
                await vscode.window.showTextDocument(document);
            });
            vscode.window.showInformationMessage(`Document loaded successfully!`);
        }
        catch (error) {
            let errorMessage = 'Failed to fetch document';
            if (error.response) {
                errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
            }
            else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout - please try again';
            }
            else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
                errorMessage = 'Network error - please check the URL and your connection';
            }
            vscode.window.showErrorMessage(`${errorMessage}: ${error.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map