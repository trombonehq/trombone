#[Trombone](https://trombone.io) - Hassle free user management for Meteor

### Getting Started

1. Create an account at <https://trombone.io>
2. From the UI, create an app. You'll get an `AppId` and `AppSecret` (in Settings)
3. Run `meteor add trombone:trombone` from your Meteor app folder
4. Come up with password to be used to login to your application, you will use this at trombone.io and in the next step. This password will ensure your account is secure and cannot even be accessed by trombone.io admins. Please keep this secure and do not share this with anyone.
5. Configure your Meteor app with the `AppId`, `AppSecret` and `Password`. by adding the following code to a `server/trombone.js` file:

```js
Meteor.startup(function() {
  Trombone.configure('<AppId>', '<AppSecret>', '<Password>');
});
```

6. Deploy your application

That's it! You can now manage your user accounts on <https://trombone.io> using your account, you will be prompted for the password you created in step 4 when accessing your app.
