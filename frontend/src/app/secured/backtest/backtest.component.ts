import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BacktestService } from './backtest.service';
import { catchError, throwError } from 'rxjs';

@Component({
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './backtest.component.html'
})
export class BacktestComponent {

  alias = '';
  valid = false;
  file: any; // Variable to store file
  error = '';
  loading: boolean = false; // Flag variable

  alerts:any[] = [];
  alert:any = null;

  constructor(private service:BacktestService){}
  
  ngOnInit(): void {
    this.service.findAlerts().subscribe((data:any) => {
      this.alerts = data;
    });
  }

  showAlert(id:number){
    this.service.findAlertById(id).subscribe((data:any)=>{
      console.log('setting data');
    console.log(data);
      
      this.alert = data[0];
    })
    
  }

  onChange(event:any) {
    this.file = event.target.files[0];
    this.alias = this.file.name.substring(0,this.file.name.indexOf('.'));
  }

  onUpload() {
    this.loading = !this.loading;
  
    this.service.upload(this.file,this.alias).pipe(
        catchError(error => {
          this.error = error['error']['message'];
          this.loading = false;
          return throwError(() => new Error(error['error']['message']));
        })
      ).subscribe(
        (event: any) => {
            if (typeof (event) === 'object') {
                this.error = '';
                this.file = null;
                this.loading = false; // Flag variable 
                // console.log('uploaded document, emitting',event);
                // this.saveDocInfoToTable(event);
            }
        }
    );
  }

  isFormValid(){
    return this.alias !== '' && this.file;
  }
}
