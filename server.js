const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// process.env is a list of key value pairs for environment variables
// this setup is necessary for heroku because
// the port number needs to be dynamic?
// the || 3000 is just there for local deployment
const port = process.env.PORT || 3000;


var app = express();

// this tells hbs where to look, to find partials
// partials are reusable codes that can be injected into other
// hbs files
hbs.registerPartials(`${__dirname}/views/partials`)

// registers helper functions
// by injecting getCurrentYear in hbs files, we call the return value automatically
// how helpful is this? you have to register once, for every function?
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

// what happens when someone sends a request to my server
// req = request , res = respond

// an alternative way to make files accessible. The following enables an entire folder accessible
// __dirname is the absolute path for the current file, up to its containing folder
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
	var now = new Date().toString();	
	var log = `${now}: ${req.method} ${req.url}`
	console.log(log)
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.')
		}
	})
	// res.render('maintnance.hbs')
	next()
});


// sets up the main page: root, as /

// the res.send method: 

	// app.get('/', (req, res) => {
	// 	res.send({
	// 		name: 'Pei',
	// 		likes: ['silver', 'mast']
	// 	})	
	// });

app.get('/', (req, res) => {
	res.render('home.hbs', {
		welcome: 'Welcome to my page!',
		pageTitle: 'Welcome Page',	
	})
})

app.get('/project', (req, res) => {
	res.render('project.hbs')
});

// sets up the about route: localhost:3000/bad
// using res.send is extremely inefficient, since you have to do it once for every "page"
// plus, you must manually type the things you want to be sent

app.get('/bad', (req, res) => {
	res.send({
		message: 'ERROR'
	});
});

// this tells express what view engine to use
app.set('view engine', 'hbs');

// instead of res.send, we can use res.render (apart of express library)
// and ask it to render a hbs file. We can use hbs file's template string
// syntax to make the content of that file more dynamic

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		// within the hbs file, we use {{key}} as a template string
		pageTitle: 'About Page',
		currentYear: new Date().getFullYear() 
	});
})

// adds a listener, uses a port number. The function input fires when server is up
app.listen(port, () => {
	console.log(`Server is up on por ${port}`);
});

