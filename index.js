import express from "express";
const app=express();
const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.write("Server run");
});

app.listen(PORT,()=>console.log("servicer start at"+PORT));
