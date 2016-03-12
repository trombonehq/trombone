setupAnalytics = function(appId, appSecret) {

  var processUserAccounts = function () {
    console.log('Trombone: Processing user data');

    var count = 0;
    var processedData = {};

    Meteor.users.find().forEach(function(user) {
      count++;
      var date = new Date(user.createdAt);
      date.setHours(0,0,0,0);
      processedData[date] = processedData[date] ? processedData[date] + 1 : 1;
    })

    console.log('Trombone: Processed ' + count + ' user accounts')

    _tromboneConnection.call('updateUserData', appId, appSecret, processedData );
  }

  processUserAccounts();

  //every day we re run the analytics
  Meteor.setInterval(function() {
    processUserAccounts();
  }, (60000 * 60) * 24 );
}
