import { Component } from "@angular/core";
import { AlertService } from "./alerts.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Route, Router, RouterModule } from "@angular/router";

@Component({
    imports: [CommonModule,RouterModule],
    templateUrl: './alerts.component.html',
    styles: [`label {width:80px}`]
})
export class AlertsComponent {

    alerts:any = []

    constructor(private service:AlertService, private route:ActivatedRoute, private router:Router){}

    ngOnInit(){
        this.service.findAlerts(null).subscribe((data:any) => {
            this.alerts = data;
        }); 
    }

    openSecurities(id:number){
        this.router.navigate(['securities', id], {relativeTo: this.route})
    }
}