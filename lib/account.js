import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export function setupAccount(appSecret, password, callback) {
  // remove any existing super users
  const superUsers = Roles.getUsersInRole('super-admin');
  if (superUsers.count() > 0) {
    superUsers.forEach((superUser) => Meteor.users.remove(superUser._id));
  }

  const options = {
    username: appSecret,
    password,
  };

  const superUserId = Accounts.createUser(options);
  Roles.addUsersToRoles(superUserId, 'super-admin');

  const result = {
    superUserId,
  };

  // add a hook to store last logged in time for each user
  Accounts.onLogin(() => {
    const id = Meteor.userId();
    Meteor.users.update({
      _id: id,
    },
      {
        $set: { lastLogin: new Date() },
      }
    );
  });

  callback(null, result);
}
