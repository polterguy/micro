## Extension widgets - Modal

This widget will display a modal window, preventing the user from interacting with anything on the page, except
the modal widget itself. Its Active Event name is **[micro.widgets.modal]**, and its most important argument is
its **[widgets]** collection, which is a plain widgets collection, where you can add any widgets you want to add.
Below is an example of usage.

```hyperlambda-snippet
/*
 * Creates a simple modal widget, with a paragraph.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Modal widget
      p
        innerValue:Click anywhere outside of me to close me
```

You can override it **[class]**. However, realize that the class property for the modal widget is actually the
class for the main widget - Which is actually the cover parts that obstructs the widgets behind it. Hence,
you'll probably want to apply some CSS selector trickery if you go down this road. Its default class property
value is `micro-widgets-modal`, but if you add the `large` class to it, the widget is rendered slightly wider.
Below is an example.

```hyperlambda-snippet
/*
 * Creates a simple modal widget, with a paragraph.
 */
create-widgets
  micro.widgets.modal
    class:micro-widgets-modal large
    widgets
      h3
        innerValue:A large modal widget
      p
        innerValue:Click anywhere outside of me to close me
```

### Convenience events

There exists a convenience event for the modal widget, which is useful if all you want to do is
to have the user _"confirm"_ some action, before some piece of Hyperlambda is evaluated. This event is
called __[micro.windows.confirm]__, and it takes the following 3 arguments.

* __[header]__ - Optional header for your modal window, defaults to _"Confirm"_.
* __[body]__ - Optional content for your modal window, defaults to _"Please confirm that you really want to do this."_
* __[onok]__ - Mandatory lambda object, which is evaluated if the user confirms that he wants to perform the action.

Below is an example of usage.

```hyperlambda-snippet
/*
 * Asks the user if he really wants to display
 * an information bubble window.
 */
micro.windows.confirm
  header:Please confirm action
  body:Are you sure you want to display an information bubble window?
  onok

    /*
     * This piece of Hyperlambda is only evaluated if
     * the user clicks the 'Yes' button.
     */
    micro.windows.info:OK, here's your information bubble window ...
```

