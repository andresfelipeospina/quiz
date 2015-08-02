/**
 * 
 */

var models = require('../models/models.js');
var url = require('url');
var campos = ['pregunta', 'respuesta', 'tema'];

// Autoload - factoriza el codigo si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	console.log('quizId=' + quizId);
	models.Quiz.findById(quizId).then(
			function (quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} else {
					next(new Error('No existe quizId=' + quizId));
				}
			}
	).catch(function (error) { next(error); });
};

//GET /quizes
exports.index = function(req, res) {
	console.log('index');
	var queryData = url.parse(req.url, true).query;
	var search = queryData.search;
	var goToIndex = function (quizes) {
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	};	
	if (search) {
		console.log('search=' + search);
		models.Quiz.findAll({where:['pregunta like ?', '%' + search.replace(' ','%') + '%'], order:'pregunta'}).then( goToIndex ).catch( function (error) { next(error) });
	} else {	
		models.Quiz.findAll().then( goToIndex ).catch( function (error) { next(error) });
	}
};

// GET /quizes/:id
exports.show = function(req, res) {	
	console.log('show');
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	console.log('answer');
	var resultado = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto'; 
	res.render('quizes/answer', {quiz: req.quiz, respuesta : resultado, errors: []});
};

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(// crea objecto quiz
			{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate().then( function (err) {
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({fields: campos}).then( function () {
				res.redirect('/quizes');
			}); // redirección HTTP (URL relativo) lista de preguntas
		}	
	});
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var quiz = req.quiz; // autoload de la instancia quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.validate().then( function (err) {
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta de quiz
			req.quiz.save({fields: campos}).then( function () {
				res.redirect('/quizes');
			}); // redirección HTTP (URL relativo) lista de preguntas
		}
	});
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz.destroy().then( function () {
			res.redirect('/quizes');
		}
	).catch( function (error) { next(error) });
};