import { User } from './user';

export const enum PostType {
    Comment = "t1", //taken from "kind parameter"
    Account = "t2",
    Link = "t3",
    Message = "t4",
    Subreddit = "t5",
    Award = "t6",
    MoreChildren = "more",
    Listing = "Listing" //ask reddit why this is capitalised
}

export class Post {
    private _id: string;
    private _type: PostType;
    private _utc:number|null = null;
    private _subreddit: string | null = null;
    private _author: User| null = null;
    private _title: string | null = null;
    private _url: string | null = null;
    private _thumbnailUrl: string | null=  null;
    private _previewUrl: string | null = null;
    private _text: string | null = null;
    private _html: string | null = null;
    private _imageUrl: string | null = null;
    private _videoUrl: string | null = null;
    private _upvotes: number | null = null;
    private _downvotes: number | null = null;
    private _replies: Post[] = [];
    private _mediaEmbed: string | null = null;

    constructor ( id: string, type:PostType) {
        this._id = id;
        this._type = type;
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
    public get utc():number|null {
        return this._utc;
    }
    public get subreddit():string|null {
        return this._subreddit;
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
    public get html():string|null {
        return this._html;
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
    public get reference():string {
        return this.type + "_" + this.id;
    }
    public get ago():string|null {
        if (!this.utc)
            return null;

        let secs = Math.floor(Date.now()/1000 - this.utc);

        if (secs<60)
            return Math.floor(secs) + " seconds";
        secs/=60;
        if (secs<60)
            return Math.floor(secs) + " minutes";
        secs/=60;
        if (secs<24)
            return Math.floor(secs) + " hours";
        secs/=24;
        if (secs<365)
            return Math.floor(secs) + " hours";
        secs/=365;
        return Math.floor(secs) + " years";
    }

    public set title( title:string|null ) {
        this._title=title;
    }
    public set subreddit( subreddit:string|null ) {
        this._subreddit=subreddit;
    }
    public set utc( utc:number|null ) {
        this._utc=utc;
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
    public set html( html:string|null ) {
        this._html=html;
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