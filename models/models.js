/**
 * Definición de como se construye el modelo
 */

var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// SQLite   DATEBASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || 'sqlite');
var port = (url[5] || null);
var host = (url[4] || null);
var storage = DB_name !== null ? process.env.DATABASE_STORAGE : 'quiz.sqlite';

// Cargar el modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, { 
	dialect: dialect, 
	protocol: protocol,
	port: port,
	host: host,
	storage: storage, // solo SQLite (.env)
	omitNull: true // solo Postgres
	});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // Exportar definición de tabla Quiz

var binomios = [
                {pregunta: 'Capital de Italia', respuesta: 'Roma'},
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa'}
                ];

var logCreate = function () {
	console.log('Create con exito');
};

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then( function () {
	// Quiz.drop({});
	
	// success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then( function (count) {
		if (count === 0) { // la tabla se inicializa solo si está vacia
			Quiz.create( binomios[0]);
			Quiz.create( binomios[1]).then(function () {
				console.log('Base de datos inicializada');
			});			
		} else {			
			for (var indexBi in binomios) {
				Quiz.count({pregunta: binomios[indexBi].pregunta}).then( function (binomio) {
					if (binomio === 0) {							
						Quiz.create( binomios[indexBi] ).then(logCreate);
					}
				});
			}
		}
		console.log('Base de datos inicializada');
	});
});