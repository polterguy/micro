## Extension widgets - File

This widget will load up all Hyperlambda files from the specified **[folder]**, and/or **[files]** collection,
and treat these files' content as children widgets of itself. It is useful for creating toolbars with
plugins, encapsulating each toolbar item, into a separate folder, and/or bunch of specific files. Usage can
be found below. Notice, this code doesn't evaluate without an exception, since you highly likely don't
have the specified **[folder]** on your system.

```hyperlambda
/*
 * Our actual file widget.
 */
micro.widgets.file
  class:strip right toolbar
  folder:/some-folder/in-your-system/with-a-bunch-of-widget-hyperlambda-files/
```

You can also in addition to a **[folder]** argument, supply a **[widgets]** argument, and/or a
**[files]** arguments. The latter is expected to contain a bunch of files that points to individual
Hyperlambda files, which contains a widget declaration. Example can be found below.

```hyperlambda
/*
 * Our actual file widget.
 */
micro.widgets.file
  class:strip right toolbar
  files
    /some-folder/in-your-system/with-a-bunch-of-widget-hyperlambda-files/foo.hl
      style:"width:70%;"
    /some-folder/in-your-system/with-a-bunch-of-widget-hyperlambda-files/bar.hl
  widgets
    button
      innerValue:Foo bar
```

Notice, in the example above, we parametrized our _"foo.hl"_ file. All parameters beneath your individual
**[files]** items will be passed in to the file as arguments. You can also parametrise a **[folder]** argument
in a similar fashion, except (of course) all files inside of your folder will be paramatrised with the same
arguments.

The order of your **[folder]**, **[files]** and **[widgets]** arguments will be preserved, allowing you to
determine the ordering of your widgets accordingly.
