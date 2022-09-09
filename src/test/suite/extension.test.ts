import * as assert from 'assert';
import {buildSnippet} from '../../parser';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Snippet Build', () => {
		// assert.strictEqual('[$1, $2, $3, $4, $5, $6, $7, $8]', buildSnippet('Array', 8).value);
		// assert.strictEqual('($1, $2, $3)', buildSnippet('Tuple', 3).value);
		// console.error(buildSnippet('Switch', 3).value);

	});
});
