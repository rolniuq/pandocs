import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('quynhvo.pandocs'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('quynhvo.pandocs');
        await extension?.activate();
        assert.ok(true);
    });

    test('Command should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('pandocs.openUrl'));
    });
});