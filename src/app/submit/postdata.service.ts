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
      {controlName:"Title",controlType:"text"},
      {controlName:"Text",controlType:"textarea"}
    ],
    [this._linkType]: [
      {controlName:"Title",controlType:"text"},
      {controlName:"Subreddit",controlType:"text"}
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
  valueType?: string;
  currentValue?: string;
  placeholder?: string;
  options?: Array<{
    optionName: string;
    value: string;
  }>;
  validators?: {
    required?: boolean;
    minlength?: number;
    maxlength?: number;
  };
}