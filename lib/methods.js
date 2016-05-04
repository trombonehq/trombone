import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';


export function addMethods() {
  Meteor.methods({
    getUsers(searchTerm, usersToLoad, sortOrder = { createdAt: -1 }) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to get users.');
      }

      check(searchTerm, String);
      check(usersToLoad, Number);

      const superUserId = user._id;

      function searchTermSelector(searchText) {
        const words = searchText.trim().split(/[ \-\:]+/);
        const exps = _.map(words, function(word) {
          return '(?=.*' + word + ')';
        });
        const fullExp = exps.join('') + '.+';
        const regExp = new RegExp(fullExp, 'i');

        return {

          $and: [
            {
              $or: [
                {
                  emails: {
                    $elemMatch: { address: regExp },
                  },
                },
                { _id: regExp },
                { 'profile.name': regExp },
              ],
            },
            { _id:
              { $ne: superUserId },
            },
          ],
        };
      }

      const options = {
        limit: usersToLoad,
        sort: sortOrder,
      };

      const selector = searchTerm ? searchTermSelector(searchTerm) : { _id: { $ne: superUserId } };

      return Meteor.users.find(selector, options).fetch();
    },

    getLastWeekSignUps() {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to get user counts.');
      }
      const superUserId = user._id;
      const oneWeekAgo = new Date(Date.now() - ((((1000 * 60) * 60) * 24) * 7));

      return Meteor.users.find({ $and: [
        { _id:
          { $ne: superUserId },
        },
        { createdAt: { $gt: oneWeekAgo } },
      ] }).count();
    },

    deleteUsers(userArray) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to delete a user.');
      }

      let count = 0;
      userArray.forEach((userId) => {
        if (user._id === userId) {
          throw new Meteor.Error(422, 'You can\'t delete yourself.');
        }

        // remove the user
        count++;
        Meteor.users.remove(userId);
      });
      return count;
    },

    updateUser(userObject) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to delete a user.');
      } else {
        return Meteor.users.update(userObject._id, userObject);
      }
    },

    sendPasswordResetEmails(userArray) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to reset a user password.');
      }

      let count = 0;
      userArray.forEach((userId) => {
        if (user._id === userId) {
          throw new Meteor.Error(422, 'You can\'t reset the super-user password.');
        }

        const userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          const email = userToModify.emails[0].address;
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendResetPasswordEmail(userId);
          }
        }
      });
      return count;
    },

    sendVerificationEmails(userArray) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to send verification emails.');
      }

      let count = 0;
      userArray.forEach((userId) => {
        if (user._id === userId) {
          throw new Meteor.Error(422, 'You can\'t verify the super-user.');
        }

        const userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          const email = userToModify.emails[0].address;
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendVerificationEmail(userId);
          }
        }
      });
      return count;
    },

    sendEnrollmentEmails(userArray) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(401, 'You need to be an admin to send enrollment emails.');
      }

      let count = 0;
      userArray.forEach((userId) => {
        if (user._id === userId) {
          throw new Meteor.Error(422, 'You can\'t enroll the super-user.');
        }

        const userToModify = Meteor.users.findOne(userId);
        if (userToModify.emails && userToModify.emails[0]) {
          const email = userToModify.emails[0].address;
          if (email || _.contains(_.pluck(userToModify.emails || [], 'address'), email)) {
            count++;
            Accounts.sendEnrollmentEmail(userId);
          }
        }
      });
      return count;
    },

    getSignUpsPerDay() {
      let count = 0;
      const processedData = {};

      Meteor.users.find().forEach((user) => {
        count++;
        const date = new Date(user.createdAt).toDateString();
        processedData[date] = processedData[date] ? processedData[date] + 1 : 1;
      });

      return processedData;
    },
  });
}
