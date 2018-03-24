
## Extension widgets - Grid

The grid widget allows you to easily create dynamic tables, to display lists and columns of data.
These types of widgets are often called _"datagrids"_. To create a grid widget, you could do
something like the following.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a grid widget inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our actual datagrid.
       */
      micro.widgets.grid
        class:hover striped
        columns
          Name
          Phone
          Address
        rows
          item
            Name:Thomas Hansen
            Phone:90909090
            Address:Foo bar st. 57
          item
            Name:John Doe
            Phone:98989898
            Address:Foo bar st. 67
          item
            Name:Jane Doe
            Phone:37474747
            Address:Foo bar st. 77
```

In our above example, we are overriding the CSS **[class]** argument of our grid. This will render our
main table element with the CSS class of `hover striped`, which are CSS classes that modifies the look
and feel of an HTML table from Micro.

Notice, the grid widget has two important arguments, both of which are optional arguments. These are as follows.

* __[columns]__ - Contains the headers for your grid
* __[rows]__ - Contains you grid's (initial) rows or items

The **[columns]** argument cannot be changed after creation of your grid, but the **[rows]** argument
can be dynamically _"databound"_, to change your grid's content, after you have created it.
To dynamically databind your grid, you can use the **[micro.widgets.grid.databind]**
event. This allows you to dynamically change its content, to allow for _"paging"_ and _"filtering"_.
Below is an example that is databinding the grid from above only as the user clicks a button.


```hyperlambda-snippet
/*
 * A "databind" example of the grid widget.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our actual datagrid.
       */
      micro.widgets.grid:my-grid
        class:striped
        columns
          Name
          Phone
          Address

      /*
       * This button dynamically "databinds" the grid.
       */
      button
        innerValue:Databind grid
        onclick

          /*
           * Dynamically databinds the datagrid we created above.
           */
          micro.widgets.grid.databind:my-grid
            item
              Name:Thomas Hansen
              Phone:90909090
              Address:Foo bar st. 57
            item
              Name:John Doe
              Phone:98989898
              Address:Foo bar st. 67
            item
              Name:Jane Doe
              Phone:37474747
              Address:Foo bar st. 77
```

### Widgets as cell content

Notice, the structure for your **[micro.widgets.grid.databind]** event, and the grid's initial **[rows]**
argument are similar, and in fact, you can create highly rich grids, allowing for your grid to contain
widgets and hierarchies of widgets in its items. Below is an example of a more _"complex"_ grid structure.

```hyperlambda-snippet
/*
 * This grid contains a button in its first column.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our actual datagrid.
       */
      micro.widgets.grid
        class:hover
        columns
          Name
          Phone
          Address
        rows
          item

            /*
             * Notice, here we have a cell that contains a button,
             * instead of simply statically render a piece of text.
             */
            Name
              widgets
                button
                  innerValue:Thomas Hansen
                  onclick
                    micro.windows.info:Thomas was clicked

            Phone:90909090
            Address:Foo bar st. 57
          item
            Name
              widgets
                button
                  innerValue:John Doe
                  onclick
                    micro.windows.info:John was clicked

            Phone:98989898
            Address:Foo bar st. 67
```

You can add widgets to all cells as you see fit, to create a grid, that contains any widgets you can
legally create with Phosphorus Five. If you do, you cannot supply a value to your item, as illustrated
above.

You can also create header cells with such **[widgets]** collections.
