
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

let hbs = exphbs.create({ extname: ".hbs" });

app.engine('.hbs', hbs.engine);

//Sets our app to use the handlebars engine
app.set("view engine", ".hbs");

//Serves static files
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000)
