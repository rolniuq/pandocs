"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('quynhvo.document-reader'));
    });
    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('quynhvo.document-reader');
        await extension?.activate();
        assert.ok(true);
    });
    test('Command should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('document-reader.openUrl'));
    });
});
//# sourceMappingURL=extension.test.js.map