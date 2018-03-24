## Extension widgets - Cover

The **[micro.widgets.cover]** allows you to completely hide all widgets on your page, behind a semi
transparent layer, which prevent interaction with all other widgets on your page. It is useful if
you have lenghty operations, which requires the user to wait until the operation is finisihed.

```hyperlambda-snippet
/*
 * Creates a modal widget with a button,
 * that creates a "cover" widget when clicked.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * This button will create a cover widget,
       * and then call the server again 2 seconds afterwards,
       * at which point the cover widget is deleted again.
       */
      button
        innerValue:Cover
        onclick

          /*
           * Creating a cover widget.
           */
          create-widgets
            micro.widgets.cover:cover-widget
              message:Please wait for 2 seconds ...

          /*
           * Creating a timer that invokes our server
           * 2 seconds from now, for then to delete our cover widget.
           */
          micro.lambda.create-timeout
            milliseconds:2000
            onfinish
              delete-widget:cover-widget
```

The cover widget optionally takes a **[message]** argument, which you can set to some piece of
information to display to the user.
