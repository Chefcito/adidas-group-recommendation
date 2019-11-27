const PORT = 5500;
const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'adidas_database';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(URL, {useUnifiedTopology: true});
const ObjectId = require('mongodb').ObjectID;

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
var selectedUser = {
    name: 'Calex Rodriguez',
    gender: 'male',
    ratings: 
    {
        material_cotton: 9,
        material_lycra: 9,
        material_wool: 5,
        material_flannel: 5,
        material_lace: 0,
        material_linen: 1,
        material_silk: 2,
        sleeve_long: 9,
        sleeve_short: 7,
        waterproof: 9,
        stripes_horizontal: 7,
        stripes_vertical: 6,
        stripes_diagonal: 3,
        pattern_square: 0,
        pattern_circle: 0,
        pattern_spots: 0,
        pattern_none: 10,
        color_yellow: 0,
        color_blue: 5,
        color_red: 10,
    }
};
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

    if(selectedUser != null) {
        const collection = database.collection('users');
        collection.find({}).toArray(function(err, docs) {
            if(err) {
                console.error(err);
                response.send(err);
                return;
            }
    
            var context = {
                name: selectedUser.name,
            }

            response.render('adidas-experience', context);
        });
    }
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
    let userId = request.body.id;
    let mongoUserID = new ObjectId(userId);;

    const collection = database.collection('users');
    collection.find({
        _id: { $eq: mongoUserID},
    }).toArray(function (err, docs) {
        if(err) {
            console.error(err);
            response.send(err);
            return;
        }
        
        selectedUser = docs[0];
        response.send(selectedUser);
    });
});
//#endregion