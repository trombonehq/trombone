#[Trombone](https://trombone.io) - Hassle free user management for Meteor

## Note - this is beta software, please use at your own risk.

### Getting Started

1. Create an account at <https://trombone.io>
2. From the UI, create an app. You'll get an `AppId` and `AppSecret` (in Settings)
3. Run `meteor add trombonehq:trombone` from your Meteor app folder
4. Come up with password to be used to login to your application, you will use this when accessing the application at trombone.io. Please create a long, secure passcode/phrase and do not share this with anyone (including the trombone team).
5. Configure your Meteor app with the `AppId`, `AppSecret` and `Password`. by adding the following code to a `server/trombone.js` file:

```js
Meteor.startup(function() {
  Trombone.configure('<AppId>', '<AppSecret>', '<Password>');
});
```

Finally, deploy your application

That's it! You can now manage your user accounts on <https://trombone.io> using your account, you will be prompted for the password you created in step 4 when accessing your app.


### Points to Note

- This will only work on sites with SSL enabled. If you're doing authentication over non-SSL connections please stop.
- We currently only support apps that use the [Accounts-Password](https://atmospherejs.com/meteor/accounts-password) package
- Your application must be accessible over the public internet to work. Local apps will still authenticate with the trombone API but the trombone dashboard not be able to fetch data.
