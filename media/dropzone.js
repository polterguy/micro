/*
 * Micro, copyright 2014 - 2017, Thomas Hansen, thomas@gaiasoul.com
 * 
 * This file is part of Micro.
 *
 * Micro is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3, as published by
 * the Free Software Foundation.
 *
 *
 * Micro is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Phosphorus Five.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * If you cannot for some reasons use the GPL license, Micro
 * is also commercially available under Quid Pro Quo terms. Check 
 * out our website at http://gaiasoul.com for more details.
 */
(function () {

    // Constructor.
    p5.dropzone = function (hoverClass, dropClass, errorClass, filter, multiple, url, onfinish, onbegin) {

        // Initializing.
        this._cssClass = document.body.className;
        this._hoverClass = hoverClass;
        this._dropClass = dropClass;
        this._errorClass = errorClass;
        this._filter = (filter == '' ? [] : filter.split('|'));
        this._multiple = multiple;
        this._url = url;
        this._onfinish = onfinish;
        this._onbegin = onbegin;
        this._file = p5.$('micro-page-dropzone-file').el;

        // Storing this as "self" to have access to it inside of event handlers further down.
        var self = this;

        // Handling onchange event on file input element.
        this._file.addEventListener('change', function () {self.onFileInputChanged();});

        // Then the DOM event handler for what happens when a file is dropped unto widget.
        document.body.addEventListener('drop', function (e) { self.onDrop(e);}, false);

        // Then the DOM event handler for what happens when a file is dragged over it.
        document.body.addEventListener('dragover', function (e) {self.onDragOver(e);}, false);

        // Then the DOM event handler for what happens when the user drags the file away from our widget.
        document.body.addEventListener('dragleave', function (e) {self.onDragLeave(e);}, false);

        // Storing instance.
        p5.dropzone.instance = this;
    };


    /*
     * Allows you to show the "browse for file" window explicitly.
     *
     * Notice, this is an "API" function, allowing you to invoke it from your own
     * code, if you have a button for instance, that explicitly allows the user to
     * browse for files, to be uploaded using the uploaded logic.
     *
     * Notice, you are responsible yourself to stop the propagation of the function,
     * such that the clicking of your button, doesn't propagate, and reloads your page,
     * etc - If you invoke this function from a button.
     *
     * To invoke from a button onclick event handler for instance, you could use the following code;
     * "p5.dropzone.browse();event.stopPropagation(true);return false;"
     */
    p5.dropzone.browse = function () {

        // Making sure we set the file input's value to null, in case user tries to upload the same file once more later.
        p5.dropzone.instance._file.value = null;

        // Clicks the file input element.
        p5.dropzone.instance._file.click ();
    };


    // Triggered when file input's value was changed.
    p5.dropzone.prototype.onFileInputChanged = function () {

        // Forwarding to common uploader function.
        this.uploadFiles(this._file.files);
    };


    // Invoked when user drops a file unto surface of main widget.
    p5.dropzone.prototype.onDrop = function (e) {

        // Making sure we prevent default logic, since that would simply load up the files in browser.
        e.preventDefault ();

        // Forwarding to common uploader function.
        this.uploadFiles (e.dataTransfer.files);
    };


    // Triggered when file input's value was changed.
    p5.dropzone.prototype.uploadFiles = function (files) {

        // Checking if file input's files are accepted as valid input.
        if (!this.checkFile (files)) {

            // File input is not valid, making sure we provide visual clues to user by setting its error CSS class.
            // Also making sure we remove the error CSS class after one second, such that we can set it again later successfully,
            // in case user does something else later, that also triggers an error.
            document.body.el.className = this._cssClass + " " + this._errorClass;
            var self = this;
            setTimeout(function () { document.body.className = self._cssClass; }, 1000);

        } else {

            // Checking if we actually have any files to push, and if so, starting the pushing, and changing the CSS class of widget.
            if (files.length > 0) {

                // Changing CSS class to the specified "drop" CSS class.
                document.body.className = this._cssClass + " " + this._dropClass;

                // Creating a batch id.
                function guid_new() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }

                // Uploading file(s).
                this._onbegin();
                var self = this;
                var length = files.length, no = 0, has_error = 0, uid = guid_new ();

                // Looping through each file, and pushing it towards our specified endpoint.
                for (var i = 0; i < files.length; i++) {
                    var xhr = new XMLHttpRequest(), fd = new FormData();
                    xhr.open('POST', this._url, true);
                    xhr.onreadystatechange = function() {
                        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                            document.body.className = this._cssClass;
                            if (this.responseText === 'ERROR') {
                                has_error += 1;
                            }
                            if (++no == length) {
                                self._onfinish(uid, no, has_error);
                            }
                        }
                    };
                    fd.append('file', files[i]);
                    fd.append('batch', uid)
                    xhr.send(fd);
                }
            }
        }
    };


    // Invoked when a dragleave operation occurs.
    p5.dropzone.prototype.onDragLeave = function (e) {

        // Preventing default, and setting back CSS class to default class.
        e.preventDefault();
        document.body.className = this._cssClass;
    };


    // Invoked when a dragover operation occurs.
    p5.dropzone.prototype.onDragOver = function (e) {

        // Verifying that it's actually a file that's being dragged here.
        var dt = e.dataTransfer;
        if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {

            // Preventing default, and setting CSS class to "hover class".
            e.preventDefault();
            document.body.className = this._cssClass + " " + this._hoverClass;
        }
    };


    // Checks if all files are valid extensions according to initialization of object.
    // Notice, for security reasons, this logic is mirrored on the server.
    // However, to create an "early abort" for file types, and input, not accepted, we also do it here ...
    // This avoids user from uploading huge files, only to get a message that his huge file(s) was not accepted after having spent
    // tons of bandwidth and waiting for the file(s) to upload.
    p5.dropzone.prototype.checkFile = function (files) {

        // Checking if user provided multiple files, and only one is allowed.
        if (this._multiple === false && files.length > 1) {

            // Widget only allows uploading one file, and multiple files were provided.
            return false;
        }

        // Checking if current instance has a filter.
        if (this._filter.length == 0) {

            // No filters, accepting everything.
            return true;
        }

        // Looping through files, making sure they match at least one of our filters.
        for (var idx = 0; idx < files.length; idx++) {

            // Filter(s) were provided, looping through them all, to verify file extension can be found in at least one of the filters provided.
            var splits = files[idx].name.split('.');
            var ext = splits[splits.length - 1];
            var found = false;
            for (var idxSplit = 0; idxSplit < this._filter.length; idxSplit++) {
                if (this._filter[idxSplit] == ext) {
                    found = true;
                    break;
                }
            }
            if (!found) {

                // File's extension was not found in our filters.
                // Hence, file(s) were not accepted.
                return false;
            }
        }

        // All files were accepted as input.
        return true;
    };
})();
