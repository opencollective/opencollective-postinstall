# opencollective-postinstall
Prompt your users to donate to your collective after `npm install`

![](https://cl.ly/323M3x2Y1J3E/Screen%20Shot%202017-02-22%20at%202.03.58%20AM.png)

## Install

    npm install opencollective-postinstall --save

In your `package.json`, add:

    {
      ...
      "collective": {
        "type": "opencollective",
        "url": "https://opencollective.com/yourcollective_slug" // e.g. https://opencollective.com/webpack
      },
      "scripts": {
        "postinstall": "./node_modules/.bin/opencollective-postinstall"
      },
      ...
    }

## Options

You can specify a suggested donation amount or a different URL to use for your logo in ascii.

In the "collective" section of your `package.json`, add: 

    {
      ...
      "collective": {
        "type": "opencollective",
        "url": "https://opencollective.com/yourcollective_slug", // e.g. https://opencollective.com/webpack
        "logo": "https://opencollective.com/yourcollective_slug/logo.txt" // e.g. https://opencollective.com/webpack/logo.txt
        "suggested_donation": {
          "amount": 2,
          "currency": "USD", // must be same currency than your collective's default currency
          "interval": "monthly" // or "one-time" or "yearly"
        }
      }
    }


## Questions? Comments? Feedback?

Join the #opensource channel on our slack: https://slack.opencollective.org

