/**
 * 
 */

var users = {
	admin: {id: 1, username: 'admin', password:'1234'},
	pepe: {id: 2, username: 'pepe', password:'5678'}
};

// comprueba si el usuario está registrado en users
// si autenticación falla o hay errores se ejecuta el callback(error).
exports.autenticar = function (login, password, callback) {
	var loginObj = users(login);
	if (loginObj) {
		if (password === loginObj.password) {
			callback(null, loginObj);
		} else {
			callback(new Error('Password erroneo.'));
		}
	} else {
		callback(new Error('No existe el usuario.'));
	}
};