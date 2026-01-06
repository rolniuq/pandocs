import * as vscode from 'vscode';
import axios from 'axios';
import TurndownService from 'turndown';

function cleanHtmlContent(html: string): string {
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

export function activate(context: vscode.ExtensionContext) {
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

                const response = await axios.get(url, {
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
                    
                    const turndownService = new TurndownService({
                        headingStyle: 'atx',
                        bulletListMarker: '-',
                        codeBlockStyle: 'fenced',
                        preformattedCode: true
                    });
                    
                    // Remove unwanted elements completely
                    turndownService.remove(['script', 'style', 'noscript', 'iframe', 'embed', 'object']);
                    
                    // Custom rules for better conversion
                    turndownService.addRule('strikethrough', {
                        filter: ['del', 's', 'strike' as keyof HTMLElementTagNameMap],
                        replacement: (content: string) => `~~${content}~~`
                    });
                    
                    turndownService.addRule('highlight', {
                        filter: ['mark'],
                        replacement: (content: string) => `==${content}==`
                    });
                    
                    content = turndownService.turndown(content);
                    language = 'markdown';
                } else if (contentType.includes('json')) {
                    language = 'json';
                } else if (contentType.includes('xml')) {
                    language = 'xml';
                } else if (contentType.includes('javascript')) {
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

        } catch (error: any) {
            let errorMessage = 'Failed to fetch document';
            
            if (error.response) {
                errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout - please try again';
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
                errorMessage = 'Network error - please check the URL and your connection';
            }

            vscode.window.showErrorMessage(`${errorMessage}: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
