import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    apiUrl = `${environment.apiHost}/orders/filter`;

    constructor(private http: HttpClient){}

    findOrders(criteria:any){
        return this.http.post(`${this.apiUrl}`,criteria);
    }

}