## Extension widgets - Wizard form

The **[micro.widgets.wizard-form]** extension widget provides a convenient short hand for creating form
input elements, such as textboxes, radio buttons, etc. It will create the necessary boiler plate for
_"beautiful"_ form elements, such as adding a label in front of textboxes, and nicely align your widgets,
etc.

```hyperlambda-snippet
/*
 * Creates a modal widget with a "wizard widget".
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our actual "wizard widget".
       */
      micro.widgets.wizard-form:wizard-form
        text
          info:Name
          .data-field:name
        textarea
          info:Address
          .data-field:address
        checkbox
          info:Permanent
          .data-field:permanent
        radio-group
          .data-field:sex
          options
            Male:male
            Female:female
        select
          .data-field:hair
          info:Hair
          options
            Short:short
            Long:long

        /*
         * A button that serializes the wizard widget, and displays
         * another modal widget with the result.
         */
        button
          innerValue:Save
          onclick

            /*
             * Serializing wizard widget.
             */
            micro.form.serialize:wizard-form

            /*
             * Creating another modal widget, with the results
             * from our above serialization.
             */
            eval-x:x:/+/*/*/*/*/innerValue
            create-widgets
              micro.widgets.modal:modal-widget
                widgets
                  h3
                    innerValue:Values
                  pre
                    innerValue:x:/@micro.form.serialize
```

This widget is particularly useful when combined with **[micro.form.serialize]**, since it allows for doing
a lot, with very little code. Notice, this widget makes it very easy to create form elements, such as the
above illustrates - But you do loose some control over your form's final rendering, and it is (obviously)
not as flexible as creating your form elements entirely from scratch yourself. It allows you to declare
form elements with the following arguments.

* __[text]__ - Single line textbox input
* __[textarea]__ - Multiline textarea input
* __[checkbox]__ - Checkbox input element
* __[select]__ - Select dropdown element
* __[radio-group]__ - A group of radio buttons
* __[class]__ - Allows you to override the CSS class for your widget

If you supply anything but the above types to your wizard form, the widget will assume that you're
declaring another widget, and instantiate your argument as such.

The **[text]**, **[textarea]** and **[checkbox]** types from above, expects you to provide an **[info]**
argument, which becomes a piece of text displayed as a label, associated with your widget somehow.

The **[select]** and **[radio-group]** types, expects an **[options]** argument, which is a list of
name/value options the user is allowed to select.

To understand the **[.data-field]** arguments above, please refer to the **[micro.form.serialize]** event.
