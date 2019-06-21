const express =require("express");
const app=express();
const PORT = process.env.PORT || 6969;

app.get('/',(req,res)=>{
    console.log("home")
    res.send("Server run");
});

app.listen(PORT,()=>console.log("servicer start at"+PORT));
