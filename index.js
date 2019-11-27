const PORT = 5500;

const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const HBS = require('express-handlebars');
const MONGO_CLIENT = require('mongodb').MongoClient;

const app = EXPRESS();
const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'adidas_database';
var database = null;

const CLIENT = new MONGO_CLIENT(URL, {useUnifiedTopology: true});

/* CLIENT.connect(function(err) {
    if(err) {
        console.error(err);
        return;
    } 
 
    database = CLIENT.db(DATABASE_NAME);
}); */

app.use(EXPRESS.static('public'));

app.engine('handlebars', HBS({
    extname: "HBS",
    defaultLayout: "",
    layoutsDir: "",
 }));
app.set('view engine', 'handlebars');

//#region RUTAS GET
//Home
app.get('/', function(request, response) {

    CLIENT.connect(function(err) {
        if(err) {
            console.error(err);
            response.send(err);
            return;
        } 
     
        database = CLIENT.db(DATABASE_NAME);
        const collection = database.collection('users');
        collection.find({}).toArray(function (err, docs) {
            if(err) {
                console.error(err);
                response.send(err);
                return;
            }

            var context = {
                title: 'Titulazo',
                users: docs,
            }
            
            response.render('home', context);
        });
    });
}); 

//Selección de Usuario
app.get('/user-selection', function(request, response) {
    response.render('user-selection');
});

//Experiencia Adidas
app.get('/adidas-experience', function(request, response) {
    response.render('adidas-experience');
});

//Recomendación Grupal
app.get('/group-recommendation', function(request, response) {
    response.render('group-recommendation');
});

//Colección
app.get('/collection', function(request, response) {
    response.render('collection');
});

//Item
app.get('/item', function(request, response) {
    response.render('item');
});
//#endregion

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
}); 