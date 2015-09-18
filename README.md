# Lackey DustJs Helpers

**DEPRECATED**
Each helper now moved into its own module.


A bunch of dustjs helpers

This module is part of the [Lackey framework](https://www.npmjs.com/package/lackey-framework) that is used to build the [Lackey CMS](http://lackey.io) amongst other projects.

**UNSTABLE**

This is an early release of this helpers and they haven't been tested outside our framework. Please wait until a stable version is published.

## Usage

	var dustjs = require('dustjs-linkedin'),
        dustjs.helpers = require('dustjs-helpers').helpers, // optional, but a good idea
        helpers = require('lackey-dustjs-helpers');

    helpers.registerAll(dustjs);

Or, if you want to register specific ones:
    
    helpers.var(dustjs);
    helpers.options(dustjs);

## Helpers Included

- [Api](./lib/api.md)
- [Mongoose](./lib/mongoose.md)
- [Var](./lib/var.md)
- [Options](./lib/options.md)