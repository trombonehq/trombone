configurePublications = function(superUserId, appSecret) {

  //text indexes for searching
  Meteor.users._ensureIndex({
    'emails.address': "text",
    '_id' : "text",
    'profile.name' : "text"
  });


  Meteor.publish('allUserAccounts', function(searchTerm, usersToLoad) {
    if (Roles.userIsInRole(this.userId, 'super-admin')) {
      var sub = this;
      var options = { limit: usersToLoad };
      var selector = {};

      //default options if there's no search term
      if(!searchTerm) {
        options = {
          limit: usersToLoad,
          sort: { createdAt: -1}
        }
      }

      //if we're searching for something, sort by search score and search
      if(searchTerm) {
        options.fields = {
          searchScore: {
            $meta: 'textScore'
          }
        };
        options.sort = {
          searchScore: {
            $meta: 'textScore'
          }
        }
        selector = {
          $text: {
              $search: searchTerm
            }
        };
      };

      subHandle = Meteor.users.find(selector, options)
        .observeChanges({
           added: function(id, fields) {
             if(appSecret !== fields.username) {
               sub.added('remoteUsers', id, fields);
             }
           },
           changed: function(id, fields) {
             sub.changed('remoteUsers', id, fields);
           },
           removed: function(id) {
             sub.removed('remoteUsers', id);
           }
        });

      sub.ready();

      sub.onStop(function() {
         subHandle.stop();
      });

    } else {
      return null;
    }
  });


  Meteor.publish('userCount', function() {
    if (Roles.userIsInRole(this.userId, 'super-admin')) {
      var count = 0;
      var initizalizing = true; //used to ensure we don't send lots of user count notifications until we're ready
      var sub = this;

      subHandle = Meteor.users.find()
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
