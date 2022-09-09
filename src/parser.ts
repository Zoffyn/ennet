import {readFileSync, Dir} from 'fs';
import {AbbreviationList} from './abbreviation';
import {SnippetString, ExtensionContext} from 'vscode';

export function loadAbbreviationList(path: string): AbbreviationList {
    let jsonString = readFileSync(path, {encoding: 'utf8'});
    return JSON.parse(jsonString)
}

export function getAbbrevName(al: AbbreviationList, prefix: string): string {
    const abbrevObj = al.abbreviationList.find((value) => {
        return value.prefix === prefix;
    });
    return abbrevObj?.name!;
}

export function buildSnippet(al: AbbreviationList, name: string, repeat: number): SnippetString {
    const abbrevObj = al.abbreviationList.find((value) => {
        return value.name === name;
    });
    const expand = abbrevObj?.expand!;
    let tmp = expand.prefix;
    for (let i = 1; i < repeat; i++) {
        tmp += expand.body + expand.separator;
    }
    tmp += expand.body + expand.suffix;
    const indexCount = (tmp.match(/\$INDEX/g) || []).length;
    for(let i = 1; i <= indexCount; i++) {
        tmp = tmp.replace('$INDEX', i.toString());
    }
    return new SnippetString(tmp);
}