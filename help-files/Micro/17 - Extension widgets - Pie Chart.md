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
such that the label for each item becomes a link button, instead of a simple label. Below is an example.

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
your actual pie chart - Or create an **[onclick]** event handler for your chart as a whole. Below is an example.

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
        style:"cursor:pointer;width:70%;float:right;"
        onclick
          micro.windows.info:Your pie chart was clicked!
        data
          John:50
          Peter:25
          Jane:75
          Thomas:125
```

The pie chart widget is rendered roughly the same way as a div element, and allows for floating, putting
it inside of a grid column to make it responsively rendered, etc. It is created entirely with
CSS and SVG elements, making it easily styled. This also implies that the chart consumes very low
amounts of bandwidth.

Its default colors can be overridden in for instance a skin file, by changing the CSS variables `--color1`
through `--color2`, in for instance your `.micro-widgets-chart-pie` CSS selector.

### Modifying your legend

A legend is by default rendered for your pie chart, and its width is 30% of the chart's available width. If
you need a larger legend, you can override the legend's size, by for instance adding a **[style]** argument
to your chart - At which point you should probably also change the width of each of your slices, to make
sure your chart as a whole is rendered correctly. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Overriding legend width
      micro.widgets.chart.pie
        legend:bool:true
          style:"width:60%;"
        data
          This is a fairly long label requiring more width:25
            style:"width:40%;"
          Peter:75
            style:"width:40%;"
          Jane:55
            style:"width:40%;"
          Thomas:175
            style:"width:40%;"
```

You can also completely drop the legend, by providing a **[legend]** argument, and setting its value to
boolean _"false"_ as illustrated below.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:No legend
      micro.widgets.chart.pie
        style:"width:50%; margin-left: auto; margin-right: auto;"
        legend:bool:false
        data
          Howdy:50
          World:25
          No legend:65
```

### CSS selectors for your pie chart

Normally a better way to style your pie chart, is to use a CSS file, overriding your pie chart's styles. Below
are all CSS classes you can override.

* __micro-widgets-chart-pie__ - The default root CSS class for your pie chart
* __has-legend__ - Added to your pie chart's root element if you choose to render it with a legend
* __slice__ - The CSS class for your slices
* __legend__ - The CSS class for your legend

Your legend's color squares are rendered as _"rect"_ SVG elements, and they are 20 pixels in height and width.
Your legend's labels are rendered as _"foreignObject"_ elements, with a _"span"_ child, unless you provide an
**[onclick]** event handler for your **[data]** items, at which point they're rendered as hyperlink (_"a"_)
elements.

