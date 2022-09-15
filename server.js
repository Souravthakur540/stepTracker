const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./router')
const PORT = 4000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/', routes);

app.listen(PORT, function(req, res){
    console.log(`server is running on port ${PORT}`)
})