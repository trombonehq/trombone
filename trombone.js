import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DDP } from 'meteor/ddp';

import { setupAccount } from './lib/account.js';
import { configurePublications } from './lib/publications.js';
import { addMethods } from './lib/methods.js';

export const Trombone = {
  configure(appId, appSecret, password) {
    const apiURl = Meteor.settings.tromboneAPIUrl ? Meteor.settings.tromboneAPIUrl : 'https://trombone.io';

    check(appId, String);
    check(appSecret, String);
    check(password, String);

    setupAccount(appSecret, password, (error, result) => {
      if (error) {
        throw new Meteor.Error('Trombone Error', error.message);
      } else {
        console.log('Trombone: Account configuration successful');
        configurePublications(result.superUserId, appSecret);
        addMethods();
      }
    });

    const connection = DDP.connect(apiURl);

    // wait to connect to the API and then authenticate
    function waitForConnection() {
      if (!connection.status().connected) {
        Meteor.setTimeout(waitForConnection, 100);
      } else {
        const absoluteUrl = Meteor.absoluteUrl({ secure: true });

        connection.call('authenticateCredentials', appId, appSecret, absoluteUrl, (error) => {
          if (error) {
            throw new Meteor.Error('Trombone Error', error.message);
          } else {
            console.log('Trombone: Authenticated with ' + apiURl + ' successfully');
          }
        });
      }
    }
    return waitForConnection();
  },
};
