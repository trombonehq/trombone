import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export function configurePublications(superUserId, appSecret) {
  Meteor.publish('userCount', function userCount() {
    if (Roles.userIsInRole(this.userId, 'super-admin')) {
      let count = 0;
      // used to ensure we don't send lots of user count notifications until we're ready
      let initizalizing = true;
      const sub = this;

      const subHandle = Meteor.users.find().observeChanges({
        added(id, fields) {
          if (appSecret !== fields.username) {
            count++;
          }
          if (!initizalizing) {
            sub.changed('userCount', appSecret, { count });
          }
        },
        removed() {
          count--;
          sub.changed('userCount', appSecret, { count });
        },
      });

      initizalizing = false;
      sub.added('userCount', appSecret, { count });

      sub.ready();

      sub.onStop(() => {
        subHandle.stop();
      });
    } else {
      return null;
    }
  });
}
