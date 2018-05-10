## Extension widgets - Column Chart

This widget allows you to create a _"column chart"_, supplying any number of name/value items as a **[data]**
collection, and let the widget take care of creating columns accordingly. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Column chart example
      micro.widgets.chart.column
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

### Providing negative values

The column chart automatically handles negative values, and will by default render negative columns with a
light red color. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Sales each year in millions
      micro.widgets.chart.column
        data
          2015:10
          2016:-25
          2017:50
          2018:120
```

### Overriding colors of columns

You can supply items with any number values you wish, and the widget will automatically calculate
the relative size of the columns for each of your items. In addition, you can override the **[color]** for one
or more of your items. The default implementation will use a gray color, with some nice hovering effects, but
this can easily be overridden. Below is an example of overriding the color for each of your items.


```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it,
 * where each item has a custom color.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Column chart example with custom colors
      micro.widgets.chart.column
        data
          John:50
            color:#ffa0a0
          Peter:25
            color:#a0ffa0
          Jane:75
            color:#a0a0ff
          Thomas:125
            color:#ffa0ff
```

### Further customizing your chart's appearance

If you provide an **[onclick]** event handler for your **[data]** items, the legend will be rendered
such that the label for each item becomes a link button, instead of a simple label. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Column chart example
      p
        innerValue:Try clicking the name labels.
      micro.widgets.chart.column
        data
          John:50
            onclick
              micro.windows.info:John was clicked
          Peter:25
            onclick
              micro.windows.info:Peter was clicked
          Jane:75
            onclick
              micro.windows.info:Jane was clicked
          Thomas:125
            onclick
              micro.windows.info:Thomas was clicked
```

You can also provide any other properties, and override for instance the **[onclick]** event handler for
your chart as a whole. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Column chart example
      p
        innerValue:Try clicking the actual chart
      micro.widgets.chart.column
        style:"cursor:pointer;width:70%;float:right;"
        onclick
          micro.windows.info:Your column chart was clicked!
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

The column chart widget is rendered as a div element, with an _"svg"_ element for your actual graphics.

If you provide a **[labels]** argument to your chart, and set its value to boolean _"false"_, no name labels
will be added to your chart - At which point you'll be free to add your own description for each column. Below is
an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Column chart example
      micro.widgets.chart.column
        labels:bool:false
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

### CSS selectors for your column chart

Normally a better way to style your chart if you can, is to use a CSS file, overriding your column chart's
styles. Below are all CSS classes you can override.

* __micro-widgets-chart-column__ - The default root CSS class for your column chart's _"div"_ element
* __column__ - CSS class for each of your _"rect"_ columns. If your column's value is negative, the _"negative"_ CSS class will be added
* __zero-line__ - CSS class of your zero line
* __zero-label__ - CSS class of your zero label
* __line__ - CSS class of all other lines
* __label__ - CSS class of all your other labels
* __name-label__ - CSS class of the _"foreignObject"_ where your name label for your item is rendered as a _"span"_ inside of it
