import { Component } from "@angular/core";
import { AlertService } from "../alerts.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";

@Component({
    imports: [CommonModule,RouterModule],
    templateUrl: './securities.component.html',
    styles: [`label {width:80px}`]
})
export class SecuritiesComponent {

    securities:any = []

    constructor(private activatedRoute:ActivatedRoute, private service:AlertService){}

    ngOnInit(){
        this.activatedRoute.params.subscribe(data => {
            this.service.findAlertSecurities(data['id']).subscribe(secs => this.securities = secs);
        });
    }
}