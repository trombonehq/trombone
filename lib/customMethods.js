import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

const customMethodRegister = {};

export function setupCustomMethod(name, options) {
  // check if method has been registered in the Meteor method handlers
  const currentMethods = Meteor.default_server.method_handlers;
  if(!currentMethods[name]) {
    throw new Meteor.Error(400, 'Custom method name does not match an existing method');
  }

  // register the custom method
  customMethodRegister[name] = {
    functionCode: currentMethods[name],
    buttonLabel: options.buttonLabel,
    needsUsers: options.needsUsers,
  };
};

export function exposeCustomMethods() {
  Meteor.methods({
    getCustomTromboneMethods() {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(403, 'You need to be an admin to retrieve custom methods');
      }
      return customMethodRegister;
    },

    customTromboneMethodCall(name, users) {
      const user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['super-admin'])) {
        throw new Meteor.Error(403, 'You need to be an admin to call a custom method');
      }

      const customMethod = customMethodRegister[name];
      if (customMethod.needsUsers) {
        return customMethod[functionCode](users);
      } else {
        return customMethod[functionCode]();
      }

    },
  });
}
