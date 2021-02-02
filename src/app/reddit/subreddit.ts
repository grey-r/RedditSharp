export class Subreddit {
  private _id: string;
  private _type: string;
  private _name: string;
  constructor(id: string, type: string, name: string) {
    this._id = id;
    this._type = type;
    this._name = name;
  }
  public get id(): string {
    return this._id;
  }
  public get type(): string {
    return this._type;
  }
  public get name(): string {
    return this._name;
  }
}
