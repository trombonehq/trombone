configurePublications = function(superUserId, appSecret) {

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


  Meteor.publish('allUserAccounts', function(searchTerm, usersToLoad) {
    if (Roles.userIsInRole(this.userId, 'super-admin')) {
      var sub = this;

      var options = {
        limit: usersToLoad,
        sort: { createdAt: -1}
      };

      var selector = searchTerm ? searchTermSelector(searchTerm) : {};

      var userRecord = Meteor.users.findOne();

      var subHandle = Meteor.users.find(selector, options)
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
