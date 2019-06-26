const { Pool } = require('pg');
const client = new Pool({
    connectionString: 'postgres://ebkunvhqjbtrht:25e1e6e6cdaa216d01b6a9433e9db2cb4060d1dfe6e367480b912bd038c827a1@ec2-107-20-230-70.compute-1.amazonaws.com:5432/d22o909e4ksmea',
    ssl: true,
});
var CloriesService = {

    searchData: async (keyword, pageIndex = 0, pageSize = 10) => {

        if(!pageSize||pageSize==0)
            pageSize=10;
        let query = `SELECT {1} FROM Calories WHERE 1=1`;
        let params=[];
        if (keyword && keyword.length > 0)        {
            query += ` AND shrt_desc  ~* '${keyword}'`;
            params.push(keyword);
        }
      // await client.connect();
        try {

            let countQuery = query.replace("{1}", 'count(1)');
            let selectQuery = query.replace('{1}', '*') + ` ORDER BY id limit ${pageSize} offset ${pageIndex * pageSize}`
            query = countQuery + ';' + selectQuery;
            let result = await client.query(query);
            let totalRecord = result[0].rows[0].count;
            let items = result[1].rows;
          //  await client.end();
            return {
                Items:items,
                TotalRecords:totalRecord
            };


        } catch{
          //  await client.end();
        }




    }


}
module.exports = CloriesService;