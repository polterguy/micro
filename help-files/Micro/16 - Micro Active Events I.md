
## Micro Active Events I

Micro also contains a whole range of additional Active Events, solving particular tasks in your
daily use of Phosphorus Five. Below is a list of which Active Events are documented in this file.

* __[micro.css.add]__ - Adds a CSS class to one or more widgets
* __[micro.css.delete]__ - Deletes a CSS class from one or more widgets
* __[micro.css.toggle]__ - Toggles a CSS class in one or more widgets
* __[micro.css.include]__ - Includes Micro CSS on your page
* __[micro.download.file]__ - Downloads a file to the client
* __[micro.form.serialize]__ - Retrieve all form element values beneath some widget
* __[micro.google.translate]__ - Translates the given text using Google Translate

In addition to the above Active Events, you can find some additional Active Events if you look
at Micro's code. However, the above are the ones I consider _"stable"_ at the time of writing.
Be warned! Also be warned that only Google Chrome currently supports speech recognition.
So the listen event from our above list, won't work with any other types of clients than Google
Chrome.

### CSS helper Active Events

There are three basic CSS events to help you modify your widget's CSS classes. These are as follows.

* __[micro.css.add]__
* __[micro.css.delete]__
* __[micro.css.toggle]__

They all expect an ID to one or more widgets, and a **[class]** argument, declaring which class(es) you
wish to delete, add, or toggle. Below is an example of using all of them.

```hyperlambda-snippet
/*
 * Creates a modal widget with a couple of buttons,
 * modifying their CSS classes when clicked.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * A bunch of buttons, using the CSS events from Micro.
       */
      button
        innerValue:Delete
        class:success
        onclick

          // Deletes a CSS class from widget.
          micro.css.delete:x:/../*/_event?value
            class:success

      button
        innerValue:Add
        onclick

          // Adds a CSS class to widget.
          micro.css.add:x:/../*/_event?value
            class:success

      button
        innerValue:Toggle
        onclick

          // Toggles a CSS class on widget.
          micro.css.toggle:x:/../*/_event?value
            class:success
```

The fourth Active Event, **[micro.css.include]**, simply includes Micro on your page. It can optionally
be given either the name of a skin, or an absolute path to another CSS skin file you have created
yourself.

### Downloading files to the client

The **[micro.file.download]** is pretty self explaining. It simply downloads a file to the client.
You can test it with the following code.

```hyperlambda-snippet
/*
 * Creates a modal widget with a button that
 * downloads a file to your client.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * A button that downloads a file to your client.
       */
      button
        innerValue:Download
        onclick
          micro.download.file:@MICRO/README.md
```

### Serializing forms

The **[micro.form.serialize]** serializes all form elements beneath some specified widget. It uses a fairly
intelligent construct to create _"friendly names"_ for your form elements, based upon a hidden attribute
called **[.data-field]**. The data-field value becomes the name of your form element values when this event
is invoked. Below is an example of usage.

```hyperlambda-snippet
/*
 * Creates a modal widget with a a form that is serialized
 * using [micro.form.serialize].
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Some form wrapper, which we'll later serialize.
       */
      div:my-form
        class:air-inner bg shaded rounded
        widgets
          input
            type:text
            class:fill
            placeholder:Name ...
            .data-field:name
          literal
            element:textarea
            placeholder:Address ...
            .data-field:address
            class:fill
          button
            innerValue:Serialize
            onclick

              /*
               * Serializing our form and displaying the result in a modal window.
               */
              micro.form.serialize:my-form
              eval-x:x:/+/**
              create-widgets
                micro.widgets.modal
                  widgets
                    h3
                      innerValue:Your values
                    pre
                      innerValue:x:/@micro.form.serialize
```

### Using Google Translate

The **[micro.google.translate]** Active Event is fairly self describing. It optionally takes two arguments.

* __[dest-lang]__ - Mandatory language you want to translate text into
* __[src-lang]__ - If ommitted, will be automatically determined by Google Translate

Consuming it might resemble the following.

```hyperlambda-snippet
/*
 * Translates "Hello world" into Norwegian, and displays
 * the result.
 */
micro.google.translate:Hello world
  dest-lang:NB-no
micro.windows.info:x:/-?value
```
