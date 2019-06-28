const CloriesService =require("./services/CloriesService.js");
const express =require("express");
var bodyParser = require('body-parser');
const path=require("path");
const app=express();
const PORT = process.env.PORT || 6969;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
 
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      callSendAPI(webhook_event.recipient.id,"Xin chào",()=>{
          console.log("send success");
      })
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
   
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});
const callSendAPI = (sender_psid, response, cb = null) => {
  // Construct the message body
  let request_body = {
      "recipient": {
          "id": sender_psid
      },
      "message": response
  };

  // Send the HTTP request to the Messenger Platform
  request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token":getToken() },
      "method": "POST",
      "json": request_body
  }, (err, res, body) => {
      if (!err) {
          if(cb){
              cb();
          }
      } else {
          console.error("Unable to send message:" + err);
      }
  });
}
let getToken=()=>{
  return 'EAAGhJcJzaDsBAKZBUixkZCEy2XeTZBuoElrXNC9NNeKrodd8l1iIRcAQO8z6cSqOKCB7KWhxRRtNc5GlReXeufr46fXdZASfqKwTtjmbaZCgaT3l9sQ3TeVPKdO9XGGHNqqottbXpvJS1UgVmOLajZCqqfZAFNoQJxQuBcFskXvXDMcpHPZCUYMH';
}
app.listen(PORT,()=>console.log("servicer start at"+PORT));
