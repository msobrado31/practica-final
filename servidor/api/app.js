//importar dependencias
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require( 'cors');
const PORT = 5000;

//def rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//crea la aplicación
var app = express();

//inicializar módulos
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

//Cors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*' );
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Request-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    next();
});
app.use(cors());

app.get('/users', async(req,res)=>{
  const users = await User.find();
  res.json(users);
})

app.post('/user',async(req,res)=>{
  const nuevoUsuario = new User(req.body)
  await nuevoUsuario.save()
  res.send({ message: "Usuario creado"})
})

app.put('/user/:id',async(req,res)=>{
  const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body)
  res.json({ status: "Usuario actualizado"})
})

app.delete('/user/:id',async(req,res)=>{
  const userDeleted = await User.findByIdAndDelete(req.params.id)
  res.json({ status: "Usuario eliminado"})
})

app.get('/user/:id',async(req,res)=>{
  const user = await User.findById(req.params.id)
  res.send(user)
})

// Servidor
app.listen(PORT, () =>{
  console.log('Servidor en ejecución')
})

//exportar aplicación
module.exports = app;

