## Extension widgets - CodeMirror

This widget creates a CodeMirror editor for you, that allows you to edit code on your page, providing syntax
highlighting for more than 100 programming languages, in addition to autocomplete, and many more features.
Below is an example of creating a JavaScript editor.

```hyperlambda-snippet
/*
 * Creates a modal widget with a CodeMirror widget.
 */
create-widgets
  micro.widgets.modal
    widgets

      /*
       * Our CodeMirror widget.
       */
      micro.widgets.codemirror
        class:air-bottom
        mode:javascript
        value:@"
function foo() {
  alert('Holla senior!');
}
foo();"
```

The most important arguments to the CodeMirror widget is as follows.

* __[auto-focus]__ - If true, the editor will get initial focus
* __[height]__ - Height in pixels, percent or any other unit for editor, e.g. _"300px"_
* __[mode]__ - Language mode for editor, e.g. _"htmlmixed"_, _"hyperlambda"_ or _"javascript"_, etc. Defaults to _"hyperlambda"_
* __[keys]__ - CodeMirror keyboard-shortcut to JavaScript callback list. E.g. `Ctrl-T:function(){alert('x');}`
* __[value]__ - Initial value of editor
* __[.data-field]__ - Data field name, used when for instance serialising editor's content
* __[theme]__ - Optional theme override. If not given, will use the user's settings, defaulting to _"phosphorus"_
* __[font-size]__ - Optional font size for content. If not given, will use user's settings, defaulting to 9.25pt if no settings exists
* __[tab-size]__ - Optional tab size. Defaults to 2

The CodeMirror widget also support retrieving and setting its value property. Below are the events that allows you
to programmatically retrieve or change its value from Hyperlambda.

* __[micro.widgets.codemirror.get-value]__ - Returns the value of the specified __[\_arg]__ CodeMirror instance
* __[micro.widgets.codemirror.set-value]__ - Sets the value of the specified __[\_arg]__ CodeMirror instance to the spcified __[value]__ value

In addition, the CodeMirror widget will also track whether or not it is _"dirty"_, which means that its value has
been edited since its content was set somehow. You can retrieve the _"dirty"_ status of your CodeMirror instance,
by simply serializing your form, using the **[micro.form.serialize]** event, and for instance pass in the ID
of your CodeMirror instance. This event is documented elsewhere in the documentation for Micro.

### Skinning or changing your CodeMirror "theme"

The CodeMirror widget has 57 different themes you can select from, which you can find in the
_"/micro/media/codemirror/theme/" folder_. If no theme is explicitly supplied, it will use the theme
settings for the currently logged in user, and if no such setting exists, it will default to the
_"phosphorus"_ theme. The language modes are the modes supported by CodeMirror can be found in the
_"/micro/media/codemirror/mode/"_ folder.

By default, the CodeMirror widget has the following default keyboard shortcuts.

* __Tab__ - Indent code
* __Shift+Tab__ - De-indent code
* __Ctrl+Space__ - Display autocompleter (__Cmd+Space__ on Mac)
* __Alt+F__ - Persistent search dialog
* __Ctrl+F__ or __Cmd+F__ (Mac) - Search in document
* __Ctrl+G__ or __Cmd+G__ (Mac) - Go to next search result in document
* __Alt+M__ - Maximize CodeMirror widget (fills entire browser surface)
* __Shift+Ctrl+F__ - Replace in document
* __Alt+G__ - Go to specified line number
* __Ctrl+Z__ or __Cmd+Z__ - Undo
* __Shift+Ctrl+Z__ or __Shift+Cmd+Z__ - Redo

### Supported languages

The supported **[mode]** for the CodeMirror editor is as follows. Not all of these have good autocompletion,
and the support for different languages vary. But below are all the officially supported modes, according
to CodeMirror's website. Hyperlambda support is very strong, since it's implemented in Phosphorus Five
as a plugin mode. HTML, XML, CSS and JavaScript support is also very strong. The JavaScript autocomplete
object is populated from the _"current JavaScript context"_ on your page though - So you might benefit from
somehow actually being able to execute the JavaScript from your CodeMirror editor, to have autocomplete
access to whatever its content is producing.

* apl
* asciiarmor
* asn.1
* asterisk
* brainfuck
* clike (C#, C++, C, Java, etc)
* clojure
* cmake
* cobol
* coffescript
* commonlisp
* crystal
* css
* cypher
* d
* dart
* diff
* django
* dockerfile
* dtd
* dylan
* ebnf
* ecl
* eiffel
* elm
* erlang
* factor
* fcl
* forth
* fortran
* gas
* gfm
* gherkin
* go
* groovy
* haml
* handlebars
* haskell
* haskell-iterate
* haxe
* htmlembedded
* htmlmixed
* http
* hyperlambda (default mode)
* idl
* javascript
* jinja2
* jsx
* julia
* livescript
* lua
* markdown
* mathematica
* mbox
* mirc
* mllike
* modelica
* mscgen
* mumps
* nginx
* nsis
* ntriples
* octave
* oz
* pascal
* pegjs
* perl
* php
* pig
* powershell
* properties
* protobug
* pug
* puppet
* python
* q
* r
* rpm
* rst
* ruby
* rust
* sas
* sass
* scheme
* shell
* sieve
* slim
* smalltalk
* smarty
* solr
* soy
* sparql
* spreadsheet
* sql
* stylus
* swift
* tcl
* textile
* tiddlywiki
* tiki
* toml
* tornado
* troff
* ttcn
* ttcn-cfg
* turtle
* twig
* vb
* vbscript
* velocity
* verilog
* vhdl
* vuew
* webidl
* xml
* xquery
* yacas
* yaml
* yaml-frontmatter
* z80
