import { Body, Controller, Get, Inject, LoggerService, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "./multer.config";
import { createReadStream, unlinkSync } from "fs";
import * as csv from 'csv-parser';
import { BacktestService } from "./backtest.service";
import { ApiService } from "../shared/api.service";

@Controller('backtest')
export class BacktestController {

  headers = {
    'access-token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzM2ODUxOTQwLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMTEyMTUxNSJ9.sP82yLDVq4OrdMvCdtGIiT6uFLUEs_GDa-Vr-g53L4B324NR-8gyj7eiKh2ogqxieaKtob5NskICj2JMYRAbQw',
    'client-id':'1101121515'
  }

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    private service: BacktestService, private api: ApiService) { }

   @Post('upload')
   @UseInterceptors(FileInterceptor('file',multerOptions))
   async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() payload: any) {
    const results = [];
    createReadStream(file.path).pipe(csv())
    .on('data', (data)=>{results.push(data)})
    .on('end', async ()=>{
      // console.log(results);
      try {
        await this.service.saveAlert(payload['alias'],results);
      } catch (error) {
        console.log(error);
      }
      unlinkSync(file.path);
    })
     return file;
   }

   @Get('/alerts')
   async findAllAlerts(){
    let alerts = [];
    try {
      alerts = await this.service.findAll();
    } catch (error) {
      console.log(error);
    }
    return alerts;
   }

   @Get('/alerts/:id')
   async findAllById(@Param() param:any){
    let alert = {};
    let sids = [];
    let symbols = [];
    try {
      alert = await this.service.findAlertById(param['id']);
      // console.log(alert);
      const signals = alert[0]['alert_signals'];

      //make the unique list of symbols
      signals.forEach(element => {
        if(!symbols.includes(element['symbol'])){
          symbols.push(`'${element['symbol']}'`)
        }
        else {

        }
      });

      sids = await this.service.getSecurityIds(symbols.join(','))
      // console.log(sids);
      let ids = sids.map(i => i.id)
      const ltps = await this.api.postData(`https://api.dhan.co/v2/marketfeed/ltp`, `  {
        "NSE_EQ":[${ids}]
        }`, this.headers );
        
          sids.forEach(sec => {
            try {
              sec['ltp'] = ltps.data.data['NSE_EQ'][sec.id]['last_price']  
            } catch (error) {
              console.log('unable to fetch ltp for ',sec);
            }
            //get signals for the symbol
            const ss = signals.filter(s => s.symbol === sec.symbol)
            // console.log(ss);
            let i = 0
            sec['alerts'] = ss.map(s => { 
             
                return s.date;  
                            
            });
          })
        // console.log(sids);
        
    } catch (error) {
      console.log(error);
    }
    
    
    
    return alert;
   }

}