const obj = {
	exchange: 'NSE',//BSE/MCX'
	segment: 'EQ',//FNO/CURRENCY/COMM'
	entry: {
	    productType: 'INTRADAY',//MTF/CNC',
	    orderType: 'LIMIT',//MARKET/TRIGGER/CO/BO',
		intraday: { 
			validity: 'DAY',///IOC',
			begin: '09:45', end: '14:00'
		},
	    position: { 
			type: 'VALUE',//UNIT', 
			build: true, //adding more positions on more alerts, AVG if the trade goes against,  ACMLT is the trade goes in favour
			qty: {
				min: 10000, incr: 2000, max: 20000,
				disclose: 5
			}
		}
	},
    exit: {
		targets: [
			{trigger_pcnt: 2, qty_pcnt:50, sl_pcnt: 0},
			{trigger_pcnt: 1, qty_pcnt:25, sl_pcnt: 2}
		],
		stoploss: {
			pcnt: .5
		}
	}
  }


console.log(JSON.stringify(obj)) // {};
