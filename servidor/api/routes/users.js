
var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController');//quitar la 'lógica del control' del fichero de rutas pq ya está en el controlador

const {check} = require ('express-validator');  //definimos la función check para comprobar los parámetros

var mongoose = require ('mongoose');
const { Schema, model } = mongoose;
//definir esquema de usuario que vamos a usar
const userSchema = new Schema({
  id : { type : String },
  name : { type : String },
  surnames : { type : String },
  age : { type : String },
  dni : { type : String },
  birthday : { type : Date },
  favouriteColour : { type : String },
  sex :  { type : String },
},{
  timestamps : true,
  versionKey :false
});
//asociar el esquema a user
const User = model('user', userSchema);

//conectar con la bd de mongo
mongoose.connect('mongodb://localhost:3000', {
  useUnifiedTopology : true,
  useNewUrlParser : true,
  useFindAndModify : false
})
.then((db) => console.log ('se ha conectado a la BBDD'))
.catch((err) => console.log(err));

//establecemos las reglas de validación en un array
const valid_user = [
  check ('name','El nombre debe tener al menos 3 caracteres que no sean números')
    .isLength({min:3})
    .isAlpha(),
  check ('surnames', 'Los apellidos deben tener al menos 3 caracteres que no sean números')
    .isLength({min:3})
    .isAlpha(),
  check ('age','La edad debe estar comprendida entre 1 y 125')
    .isFloat({min:1,max:125}),
  check ('dni','El dni debe contener 9 caracteres alfanuméricos')
    .isLength({min:9,max:9})
    .isAlphanumeric(),
  check ('birthday', 'ESpecificar el cumpleaños en formato aaaa-mm-dd')
    .isISO8601(),
  check ('favouriteColour','El color favorito debe tener al menos 3 caracteres que no sean números')
    .isLength({min:3})
    .isAlpha(),
  check ('sex', 'el sexo debe ser uno entre: Hombre, Mujer, Otro, No especificado')
    .isIn(['Hombre', 'Mujer', 'Otro', 'No especificado'])

];

//RESTful Web API_implementamos CRUD (como realizar las peticiones)
//método GET para listar usuarios
router.get ('/', users_controller.users_list);

//método POST para crear usuarios con validaciones
router.post ('/', valid_user,users_controller.users_create);

//método PUT para actualizar usuarios con validaciones
router.put ('/:id', valid_user,users_controller.users_update_one);

//método DELETE para borrar usuarios
router.delete ('/:id', users_controller.users_delete_one);

//exportamos el módulo para que sea utilizado donde sea necesario
module.exports = router;