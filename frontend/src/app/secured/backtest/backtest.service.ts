import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BacktestService {

    apiUrl = `${environment.apiHost}/backtest`;

    constructor(private http: HttpClient){}

    upload(file:any,alias:string):Observable<any> {
        const formData = new FormData(); 
        // Store form name as "file" with file data
        formData.append("file", file);
        formData.append("alias", alias);
        return this.http.post(this.apiUrl+`/upload`, formData)
    }

    findAlerts(){
        return this.http.get(this.apiUrl+`/alerts`)
    }

    findAlertById(id:number){
        return this.http.get(this.apiUrl+`/alerts/${id}`)
    }

}