/**
 * 
 */

var models = require('../models/models.js');
var url = require('url');

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
	var toSearch = false;
	var goToIndex = function (quizes) {
		var prefixEjs = toSearch ? 'search' : 'index';
		res.render('quizes/' + prefixEjs + '.ejs', {quizes: quizes}).catch( function (error) { next(error) });
	};	
	if (search) {
		toSearch = true;
		console.log('search=' + search);
		models.Quiz.findAll({where:['pregunta like ?', '%' + search.replace(' ','%') + '%']}).then( goToIndex );
	} else {	
		models.Quiz.findAll().then( goToIndex );
	}
};

// GET /quizes/:id
exports.show = function(req, res) {	
	console.log('show');
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	console.log('answer');
	var resultado = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto'; 
	res.render('quizes/answer', {quiz: req.quiz, respuesta : resultado});
};