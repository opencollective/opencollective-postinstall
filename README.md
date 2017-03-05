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
        "postinstall": "./bin/opencollective-postinstall [--no-logo]" // if you pass --no-logo, we won't show the Open Collective logo
      },
      ...
    }

## Suggest a donation amount (optional)

In the "collective" section of your `package.json`, add: 

    {
      ...
      "collective": {
        "type": "opencollective",
        "url": "https://opencollective.com/yourcollective_slug", // e.g. https://opencollective.com/webpack
        "suggested_donation": {
          "amount": 2,
          "currency": "USD", // must be same currency than your collective's default currency
          "interval": "monthly" // or "one-time" or "yearly"
        }
      }
    }

## Questions? Comments? Feedback?

Join the #opensource channel on our slack: https://slack.opencollective.org

