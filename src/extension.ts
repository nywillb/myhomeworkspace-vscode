// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as mhs from './mhsutil';
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let hwviewHtml = fs.readFileSync(path.join(context.extensionPath, 'public', 'hwview.html')).toString();
	let hwview = handlebars.compile(hwviewHtml);

	let getHomework = vscode.commands.registerCommand('myhomeworkspace.getHomework', async () => {
		if (!await mhs.prepare(context)) { return; }
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		let panel = vscode.window.createWebviewPanel("hwView", "Homework", vscode.ViewColumn.Beside, {
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'public'))],
			enableScripts: true
		});

		panel.webview.html = hwview({
			token: mhs.getToken(),
			js: panel.webview.asWebviewUri(vscode.Uri.file(
				path.join(context.extensionPath, 'public', 'hwview', 'index.js')
			)),
			css: panel.webview.asWebviewUri(vscode.Uri.file(
				path.join(context.extensionPath, 'public', 'hwview', 'index.css')
			)),
		});
	});

	context.subscriptions.push(getHomework);

	let signIn = vscode.commands.registerCommand('myhomeworkspace.signIn', async () => {
		await mhs.registerSignIn(context);
	});

	context.subscriptions.push(signIn);

	let signOut = vscode.commands.registerCommand('myhomeworkspace.signOut', async () => {
		await context.globalState.update("token", undefined);
		mhs.registerSignOut();
	});

	context.subscriptions.push(signOut);
}

// this method is called when your extension is deactivated
export function deactivate() { }
