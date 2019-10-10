import * as vscode from 'vscode';
import { clientId } from "../config.json";

let token: String | null;

export async function prepare(context: vscode.ExtensionContext): Promise<boolean> {
    let storedToken: string | undefined = context.globalState.get("token");
    if (!storedToken) {
        vscode.window.showInformationMessage("A web browser is being opened to allow you to sign into MyHomeworkSpace. You may be prompted to confirm this request.");
        await vscode.env.openExternal(vscode.Uri.parse(`https://api-v2.myhomework.space/application/requestAuth/${clientId}`));
        return false;
    } else {
        token = storedToken;
    }
    return true;
}

export async function registerSignIn(context: vscode.ExtensionContext): Promise<any> {
    let newToken = await vscode.window.showInputBox({
        prompt: "MyHomeworkSpace token",
        password: true,
    });
    if (!newToken) {
        return vscode.window.showErrorMessage("Sign in cancelled :(");
    }
    context.globalState.update("token", newToken);
    vscode.window.showInformationMessage("Signed in!");
}

export function registerSignOut() {
    token = null;
}

export function getToken() {
    return token;
}