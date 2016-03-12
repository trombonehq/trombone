setupAccount = function(appSecret, password, callback) {

  //remove any existing super users
  var superUsers = Roles.getUsersInRole('super-admin');
  if(superUsers.count() > 0) {
    superUsers.map(function(superUser) {
      Meteor.users.remove(superUser._id);
    });
  };

  var options = {
    username: appSecret,
    password: password
  };
  var superUserId = Accounts.createUser(options);
  Roles.addUsersToRoles(superUserId, 'super-admin');

  var result = {
    superUserId: superUserId
  }

  callback(null, result);
}
