const reader = require('xlsx');
const fs = require('fs');

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

load();