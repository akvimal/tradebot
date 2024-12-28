import { Component } from "@angular/core";
import { OrderService } from "./orders.service";
import { WebsocketService } from "src/app/websocket.service";

@Component({
    templateUrl: './orders.component.html'
})
export class OrdersComponent {

    orders:any = []

    constructor(private service:OrderService,private wsService: WebsocketService){}

    ngOnInit(){
        this.service.findOrders(null).subscribe((data:any) => {
            this.orders = data;
        })
        // const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzM1Nzg1MjU0LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cDovLzg5LjIzMy4xMDQuMjo5MDkwL29yZGVyL2ZlZWRiYWNrL2RoYW4iLCJkaGFuQ2xpZW50SWQiOiIxMTAxMTIxNTE1In0.DIoESWnDxtUYzAjCdD8z-DWB7dBWQceOEySLTt2i6rsyHZkpFe8YLbBkW-YiGbPwStPuDWBkkRhg7oT0kKDsvA`;
        // const clientId = `1101121515`;
        
        // const url = `wss://api-feed.dhan.co?version=2&token=${token}&clientId=${clientId}&authType=2`
        // console.log('connecting ws ...');
        
        // this.wsService.connect(url).subscribe((data) => {
        //     console.log(data);
        //     // this.wsService.sendMessage({
        //     //     "RequestCode" : 15,
        //     //     "InstrumentCount" : 2,
        //     //     "InstrumentList" : [
        //     //         {
        //     //             "ExchangeSegment" : "MCX",
        //     //             "SecurityId" : "441347"
        //     //         }
        //     //     ]
        //     // })
        // });
        
    }
}