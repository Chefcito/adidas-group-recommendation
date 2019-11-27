const PORT = 5500;
const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'adidas_database';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(URL, {useUnifiedTopology: true});

const app = express();
var database = null;


client.connect(function(err) {
    if(err) {
        console.error(err);
        return;
    } 
 
    database = client.db(DATABASE_NAME);
    app.listen(PORT, function() {
        console.log("Server running on port " + PORT);
    }); 
});

app.use(express.static('public'));

app.engine('handlebars', hbs({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
 }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

//#region VARIABLES GLOBALES
var selectedUser;
//#endregion

//#region RUTAS GET
//Home
app.get('/', function(request, response) {

    /* CLIENT.connect(function(err) {
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
    }); */
    
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

//Selección de Usuario
app.get('/user-selection', function(request, response) {
    const collection = database.collection('users');
    collection.find({}).toArray(function (err, docs) {
        if(err) {
            console.error(err);
            response.send(err);
            return;
        }

        var context = {
            users: docs,
        }
        
        response.render('user-selection', context);
    });
});

//Experiencia Adidas
app.get('/adidas-experience', function(request, response) {
    var context = {
        userId: selectedUser,
    }

    response.render('adidas-experience', context);
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

//#region RUTAS POST
// Seleccionar usuario
app.post('/api/selectUser', function(request, response){
    let userId = request.body.userId;
    selectedUser = userId;

    response.send(selectedUser);
});
//#endregion