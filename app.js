//Include the modules & libraries
const express =     require ('express')
const fs =          require ('fs')
const app =         express()
const bodyParser =  require('body-parser')
const pg =          require ('pg')

// Parse the input data with the urlEndoded
let urlEncoder = bodyParser.urlencoded({extended: false})
//Variable to connect to the database
let connectionString = "postgres://NONO:Iceteagreen8051@localhost/bulletinboard";
//load static files
app.use(express.static('static'))
//Set up pug
app.set ('view engine', 'pug')
app.set ('views', __dirname + '/views')

// Get request route index
app.get('/index', function (req, res) {
  console.log('Hello World')
  //Render a pug page index
  res.render('index')
});

//Post request (our data) to database via index route
app.post('/index', urlEncoder, function (req, res) {
  //debug
  console.log('Hello yoyo')
  //connect to the database 
  pg.connect(connectionString, function (err, client, done) {
  	console.log('connexion works');
    //Send the data to the database (note that $1,$2 is the notation system)
  	client.query('insert into messages (title, body) values ($1, $2)', [req.body.title, req.body.message], function (err, result) {
  		
  		//Rredirect -> NEVER RENDER IN APP.POST
		res.redirect('/msgpage')
  		done();
	  	pg.end();

  	})
  })
});

//we want to get our data and render it to msg page
app.get ('/msgpage', function (req, res) {
	console.log('msg page soon ok')
	//connect to database bu TAKES the data
	pg.connect(connectionString, function (err, client, done) {
  	console.log('connexion works');
    //takes the data from the database.
  	client.query('select * from messages', function (err, result) {
  		console.log(result.rows)
  		//redirect the DATA stored in POPCORN to the msgpage
		res.render('msgpage', {bitch:result.rows.reverse()})
			//debug
			console.log('you go girl')

  	done();
	pg.end();


  	})
  })
	
})



// app listened on port 3000
app.listen(3000, function () {
	console.log('It works on 3000 port');
});
