
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;

let hbs = exphbs.create({ extname: ".hbs" });

app.engine('.hbs', hbs.engine);

//Sets our app to use the handlebars engine
app.set("view engine", ".hbs");

//Serves static files
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port)
