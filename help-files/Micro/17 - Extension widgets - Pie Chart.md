## Extension widgets - Pie Chart

This widget allows you to create a _"pie chart"_, supplying any number of name/value items as a **[data]**
collection, and let the pie chart widget takes care of creating slices accordingly. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Pie chart example
      micro.widgets.chart.pie
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

You can supply items with any number values you wish, and the pie chart widget will automatically calculate
the relative size of the slice for each of your items. In addition, you can override the **[color]** for one
or more of your items. The default implementation only has unique colors for your first 7 items, at which
point it starts reusing your colors - So if you need more than 7 slices, you should probably explicitly
supply your own colors for each slice, such as illustrated below.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it,
 * where each item has a custom color.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Pie chart example with custom colors
      micro.widgets.chart.pie
        data
          John:50
            color:red
          Peter:25
            color:yellow
          Jane:75
            color:green
          Thomas:125
            color:#ff00ff
```

If you provide an **[onclick]** event handler for your **[data]** items, the legend will be rendered
such that the label for each item becomes a link button, instead of a simple button. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Pie chart example
      p
        innerValue:Try clicking the legend labels.
      micro.widgets.chart.pie
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

You can also provide any other properties, and override for instance the **[class]** or **[style]** for
your actual pie chart. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Pie chart example
      p
        innerValue:Try clicking the actual chart
      micro.widgets.chart.pie
        style:"cursor:pointer;width:50%;"
        onclick
          micro.windows.info:Your pie chart was clicked!
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

The pie chart widget is rendered roughly the same way as a div element, and allows for floating, putting
it inside of a grid column to make it responsively rendered, etc, etc, etc. It is created entirely with
CSS and SVG elements, making it easily styled, and comsuming very little bandwidth.
