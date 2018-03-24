## Extension widgets - File

This widget will load up all Hyperlambda files from the specified **[folder]**, and/or files, and treat these
files' content as children widgets of itself. It is useful for creating toolbars with plugins, encapsulating
each toolbar item, into a separate file. Usage can be found below. Notice, this code doesn't evaluate without
an exception, since you highly likely don't have the specified **[folder]** on your system.

```hyperlambda
/*
 * Our actual file widget.
 */
micro.widgets.file
  class:strip right toolbar
  folder:/some-folder/in-your-system/with-a-bunch-of-hyperlambda-files/
  widgets
```

You can also in addition to a **[folder]** argument, supply a **[widgets]** argument, and/or a
**[files]** arguments. The latter is expected to contain a bunch of files that points to individual
Hyperlambda files, which contains a widget declaration.
