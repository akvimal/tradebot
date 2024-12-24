const obj = {
	security: 'STK', //FUT,OPT
	type: 'MARKET',
	intraday: {
		begin: '09:45',
		end: '14:00'
	},
	position: {
		type: 'UNIT',//'AMNT','PCNT'
		initial: 5,
		repeat: 5,
		final: 50
	},
	repeat: 0,
	exit: 'SESSION',//'SIGNAL'
	loss: {
        limit: 0,
        trailing: {
            percent: 1,
            point: 1,
            same: true
        }
	}	
}

console.log(JSON.stringify(obj)) // {};
