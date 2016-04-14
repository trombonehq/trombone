configurePublications = function(superUserId, appSecret) {
  Meteor.publish('userCount', function() {
    if (Roles.userIsInRole(this.userId, 'super-admin')) {
      var count = 0;
      var initizalizing = true; //used to ensure we don't send lots of user count notifications until we're ready
      var sub = this;

      var subHandle = Meteor.users.find()
        .observeChanges({
           added: function(id, fields) {
             if(appSecret !== fields.username) {
               count++;
             }
             if(!initizalizing) {
               sub.changed('userCount', appSecret, {count: count});
             }
           },
           removed: function(id) {
             count--;
             sub.changed('userCount', appSecret, {count: count});
           }
        });

      initizalizing = false;
      sub.added('userCount', appSecret, {count: count});

      sub.ready();

      sub.onStop(function() {
         subHandle.stop();
      });
    } else {
      return null;
    }
  });
}
