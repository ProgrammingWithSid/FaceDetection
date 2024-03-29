require('dotenv').config();
require('./config/mongoose');

let createExpressApp = require('./config/express'); 
let app = createExpressApp(); 


const port = process.env.PORT || 3001; 

app.listen(port,async ()=> {
    console.log(`Magic Happens At Port ${port}`)

})