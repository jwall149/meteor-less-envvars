# Offical Less + environment variables to global variable

## Install

    meteor add jwall149:less-env-globalvars

## Configuration
You can pass global variables by setting `LESS_GLOBALVARS` environment variable: `export LESS_GLOBALVARS='{ "global_color": red}'`

At your `.less` you can declare:
```
.test {
  color: @global_color;
}
```

You now can also add `LESS_MODIFYVARS` environment variable to change some of the variable in the less file.

Example:

`export LESS_MODIFYVARS='{ "main_color": white}'`


## Common Pitfall
Not escape single quote and double quote

`LESS_GLOBALVARS='{"image_path": "/"}'`
will raise compile error, it should be:

`LESS_GLOBALVARS='{"image_path": "'/'"}'`

###Credits:
[Tonny Pham](https://github.com/jwall149)

----

### From the official meteor less package:

[LESS](http://lesscss.org/) extends CSS with dynamic behavior such as variables, mixins,
operations and functions. It allows for more compact stylesheets and
helps reduce code duplication in CSS files.

With the `less` package installed, `.less` files in your application are
automatically compiled to CSS and the results are included in the client CSS
bundle.

If you want to `@import` a file, give it the extension `.import.less`
to prevent Meteor from processing it independently.
