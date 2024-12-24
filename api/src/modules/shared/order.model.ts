export interface Order {
    exchange: string;
    instrument: string;
    clientId: string;
    transactionType: string; //BUY,SELL
    orderType: string; //MARKET,LIMIT,SL,SL-M
    symbol: string;
    securityId: string;
    quantity: number;
    price: number;
    validity: string; //DAY,IOC
    productType: string; //INTRADAY,DELIVERY
    correlationId: string;
}