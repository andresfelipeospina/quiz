/**
 * 
 */

var models = require('../models/models.js');
var url = require('url');

// GET /quizes/:quizId(\\d+)/comments/new
exports.new = function (req, res) {
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId(\\d+)/comments
exports.create = function (req, res) {
	var quizIdParams = req.params.quizId;
	var comment = models.Comment.build( {texto: req.body.comment.texto, QuizId: quizIdParams} );
	comment.validate().then( function (err) {
		if (err) {
			res.render('comments/new.ejs', {comment: comment, errors: err.errors});
		} else {
			// guarda en DB los campos texto de comment
			quiz.save().then( function () {
				res.redirect('/quizes/' + quizIdParams);
			}); // redirección HTTP (URL relativo) lista de preguntas
		}	
	});
};
