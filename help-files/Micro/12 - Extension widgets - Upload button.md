## Extension widgets - Upload button

The **[micro.widgets.upload-button]** encapsulates the process of uploading files to your server. It simply
creates a button, which allows you to upload one (or multiple) files to your server. It requires an
**[.onupload]** lambda callback, which will be evaluated with a **[files]** argument once the user has
uploaded one or more files to your server. It will store the uploaded files in your user's _"/temp/"_ folder.
Below is an example of usage.

```hyperlambda-snippet
/*
 * Creates a modal widget with an upload-button widget.
 */
create-widgets
  micro.widgets.modal
    widgets

      pre:upload-result
        innerValue:result ...

      /*
       * Our actual upload-button widget.
       */
      micro.widgets.upload-button
        multiple
        .onupload
          set-widget-property:upload-result
            innerValue:x:/..
```

You can optionally pass in a **[multiple]** argument, to allow for multiple files to be uploaded at the same
time. All other arguments becomes directly added to the button itself, allowing you to override its class
or style property, etc. You can also optionally pass in a **[accept]** argument, which should be a comma
separated file extension list of accepted file extensions, such as e.g. _".png,.jpg,.jpeg,.gif"_.

**Notice** - The **[physical-file]** argument which is passed into your lambda callback, is the physical
filename of the uploaded file on your server, while the **[original-filename]** argument, is the filename
that was supplied by the client, and the file's original filename. It is necessary to create a unique
filename on the server like we do above, since otherwise we might risk multiple file uploading processes,
with similar filenames, overwriting each others' files.

After the uploading is complete, you are responsible yourself to move the file to whatever folder you want to
permanently store the file within, and/or delete the file from the user's _"/temp/"_ folder. All files are
uploaded to the currently logged in user's _"/temp/"_ folder.
