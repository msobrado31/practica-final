//gestiona las peticiones que llegan al sistema

//para usar la conexión con la base de datos (listar,crear,editar y borrar usuarios)
//incluir fichero con la definición de la bd
var db = require ('../db');
var mongodb = require ('mongodb');

//incluir la constante "validationResult" para utilizar los modulos de validación
const { validationResult } = require('express-validator');

//conectar con la base de datos
db.connect ('mongodb://localhost:27017', function (err){
    if (err){
        throw ('Fallo en la conexión con la BD '+err);
    }
});

//definir las acciones que va a resolver el controlador

//mostrar los usuarios almacenados en la base de datos
module.exports.users_list = function (req, res){
    db.get().db('apidb').collection('users').find().toArray(function(err, result){
        if (err){                 //si se produce un error, señalarlo
            throw('Fallo en la conexión con la BD');
        } else {
            res.send(result);   //si todo fue bien, devolver resultado al cliente
        }
    });
};

//crear un nuevo usuario y almacenarlo en la base de datos realizando previamente la validación
module.exports.users_create = function (req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){                                      //si se detecta algún error
        return res.status (422).json ({errors:errors.array()});  //se muestra junto al código 422
    }
    if (db.get() === null){
        next (new Error ('La conexión no está establecida'));    //se interrumpe la aplicación
        return;
    }
    //usuario
    const user = {};
    user.name = req.body.name;
    user.surnames = req.body.surnames;
    user.age = req.body.age;
    user.dni = req.body.dni;
    user.birthday = req.body.birthday;
    user.favouriteColour = req.body.favouriteColour;
    user.sex = req.body.sex;
    user.id = req.body.id;

    //insertar 
    db.get().db('apidb').collection('users').insertOne(user, function (err, result){
        if (err){                                                    //si se produjo un error
            next (new Error ('Fallo en la conexión con la BD'));     //enviar a la siguiente función
            return;
        } else {                                                     //si no
            res.send (result);                                       //devolver resultado
        }
    });
};

//actualizar un usuario de la base de datos previa validación
module.exports.users_update_one = function (req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){                                      //si se detecta algún error
        return res.status (422).json ({errors:errors.array()});  //se muestra junto al código 422
    }
    if (db.get() === null){
        next (new Error ('La conexión no está establecida'));    //se interrumpe la aplicación
        return;
    }
    //filtro
    const filter = {_id: new mongodb.ObjectID(req.params.id)};
    const update = {
        $set:{
            name : req.body.name,
            surnames : req.body.surnames,
            age : req.body.age,
            dni : req.body.dni,
            birthday : req.body.birthday,
            favouriteColour : req.body.favouriteColour,
            sex : req.body.sex,
            id : req.body.id
        }
    };
    //insertar 
    db.get().db('apidb').collection('users').updateOne(filter, update, function (err, result){
        if (err){                                                    //si se produjo un error
            next (new Error ('Fallo en la conexión con la BD'));     //enviar a la siguiente función
            return;
        } else {                                                     //si no
            res.send (result);                                       //devolver resultado al cliente
        }
    });
};

//borrar usuario de la base de datos
module.exports.users_delete_one = function (req, res, next){
   
    if (db.get() === null){
        next (new Error ('La conexión no está establecida'));    //se interrumpe la aplicación
        return;
    }
    //filtro
    const filter = {_id: new mongodb.ObjectID(req.params.id)};
    //eliminar un documento
    db.get().db('apidb').collection('users').deleteOne(filter, function (err, result){
        if (err){                                                    //si se produjo un error
            next (new Error ('Fallo en la conexión con la BD'));     //enviar a la siguiente función
            return;
        } else {                                                     //si no
            res.send (result);                                       //devolver resultado al cliente
        }
    });
};