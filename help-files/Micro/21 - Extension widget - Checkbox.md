
## Extension widgets - Checkbox

The **[micro.widgets.checkbox]** widget is a convenience widget to create a checkbox, with a label. Below is
an example.

```hyperlambda-snippet
/*
 * Creating a modal widget with a checkbox inside of it.
 */
create-widgets
  micro.widgets.modal:help-modal
    widgets
      h3
        innerValue:Checkbox

      /*
       * Checkbox widget.
       */
      micro.widgets.checkbox
        label:Are you sure?
        .data-field:sure
        onchange
          micro.windows.info:x:/../*/checked?value

      /*
       * A close window button.
       */
      div
        class:right
        widgets
          button
            innerValue:Close
            onclick
              delete-widget:help-modal
```

The **[onchange]** and **[.data-field]** arguments are optional. You can also wrap the checkbox inside for instance
a _"div"_ widget, and set the div's **[class]** value to _"select-panel"_ to render it similarly to the previous
example with our radio buttons.
