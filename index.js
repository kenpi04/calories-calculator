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
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "QuangTeo1234!@#$"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  console.log(body);
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});
app.listen(PORT,()=>console.log("servicer start at"+PORT));
