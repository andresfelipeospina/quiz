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
var quizPath = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quizPath);

// Importar la definición de la tabla Quiz en comment.js
var commentPath = path.join(__dirname, 'comment');
var Comment = sequelize.import(commentPath);

// Quiz.drop({});
 Comment.drop({});

// Relación entre tablas Quiz = 1 y Comment = N, relación 1 a N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definición de tabla Quiz
exports.Comment = Comment; // Exportar definición de tabla Comment

var binomios = [
                {pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'humanidades'},
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades'}
                ];

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then( function () {
	// la tabla se inicializa solo si está vacia
	for (var indexBi in binomios) {
		Quiz.findOrCreate({where: {pregunta: binomios[indexBi].pregunta}, defaults: {respuesta: binomios[indexBi].respuesta, tema: binomios[indexBi].tema}})
		  .spread(function(user, created) {
		    console.log(user.get({ plain: true }))
		});
	}
	console.log('Base de datos inicializada');
});