import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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

  constructor(private _formBuilder:FormBuilder, private _postData:PostDataService) { 
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
      console.log(data);
      this.secondFormData=data;
      const formGroup:{[name:string]: FormControl} = {};

      data.forEach( (formControl) => {
        formGroup[formControl.controlName] = new FormControl();
      });

      console.log(formGroup);

      this.secondFormGroup = new FormGroup(formGroup);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}