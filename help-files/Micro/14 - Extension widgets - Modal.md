
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
