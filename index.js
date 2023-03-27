/* eslint-disable dot-notation */
const express = require('express');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');

const port = 5000; // Puerto en el que correrá el servidor

// eslint-disable-next-line no-unused-vars
let temperature = [];
// Obtiene la temperatura y la guarda en un array cada 15 minutos
setInterval(() => {
	axios
		.get('https://backend-vf-12.vercel.app/api/ultimo')
		.then(res => {
			// eslint-disable-next-line no-undef
			const temp = res.data[0]['Temperatura'];
			temperature.push(temp);
		})
		.catch(error => {
			console.log(error);
		});
}, 5000);
// }, 900000);  Cada 15 minutos
// 60000 cada 1 min
// 3600000 cada hora
// Realizar la media y mandar la fecha actual
setInterval(() => {
	const suma = temperature.reduce((a, b) => a + b, 0);
	const media = suma / temperature.length;
	axios
		.post('http://mi-api.com/datos', {
			media: media,
		})
		.then(response => {
			console.log('La petición fue enviada correctamente');
		})
		.catch(error => {
			console.error('Error al enviar la petición:', error);
		});
	temperature = [];
}, 60000);

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor escuchando en http://localhost:${port}`);
});

// coneccion a mongo
const uri = 'mongodb://localhost:27017/mydatabase'; // URL de tu servidor de MongoDB y nombre de la base de datos
mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Conexión exitosa a la base de datos');
		// Aquí puedes definir tus modelos y hacer consultas a la base de datos
	})
	.catch(error => {
		console.error('Error al conectar a la base de datos', error);
	});
