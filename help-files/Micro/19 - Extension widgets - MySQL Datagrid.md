## Extension widgets - MySQL Datagrid

This widget allows you to create a _"datagrid"_ that automatically databinds towards a MySQL database table.
Below is an example that assumes you have Hypereval installed in your Phosphorus Five installation.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
```

The __[micro.widgets.mysql.datagrid]__ extension widget expects the following arguments.

- __[database]__ - Which database to databind your datagrid towards. This argument it mandatory.
- __[table]__ - Which table to databind your datagrid towards. This argument is mandatory.
- __[columns]__ - Collection of which columns your datagrid should have. This argument is mandatory.
- __[page-size]__ - How many items your datagrid should retrieve during databind invocations. This argument is optional, and defaults to 10.
- __[databind]__ - If you declare this argument, and set its value to boolean _"false"_, the datagrid will _not_ be initially databound. This argument is optional, and it defaults to _"true"_.
- __[headers]__ - If you don't want to render any headers _at all_ for your datagrid, you can provide this argument, and set its value to a boolean _"false"_.

In addition to the above arguments, this widget also supports the following
optional arguments. These arguments are only used during the _initial_ databind
invocation, and are passed _"as is"_ to __[micro.widgets.mysql.datagrid.databind]__,
as it is being invoked when your datagrid is created.

- __[filter]__ - Filter for _initial_ databind invocation. This argument is optional.
- __[page]__ - Page for _initial_ databind invocation. This argument is optional.
- __[sort-by]__ - Sorting for _initial_ databind invocation. This argument is optional.
- __[sort-direction]__ - Sorting direction for _initial_ databind invocation. This argument is optional.

**Notice**, the above 4 arguments are only relevant if you choose to databind your datagrid during
its initial instantiation, which is its default behaviour. To avoid databinding your datagrid during its
initial instantiation, you can pass in `databind:bool:false` as an argument to it.
All arguments besides those shown above, will be applied to your datagrid's root widget, allowing you
to for instance override your table's CSS class, etc. Below is an example of changing some of its attributes.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * overriding its default [style] and [class] attributes.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        style:"font-size:2rem;"
        class:hover striped
        database:hypereval
        table:snippets
        columns
          name
```

If you don't want to initially databind your datagrid, you can supply a __[databind]__ argument, and set its value
to boolean _"false"_ - At which point the datagrid will not be initially databound. Below is an example that avoids
initial databinding, and creates a timeout, that databinds the datagrid after 3 seconds.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * that is not initially databound, but databinds the datagrid
 * after 3 seconds.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets - Databinds 3 seconds from now!

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid:examples-mysql-datagrid
        database:hypereval
        table:snippets
        databind:bool:false
        columns
          name
        oninit

          /*
           * Creates a timeout of 3 seconds, databinding the datagrid
           * when 3 seconds have passed.
           */
          micro.lambda.create-timeout
            milliseconds:3000
            onfinish
              micro.widgets.mysql.datagrid.databind:examples-mysql-datagrid
```

### Declaring your [columns]

The __[columns]__ argument allows you to control your datagrid header and items exactly as
you see fit. In its simplest form, it simply assumes a collection of columns from your database table,
such as illustrated above. However, you can also declare your columns as a _"widget lambda object"_, that
allows you to dynamically create your own cell's content for these columns as a __[widgets]__ collection.
You can do this by adding a __[.lambda]__ argument to your columns, which will be evaluated, with
a __[row]__ argument for the currently iterated row from your database. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget with a MySQL datagrid
 * containing a 'template column'.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
          Click the button

            /*
             * This declares a [.lambda] column.
             */
            .lambda

              /*
               * Forward evaluating the [.name] node inside of our
               * [onclick] event handler below.
               */
              eval-x:x:/+/*/*/*/.name
              return
                button
                  innerValue:What's my name?
                  onclick

                    /*
                     * This will contain the 'name' from your result.
                     */
                    .name:x:/../*/row/*/name?value
                    set-widget-property:x:/../*/_event?value
                      innerValue:x:/@.name?value
```

A __[.lambda]__ column is basically a lambda object, which will be evaluated with the __[row]__ from
your currently iterated row as an argument. Your __[.lambda]__ object is expected to return a
__[widgets]__ collection, which will become the widgets of your cells, as your datagrid is being
databinded.

**Notice**, sometimes you want to reference columns from your database inside of your
__[.lambda]__ columns, which you don't want to display in your actual datagrid. For such times,
you'll still have to declare the column in your __[columns]__ collection, but you can set its
visibility to _"false"_, making the column a part of your SQL, and hence your __[row]__ - Yet
still avoid having the column rendered in your actual datagrid. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget with a MySQL datagrid
 * containing a 'template column'.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns

          /*
           * Notice, if you remove this column declaration, your
           * [.lambda] column below won't work, since it is referencing
           * the [name] inside of the [row].
           */
          name
            visible:bool:false
          Click the button

            /*
             * This declares a [.lambda] column.
             */
            .lambda

              /*
               * Forward evaluating the [.name] node inside of our
               * [onclick] event handler below.
               */
              eval-x:x:/+/*/*/*/.name
              return
                button
                  innerValue:What's my name?
                  onclick

                    /*
                     * This will contain the 'name' from your result.
                     */
                    .name:x:/../*/row/*/name?value
                    set-widget-property:x:/../*/_event?value
                      innerValue:x:/@.name?value
```

If we hadn't provided the __[name]__ column above, it wouldn't exist in our __[row]__, inside of our
__[.lambda]__ object.

Besides from the __[.header]__ argument, which is explained further down, and the __[.lambda]__ argument
to your columns declarations - All other arguments are applied to every cell of your datagrid, allowing
you to override for instance the style property of a cell, or its class, etc. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * changing the style attribute of your 'name' column.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
            style:"background-color:yellow; font-family: Comic Sans MS;"
```

The above allows you to for instance provide event handlers for your cells if you want to. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * handling the [onmouseover] event for each cell.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
            onmouseover
              set-widget-property:x:/../*/_event?value
                innerValue:Do you want to play hide and seek?
```

### Modifying your headers

You can also control every aspect of your table's headers, with similar semantics as we did in
our above __[.lambda]__ example. This is being done by adding a __[.header]__ argument to your
column declaration. The __[.header]__ argument is _only_ applied to your table's header, for
the specified column, and is ignored by your actual databind operation. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * making sure the header is rendered with larger font, and yellow
 * color.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
            .header
              style:"color:yellow;font-size:2rem;"
```

You can also create your headers as a __[widgets]__ collection, to allow for having your table's headers
contain rich widgets. This is useful if you for instance want to support clicking the headers of your datagrid.
Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * making sure the header is rendered with a [widgets] collection,
 * instead of its default 'simple' label.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name
            .header

              /*
               * This entirely bypasses the default rendering of your
               * header, and replaces its simple label with a button.
               */
              widgets
                button
                  innerValue:Click the bunny!
                  onclick
                    micro.windows.info:The 'bunny' header was clicked!
```

If you want to completely drop the rendering of your headers, you can do this by providing a boolean _"false"_
value to a __[headers]__ argument. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets

      /*
       * Our actual datagrid.
       */
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        headers:bool:false
        columns
          name
```

### Databinding your datagrid

To databind your datagrid, you can use the __[micro.widgets.mysql.datagrid.databind]__ widget lambda event.
Below is an example of dynamically databinding your grid. This snippet assumes you've got Hypereval installed.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * and a button, which once clicked, re-databinds the datagrid.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets
      micro.widgets.mysql.datagrid:examples-mysql-datagrid
        database:hypereval
        table:snippets
        columns
          name
      button
        innerValue:Databind towards 'widgets' items
        onclick

          /*
           * Databinding the datagrid.
           */
          micro.widgets.mysql.datagrid.databind:examples-mysql-datagrid
            filter:name like @name
              @name:%widget%
```

The __[micro.widgets.mysql.datagrid.databind]__ widget lambda event can be given the following arguments.

- __[filter]__ - Optional filter for your databind operation.
- __[page]__ - Optional page for your databind operation.
- __[sort-by]__ - Optional sorting column for your databind operation.
- __[sort-direction]__ - Optional sorting direction for your databind operation. Defaults to _"asc"_.
- __[keep-items]__ - If you declare this, and set its value to boolean _"true"_, the databind operation will instead of deleting its old items, append its new items to the datagrid.

The above arguments obeys by the same set of rules as they do when you initially create your datagrid.
The __[keep-items]__ above though, is the only argument that does not also exist when initially creating
your datagrid. This argument allows you to instead of re-databinding your datagrid, append your items to
its existing items. This feature allows you to (among other things) create a _"never ending scrolling"_
feeling for your datagrid, where as the user scrolls to the bottom of his page, you can handle the scroll
event, and feed your datagrid with more items. Below is a simple example, not illustrating never ending
scrolling, but rather simply appending a bunch of items to your datagrid.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * and a button, which once clicked, re-databinds the datagrid,
 * making sure the grid keep its existing items.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets
      micro.widgets.mysql.datagrid:examples-mysql-datagrid
        database:hypereval
        table:snippets
        columns
          name
      button
        innerValue:Give me more!
        onclick

          /*
           * Databinding the datagrid.
           */
          micro.widgets.mysql.datagrid.databind:examples-mysql-datagrid
            keep-items:bool:true
            page:1

          /*
           * Disabling the button to avoid consecutive clicks.
           */
          set-widget-property:x:/../*/_event?value
            disabled
```

The __[filter]__ argument allows you to _"filter"_ your result, and is a _"where"_ clause to the actual
SQL that is executed on your database connection. An example can be found above. The filter can contain
any legal _"where"_ clause that MySQL can handle for your table, and be as complex or simple as you want
it to be. An example of filtering according to some _"name"_ and _"email"_ column for instance would
be the following.

```hyperlambda
/*
 * Filtering by name equals 'John Doe' and email equals 'john@doe.com'
 */
micro.widgets.mysql.datagrid.databind:examples-mysql-datagrid
  filter:name = @name and email = @email
    @name:John Doe
    @email:john@doe.com
```

The __[page]__ argument creates an _"offset"_ to your SQL of __[page-size]__ multiplied by __[page]__,
allowing you to show the _"next"_ items matching your query. Below is an example that will show only
item 6 to 12 from your Hypereval database.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * databinding it towards items 6-12 from your snippets table.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name

        // Page 1.
        page:1

        // Select only 6 items.
        page-size:6
```

__[sort-by]__ is a reference to a column in your database table, which you want to order your results
by, and __[sort-direction]__ can be either _"asc"_ or _"desc"_, implying _"ascending"_ and _"descending"_.
Below is an example of sorting descending by _"name"_, effectively showing you the last 10 items in your
Hypereval snippets table.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a MySQL datagrid inside of it,
 * making sure we sort our columns by 'name' descending.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Hypereval snippets
      micro.widgets.mysql.datagrid
        database:hypereval
        table:snippets
        columns
          name

        // Sorting results by the 'name' column.
        sort-by:name

        // Sorting 'descending'.
        sort-direction:desc
```

### Internals of the datagrid widget

Internally the __[micro.widgets.mysql.datagrid]__ widget uses the __[micro.widgets.grid]__ extension widget. This
widget renders a simple _"table"_ element, with a _"thead"_ element for your header, and a _"tbody"_ element for your
content. It adds _zero_ custom JavaScript to your page, but relies entirely upon the Managed Ajax parts from
the core of Phosphorus Five, making it literally orders of magnitudes smaller in size than most other datagrids
out there. If you have Hypereval installed, you can try out the [datagrid widget example](/hypereval/widgets-samples-mysql-datagrid)
and compare its bandwidth usage with any other datagrids out there. If you do, you'll find that it consumes
ridiculously small amounts of bandwidth, making it highly optimised and well suited for situations where
you don't have the luxury of consuming huge amounts of bandwidth.

Below is a snippet that shows you a modal dialog, with a chart, illustrating the difference between some
of the most popular datagrid implementations for .Net. It assumes you're using the
[datagrid widget example](/hypereval/widgets-samples-mysql-datagrid) from Hypereval to measure the Micro
datagrid, and it uses the _"Magic Forest"_ skin from Micro, which doesn't include any external fonts.
The other numbers were among some of the first example pages I found as I Googled _"ExtJS/Infragistics/Telerik/DevExpress
web datagrid"_.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a column chart, illustrating
 * bandwidth consumption of some of the more popular datagrids
 * out there, compared to the Micro datagrid.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Bandwidth conumption in KB
      micro.widgets.chart.column
        data
          Micro:96.6
          Telerik:1100
          Infragistics:1300
          DevExpress:1600
          ExtJS:2100
      label
        innerValue:Hint, smaller is better ...
```

So arguably, at least in regards to bandwidth consumption, the Micro MySQL datagrid performs up to 21
times faster, or at least consumes up to 1/21th of the bandwidth as some of the other datagrids out there does.
Which of course makes it blistering fast for phones, and other devices that doesn't have the luxury of a high
bandwidth connection. An although, some of the examples from some of the other datagrid vendors, would arguably
require some more code to implement in the Micro MySQL datagrid - I don't think I know about one feature from
their feature set that would not be possible to create using the Micro MySQL datagrid, assuming you're fetching
your data from a MySQL database of course.

If you'd rather like to see a pie chart, you can find one below, made with the same numbers as the one above.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a pie chart, illustrating
 * bandwidth consumption of some of the more popular datagrids
 * out there, compared to the Micro datagrid.
 */
create-widgets
  micro.widgets.modal
    widgets
      h3
        innerValue:Bandwidth conumption in KB
      micro.widgets.chart.pie
        data
          Micro:96.6
          Telerik:1100
          Infragistics:1300
          DevExpress:1600
          ExtJS:2100
```
