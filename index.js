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
    _id: '5ddc931e8c400c1c08f95cbd',
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

//#region IMPLEMENTACIÓN DE LOS ALGORITMOS
var users = [];

// selected es el objeto seleccionado, y neighbors es un array de objetos con los cuales se va a comparar.
function knnSort(selected, neighbors) {
    let selectedRatings = [];
    for(let i = 0; i < Object.keys(selected.ratings).length; i++) {
        selectedRatings[i] = parseFloat(selected.ratings[ Object.keys(selected.ratings)[i] ]);
    }

    let tempRatings = [];
    for(let i = 0; i < neighbors.length; i++) {

        for(let j = 0; j < Object.keys(neighbors[i].ratings).length; j++) {
            tempRatings[j] = parseFloat(neighbors[i].ratings[ Object.keys(neighbors[i].ratings)[j] ]);
        }

        // Producto punto vector
        let vectorDotProduct = 0;
        for(let j = 0; j < selectedRatings.length; j++) {
            vectorDotProduct += selectedRatings[j] * tempRatings[j];
        }
        neighbors[i].vectorDotProduct = vectorDotProduct;

        // Magnitudes
        let selectedMag = 0;
        let innerOperation1 = 0;
        for(let j = 0; j < selectedRatings.length; j++) {
            innerOperation1 += Math.pow(selectedRatings[j], 2);
        }
        selectedMag = Math.sqrt(innerOperation1);
        selected.magnitude = selectedMag;

        let neighborMag = 0;
        let innerOperation2 = 0;
        for(let j = 0; j < tempRatings.length; j++) {
            innerOperation2 += Math.pow(tempRatings[j], 2);
        }
        neighborMag += Math.sqrt(innerOperation2);
        neighbors[i].magnitude = neighborMag;

        // Cosine Similarity
        let cosineSimilarity = vectorDotProduct / (selectedMag * neighborMag);
        neighbors[i].cosineSimilarity = cosineSimilarity.toFixed(4);
    }

    // Se ordena el array de objetos de mayor a menor distancia coseno 
    neighbors.sort(function (a, b) {
        return b.cosineSimilarity - a.cosineSimilarity;
    });
}
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

            docs.forEach(function(elem) {
                if(elem._id != selectedUser._id ) {
                    users.push(elem);
                } 
            });

            knnSort(selectedUser, users);
            console.log(users);
    
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