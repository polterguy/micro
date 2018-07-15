
## Extension widgets - Radio buttons

The **[micro.widgets.radiobuttons]** widget is a convenience widget for more easily creating a bunch of related
radio buttons.

```hyperlambda-snippet
/*
 * Creating a modal widget with a bunch of radio buttons inside of it.
 */
create-widgets
  micro.widgets.modal:help-modal
    widgets
      h3
        innerValue:Radio buttons

      /*
       * Radio buttons widget.
       */
      micro.widgets.radiobuttons
        class:select-panel
        .data-field:radios
        option
          label:Foo
          .data-value:foo
        option
          label:Bar
          .data-value:bar

      /*
       * A pre element, and two buttons, to help serialize the widget,
       * and to close the modal widget.
       */
      literal:help-results
        element:pre
      div
        class:right strip
        widgets
          button
            innerValue:Save
            onclick
              micro.form.serialize:help-modal
              set-widget-property:help-results
                innerValue:x:/@micro.form.serialize
          button
            innerValue:Close
            onclick
              delete-widget:help-modal
```

The **[.data-field]**, **[.data-value]** and **[class]** arguments above are optional. The **[class]** value of
_"select-panel"_ simply renders your radio buttons as a _"select panel"_, adding some CSS _"bling"_ to your widget.
This widget allows you to supply your own **[onchange]** lambda callback, which will be invoked as the checked value
of your radio buttons are changing. If you supply this callback, your callback will be invoked with a **[value]**
argument, being the checked radio button. Below is an example.

```hyperlambda-snippet
/*
 * Creating a modal widget with a bunch of radio buttons inside of it.
 */
create-widgets
  micro.widgets.modal:help-modal
    widgets
      h3
        innerValue:Radio buttons

      /*
       * Radio buttons widget.
       */
      micro.widgets.radiobuttons
        onchange
          micro.windows.info:x:/../*/value?value
        class:select-panel
        .data-field:radios
        option
          label:Foo
          .data-value:foo
        option
          label:Bar
          .data-value:bar

      /*
       * A close modal widget button.
       */
      div
        class:right strip
        widgets
          button
            innerValue:Close
            onclick
              delete-widget:help-modal
```
