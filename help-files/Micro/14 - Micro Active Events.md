## Micro Active Events

Micro also contains a whole range of additional Active Events, solving particular tasks in your
daily use of Phosphorus Five. Below is a list of some of the more important ones.

* __[micro.css.add]__ - Adds a CSS class to one or more widgets
* __[micro.css.delete]__ - Deletes a CSS class from one or more widgets
* __[micro.css.toggle]__ - Toggles a CSS class in one or more widgets
* __[micro.css.include]__ - Includes Micro CSS on your page
* __[micro.download.file]__ - Downloads a file to the client
* __[micro.form.serialize]__ - Retrieve all form element values beneath some widget
* __[micro.google.translate]__ - Translates the given text using Google Translate
* __[micro.page.set-focus]__ - Sets the focus to a widget on your page
* __[micro.speech.listen]__ - Listens for input using speech recognition
* __[micro.speech.speak]__ - Speaks the given text
* __[micro.speech.stop]__ - Stops listening and speaking, if active
* __[micro.speech.query-voices]__ - Queries available voices from your client
* __[micro.windows.info]__ - Shows a small information _"bubble window"_
* __[micro.url.get-entities]__ - Returns each folder of the URL for the current request
* __[micro.lambda.contract.min]__ - Creates an expectancy to arguments, and throws if specified arguments are not given
* __[micro.lambda.contract.optional]__ - Declares optional arguments to your lambda objects

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

### Setting focus to elements

The **[micro.page.focus]** Active Event is fairly self describing. Pass in the ID to whatever widget
you want to give focus to.

### Micro's speech Active Events

There are four basic Active Events which helps you with speech recognition and speech synthesis, these are
as follows.

* __[micro.speech.listen]__
* __[micro.speech.speak]__
* __[micro.speech.stop]__
* __[micro.speech.speak.query-voices]__

To have the computer speak some sentence for instance, you can use the following code.

```hyperlambda-snippet
/*
 * Speaks some sentence.
 */
micro.speech.speak:Hello there, my name is Phosphorus Five
```

You can optionally pass in a **[voice]** argument, which you can give a value of either a named voice, which
you can fetch by querying the voice API on the client - Or to a language code, such as for instance _"nb-NO"_.
Try adding `voice:Alex` for instance to the above code, if you are using Google Chrome.

Both the listen and speak events can optionally take an **[onfinish]** lambda callback, which if specified,
will be evaluated after the operation is finished. If you pass in an onfinish lambda to the
**[micro.speech.listen]** event, then a **[text]** argument will be passed into your lambda callback,
with the text that the speech recognition engine was capable of recognizing. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget which allows you to capture
 * speech, using speech recognition.
 *
 * NOTICE, this example only works in Google Chrome at the moment.
 */
create-widgets
  micro.widgets.modal
    widgets
      div
        events

          /*
           * Waits for speech input, reads it out loud, and restarts the input loop.
           */
          examples.capture-speech

            /*
             * Listens for input.
             */
            micro.speech.listen
              onfinish

                /*
                 * Speaks the input with the "Karen" voice.
                 * Notice, make sure the Karen voice exists in your client, 
                 * before you try to run this example.
                 */
                micro.speech.speak:x:/../*/text?value
                  voice:Karen

                /*
                 * "Recursively" invokes self.
                 */
                examples.capture-speech

        widgets
          div
            class:row
            widgets
              div
                class:col
                widgets
                  button
                    innerValue:Talk to me
                    onclick

                      /*
                       * Starts "input loop".
                       */
                      examples.capture-speech

                  button
                    innerValue:Stop
                    onclick

                      /*
                       * Stops speech engine (both speak and listen).
                       */
                      micro.speech.stop
```

#### Querying available voices and languages

To figure out which language codes you can use for capturing speech, and which voices you can use to utter
text, you can use the **[micro.speech.speak.query-voices]** Active Event. This event will have to create a roundtrip
to the client (browser), to figure out which voices/languages the browser supports - Hence, it requires you
to provide an **[onfinish]** lambda callback, which will be evaluated with a **[voices]** argument, being
all available voices for utterance, which also corelates to all available language codes you can use for speech
recognition. Below is an example of using it.

```hyperlambda-snippet
/*
 * Queries the available voices in your browser.
 */
micro.speech.speak.query-voices
  onfinish

    /*
     * Creates a modal widget with the result.
     */
    eval-x:x:/+/**/innerValue
    create-widgets
      micro.widgets.modal
        widgets
          pre
            innerValue:x:/../*/voices
```

**Notice**, if a voice has the property of `local:bool:false`, this implies that the voice will have to create a
roundtrip to Google, in order to create its speech - Which will have consequences for your privacy.

### Information "bubble" windows

The **[micro.windows.info]** is a _"bubble"_ window, for displaying feedback to the user, in a non-intrusive
way. Simply pass in whatever text you want for it to display, and optinally pas in a **[class]** argument.
Notice, if you pass in an explicit class, you'd probably want to make sure you **also add micro-windows-info**
to your class list, since otherwise it'll probably look weird. Below is an example.

```hyperlambda-snippet
/*
 * Creates an information "bubble" window.
 */
micro.windows.info:Hello world
  class:micro-windows-info success
```

### Retrieving URL's entities

The **[micro.url.get-entities]** event will return all URL _"entities"_ for you, implying all folders
for the current request, without any query parameters. If your URL is for instance _"/foo/bar/howdy?some=query"_, it
will return the following.

```hyperlambda
micro.url.get-entities
  foo
  bar
  howdy
```

This makes it easy for you to retrieve the different parts and sub parts of the current request's URL, without
having to manually parse it yourself, using for instance **[split]** etc.

### Lambda contracts

You can also use the **[micro.lambda.contract.xxx]** events to declare arguments to your lambda objects, such
as your Active Events or Hyperlambda files for instance. The **[micro.lambda.contract.min]** event, will throw
an exception if the expected argument is not supplied. Below is an example that will throw an exception, since
we did not pass in a **[foo]** argument.

```hyperlambda-snippet
/*
 * Our lambda object
 */
.exe
  micro.lambda.contract.min:x:/..
    foo

/*
 * Invoking our above lambda object, without
 * a [foo] argument, which results in an exception.
 */
eval:x:/@.exe
  //foo:No foo here ...
```

If you uncomment the above **[foo]** argument, then no exception will be thrown. Notice, you can also type your
arguments, such as the following illustrates. Also this code will throw an exception.

```hyperlambda-snippet
/*
 * Our lambda object
 */
.exe
  micro.lambda.contract.min:x:/..
    foo:int

/*
 * Invoking our above lambda object, with a value
 * that is not convertible into an "int" (integer number).
 */
eval:x:/@.exe
  foo:This is not an integer value
```

Changing the above to the following will make our code evaluate without exceptions.

```hyperlambda-snippet
/*
 * Our lambda object
 */
.exe
  micro.lambda.contract.min:x:/..
    foo:int

/*
 * Invoking our above lambda object, with a value
 * that IS convertible into an "int" (integer number).
 */
eval:x:/@.exe
  foo:5
```

If you use the **[micro.lambda.contract.optional]**, then no exception will occur if the argument is not given.
However, if the argument is given, it will check its type, if supplied in the contract, and throw an exception
if the argument is given, but with the wrong type.

Both of these Active Events also serves a _"double purpose"_, which is that they give you meta capabilities on
your Active Events and lambda objects in general, allowing you to _"query"_ your lambda objects/Active Events,
to have them tell you which arguments they can handle. Hence, you should at least to some extent carefully
make sure your public API events are correctly consuming these events, which helps others to understand your
system, even allowing for automated processes querying your API for its legal arguments too.
