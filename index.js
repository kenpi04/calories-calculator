const CloriesService =require("./services/CloriesService.js");
const express =require("express");
const app=express();
const PORT = process.env.PORT || 6969;

app.get('/',async(req,res)=>{

    const keyword=req.query.keyword;
    const pageIndex=req.query.pageindex;
    const pageSize=req.query.pagesize;
    console.log(req.query);
    
    var data=await CloriesService.searchData(keyword,pageIndex,pageSize);
    res.send(data);
    
    
 
});

app.listen(PORT,()=>console.log("servicer start at"+PORT));
