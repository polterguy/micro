## Micro Active Events III

This is the continuation of the documentation of Active Events from Micro. Below is a list of which Active Events
are documented in this file.

* __[micro.lambda.contract.min]__ - Creates an expectancy to arguments, and throws if specified arguments are not given
* __[micro.lambda.contract.optional]__ - Declares optional arguments to your lambda objects
* __[micro.lambda.contract.get]__ - Retrieves the lambda contract associated with event, if any
* __[micro.lambda.create-timeout]__ - Creates a timer, that once done, will evaluate some piece of Hyperlambda on the server
* __[micro.page.scroll-into-view]__ - Scrolls an element into view on client

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

#### Retrieving an event's lambda contract

Such lambda contracts can be highly useful, since they allow an event to actually communicate which arguments
it is expecting its callers to provide. Since Phosphorus Five is built around the axiom of meta cognition,
retrieving such lambda contracts is obviously a natural. This arguably, at least to some extent, allows any
event to be _"self describing"_ in nature, and document how a caller might want to consume it. Below is a snippet
that retrieves the lambda contract for the event **[micro.css.add]**, and displays it in a modal widget.

```hyperlambda-snippet
/*
 * Retrieving lambda contract for [micro.css.add]
 */
micro.lambda.contract.get:micro.css.add

/*
 * Displaying results in a modal widget.
 */
eval-x:x:/+/*/*/*/*
create-widgets
  micro.widgets.modal
    widgets
      pre
        innerValue:x:/@micro.lambda.contract.get
```

The above construct, allows you to dynamically figure out which arguments, and which types these arguments have -
And whether or not an argument is optional or not, for any dynamically created Active Events in your system.

The **[micro.lambda.contract.get]** event will only be able to return intelligent information if you have thoroughly
documented your event's lambda contract using **[micro.lambda.contract.min]** and/or **[micro.lambda.contract.optional]**.

### Creating timeout evaluations

The **[micro.lambda.create-timeout]** event allows you to supply a **[milliseconds]** argument, in addition to
an **[onfinish]** argument - And once the milliseconds have passed, your lambda object in onfinish will be
evaluated. It is therefor quite useful for allowing for some piece of Hyperlambda to be evaluatred after some
amount of milliseconds, and such _"poll"_ the server for changes. Below is an example.

```hyperlambda-snippet
/*
 * Shows an info window 2 seconds from now.
 */
micro.lambda.create-timeout
  milliseconds:2000
  onfinish
    micro.windows.info:Hello there, 2 seconds just passed!
```

If you want to, you can explicitly name your timer. Since the timer is implemented using a hidden input widget,
this allows you to delete the timer explicitly, by invoking for instance __[delete-widget]__, supplying the
name you provided as you created your timer. Below is an example that polls the server after 3 seconds, but
which you can stop, by clicking the button inside of the modal window.

```hyperlambda-snippet
/*
 * Shows an info window 3 seconds from now, unless the
 * caller clicks the "Stop" button inside of the modal widget.
 */
micro.lambda.create-timeout:samples-your-timer
  milliseconds:3000
  onfinish
    micro.windows.info:Hello there, 3 seconds just passed!

/*
 * Creates a modal widget with a "Stop timer" button inside of it.
 */
create-widgets
  micro.widgets.modal:samples-timer-modal-window
    widgets
      button
        innerValue:Stop timer!
        onclick

          /*
           * By deleting the timer widget, we stop the timer
           * from evaluating.
           */
          delete-widget:samples-your-timer

          /*
           * Deleting the modal widget, to prevent user
           * from trying to stop timer twice.
           */
          delete-widget:samples-timer-modal-window
```

**Notice**, you can also explicity override your timer's parent widget, by supplying a __[parent]__
widget ID. The latter allows for _"auto destruction"_ of your timer, as its parent widget is deleted.
This allows you to have your timer associated with a specific widget, and automatically deleted if
its __[container]__ widget is somehow deleted.

### Browser scrolling

The **[micro.page.scroll-into-view]** event will (smoothly) scroll some element into view on the client. Specify
which widget or element you want to scroll into view as **[\_arg]**. Below is an example.

```hyperlambda-snippet
/*
 * Scrolls "cnt" element into view, resulting in
 * that browser will smoothly scroll to top of page.
 */
micro.page.scroll-into-view:cnt
```
