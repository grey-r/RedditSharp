import {User} from './user'

export const enum PostType {
    Comment = "t1", //taken from "kind parameter"
    Account = "t2",
    Link = "t3",
    Message = "t4",
    Subreddit = "t5",
    Award = "t6"
}

export class Post {
    private _id: string;
    private _type: PostType;
    private _author: User| null;
    private _title: string | null;
    private _url: string | null;
    private _text: string | null;
    private _thumbnailUrl: string | null;
    private _previewUrl: string | null;
    constructor ( id: string, type:PostType, author:User|null=null, title:string|null=null, url:string|null=null, thumbnailUrl:string|null=null, previewUrl:string|null=null) {
        this._id = id;
        this._type = type;
        this._author=author;
        this._title=title;
        this._url = url;
        this._thumbnailUrl = thumbnailUrl;
        this._previewUrl = previewUrl;
        this._text=null;
    }
    public get id():string {
        return this._id;
    }
    public get author():User|null {
        return this._author;
    }
    public get title():string|null {
        return this._title;
    }
    public get url():string|null {
        return this._url;
    }
    public get text():string|null {
        return this._text;
    }
    public get thumbnailUrl():string|null {
        return this._thumbnailUrl;
    }
    public get previewUrl():string|null {
        return this._previewUrl;
    }
    public set title( title:string|null ) {
        this._title=title;
    }
    public set author( author:User|null ) {
        this._author=author;
    }
    public set url( url:string|null ) {
        this._url=url;
    }
    public set thumbnailUrl( thumbnailUrl:string|null) {
        this._thumbnailUrl=thumbnailUrl;
    }
    public set previewUrl( previewUrl:string|null ) {
        this._previewUrl=previewUrl;
    }
    public set text( text:string|null ) {
        this._text=text;
    }
}