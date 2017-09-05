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
    p5.dropzone = function (widget, cssClass, hoverClass, dropClass, errorClass, filter, multiple, url) {

        // Initializing.
        this._widget = p5.$(widget);
        this._cssClass = cssClass;
        this._hoverClass = hoverClass;
        this._dropClass = dropClass;
        this._errorClass = errorClass;
        this._filter = (filter == '' ? [] : filter.split('|'));
        this._multiple = multiple;
        this._url = url;
        this._file = p5.$(widget).el.childNodes[0];

        // Storing this as "self" to have access to it inside of event handlers further down.
        var self = this;

        // Handling onchange event on file input element.
        this._file.addEventListener('change', function () {self.onFileInputChanged();});

        // Then the DOM event handler for what happens when a file is dropped unto widget.
        this._widget.el.addEventListener('drop', function (e) { self.onDrop(e);}, false);

        // Then the DOM event handler for what happens when a file is dragged over it.
        this._widget.el.addEventListener('dragover', function (e) {self.onDragOver(e);}, false);

        // Then the DOM event handler for what happens when the user drags the file away from our widget.
        this._widget.el.addEventListener('dragleave', function (e) {self.onDragLeave(e);}, false);
    };


    // Allows you to show the "browse for file" window explicitly.
    p5.dropzone.prototype.browse = function () {

        // Clicks the file input element.
        this._file.click ();
    };


    // Triggered when file input's value was changed.
    p5.dropzone.prototype.onFileInputChanged = function () {

        // Forwarding to common uploader function.
        this.uploadFiles(this._file.files);

        // Making sure we set the file input's value to null, in case user tries to upload the same file once more later.
        this._file.value = null;
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
            this._widget.el.className = this._cssClass + " " + this._errorClass;
            var self = this;
            setTimeout(function () { self._widget.el.className = self._cssClass; }, 1000);

        } else {

            // Checking if we actually have any files to push, and if so, starting the pushing, and changing the CSS class of widget.
            if (files.length > 0) {

                // Changing CSS class to the specified "drop" CSS class.
                this._widget.el.className = this._cssClass + " " + this._dropClass;

                // Creating a batch id.
                function uuidv4() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }

                // Uploading file(s).
                var self = this;
                var length = files.length, no = 0, has_error = 0, uid = uuidv4();
                for (var i = 0; i < files.length; i++) {
                    var xhr = new XMLHttpRequest(), fd = new FormData();
                    xhr.open('POST', this._url, true);
                    xhr.onreadystatechange = function() {
                        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                            if (this.responseText === 'ERROR') {
                                has_error += 1;
                            }
                            if (++no == length) {
                                if (has_error != 0) {
                                    alert(has_error + ' file(s) were not accepted');
                                }
                                if (no == has_error) {
                                    //window.location.replace(window.location);
                                } else {
                                    //window.location.replace('{0}batch/{1}');
                                }
                            }
                        }
                    };
                    fd.append('file', files[i]);
                    fd.append('batch-id', uid)
                    xhr.send(fd);
                }
            }
        }
    };


    // Invoked when a dragleave operation occurs.
    p5.dropzone.prototype.onDragLeave = function (e) {

        // Preventing default, and setting back CSS class to default class.
        e.preventDefault();
        this._widget.el.className = this._cssClass;
    };


    // Invoked when a dragover operation occurs.
    p5.dropzone.prototype.onDragOver = function (e) {

        // Preventing default, and setting CSS class to "hover class".
        e.preventDefault();
        this._widget.el.className = this._cssClass + " " + this._hoverClass;
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
