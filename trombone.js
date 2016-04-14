Trombone = {
  configure: function (appId, appSecret, password) {

    var apiURl = Meteor.settings.tromboneAPIUrl ? Meteor.settings.tromboneAPIUrl : 'https://trombone.io';

    var result = {};

    if (typeof appId === 'undefined' || appId === null) {
      result.connected = false;
      result.error = 'Invalid App Id';
      console.log('Trombone: Missing App Id, Please provide your app id as an argument to the configure function');
      return result;
    }

    if (typeof appSecret === 'undefined' || appSecret === null || appSecret.length !== 43) {
      result.connected = false;
      result.error = 'Invalid App Secret';
      console.log('Trombone: Invalid App Secret: ' + appSecret + ' please check your app secret matches the secret provided by https://trombone.io');
      return result;
    }

    if (typeof password === 'undefined' || password === null) {
      result.connected = false;
      result.error = 'Invalid Password';
      console.log('Trombone: Missing Password, please provide a password as an argument to the configure function. Use this password to access your app on https://trombone.io');
      return result;
    }

    setupAccount(appSecret, password, function (error, result) {
      if (error) {
        console.log('Trombone Error: ' + error.message);
      } else {
        console.log('Trombone: Account configuration successful');
        configurePublications(result.superUserId, appSecret);
        addMethods();
      }
    });

    _tromboneConnection = DDP.connect(apiURl);

    // wait to connect to the API and then authenticate
    function waitForConnection() {
      if (!_tromboneConnection.status().connected) {
        Meteor.setTimeout(waitForConnection, 100);
      } else {
        result.connected = _tromboneConnection.status().connected;
        var absoluteUrl = Meteor.absoluteUrl({ secure: true });

        _tromboneConnection.call('authenticateCredentials', appId, appSecret, absoluteUrl, function (error, result) {
          if (error) {
            console.log('Trombone Error: ' + error.message);
          } else {
            setupAnalytics(appId, appSecret);
            console.log('Trombone: Authenticated with ' + apiURl + ' successfully');
          }
        });

      }
    }
    waitForConnection();

  }

};
