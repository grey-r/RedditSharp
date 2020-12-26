export class User {
    private _name: string; //3-20 characters; ensure this is validated when coding login. PW must be 6 chars
    private _avatarUrl: string = "/assets/img/load.svg";
    constructor (name:string) {
        this._name=name;
    }
    public get name():string {
        return this._name;
    }
    public get avatarUrl(): string  {
        return this._avatarUrl;
    }
    public set avatarUrl(value: string ) {
        this._avatarUrl = value;
    }
}