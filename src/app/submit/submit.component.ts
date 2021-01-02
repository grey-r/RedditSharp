import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SubredditValidatorService } from '../reddit/validators/subreddit-validator.service';
import { AlphaUnderValidator } from '../validators/alpha-under-validator';
import { URLValidator } from '../validators/url-validator';
import { PostDataService, SubmissionType, SubmitFormControl } from './postdata.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit, OnDestroy {
  SubmissionType = SubmissionType;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  secondFormData!:SubmitFormControl[];
  postData:PostDataService;

  ngUnsubscribe = new Subject<void>();

  constructor(private _formBuilder:FormBuilder, private _postData:PostDataService, private _subVal:SubredditValidatorService) { 
    this.postData = this._postData;
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      postType: [this.postData.type, Validators.required]
    });
    this.firstFormGroup.get("postType")?.valueChanges.subscribe( (val:SubmissionType) => {
      this._postData.type = val;
    });
    this.postData.submitFormData$.subscribe( (data:SubmitFormControl[]) => {
      this.secondFormData=data;
      const formGroup:{[name:string]: FormControl} = {};

      data.forEach( (formControl) => {
        let validators:ValidatorFn[] = [];
        let validatorsAsync:AsyncValidatorFn[] = [];

        if (formControl.validators) {
          if (formControl.validators.required) {
            validators.push(Validators.required);
          }
          if (formControl.validators.minLength) {
            validators.push(Validators.minLength(formControl.validators.minLength));
          }
          if (formControl.validators.maxLength) {
            validators.push(Validators.maxLength(formControl.validators.maxLength));
          }
          if (formControl.validators.url) {
            validators.push(URLValidator);
          }
          if (formControl.validators.email) {
            validators.push(Validators.email);
          }
          if (formControl.validators.alphaunder) {
            validators.push(AlphaUnderValidator);
          }
          if (formControl.validators.subreddit) {
            validatorsAsync.push(this._subVal.getValidator());
          }
        }

        formGroup[formControl.controlName] = new FormControl('',validators,validatorsAsync);
      });

      this.secondFormGroup = new FormGroup(formGroup);
    });
  }

  getErrorMessage(fg:FormGroup,controlName:string):string {
    let c = fg.get(controlName);
    if (!c) {
      return "Invalid control";
    }
    if (c.hasError("minlength")) {
      return "Too short."
    }
    if (c.hasError("maxlength")) {
      return "Too long."
    }
    if (c.hasError("invalidText")) {
      return "Contains invalid characters";
    }
    if (c.hasError("email")) {
      return "Not a valid EMail";
    }
    if (c.hasError("url")) {
      return "Not a valid URL";
    }
    if (c.hasError("sub")) {
      return c.getError("sub");
    }
    return "Generic error.";
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}