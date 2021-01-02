import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PostDataService implements OnDestroy {

  private _type: SubmissionType = SubmissionType.Link;
  private _type$:BehaviorSubject<SubmissionType> = new BehaviorSubject<SubmissionType>(this._type);
  private _submitFormData$:BehaviorSubject<SubmitFormControl[]> = new BehaviorSubject<SubmitFormControl[]>([]);

  public set type(type:SubmissionType) {
    this._type = type;
    this._type$.next(type);
  }
  public get type():SubmissionType {
    return this._type;
  }
  public get submitFormData$():Observable<SubmitFormControl[]> {
    return this._submitFormData$.asObservable();
  }

  ngUnsubscribe = new Subject<void>();

  private _textType = SubmissionType.Text;
  private _linkType = SubmissionType.Link;
  SubmitFormControlMap = {
    [this._textType]: [
      {controlName:"Title",controlType:"text", validators:{required:true,maxLength:200}, placeholder: "Title (1-200 characters)"},
      {controlName:"Subreddit",controlType:"text", validators:{required:true, minLength:3, maxLength:21, alphaunder:true, subreddit: true}, placeholder: "Subreddit (3-21 characters)", parameter: "subreddit"},
      {controlName:"Text",controlType:"textarea", placeholder: "Text (1+ characters)"}
    ],
    [this._linkType]: [
      {controlName:"Title",controlType:"text", validators:{required:true,maxLength:200}, placeholder: "Title (1-200 characters)"},
      {controlName:"Subreddit",controlType:"text", validators:{required:true, minLength:3, maxLength:21, alphaunder:true, subreddit: true}, placeholder: "Subreddit (3-21 characters)", parameter: "subreddit"},
      {controlName:"Link",controlType:"url", validators:{required:true, url:true}, placeholder: "https://google.com/"}
    ]
  }

  constructor() {
    this._type$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (type:SubmissionType) => {
      this._submitFormData$.next(this.SubmitFormControlMap[type]);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._submitFormData$.complete();
  }
}

export enum SubmissionType {
  Text = "text",
  Link = "link"
}

export interface SubmitFormControl {
  controlName: string;
  controlType: string;
  default?: string;
  placeholder?: string;
  parameter?: string; //route parameter
  options?: Array<{
    optionName: string;
    value: string;
  }>;
  validators?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    url?: boolean;
    email?: boolean;
    alphaunder?:boolean;
    subreddit?: boolean;
  };
}