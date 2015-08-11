/**
 * 
 */

var models = require('../models/models.js');
var url = require('url');

//Autoload - factoriza el codigo si la ruta incluye :commentId
exports.load = function (req, res, next, commentId) {
	console.log('commentId=' + commentId);
	models.Comment.find({where:{id: Number(commentId)}}).then(
			function (comment) {
				if (comment) {
					req.comment = comment;
					next();
				} else {
					next(new Error('No existe commentId=' + commentId));
				}
			}
	).catch(function (error) { next(error); });
};


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
			comment.save().then( function () {
				res.redirect('/quizes/' + quizIdParams);
			}); // redirección HTTP (URL relativo) lista de preguntas
		}	
	});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function (req, res) {
	req.comment.publicado = true;
	req.comment.save({fields: ['publicado']}).then(function () {
		res.redirect('/quizes/' + req.params.quizId);
	}
			).catch(function (error) { next(error);});
};
