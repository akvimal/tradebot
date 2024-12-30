import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyAlertService } from "./myalerts.service";

@Component({
    imports: [CommonModule],
    templateUrl: './myalerts.component.html',
    styles: [`label {width:80px}`]
})
export class MyAlertsComponent {

    alerts:any = []

    constructor(private service:MyAlertService){}

    ngOnInit(){
        this.service.findAlerts(null).subscribe((data:any) => {
            this.alerts = data;
        }); 
    }
}