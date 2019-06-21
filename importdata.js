const { Client } = require('pg');
const fs = require("fs")
const client = new Client({
    connectionString: 'postgres://ebkunvhqjbtrht:25e1e6e6cdaa216d01b6a9433e9db2cb4060d1dfe6e367480b912bd038c827a1@ec2-107-20-230-70.compute-1.amazonaws.com:5432/d22o909e4ksmea',
    ssl: true,
});

const initialDatabase = (calback) => {
    fs.readFile(__dirname + '/data/0.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        let obj = JSON.parse(data).data[0];
        let sqlColumnNames = [];
        let columnName = [];
        for (var i in obj) {
            if (isNaN(parseInt(i))) {

                let value = obj[i];
                if (!isNaN(value)) {
                    columnName.push({ name: i, type: 'number' });
                    sqlColumnNames.push(i + ' float');
                }
                else {
                    sqlColumnNames.push(i + ' varchar(500)');
                    columnName.push({ name: i, type: 'string' });
                }

            }

        }
        const query = `        
        create table if not exists Calories (
            Id int GENERATED ALWAYS AS IDENTITY,
            ${sqlColumnNames.join(',')}
        );    
        `;
        console.log(query);
        client.connect();
        client.query(query,(err, res) => {
            if (err)
                console.log(err);
            client.end();
            calback(columnName);
        });
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
const importDataFromFile = (listColumnNames, fileName) => {
    let listQuery = [];
    let fileData = fs.readFileSync(__dirname + '/data/' + fileName);
    let objData = JSON.parse(fileData).data;
    for (let item of objData) {
        let arrayValue = [];
        let columns = [];
        for (let i of listColumnNames) {

            arrayValue.push("'" + item[i.name].replace("'","''") + "'");
            columns.push(i.name);
        }
        let query = `INSERT INTO Calories(${columns.join(',')}) Values(${arrayValue.join(',')})`;
       
        listQuery.push(query);
    }
    return listQuery;

}
const insertData=async(fromIndex,toIndex,columnName)=>{
    let isBusy=false;
    let i=fromIndex;
    const client_1 = new Client({
        connectionString: 'postgres://ebkunvhqjbtrht:25e1e6e6cdaa216d01b6a9433e9db2cb4060d1dfe6e367480b912bd038c827a1@ec2-107-20-230-70.compute-1.amazonaws.com:5432/d22o909e4ksmea',
        ssl: true,
    });
    
    client_1.connect();
    while(true)
    {
        if(i==toIndex)
            break;
        if(isBusy)
        {
            await sleep(2000);
            continue;
        }
        isBusy=true;
        const listSql = importDataFromFile(columnName, i + '.json');
        client_1.query(listSql.join(';'), (err, res) => {
            if (err)
                console.log(err);
            console.log('success ' + i);
            isBusy=false;
            i++;
        });
    }
    client_1.end();
}
initialDatabase((columnName)=>{
    insertData(200,300,columnName);
    insertData(300,400,columnName);
    insertData(400,500,columnName);
    insertData(500,600,columnName);
    insertData(600,700,columnName);
    insertData(700,800,columnName);
    insertData(800,877,columnName);
});







