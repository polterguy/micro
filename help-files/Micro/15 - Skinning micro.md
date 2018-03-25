## Skinning Micro

The skinning system in Micro is cleverly created using CSS variables. This allows you to easily create your own
skins, without having to consciously think much about CSS selectors, etc. To see an example of a skin, you can
evaluate the snippet below, which will open up the _"Aztec"_ skin for you in a Hyper IDE editor.

```hyperlambda-snippet
/*
 * Verifying Hyper IDE is open.
 */
if
  hyper-ide.is-open
  not

  /*
   * Warning user.
   */
  micro.windows.info:This example only works from Hyper IDE
  return

/*
 * Using Hyper IDE's API to open up the "Aztec" CSS skin file.
 */
hyper-ide.folder-explorer.select-path:/modules/micro/media/skins/aztec.css
```

The Aztec skin loads up a Google font, and changes a couple of CSS selectors. However, most of the _"heavy lifting"_,
as you can clearly see, is implemented by simply changing some few CSS variables. This makes it easy to create
your own skin for Micro, even if you don't know any CSS. Below is a list of the CSS variables you can
modify, and their default values.

```css
:root {
    --font-size: 16px;
    --font-break-size: var(--font-size);
    --color: #555;
    --background: #fbfbfb;
    --button-color: #777;
    --button-background: linear-gradient(#f9f9f9, #b0b0b0);
    --button-toggled-background: linear-gradient(#b0b0b0, #f9f9f9);
    --anchor-color: #5959c9;
    --anchor-hover-color: #007;
    --anchor-active-color: #77e;
    --form-element-color: #777;
    --form-element-background-color: #fdfdfd;
    --form-element-active-background: #ffffff;
    --form-element-disabled-color: #aaa;
    --form-element-disabled-background-color: #e5e5e5;
    --form-element-padding: .5rem;
    --placeholder-color: #ccc;
    --border-color: #bbb;
    --border-radius: .25rem;
    --shadow-color: rgba(0,0,0,.4);
    --success-background: linear-gradient(#efe,#afa);
    --warning-background: linear-gradient(#fee,#fcc);
    --max-viewport-width: 1120px;
    --table-striped-background: rgba(0,0,0,.05);
    --table-selected-background: rgba(0,0,0,.1);
    --table-hover-background: rgba(0,0,0,.1);
    --code-background: var(--background);
}
```

Notice, to allow for nice transitions on buttons, and similar types of elements, the `linear-gradient` parts
of your buttons will only use the top 50% of its values, while consuming the bottom 50% of their values
when activated ot hovered.

If you'd like to create a skin, which only changes the font size of your installation to for instance 24px -
Then you can easily accomplish that by creating a CSS file with the following content, at which point the rest
of your site's appearance will use the default values from the main Micro CSS file.

```css
:root {
    --font-size: 24px;
}
```

**Notice**, Hyper IDE contains a _"create skin wizard"_, which even allows you to follow a graphical user
interface, with preview, to create your skins. No CSS knowledge (really) required. To use the skin wizard,
make sure you select the `/micro/media/skins/` folder in Hyper IDE's folder explorer, and click the _"star"_
button. At which point your screen will resemble the following.

https://phosphorusfive.files.wordpress.com/2018/03/screenshot-skin-wizard.png

The skin wizard will dynamically fetch all CSS variables from _"micro.css"_, and create a textbox for
each possible CSS variable, allowing you to fill out its value, creating your own skin. In its preview
tab view, it will show the results for you visually, with some random widgets displayed. When you're
happy with your skin, you can click the _"Generate"_ button, at which point you'll be asked for a name
for your skin.

After you have generated your skin, you can manually edit it in Hyper IDE, to add your own CSS custom
things - If you want to ...
