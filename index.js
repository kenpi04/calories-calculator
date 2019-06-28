const CloriesService =require("./services/CloriesService.js");
const express =require("express");
const path=require("path");
const app=express();
const PORT = process.env.PORT || 6969;

app.use(express.static(path.join(__dirname, 'assets')))
  .set('views', path.join(__dirname, 'views'))
app.get('/',async(req,res)=>{

    res.sendFile(path.join(__dirname,'/views/index.html'));   
});
app.get('/search',async(req,res)=>{

    const keyword=req.query.keyword;
    const pageIndex=req.query.pageindex;
    const pageSize=req.query.pagesize;
    console.log(req.query);
    
    var data=await CloriesService.searchData(keyword,pageIndex,pageSize);
    res.send(data);    
    
 
});
app.get('/api/search',async(req,res)=>{
  const keyword=req.query.keyword;  
  var data=await CloriesService.searchData(keyword,0,10);
  res.send(data.Items);    

})
app.get('/facebook/webhook',async(req,res)=>{
    res.send(req.query);
})
app.listen(PORT,()=>console.log("servicer start at"+PORT));
