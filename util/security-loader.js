const reader = require('xlsx');
const csv = require('csv-parser');
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tradebot-dev',
    password: 'postgres',
    port: 5432,
});

const results = [];

function processCSV(file){
    fs.createReadStream(file)
  .pipe(csv({skipLines: 0}))
  .on('data', (data) => {
    if(['NSE'].indexOf(data['SEM_EXM_EXCH_ID']) >= 0 && 
        ((['OPTSTK'].indexOf(data['SEM_INSTRUMENT_NAME']))>=0 
        || data['SEM_INSTRUMENT_NAME'] == 'EQUITY' && data['SEM_SERIES'] == 'EQ' && data['SEM_EXCH_INSTRUMENT_TYPE'] == 'ES'
        )
    )
    results.push(data)}
    )
  .on('end', async () => {
   console.log(results.length);
    for (let index = 0; index < results.length; index++) {
    // for (let index = 0; index < 2; index++) { 
    // for (let index = 0; index < 2; index++) {
        const rec = results[index];
        
        // console.log(`${rec['SEM_TRADING_SYMBOL']} | ${rec['SEM_CUSTOM_SYMBOL']}`);
        const sql = `insert into security_master (exch_id,segment,security_id,
        instrument,underlying_symbol,display_name,strike_price,option_type,lot_size) 
        values(
        '${rec['SEM_EXM_EXCH_ID']}',
        '${getSegment(rec['SEM_SEGMENT'])}',
        '${rec['SEM_SMST_SECURITY_ID']}',
        '${rec['SEM_INSTRUMENT_NAME']}',
        '${rec['SEM_TRADING_SYMBOL']}',
        '${rec['SEM_CUSTOM_SYMBOL']}',
        '${rec['SEM_STRIKE_PRICE']}',
        '${rec['SEM_OPTION_TYPE']}',${rec['SEM_LOT_UNITS']});`
        // console.log(sql);
        await pool.query(sql).catch(error => {
            // console.log('QUERY: ',query);
            console.log(sql,error);
        });
        console.log(index);
        
    }
  });
}

function getSegment(segment){
    if(segment == 'D'){
        return 'FNO';
    } else if(segment == 'E'){
        return 'EQ';
    }
    return segment;
}

function load(){
    const file = reader.readFile('Securities.xlsx');
    const records = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[0]]);
    const keys = records.length > 0 && Object.keys(records[0]);
    
    records.filter(r => r['INSTRUMENT_TYPE'] == 'ES' && r['SERIES'] == 'EQ').forEach(rec => {
        const values = Object.values(rec).map(v => `'${v}'`);
        const sql = `insert into security_master (${keys.join(',')}) values (${values.join(',')});`;     
        fs.appendFileSync('securities.sql', sql + '\n');
    });
}

// load();
processCSV('/Users/vimalkrishnan/Downloads/api-scrip-master (3).csv');