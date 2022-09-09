import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "ennet" is now active!');

    let disposable = vscode.commands.registerCommand('ennet.expand', () => {
        let abbreviation = getWordUnderCursor();
        if (isValidAbbreviation(abbreviation!)) {
            vscode.window.activeTextEditor?.edit((editBuilder) => {
                editBuilder.delete(getWordRangeUnderCursor()!);
            });
            expandAbbreviation(abbreviation!);
        }
    });

    context.subscriptions.push(disposable);
}

function isValidAbbreviation(abbreviation: string): boolean {
    return getExpandCommand(getWordUnderCursor()!)[0] == 'arr';
}

function expandAbbreviation(abbreviation: string) {
    let [type, num] = getExpandCommand(abbreviation);
    let snippet = '';
    if (type === 'arr') {
        snippet = '[';
        for (let i = 1; i < num; i++) {
            snippet += `$${i}, `;
        }
        snippet += `$${num}]`;
    }
    insertSnippet(snippet);
}

function getExpandCommand(abbreviation: string): [string, number] {
    let com = "";
    let num = 0;
    let tmp = "";
    for (let i = 0; i < abbreviation.length; i++) {
        const c = abbreviation[i];
        const nc = abbreviation[i+1];
        if (i === 0 && !isNaN(+c)) {
            return ['', 0];
        }
        tmp += c;
        if (isNaN(+c) && !isNaN(+nc)) {
            com = tmp;
            tmp = "";
        } else if (!isNaN(+c) && nc === undefined) {
            num = Number(tmp);
        }
    }
    return [com, num];
}

function getWordUnderCursor(): string | undefined {
    let editor = vscode.window.activeTextEditor;
    let pos = editor?.selection.active!;
    let word = editor?.document.getText(getWordRangeUnderCursor());
    return word;
}

function getWordRangeUnderCursor(): vscode.Range | undefined {
    let pos = vscode.window.activeTextEditor?.selection.active!;
    return vscode.window.activeTextEditor?.document.getWordRangeAtPosition(pos);
}

function insertSnippet(...snippetTemplate: string[]) {
    let editor = vscode.window.activeTextEditor;
    let pos = editor?.selection.active!;
    let line = editor?.document.lineAt(pos.line);
    let snippet = new vscode.SnippetString(snippetTemplate.join("\n"));
    editor?.insertSnippet(snippet, pos);
}

export function deactivate() {}
