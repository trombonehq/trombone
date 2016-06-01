# [Trombone](https://trombone.io) - Hassle free user management for Meteor

[ ![Codeship Status for trombonehq/trombone](https://codeship.com/projects/a2e73880-0a40-0134-5508-7e53424ec4a1/status?branch=master)](https://codeship.com/projects/155534) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/mit-license.php)

![Screenshot](http://i.imgur.com/VXG3aL2.png)

### Getting Started

1. Create an account at <https://trombone.io>
2. From the UI, create an app. You'll get an `AppId` and `AppSecret` (in Settings)
3. Run `meteor add trombonehq:trombone` from your Meteor app folder
4. Come up with a strong password to be used to login to your application, you will use this when accessing the application at trombone.io. Please create a long, secure passcode/phrase and do not share this with anyone.
5. Configure your Meteor app with the `AppId`, `AppSecret` and `Password`. by adding the following code to a file that that is loaded during your server startup:

```js
import Trombone from { meteor/trombonehq:trombone };
Trombone.configure('<AppId>', '<AppSecret>', '<Password>');
```

Finally, deploy your application.

That's it! You can now manage your user accounts on <https://trombone.io>, you will be prompted for the password you created in step 4 when accessing your app.

### Adding custom methods

Trombone provides a custom method API that allows your to add custom methods to your trombone dashboard. These will appear above the user list, and are useful for executing common tasks in your app or over your users.

```js
Trombone.method(name, options);
```

- `name` - a string that maps to a method registered with the <a href="http://docs.meteor.com/#/full/meteor_methods">Meteor.methods</a> API
- `options` - an object as follows:

```js
{
    "buttonLabel": String, // the text to show on the button, required
    "needsUsers": boolean, // defaults to false, set this to true if you need to supply users to your method
}
```

If needsUsers is true, the checked users will be supplied to the method as an array of user IDs as the only argument.

Note that you need to ensure your call to Trombone.method() comes after you have registered your method with the Meteor.methods API.



### Points to Note

- Trombone will only work on sites with SSL enabled. If you're doing authentication over non-SSL connections please stop
- We currently only support apps that use the [Accounts-Password](https://atmospherejs.com/meteor/accounts-password) package. There are plans to remove this requirement soon
- Your application must be accessible over the public internet to work. Local apps will still authenticate with the trombone API but the trombone dashboard will not be able to fetch data
- You must be using Meteor 1.3 or above
- This is beta software, use at your own risk!
