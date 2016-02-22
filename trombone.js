Trombone = {
  configure: function(appId, appSecret, password) {

    //var apiURl = 'http://localhost:3000';
    var apiURl = 'https://trombone.io';

    var result = {};

    if(typeof appId === 'undefined' || appId === null){
      result.connected = false;
      result.error = 'Invalid App Id';
      console.log('Trombone: Missing App Id, Please provide your app id as an argument to the configure function');
      return result;
    }

    if(typeof appSecret === 'undefined' || appSecret === null || appSecret.length !== 43) {
      result.connected = false;
      result.error = 'Invalid App Secret';
      console.log('Trombone: Invalid App Secret: ' + appSecret + ' please check your app secret matches the secret provided by https://trombone.io');
      return result;
    }

    if(typeof password === 'undefined' || password === null){
      result.connected = false;
      result.error = 'Invalid Password';
      console.log('Trombone: Missing Password, please provide a password as an argument to the configure function. Use this password to access your app on https://trombone.io');
      return result;
    }

    var connection = DDP.connect(apiURl);

    //wait to connect to the API and then authenticate
    function waitForConnection() {
      if(!connection.status().connected) {
        Meteor.setTimeout(waitForConnection, 100)
      } else {
        result.connected = connection.status().connected;
        if(connection.call('authenticateCredentials', appId, appSecret)) {
          console.log('Trombone: Connected to Trombone api');
          setupAccount(appSecret, password);
          result.authenticated = true;
          return result;
        } else {
          console.log('Trombone: Your App Id & App Secret combination was not recognised');
          result.authenticated = false;
          return result;
        };

      }
    }
    waitForConnection();

  }

}
