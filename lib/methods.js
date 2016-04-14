addMethods = function() {
  Meteor.methods({
    getUsers: function(searchTerm, usersToLoad) {

      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to get users.");
      }

      function searchTermSelector(searchText) {
        var words = searchText.trim().split(/[ \-\:]+/);
        var exps = _.map(words, function(word) {
          return "(?=.*" + word + ")";
        });
        var fullExp = exps.join('') + ".+";
        var regExp = new RegExp(fullExp, "i");

        return {
           $or: [
            {
              emails: {
                $elemMatch: { address: regExp }
              }
            },
            {_id: regExp },
            {'profile.name': regExp }
          ]
        };
      }

      var options = {
        limit: usersToLoad,
        sort: { createdAt: -1}
      };

      var selector = searchTerm ? searchTermSelector(searchTerm) : {};

      return Meteor.users.find(selector, options).fetch();

    },

    deleteUsers: function(userArray) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin']))
        throw new Meteor.Error(401, "You need to be an admin to delete a user.");

      var count = 0;
      userArray.forEach(function(userId) {
        if (user._id == userId)
          throw new Meteor.Error(422, 'You can\'t delete yourself.');

        // remove the user
        count++;
        Meteor.users.remove(userId);
      });
      return count;

    },

    updateUser: function(userObject) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to delete a user.");
      } else {
        return Meteor.users.update(userObject._id, userObject);
      }
    },

    sendPasswordResetEmails: function(userArray) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to reset a user password.");
      }

      var count = 0;
      userArray.forEach(function(userId) {
        if (user._id == userId) {
          throw new Meteor.Error(422, 'You can\'t reset the super-user password.');
        }

        var userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          email = userToModify.emails[0].address;
          console.log(email);
          console.log(_.pluck(userToModify.emails || [], 'address'));
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendResetPasswordEmail(userId);
          }
        }
      });
      return count;
    },

    sendVerificationEmails: function(userArray) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to send verification emails.");
      }

      var count = 0;
      userArray.forEach(function(userId) {
        if (user._id == userId) {
          throw new Meteor.Error(422, 'You can\'t verify the super-user.');
        }

        var userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          email = userToModify.emails[0].address;
          console.log(email);
          console.log(_.pluck(userToModify.emails || [], 'address'));
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendVerificationEmail(userId);
          }
        }
      });
      return count;
    },

    sendEnrollmentEmails: function(userArray) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to send enrollment emails.");
      }

      var count = 0;
      userArray.forEach(function(userId) {
        if (user._id == userId) {
          throw new Meteor.Error(422, 'You can\'t enroll the super-user.');
        }

        var userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          email = userToModify.emails[0].address;
          console.log(email);
          console.log(_.pluck(userToModify.emails || [], 'address'));
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendEnrollmentEmail(userId);
          }
        }
      });
      return count;
    },

    //OLD BELOW THIS LINE
    //
    //
    //

    addUserRole: function(userId, role) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      if (user._id == userId)
        throw new Meteor.Error(422, 'You can\'t update yourself.');

      // handle invalid role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      // handle user already has role
      if (Roles.userIsInRole(userId, role))
        throw new Meteor.Error(422, 'Account already has the role ' + role);

      // add the user to the role
      Roles.addUsersToRoles(userId, role);
    },

    removeUserRole: function(userId, role) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      if (user._id == userId)
        throw new Meteor.Error(422, 'You can\'t update yourself.');

      // handle invalid role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      // handle user already has role
      if (!Roles.userIsInRole(userId, role))
        throw new Meteor.Error(422, 'Account does not have the role ' + role);

      Roles.removeUsersFromRoles(userId, role);
    },

    addRole: function(role) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      // handle existing role
      if (Meteor.roles.find({name: role}).count() > 0 )
        throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

      Roles.createRole(role);
    },

    removeRole: function(role) {
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      // handle non-existing role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      if (role === 'super-admin')
        throw new Meteor.Error(422, 'Cannot delete role super-admin');

      // remove the role from all users who currently have the role
      // if successfull remove the role
      Meteor.users.update(
        {roles: role },
        {$pull: {roles: role }},
        {multi: true},
        function(error) {
          if (error) {
            throw new Meteor.Error(422, error);
          } else {
            Roles.deleteRole(role);
          }
        }
      );
    }
  });
}
