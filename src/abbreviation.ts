export interface AbbreviationList {
    abbreviationList: AbbreviationObject[];
}

export interface AbbreviationObject {
    name: string;
    prefix: string;
    expand: ExpandSnippet;
}

export interface ExpandSnippet {
    prefix: string;
    body: string;
    separator: string;
    suffix: string;
}