//funciones necesarias para facilitar la conexión

//crear el cliente mongodb
var MongoClient = require ('mongodb').MongoClient;

//crear la variable para almacenar la conexión
var db = null;

//crear una función que facilite la conexión con la base de datos
module.exports.connect = function (url, callback){
    //si ya está conectado, no se vuelve a conectar
    if (db){
        return callback();
    }

    //crear una instancia del cliente MongoDB
    const client = new MongoClient (url,{
         useNewUrlParser : true,
         useUnifiedTopology : true,
    });

    //conectar el cliente al servidor
    client.connect(function(err,result){
        if (err){
            return callback (err);
        }

        console.log("Conectado a BD");
        db = result;  //comprobar si la conexión está establecida
        callback();
    });
};

//crear una función para cerrar la conexión con la base de datos
module.exports.close = function (callback) {
    if (db){
        db.close (function (err, result){
            console.log ("Desconectado de BD");
            db = null;
            callback (err);
        });
   }
};

//crear una función para recuperar la variable que tiene la conexión a la base de datos
//obtiene el cliente mongodb conectado a la db
module.exports.get = function (){
    return db;
}