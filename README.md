# Micro

Micro is a microscopic CSS framework. It can be used stand alone as a pure CSS framework, but is 
also a perfect companion with [Phosphorus Five](https://github.com/polterguy/phosphorusfive). 
It was created because of Bootstrap being too big, and other smaller framework not having the 
necessary features. Most of the existing CSS framework were also too JavaScript centric - Including Bootstrap.

**Notice**, Micro does *not* mix well with Bootstrap, which among other things implies that
none of these examples can be seen very well in System42's Executor. If you wish to reproduce
these examples, using System42, you'll have to create a lambda CMS page, and make sure you set
its _"template"_ settings to _"empty"_.

Micro creates a default layout, not based upon CSS classes for the most parts, which means it does not
mix well with other CSS frameworks, such as e.g. Bootstrap. It is tiny in size, and contains most
of the widgets you'll need in your day to day work with Phosphorus Five. It contains 2 CSS files.

* _"/micro/media/main.css"_ - Styles most common elements, such as buttons, checkboxes, etc.
* _"/micro/media/ext.css"_ - Styles the extension widgets, such as the modal widget, tab widget, etc.

## General layout

In general, Micro does as little as possible. However, most of your HTML elements, will have some sort of sane styling applied
to them. This means that it becomes tiny, while at the same time, leaving the design parts of your page up to you.
Below is a screenshot of what you may expect.

![alt screenshot](screenshots/screenshot-1.png)

As you can see, there are no fancy fonts, and little layout in general, since Micro only solves the bare minimum expected from every page you create - Leaving the rest up to you to explicitly solve as you wish. This implies that it doesn't _"end up as much in your way"_, as you apply your own custom design to your site, as you see fit. This trait of Micro also results in a __tiny__ bandwidth consumption.

In addition to a general sane default styling of your HTML elements, most form HTML elements also have some styling for you, that
will create a sane starting ground for your web apps. Below is another screenshot showing you what you may expect.

![alt screenshot](screenshots/screenshot-2.png)

The above shows how your form elements will end up looking like, if they're embedded inside of a _"strip"_. All form elements can
also obviously be instantiated as stand-alone elements.

The color profile of Miro is easily overridden by changing a couple of CSS variables, allowing you to change the colors of all elements,
by changing only a handful of variables.

## Grid system

Micro has its own grid system based upon the _"flexbox"_ model. This means among other things, that you can create as many or as few
columns as you wish in your page. Below is some example code that will create two rows, with a different set of columns each.

```
p5.web.include-css-file:@MICRO/media/main.css
set-widget-property:cnt
  class:container
create-widget
  class:row
  widgets
    literal
      class:col
      innerValue:Column 1
    literal
      class:col
      innerValue:Column 2
create-widget
  class:row
  widgets
    literal
      class:col
      innerValue:Column 1
    literal
      class:col
      innerValue:Column 2
    literal
      class:col
      innerValue:Column 3
```

Notice, you need to embed your content inside of either a _"container"_ or a _"container-fullscreen"_ element. Which is normally
done either by changing the CSS class of your main root widget, or appending a widget with the mentioned CSS classes inside of this widget
again. In the above example, we change the main root widget _"cnt"_ CSS class to container.

Inside of each _"container"_ you'll need a _"row"_. Each row can have as many _"col"_ items as you wish. Each col will share the
total available width, according to how many columns you add to a specific row.

The _"container"_ element will have a maximum width of 1120px and automatic margins to the left and right. The _"container-fullscreen"_ will 
use all available width. You can have as many containers as you wish on your page, and as many rows as you wish inside of each container.

### Responsive rendering

Micro does feature _"responsive rendering"_, which means that if your screen resolution drops below 800px, each column, regardless of its definition,
will automatically pop out, and require 100% of the available width. Micro is created with the _"mobile first"_ approach.

### Explicit column width

You can also explicitly set a column's width, with one of the following CSS classes.

* col-10
* col-20
* col-25
* col-30
* col-33
* col-40
* col-50
* col-60
* col-67
* col-70
* col-75
* col-80
* col-90
* col-100

For instance, if you want to have two columns, where your first column is 33 percent of your page's width, you could use the following.

```
p5.web.include-css-file:@MICRO/media/main.css
set-widget-property:cnt
  class:container
create-widget
  class:row
  widgets
    literal
      class:col-33
      innerValue:Column 1
    literal
      class:col-67
      innerValue:Column 2

```

The total width of your columns must result in 100. If it exceeds 100, it will wrap the next column unto the next line.

## Form elements

Most form elements can simply be instantiated, without any CSS classes associated with them, and they will render with the style
associated with them correctly. If you wish, you can also add any form elements inside of a _"strip"_, which will make all
form elements inside of your strip become "associated" with each other, creating a toolbar kind of effect.

If you want to add a radiobutton or a checkbox into your strip though, you'll have to wrap these elements inside of a _"span"_
element. Below is an example of creating a strip.

```
p5.web.include-css-file:@MICRO/media/main.css
set-widget-property:cnt
  class:container
create-widget
  class:row
  widgets
    container
      class:col-100 strip
      widgets
        label
          innerValue:Foo
        input
          type:text
          placeholder:Foo ...
        span
          widgets
            input:my-check
              type:checkbox
        label
          innerValue:Check
          for:my-check
        button
          innerValue:OK
```

The above will result in something resembling the following.

![alt screenshot](screenshots/screenshot-3.png)

## Extension widgets

Micro contains some extension widgets which are documented below. All of these extension widgets, will automatically include
the relevant CSS files.

### [micro.widgets.modal]

A tiny modal widget, allowing you to easily create modal windows in your apps. Example usage can be found below.

```
create-widgets
  micro.widgets.modal:modal-widget-1
    class:micro-modal
    widgets
      h3
        innerValue:Menu widget
      p
        innerValue:You just clicked a link in the menu widget.
      div
        class:right
        widgets
          button
            innerValue:Close
            onclick
              delete-widget:modal-widget-1
```

The above code will create a simple modal window, with a button allowing you to close your window.
The most important argument to this Active Event is the **[widgets]** argument, which is a collection of widgets,
that will become the "content" parts of your modal widget.

All other arguments, such as for instance the above **[class]** argument, will be automatically appended into the 
root element of your widget. The modal window expects a **[class]** property of _"micro-modal"_.

Below is a screenshot of how this will end up looking like.

![alt screenshot](screenshots/screenshot-7.png)

### [micro.widgets.tab]

This is a tab control type of widget. An example of usage can be found below.

```
create-widget
  class:container
  widgets
    container
      class:row prepend-top
      widgets
        div
          class:col-100
          widgets
            micro.widgets.tab
              class:micro-tab
              view
                name:First
                widgets
                  h4
                    innerValue:First view
                  p
                    innerValue:This is the first view in your tab.
              view
                name:Second
                widgets
                  h4
                    innerValue:Second view
                  p
                    innerValue:Second view
              view
                name:Third
                widgets
                  h4
                    innerValue:Third view
                  p
                    innerValue:This is our third view
```

Your **[micro.widgets.tab]** widget needs a collection of one or more **[view]**s. Each view becomes a single tabview, and
needs at least a **[name]** and a **[widgets]** collection. The name becomes the name of your view, and also the text of the buttons
that allows you to change the active view. The **[widgets]** collection, becomes the content of your views.

All other arguments to your **[view]**s becomes appended into the main container widget of your specific view.

The tab widget needs a **[class]** property of _"micro-tab"_ to function correctly. If you wish, you can add an additional CSS class
to it, to create borders around the tab widget. If you want to have borders, make sure you also add the _"micro-tab-border"_ CSS class 
to it when instantiating it. This will create some additional padding for your tab widgets though, which means that the content of your 
tab views will not be perfectly aligned with the rest of the content on your page.

Below is a screenshot of how the above code will end up appearing on your site.

![alt screenshot](screenshots/screenshot-6.png)

### [micro.widgets.menu]

Although you could create a "nav" element in Micro by hand, Micro also contains one helper Active Event extension widget for you, that easily allows you to create Ajax and/or hyperlinks menus. A menu must have exactly one **[items]** collection. Each child node beneath your items, becomes a menu item. Each menu
item, can either have an **[onclick]** for Ajax callbacks, an **[href]** for URL navigation, or its own child **[items]** collection. You should
in general not combine these, but choose only one for a single menu item.

The name of your child node beneath your **[items]** collection, becomes the friendly name displayed to the user. The value is an optional
explicit ID for the actual anchor element of your menu. Below is an example of creating a menu.

```
create-widget:content-menu
  class:container-fullscreen
  events
  widgets
    micro.widgets.menu
      items
        Click me
          onclick
            set-widget-property:x:/../*/_event?value
              innerValue:I was clicked
        Dropdown 1
          items
            GitHub for P5
              href:"https://github.com/polterguy/phosphorusfive"
              target:_blank
            Click me to!:some-item
              onclick
                set-widget-property:some-item
                  innerValue:I was also clicked
            Sub items
              items
                My blog
                  href:"https://gaiasoul.com"
                  target:_blank
                Click me three!
                  onclick
                    set-widget-property:x:/../*/_event?value
                      innerValue:I was also clicked!
```

The above will result in something like the following
![alt screenshot](screenshots/screenshot-4.png)

You can combine URL menu items having an **[href]** argument, with other menu items having an **[onclick]** Ajax lambda callback. But you should
not create menu items that have both of these constructs. All arguments besides from **[onclick]**, **[href]** and **[items]** becomes
appended into the main anchor widget of your menu item. Above you can see an example of how we added a **[target]** attribute to our widget,
which makes sure the page the menu item is linking to is opened up in another tab. To override the rendering of specific menu items, you could
for instance add a **[class]** attribute, which would change the rendering of your anchor element, inside of your "li" widget.

The menu will expand its items upon "hover", but for each item with a sub-menu, it can also explicitly be clicked, which will add an "expanded"
CSS class to the "ul" element, forcing it to open, also for clients that doesn't handle the hover effect - Such as some tablets and smartphones.
This implies that it is very friendly for clients running touch-screens and similar constructs.

#### Responsive rendering

If the client has less than 800px in width, the menu will collapse, and render a _"hamburger button"_, allowing you to explicitly expand the entire
menu. This is useful for small devices, such as smartphones, etc. Below is a screenshot of the same menu we created above, except the client has
been resized to illustrate how it will look like on smaller devices.

![alt screenshot](screenshots/screenshot-5.png)

The _"hamburger button"_ in the top right corner toggles the expansion of your menu.

## Performance

Micro really is **microscopic**. Among other things, the total bandwidth usage for the kitchen sink example for its extension widgets
ticks in at roughly **25KB**. This includes all CSS and JavaScript on your page, in addition to the initial page load and HTML of your page in total. The number
of HTTP requests is 4. Compare this to most other Ajax control vendors, who often have several megabytes of bandwidth in their initial
rendering, and often hundreds of HTTP requests.

In general, Micro is at least 2 orders of magnitudes smaller in bandwidth consumption than literally anything else out there!

To verify this for yourself, create a new lambda page in System42, set its "template" settings to "empty", and paste in the following code, which will show you the "kitchen sink" example.

```
sys42.utilities.execute-lambda-file:@MICRO/samples/ext.hl
```

See the screenshot below, demonstrating how Google Chrome's Network inspector shows you 21KB.

![alt screenshot](screenshots/screenshot-8.png)

In the above page, we have multiple modal widgets, multiple tab widgets, and a fairly complex menu. Still it ticks in at 21KB. Simply displaying the Ajax menu example for most other Ajax libraries, will often download megabytes of JavaScript, HTML and CSS.

To see a video demonstrating some of its features, and the bandwidth consumption differences, you can 
check out [this YouTube video](https://www.youtube.com/watch?v=amVnm5uHB1sg).
