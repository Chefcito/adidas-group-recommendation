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
    _id: '5ddf39bbb129ececca83ec7d',
    name: 'Calex Rodriguez',
    gender: 'Masculino',
    ratings: 
    {
        Algodon: 9,
        Licra: 9,
        Lana: 5,
        Franela: 5,
        Encaje: 0,
        Lino: 1,
        Seda: 2,
        Larga: 9,
        Corta: 7,
        Impermeable: 9,
        Horizontal: 7,
        Vertical: 6,
        Diagonal: 3,
        Cuadros: 0,
        Circulos: 0,
        Manchas: 0,
        Ninguno: 10,
        Amarillo: 0,
        Azul: 5,
        Rojo: 10,
    }
};
//#endregion

//#region IMPLEMENTACIÓN DE LOS ALGORITMOS
var users = [];
var shirts = [];

// selected es el objeto seleccionado
// neighbors es un array de objetos con los cuales se va a comparar el objeto seleccionado.
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
    users = [];
    tshirts = [];
    if(selectedUser != null) {
        const shirtCollection = database.collection('shirts');
        const userCollection = database.collection('users');
        
        shirtCollection.find({}).toArray(function(err, docs) {
            if(err) {
                console.error(err);
                response.send(err);
                return;
            }

            docs.forEach(function(elem) {
                shirts.push(elem);
            });

            knnSort(selectedUser, shirts);
            
            userCollection.find({}).toArray(function(err, docs2) {
                if(err) {
                    console.error(err);
                    response.send(err);
                    return;
                }

                docs2.forEach(function(elem2) {
                    if(new String(elem2._id).valueOf() != new String(selectedUser._id).valueOf() ) {
                        users.push(elem2);
                    }
                });

                knnSort(selectedUser, users);

                let favoriteShirt = shirts[0];
                let alternatives = shirts.slice(1, shirts.length);

                // console.log(users[0]);
                // console.log(favoriteShirt);

                var context = {
                    selectedUser: selectedUser,
                    users: users,
                    favoriteShirt: favoriteShirt,
                    alternatives: alternatives,
                }
                response.render('adidas-experience', context);
            })
            
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