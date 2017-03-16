# opencollective-postinstall
Prompt your users to donate to your collective after `npm install`

![](https://cl.ly/3u182e3B0323/Screen%20Shot%202017-03-14%20at%2010.51.21%20AM.png)

## Install

    npm install opencollective-postinstall --save-dev

This will run an interactive cli to configure your package.json
Note: because you are adding this in your `devDependencies`, it will only be installed in development enviromnent.

![](https://cl.ly/2k0G1C461A09/Screen%20Shot%202017-03-14%20at%2010.53.36%20AM.png)

In your `package.json`, it will add a new `"collective"` attribute and update the postinstall script.

    {
      ...
      "collective": {
        "type": "opencollective",
        "url": "https://opencollective.com/yourcollective_slug", // e.g. https://opencollective.com/webpack
        "logo": "https://opencollective.com/webpack/logo.txt?variant=wide&width=26"
      },
      "scripts": {
        "postinstall": "./node_modules/.bin/opencollective-postinstall || exit 0"
      },
      ...
    }

**Why `|| exit 0` in `scripts.postinstall`?**<br />
Since we are adding the dependency in `devDependencies`, the script `./node_modules/.bin/opencollective-postinstall` won't be installed in production. Therefore, the `postinstall` script will return an error and will interrupt the `npm install` process. Adding `|| exit 0` makes sure that this `postinstall` script always returns true.

## Options

### Customize the ASCII art logo of your collective

You can play with different sizes and variants to get the perfect ASCII art for your collective:

    https://opencollective.com/:slug/logo.txt?variant=:string&width=:integer&reverse=:boolean


e.g. https://opencollective.com/webpack/logo.txt?variant=wide&width=26&reverse=false

Possible values for `variant`: `wide`, `ultra-wide`, `variant1`, `variant2`, `variant3`, `variant4`, `blocks`, `bits`, `binary`, `greyscale`, `solid`

You can also change `reverse` to `true`.

### Suggest a donation amount

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

