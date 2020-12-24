export class User {
    private _name: string;
    private _avatarUrl: string | null = null;
    constructor (name:string) {
        this._name=name;
    }
    public get name():string {
        return this._name;
    }
    public get avatarUrl(): string | null {
        return this._avatarUrl;
    }
    public set avatarUrl(value: string | null) {
        this._avatarUrl = value;
    }
}