// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();

const push = require('./push')


const mensajes = [
  {
    _id: '001',
    user: 'spiderman',
    mensaje: "La tía May, hizo unos panqueques en forma de ironman!"
  }
];





// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json(mensajes);
});


// Post mensajes
router.post('/', function (req, res) {

  const mensaje = {
    mensaje : req.body.mensaje,
    user: req.body.user
  }


  mensajes.push(mensaje);

  res.json({
    ok:true,
    mensaje
  });
});


// Almacenar las subscripciones de los usuarios
router.post('/subscribe', function (req, res) {

  const subscription = req.body;

  push.addSubscription(subscription)

  res.json('Subscribe')
});

//Obtener la key publica
router.get('/key', function (req, res) {

  const key = push.getKey()

  res.send(key)
});

// Enviar notificacion push a tdos los clientes
router.post('/push', function (req, res) {

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario,
  }

  push.sendPush(post)

  res.json('Push enviado')
});


module.exports = router;