## Extension widgets - Tree

The tree extension widget, allows you to create a relational tree structure, similar to the
one we use in Hyper IDE for showing the files and folders. Below is an example of a tree
widget that will traverse the folders on your server.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a tree widget
 * inside of it, that allows you to browse your folders
 * in your P5 installation.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * This is our treeview widget.
       */
      micro.widgets.tree
        items
          root:/

        /*
         * This one will be invoked when the tree needs items.
         * It will be given an [_item-id] argument.
         *
         * We simply list the folders of the item the tree needs
         * children for here.
         */
        .onexpand
          list-folders:x:/../*/_item-id?value
          for-each:x:/@list-folders/*?name
            split:x:/@_dp?value
              =:/
            add:x:/../*/return/*
              src:@"{0}:{1}"
                :x:/@split/0/-?name
                :x:/@_dp?value
          return
            items
```

The **[micro.widgets.tree]** extension widget, at the very least needs an **[items]** collection, with
at least one item beneath it. This becomes the tree's _"root item"_, or items (plural form) if you wish.
The tree widget will invoke its **[.onexpand]** lambda argument when it needs more items, passing in
an **[\_item-id]** argument, being the _"ID"_ of the item it needs to retrieve the children for. In our
above example we are expliting this fact, by simply using the folders themselves as _"ID"_. You can also
choose to handle selection of items, by supplying an **[.onselect]** lambda argument. Below is an example.

```hyperlambda-snippet
/*
 * Creates a modal widget, with a tree widget inside of it.
 */
create-widgets
  micro.widgets.modal
    widgets
      micro.widgets.tree
        items
          root:/

        /*
         * Handling selection of items, simply showing
         * an info window with the "ID" of the item that
         * was selected.
         */
        .onselect
          micro.windows.info:x:/../*/items/0?name
            class:micro-windows-info success

        /*
         * This one will be invoked when the tree needs items.
         */
        .onexpand
          list-folders:x:/../*/_item-id?value
          for-each:x:/@list-folders/*?name
            split:x:/@_dp?value
              =:/
            add:x:/../*/return/*
              src:@"{0}:{1}"
                :x:/@split/0/-?name
                :x:/@_dp?value
          return
            items
```

The **[micro.widgets.tree]** widget can also be rendered in _"menu mode"_, which is useful if you want to
create an hierarchical _"navbar type of widget"_. If you want to do this, you can override its default
**[class]** property, and set its CSS class to `micro-widgets-tree micro-widgets-tree-navbar`. This will
create a responsive navbar/menu widget, instead of a tree view widget. Below is an example.

```hyperlambda-snippet
/*
 * Modal widget.
 */
create-widgets
  micro.widgets.modal
    class:micro-widgets-modal large
    widgets
      micro.widgets.tree

        // Notice the CSS class below!
        class:micro-widgets-tree micro-widgets-tree-navbar
        items
          root:/

        /*
         * Expansion.
         */
        .onexpand
          list-folders:x:/../*/_item-id?value
          for-each:x:/@list-folders/*?name
            split:x:/@_dp?value
              =:/
            add:x:/../*/return/*
              src:@"{0}:{1}"
                :x:/@split/0/-?name
                :x:/@_dp?value
          return
            items
```

### Tree widget's API

You can programmatically interact with the tree, to for instance retrieve its currently selected item(s),
set its currently selected item(s), and so on. To change the currently selected item, you can use the
**[micro.widgets.tree.select-items]** event. This event require an **[items]** collection, with
an argument beneath it, for each item you want to select. Below is an example of a piece of code
that would accomplish this.

```hyperlambda
/*
 * Selects the "/modules/" items, in the "id-of-your-tree" tree.
 */
micro.widgets.tree.select-items:id-of-your-tree
  items
    /modules/
```

To retrieve the currently selected item(s) you can use the **[micro.widgets.tree.get-selected-items]** event.

To delete one or more items, invoke the **[micro.widgets.tree.delete-items]** event, and pass in an **[items]**
collection, resembling that of when selecting item(s).

To _"refetch"_ an item's children, re-invoking its **[.onexpand]**, you can use
the **[micro.widgets.tree.refresh-items]** event. This event also require an **[items]** collection.

The **[micro.widgets.tree.toggle-items]** toggles all supplied **[items]**, but can in addition be given
a **[force-expand]** argument - At which point it will never collapse an item, but only expand items.

To see more of how to use the tree, in more complex scenarios, you can see the code for Hyper IDE, which
consumes it internally. Hyper IDE illustrates refreshing a tree view item, when for instance a file
or folder is deleted. It also illustrates toggling items, and auto expanding items initially, deleting
items, etc.

