## Extension widgets - Stars

This widget creates a star rating widget, allowing the user to rate some object, with a one through n value.

```hyperlambda-snippet
/*
 * Creates a modal widget with a "star rating widget".
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our actual "star widget".
       */
      micro.widgets.stars:stars
        value:2
        max:7
```

As the user is clicking the above stars, each star will be filled, allowing the user to provide a
_"star value"_ to some object. This is useful for allowing the user to provide feedback about some object.
In addition to **[value]** and **[max]**, you can also provide a **[read-only]** argument, which if
provided, will not allow the user to change the widget's value. All other arguments are passed in _"as is"_.
The star widget also correctly handles the **[.data-field]** argument automatically, allowing you to
easily serialize its value.
