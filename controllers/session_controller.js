/**
 * 
 */

var returnBeforeLogin = function (req, res) {
	res.redirect(req.session.redir.toString()); // redirección a path anterior a login
};

// GET /login
exports.new = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('session/new', {errors: errors});
};

// POST /login
exports.create = function (req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');
	userController.autenticar(login, password, function (error, user){
		if (error) { // si hay error rettornamos mensajes de error de sesión
			req.session.errors = [{'message': 'Se ha producido un error: ' + error}];
			res.redirect('/login');
			return;
		}
		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id: user, username: user.username};		
		returnBeforeLogin(req, res);
	});
};

// DELETE /logout -- Destruir sesión
exports.destroy = function (req, res) {
	delete req.session.user;
	returnBeforeLogin(req, res);
};