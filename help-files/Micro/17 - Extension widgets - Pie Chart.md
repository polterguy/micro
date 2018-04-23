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
or more of your items. The default implementation will automatically calculate your color ranging from light
gray, to dark gray, and evenly distribute your items colors accordingly. Below is an example of overriding
the color for each of your items.


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
            color:#ffa0a0
          Peter:25
            color:#a0ffa0
          Jane:75
            color:#a0a0ff
          Thomas:125
            color:#ffa0ff
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

The pie chart widget is rendered as a div element, with an _"svg"_ element for your pie, and a _"ul"_
element for your legend.

### Modifying your legend

A legend is by default rendered for your pie chart, and its width is 40% of the chart's available width. If
you need a larger legend, you can override the legend's size, by for instance adding a **[style]** argument
to your **[legend]** argument - At which point you should probably also change the width of each of your
slices, by adding a **[pie]** argument, changing your pie's width. Below is an example.

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
          style:"width:80%;"
        pie
          style:"width:20%;"
        data
          This is a fairly long label requiring more width:25
          Peter:75
          Jane:55
          Thomas:175
```

**Notice** - If you provide a __[legend]__ argument, you'll need to make sure its value is set to boolean
_"true"_, unless you don't want to have a legend at all for your chart. You can also completely drop the
legend, by providing a **[legend]** argument, and setting its value to boolean _"false"_ as illustrated
below.

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

Normally a better way to style your pie chart if you can, is to use a CSS file, overriding your pie chart's
styles. Below are all CSS classes you can override.

* __micro-widgets-chart-pie__ - The default root CSS class for your pie chart's _"div"_ element
* __has-legend__ - Added to your pie chart's root element if you choose to render it with a legend
* __pie__ - The CSS class for the main _"svg"_ element that renders your pie slices
* __slice__ - The CSS class for your slices
* __legend__ - The CSS class for your legend _"ul"_ element
* __legend-label-bg__ - The CSS class for your legend items color square
* __legend-label__ - The CSS class for your legend items descriptive label

Your legend's labels are rendered as a _"span"_ element, unless you provide an __[onclick]__ event handler
for your item(s), at which point it will render the legend labels as a hyperlink (_"a"_) element instead.
