import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    apiUrl = `${environment.apiHost}/alerts`;

    constructor(private http: HttpClient){}

    findAlerts(criteria:any){
        return this.http.post(`${this.apiUrl}/filter`,criteria);
    }

    findAlertSecurities(alertId:number){
        return this.http.get(`${this.apiUrl}/${alertId}/securities`);
    }

}