
## Micro Active Events II

This is the continuation of the documentation of Active Events from Micro. Below is a list of which Active Events
are documented in this file.

* __[micro.page.set-focus]__ - Sets the focus to a widget on your page
* __[micro.speech.listen]__ - Listens for input using speech recognition
* __[micro.speech.speak]__ - Speaks the given text
* __[micro.speech.stop]__ - Stops listening and speaking, if active
* __[micro.speech.query-voices]__ - Queries available voices from your client
* __[micro.windows.info]__ - Shows a small information _"bubble window"_
* __[micro.url.get-entities]__ - Returns each folder of the URL for the current request

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
