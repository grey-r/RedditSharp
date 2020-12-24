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
    id: string;
    type: PostType;
    author: User| null;
    title: string | null;
    url: string | null;
    text: string | null;
    thumbnailUrl: string | null;
    previewUrl: string | null;
    constructor ( id: string, type:PostType, author:User|null=null, title:string|null=null, url:string|null=null, thumbnailUrl:string|null=null, previewUrl:string|null=null) {
        this.id = id;
        this.type = type;
        this.author=author;
        this.title=title;
        this.url = url;
        this.thumbnailUrl = thumbnailUrl;
        this.previewUrl = previewUrl;
        this.text=null;
    }
    setPreviews( thumbnailUrl:string|null=null, previewUrl:string|null=null ):this {
        this.thumbnailUrl=thumbnailUrl;
        this.previewUrl=previewUrl;
        return this;
    }
    setText( text:string ):this {
        this.text=text;
        return this;
    }
}