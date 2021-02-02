import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class PostDataService implements OnDestroy {
  private _type: SubmissionType = SubmissionType.Link;
  private _type$: BehaviorSubject<SubmissionType> = new BehaviorSubject<SubmissionType>(
    this._type
  );
  private _submitFormData$: BehaviorSubject<
    SubmitFormControl[]
  > = new BehaviorSubject<SubmitFormControl[]>([]);

  public set type(type: SubmissionType) {
    this._type = type;
    this._type$.next(type);
  }
  public get type(): SubmissionType {
    return this._type;
  }
  public get submitFormData$(): Observable<SubmitFormControl[]> {
    return this._submitFormData$.asObservable();
  }

  ngUnsubscribe = new Subject<void>();

  private _textType = SubmissionType.Text;
  private _linkType = SubmissionType.Link;
  SubmitFormControlMap = {
    [this._textType]: [
      {
        controlName: "Title",
        controlType: "text",
        validators: { required: true, maxLength: 300 },
        placeholder: "Title (1-200 characters)",
        field: "title"
      },
      {
        controlName: "Subreddit",
        controlType: "text",
        validators: {
          required: true,
          minLength: 3,
          maxLength: 21,
          alphaunder: true
        },
        placeholder: "Subreddit (3-21 characters)",
        parameter: "subreddit",
        field: "sr"
      },
      {
        controlName: "Text",
        controlType: "textarea",
        placeholder: "Text (Markdown formatted)",
        field: "text"
      }
    ],
    [this._linkType]: [
      {
        controlName: "Title",
        controlType: "text",
        validators: { required: true, maxLength: 300 },
        placeholder: "Title (1-200 characters)",
        field: "title"
      },
      {
        controlName: "Subreddit",
        controlType: "text",
        validators: {
          required: true,
          minLength: 3,
          maxLength: 21,
          alphaunder: true
        },
        placeholder: "Subreddit (3-21 characters)",
        parameter: "subreddit",
        field: "sr"
      },
      {
        controlName: "Link",
        controlType: "url",
        validators: { required: true, url: true },
        placeholder: "https://google.com/",
        field: "url"
      }
    ]
  };

  constructor() {
    this._type$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type: SubmissionType) => {
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
  Text = "self",
  Link = "link"
}

export interface SubmitFormControl {
  controlName: string;
  controlType: string;
  default?: string;
  placeholder?: string;
  parameter?: string; //route parameter
  field?: string; //field in remote queries
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
    alphaunder?: boolean;
    subreddit?: boolean;
  };
}

export interface SubmitFormData {
  type: SubmissionType;
  title: string;
  sr: string;
  text?: string;
  url?: string;
  nsfw?: boolean;
  resubmit?: boolean;
  sendreplies?: boolean;
  spoiler?: boolean;
}
