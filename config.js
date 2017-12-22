var allowedOrigins = ['http://localhost:3000', 'http://localhost:8100'];


var config = {
		mongo : {
			//connectionUrl : 'mongodb://admin:admin@ds163053.mlab.com:63053/aartiscollection'
			connectionUrl : 'mongodb://localhost:27017/aartiscollection'
		},
		mongooseConnection : null,
		client : {
			connectionUrl : ['http://localhost:3000', 'http://localhost:8100', 'https://aarticollectionadminui.herokuapp.com/', 'http://localhost:4200']
		}
}

module.exports = config;