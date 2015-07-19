/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var bcrypt = require('bcrypt');

module.exports = {
	'new':function(req,res){

		res.view('session/new');
	},

	create: function(req,res,next){
		if( !req.param("email") || !req.param("password") ){
			console.log("Enter all fields");
			res.redirect('/session/new');
			return;
		}

		// Check if user exists

		User.findOneByEmail( req.param('email'), function foundUser(err, user){
			if(err) return next(err);

			//Check if user exists

			if(!user){
				console.log('User does not exist');
				res.redirect('/session/new');
				return;
			}

			//Validate password to grant access

			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){
				if(err) return next(err);

				if(!valid){
					console.log('Invalid Password');
					res.redirect('/session/new');
					return;
				}
				console.log('User granted access');
				req.session.authenticated = true;
				req.session.User = user;
				res.redirect('/user/show/'+user.id );
			});
		});

	}

};
