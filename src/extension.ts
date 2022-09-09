import * as vscode from 'vscode';
import { buildSnippet, getAbbrevName, loadAbbreviationList } from './parser';
import { AbbreviationList } from './abbreviation';
import path = require('path');

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "ennet" is now active!');

	const al = loadAbbreviationList(context.asAbsolutePath(path.join('src', 'abbrev_list.json')));
	let prefixes: string[] = [];
	al.abbreviationList.forEach((element) => {
		prefixes.push(element.prefix);
	});

	let disposable = vscode.commands.registerCommand('ennet.expand', () => {
		let abbreviation = getWordUnderCursor();
		if (isValidAbbreviation(prefixes, abbreviation!)) {
			vscode.window.activeTextEditor?.edit((editBuilder) => {
				editBuilder.delete(getWordRangeUnderCursor()!);
			});
			expandAbbreviation(al, abbreviation!);
		}
	});

	context.subscriptions.push(disposable);
}

function isValidAbbreviation(prefixes: string[], abbreviation: string): boolean {
	return Boolean(prefixes.find((s) => s === getExpandCommand(abbreviation)[0]));
}

function expandAbbreviation(al: AbbreviationList, abbreviation: string) {
	let [prefix, repeat] = getExpandCommand(abbreviation);
	insertSnippet(buildSnippet(al, getAbbrevName(al, prefix), repeat));
}

function getExpandCommand(abbreviation: string): [string, number] {
	let prefix = "";
	let repeat = 0;
	let tmp = "";
	for (let i = 0; i < abbreviation.length; i++) {
		const c = abbreviation[i];
		const nc = abbreviation[i+1];
		if (i === 0 && !isNaN(+c)) {
			return ['', 0];
		}
		tmp += c;
		if (isNaN(+c) && !isNaN(+nc)) {
			prefix = tmp;
			tmp = "";
		} else if (!isNaN(+c) && nc === undefined) {
			repeat = Number(tmp);
		}
	}
	return [prefix, repeat];
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

function insertSnippet(snippet: vscode.SnippetString) {
	let editor = vscode.window.activeTextEditor;
	let pos = editor?.selection.active!;
	editor?.insertSnippet(snippet, pos);
}

export function deactivate() {}