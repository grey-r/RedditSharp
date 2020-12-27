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
    private _thumbnailUrl: string | null;
    private _previewUrl: string | null;
    private _text: string | null = null;
    private _imageUrl: string | null = null;
    private _videoUrl: string | null = null;
    private _upvotes: number | null = null;
    private _downvotes: number | null = null;
    private _replies: Post[] = [];
    private _mediaEmbed: string | null = null;
    constructor ( id: string, type:PostType, author:User|null=null, title:string|null=null, url:string|null=null, thumbnailUrl:string|null=null, previewUrl:string|null=null) {
        this._id = id;
        this._type = type;
        this._author=author;
        this._title=title;
        this._url = url;
        this._thumbnailUrl = thumbnailUrl;
        this._previewUrl = previewUrl;
    }
    public setVotes(upvotes: number, ratio: number) {
        this._upvotes = upvotes;
        this._downvotes = Math.round(upvotes/ratio-upvotes);
    }
    public get id():string {
        return this._id;
    }
    public get type():string {
        return this._type;
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
    public get imageUrl():string|null {
        return this._imageUrl;
    }
    public get videoUrl():string|null {
        return this._videoUrl;
    }
    public get thumbnailUrl():string|null {
        return this._thumbnailUrl;
    }
    public get previewUrl():string|null {
        return this._previewUrl;
    }
    public get upvotes():number|null {
        return this._upvotes;
    }
    public get downvotes():number|null {
        return this._downvotes;
    }
    public get replies():Post[] {
        return this._replies;
    }
    public get mediaEmbed():string|null {
        return this._mediaEmbed;
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
    public set imageUrl( url:string|null ) {
        this._imageUrl=url;
    }
    public set videoUrl( url:string|null ) {
        this._videoUrl=url;
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
    public set upvotes(num:number|null) {
        this._upvotes=num;
    }
    public set downvotes(num:number|null) {
        this._downvotes=num;
    }
    public set replies(posts:Post[]) {
        this._replies = posts;
    }
    public set mediaEmbed( str:string|null ) {
        this._mediaEmbed=str;
    }
}