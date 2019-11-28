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

var kVal1;
var kVal2;

var users = [];
var shirts = [];
var alternatives = [];
//#endregion

//#region IMPLEMENTACIÓN DE LOS ALGORITMOS
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

function bordaCount(selected, neighbors) {
    let selectedRatings = [];
    for(let i = 0; i < Object.keys(selected.ratings).length; i++) {
        selectedRatings[i] = parseFloat(selected.ratings[ Object.keys(selected.ratings)[i] ]);
    }

    let tempRatings = [];
    for(let i = 0; i < neighbors.length; i++) {

        for(let j = 0; j < Object.keys(neighbors[i].ratings).length; j++) {
            tempRatings[j] = parseFloat(neighbors[i].ratings[ Object.keys(neighbors[i].ratings)[j] ]);
        }

        // 
        let vectorDotProduct = 0;
        for(let j = 0; j < selectedRatings.length; j++) {
            vectorDotProduct += selectedRatings[j] * tempRatings[j];
        }
        neighbors[i].vectorDotProduct = vectorDotProduct;

        // 
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

        // 
        let cosineSimilarity = vectorDotProduct / (selectedMag * neighborMag);
        neighbors[i].cosineSimilarity = cosineSimilarity.toFixed(4);
    }

    // Se ordena el array de objetos de mayor a menor distancia coseno 
    neighbors.sort(function (a, b) {
        return a.cosineSimilarity - b.cosineSimilarity;
    });
}
//#endregion

//#region FUNCIONES
function createShirt(shirt) {
    let tempShirt = {};
    tempShirt.name = shirt.name;
    tempShirt.gender = shirt.gender;

    for(let i = 0; i < Object.keys(shirt.ratings).length; i++) {
        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 9) {
            if(Object.keys(shirt.ratings)[i] == "Algodon" 
            || Object.keys(shirt.ratings)[i] == "Licra" 
            || Object.keys(shirt.ratings)[i] == "Lana" 
            || Object.keys(shirt.ratings)[i] == "Franela" 
            || Object.keys(shirt.ratings)[i] == "Encaje" 
            || Object.keys(shirt.ratings)[i] == "Lino" 
            || Object.keys(shirt.ratings)[i] == "Seda") {
                tempShirt.material = Object.keys(shirt.ratings)[i];
            }
        }

        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 9) {
            if(Object.keys(shirt.ratings)[i] == "Larga") {
                tempShirt.long_sleeve = "Si";
            } else {
                tempShirt.long_sleeve = "No";
            }
        }

        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 9) {
            if(Object.keys(shirt.ratings)[i] == "Impermeable") {
                tempShirt.waterproof = "Si";
            } else {
                tempShirt.waterproof = "No";
            }
        }

        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 9) {
            if(Object.keys(shirt.ratings)[i] == "Horizontal" 
            || Object.keys(shirt.ratings)[i] == "Vertical" 
            || Object.keys(shirt.ratings)[i] == "Diagonal" 
            || Object.keys(shirt.ratings)[i] == "Cuadros" 
            || Object.keys(shirt.ratings)[i] == "Circulos" 
            || Object.keys(shirt.ratings)[i] == "Manchas" 
            || Object.keys(shirt.ratings)[i] == "Ninguno") {
                tempShirt.pattern = Object.keys(shirt.ratings)[i];
            }
        }

        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 9) {
            if(Object.keys(shirt.ratings)[i] == "Amarillo" 
            || Object.keys(shirt.ratings)[i] == "Azul" 
            || Object.keys(shirt.ratings)[i] == "Rojo") {
                tempShirt.main_color = Object.keys(shirt.ratings)[i];
            }
        }

        if(shirt.ratings[Object.keys(shirt.ratings)[i]] > 4) {
            if(Object.keys(shirt.ratings)[i] == "Amarillo" 
            || Object.keys(shirt.ratings)[i] == "Azul" 
            || Object.keys(shirt.ratings)[i] == "Rojo") {
                if(tempShirt.main_color != Object.keys(shirt.ratings)[i]){
                    tempShirt.secondary_color = Object.keys(shirt.ratings)[i];
                }
            }
        }
    }
    return tempShirt;
}

function createShirts(shirtArray) {
    let tempShirtCollection = [];
    shirtArray.forEach(function (elem){
        let tempShirt = {};
        tempShirt.name = elem.name;
        tempShirt.gender = elem.gender;

        for(let i = 0; i < Object.keys(elem.ratings).length; i++) {
            if(elem.ratings[Object.keys(elem.ratings)[i]] > 9) {
                if(Object.keys(elem.ratings)[i] == "Algodon" 
                || Object.keys(elem.ratings)[i] == "Licra" 
                || Object.keys(elem.ratings)[i] == "Lana" 
                || Object.keys(elem.ratings)[i] == "Franela" 
                || Object.keys(elem.ratings)[i] == "Encaje" 
                || Object.keys(elem.ratings)[i] == "Lino" 
                || Object.keys(elem.ratings)[i] == "Seda") {
                    tempShirt.material = Object.keys(elem.ratings)[i];
                }
            }

            if(elem.ratings[Object.keys(elem.ratings)[i]] > 9) {
                if(Object.keys(elem.ratings)[i] == "Larga") {
                    tempShirt.long_sleeve = "Si";
                } else {
                    tempShirt.long_sleeve = "No";
                }
            }

            if(elem.ratings[Object.keys(elem.ratings)[i]] > 9) {
                if(Object.keys(elem.ratings)[i] == "Impermeable") {
                    tempShirt.waterproof = "Si";
                } else {
                    tempShirt.waterproof = "No";
                }
            }

            if(elem.ratings[Object.keys(elem.ratings)[i]] > 9) {
                if(Object.keys(elem.ratings)[i] == "Horizontal" 
                || Object.keys(elem.ratings)[i] == "Vertical" 
                || Object.keys(elem.ratings)[i] == "Diagonal" 
                || Object.keys(elem.ratings)[i] == "Cuadros" 
                || Object.keys(elem.ratings)[i] == "Circulos" 
                || Object.keys(elem.ratings)[i] == "Manchas" 
                || Object.keys(elem.ratings)[i] == "Ninguno") {
                    tempShirt.pattern = Object.keys(elem.ratings)[i];
                }
            }

            if(elem.ratings[Object.keys(elem.ratings)[i]] > 9) {
                if(Object.keys(elem.ratings)[i] == "Amarillo" 
                || Object.keys(elem.ratings)[i] == "Azul" 
                || Object.keys(elem.ratings)[i] == "Rojo") {
                    tempShirt.main_color = Object.keys(elem.ratings)[i];
                }
            }

            if(elem.ratings[Object.keys(elem.ratings)[i]] > 4) {
                if(Object.keys(elem.ratings)[i] == "Amarillo" 
                || Object.keys(elem.ratings)[i] == "Azul" 
                || Object.keys(elem.ratings)[i] == "Rojo") {
                    if(tempShirt.main_color != Object.keys(elem.ratings)[i]){
                        tempShirt.secondary_color = Object.keys(elem.ratings)[i];
                    }
                }
            }
        }
        tempShirtCollection.push(tempShirt);
    });
    shirtArray = tempShirtCollection.slice();
    return shirtArray;
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
    shirts = [];
    alternatives = [];
    let favoriteShirt;
    let kUsers = [];
    let kAlternatives = [];
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

            favoriteShirt = shirts[0];
            alternatives = shirts.slice(1, shirts.length);
            if(kVal1 > alternatives.length) {
                kAlternatives = alternatives.slice(0, alternatives.length);
            } else {
                kAlternatives = alternatives.slice(0, kVal1);
            }

            favoriteShirt = createShirt(favoriteShirt);
            // createShirts(kAlternatives);   
            kAlternatives =  createShirts(kAlternatives); 
            
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

                bordaCount(selectedUser, users);

                // console.log(users[0]);
                // console.log(favoriteShirt);

                if(kVal1 > users.length) {
                    kUsers = users.slice(0, users.length);
                } else {
                    kUsers = users.slice(0, kVal1);
                }

                var context = {
                    selectedUser: selectedUser,
                    users: kUsers,
                    favoriteShirt: favoriteShirt,
                    alternatives: kAlternatives,
                }
                response.render('adidas-experience', context);
            })
        });
    }
});

//Recomendación Grupal
app.get('/group-recommendation', function(request, response) {

    users = [];
    shirts = [];
    alternatives = [];
    let favoriteShirt;
    let kUsers = [];
    let kAlternatives = [];
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

            bordaCount(selectedUser, shirts);

            favoriteShirt = shirts[0];
            alternatives = shirts.slice(1, shirts.length);
            if(kVal1 > alternatives.length) {
                kAlternatives = alternatives.slice(0, alternatives.length);
            } else {
                kAlternatives = alternatives.slice(0, kVal1);
            }

            favoriteShirt = createShirt(favoriteShirt);
            kAlternatives =  createShirts(kAlternatives); 
            
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

                if(kVal1 > users.length) {
                    kUsers = users.slice(0, users.length);
                } else {
                    kUsers = users.slice(0, kVal1);
                }

                var context = {
                    users: kUsers,
                    alternatives: kAlternatives,
                }
                response.render('group-recommendation', context);
            })
        });
    }
});

//Colección
app.get('/collection', function(request, response) {
    let adidasCollection = [];

    const shirtCollection = database.collection('shirts');    
    shirtCollection.find({}).toArray(function(err, docs) {
        if(err) {
            console.error(err);
            response.send(err);
            return;
        }

        docs.forEach(function(elem) {
            adidasCollection.push(elem);
        });

        adidasCollection = createShirts(adidasCollection);

        var context = {
            collection: adidasCollection,
        }

        response.render('collection', context);
    });
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
    if(request.body.k == '') {
        kVal1 = 3;
    } else {
        kVal1 = request.body.k;
    }
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

/* app.post('/api/updateAlternatives', function(request, response){
    let kNumber = request.body.k;
    let newAlternatives;
    if(kNumber > shirts.length-1) {
        newAlternatives = shirts.slice(1, shirts.length)
    } else {
        newAlternatives = shirts.slice(1, kNumber+1)
    }

    var context = {
        alternatives: newAlternatives,
    }

    response.render('adidas-experience', context);
}); */
//#endregion