#[Trombone](https://trombone.io) - Hassle free user management for Meteor

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


### Points to Note

- This will only work on sites with SSL enabled. If you're doing authentication over non-SSL connections please stop.
- We currently only support apps that use the [Accounts-Password](https://atmospherejs.com/meteor/accounts-password) package. There are plans to remove this requirement soon.
- Your application must be accessible over the public internet to work. Local apps will still authenticate with the trombone API but the trombone dashboard will not be able to fetch data
- You must be using Meteor 1.3 or above
- This is beta software, use at your own risk!
