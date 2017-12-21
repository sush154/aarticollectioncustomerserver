var app = require('./app');

var port = process.env.PORT || 9001;

app.listen(port, function(){
    console.log("app is listening on port 9001");

});