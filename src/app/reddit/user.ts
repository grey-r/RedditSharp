export class User {
    id: string; //author_fullname e.g. t2_729skja7
    name: string | null;
    avatarUrl: string | null;
    constructor (id:string,name:string|null=null,avatarUrl:string|null=null) {
        this.id=id;
        this.name=name;
        this.avatarUrl=avatarUrl;
    }
}