
## Extension widgets - Tab

This widget creates what's known as a _"tab view"_. It will allow you to display multiple tabs, each with its
own widgets collection, where only one tab is visible at any one time - Allowing the user to select which tab
he wants to display, by clicking his tabs' activation buttons at the top of the widget. It expects a collection
of views where each **[view]** must have a **[name]** and a **[widgets]** collection. All other arguments
are passed in as is, allowing you to for instance override its **[class]** argument. Below is an example.

```hyperlambda-snippet
/*
 * Creates a simple modal widget, with a tab widget inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Creating some spacing.
       */
      div
        class:air
        widgets

          /*
           * Our actual tab widget.
           */
          micro.widgets.tab
            view
              name:Tab view 1
              widgets
                p
                  innerValue:Tab 1
            view
              name:Tab view 2
              widgets
                p
                  innerValue:Tab 2
```

Its default **[class]** value is `micro-widgets-tab`.
