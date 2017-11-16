/*
 * Phosphorus Five, copyright 2014 - 2017, Thomas Hansen, thomas@gaiasoul.com
 * 
 * This file is part of Phosphorus Five.
 *
 * Phosphorus Five is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3, as published by
 * the Free Software Foundation.
 *
 *
 * Phosphorus Five is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Phosphorus Five.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * If you cannot for some reasons use the GPL license, Phosphorus
 * Five is also commercially available under Quid Pro Quo terms. Check 
 * out our website at http://gaiasoul.com for more details.
 */

(function() {


    /*
     * Main wrapper namespace object for speech parts of Phosphorus Five.
     * Both speech recognition and speech synthesis.
     *
     * This file contains 3 "classes", coupled with their factory constructor functions.
     * The factory functions are as follows.
     *
     * - p5.speech.speak, which will speak some arbitrary text, parametrised accordingly.
     * - p5.speech.listen, which will listen for input using speech recognition.
     * - p5.speech.query_voices, which will query the client for what voices it supports.
     *
     * Each object created using the above factory functions, will be executed in an orderly
     * fashion, as FIFO (First In First Out), and each object will be "chained", such that
     * once the first object is finished executing, the second object will execute its logic, etc.
     *
     * This allows us to create multiple "listen", "query_voices" and "speak" objects, and have them
     * executed in orderly fashion, such that once the first is done executing, the next will execute, etc.
     *
     * Each instance of our objects in our chain, is expected to at the very least have an instance "do" function,
     * in addition to optionally an "onfinish" callback, which will be executed once the object is done with
     * doing what it's supposed to do.
     */

    /*
     * Main "namespace object" for everything related to speech synthesis and speech recognition.
     */
    p5.speech = {};

    /*
     * This is our "chain of objects".
     *
     * It's basically a "FIFO chain" of 3 different "types"; "utter", "recognition" and "query_voices".
     * All of these three types conforms to a common "API", which is that they have an instance function
     * called "do", and (optionally) an instance function called "onfinish".
     */
    p5.speech._chain = [];

    /*
     * Pushes a new instance into our chain, and checks to see if this is the first instance,
     * at which point we start executing our chain.
     */
    p5.speech._push = function (instance) {
        if (p5.speech._chain.push (instance) == 1) {
            p5.speech._next ();
        }
    }

    /*
     * List of all supported voices for the current client.
     */
    p5.speech._voices = null;

    /*
     * Helper function for executing objects in our chain.
     *
     * Executes the next element in queue, waits for it to finish, and then executes
     * the next object in our "queue".
     *
     * Notice, this little chain trick, ensures that all of our speech utterings and
     * recognition objects are executed in FIFO order (First In First Out).
     *
     * This allows us to invoke multiple [micro.speak] invocations for instance, and
     * intermix with multiple [micro.listen] invocations, in the same request, and yet
     * still have all our invocations execute in an orderly fashion, doing everything they're
     * supposed to do, according to which position they have in their queue.
     */
    p5.speech._next = function () {

        /*
         * Executes the first element in queue, making sure once object has been executed,
         * we are able to execute the next object in our chain.
         */
        var exe = p5.speech._chain [0];
        exe.do (function () {

            /*
             * Checks if current object has an onfinish callback, and if so, we make sure we execute it.
             */
            if (exe.onfinish !== undefined) {
                exe.onfinish ();
            }

            /*
             * Removes the object we just executed from our queue, and checks to see if
             * we have more objects in our queue, at which point we execute the next object.
             */
            p5.speech._chain.splice (0,1);
            if (p5.speech._chain.length != 0) {
                p5.speech._next ();
            }
        });
    }




    /*
     * "Utterance constructor".
     *
     * Notice, "voice" can be for instance "en-US", or it can be "Samantha,en-US" or it can be "Fred".
     * If a name is given, this function will search for the specified name, and use that if it can, otherwise resort to the
     * first voice matching the "locale" parts after the ",".
     */
    p5.speech.speak = function (txt, voice, onfinish, pitch, rate) {

        /*
         * Pushing our speech synthesis wrapper into our chain.
         */
        p5.speech._push (new p5.speech._utter (txt, voice, onfinish, pitch, rate));
    }

    /*
     * "Utter class constructor", wrapping speech synthesis.
     */
    p5.speech._utter = function (txt, voice, onfinish, pitch, rate) {

        /*
         * Creating and decorating our "utterance" object, in addition to
         * storing our onfinish and voice arguments for later.
         */
        this.ssu = new SpeechSynthesisUtterance (txt);
        this.voice = voice;
        this.onfinish = onfinish;
        this.ssu.pitch = pitch;
        this.ssu.rate = rate;
    }

    /*
     * "Interface" function for executing an "utter object".
     */
    p5.speech._utter.prototype.do = function (onfinish) {

        /*
         * Checking if voices have already been initialised, and cached, and if not,
         * making sure we query our voices first, before we execute our speech synthesis utterance object.
         */
        if (p5.speech._voices != null) {

            /*
             * Voices have already been queried previously, hence we can speak the given text immediately.
             */
            this.ssu.onend = function() {onfinish ()};
            this.ssu.voice = p5.speech._utter.findVoice (this.voice);

            /*
             * If we didn't find the specified voice, we simply show an alert.
             */
            if (this.ssu.voice != null) {
                window.speechSynthesis.speak (this.ssu);
            } else {
                throw "The voice '" + this.voice + "' was not found.";
            }

        } else {

            /*
             * Voices have not been initialised before, hence we'll need to fetch them, and then afterwards
             * invoke ourself again.
             */
            var self = this;
            p5.speech._queryVoices (function(){self.do (onfinish)});
        }
    }

    /*
     * Returns the first voice matching the given "voice" argument.
     */
    p5.speech._utter.findVoice = function (voice) {

        /*
         * Retrieving the specified voice, such that we support all possible permutations.
         *
         * Notice, we support multiple different formats of "voice", for instance "Veronica,en-US", "en-US", 
         * "en" and "Veronica".
         */
        var voiceEntities = voice.split(",");
        var voices = p5.speech._voices.filter (function (ix) {

            /*
             * Checking if voice contains both name and locale, meaning e.g. "Veronica,en-US".
             */
            if (voiceEntities.length == 2) {

                /*
                 * Voice contains both name and locale, e.g. "Veronica,en-US".
                 */
                return ix.name == voiceEntities [0];

            } else {

                /*
                 * Voice is either "en-US" or "Veronica" style, but not both.
                 */
                return ix.name == voice || ix.lang == voice;
            }
        });

        /*
         * If voice was in "name,locale" format, and the "name" voice was not found, we must look for the first voice matching
         * the "locale" (meaning the parts after the ",").
         */
        if (voices.length == 0 && voiceEntities.length == 2) {
            voices = p5.speech._voices.filter (function (ix) {return ix.lang == voiceEntities [1]});
        }

        /*
         * Returning first matching voice to caller.
         */
        return voices [0];
    }




    /*
     * "Speech recognition constructor".
     *
     * Optionally pass in an onfinish function, which will be invoked once speech has been captured.
     */
    p5.speech.listen = function (lang, onfinish) {

        /*
         * Pushing our speech recognition wrapper into our chain.
         */
        p5.speech._push (new p5.speech._recognition (lang, onfinish));
    }

    /*
     * "Speech recognition class constructor", wrapping speech recognition.
     */
    p5.speech._recognition = function (lang, onfinish) {

        // Setting properties for speech recognition object.
        this.lang = lang;
        this.onfinish = onfinish;
    }

    /*
     * "Interface" function for executing a "speech recognition object".
     */
    p5.speech._recognition.prototype.do = function (whendone) {

        /*
         * Verifying that the client supports speech recognition, and if not, warning user through an alert.
         */
        if (window.SpeechRecognition == null && 
            window.webkitSpeechRecognition == null && 
            window.mozSpeechRecognition == null && 
            window.msSpeechRecognition == null) {

            alert("Your browser doesn't support speech recognition. Hint; Google Chrome does!");

            /*
             * Making sure we invoke "onfinish", to allow for the next object in chain to be executed,
             * before we return.
             */
            whendone ();
            return;
        }

        /*
         * Creating and decorating our SpeechRecognition object, making sure we 
         * support all possibly different browser implementations.
         */
        this._rec = new (
            window.SpeechRecognition || 
            window.webkitSpeechRecognition || 
            window.mozSpeechRecognition || 
            window.msSpeechRecognition)();
        this._rec.lang = this.lang;

        /*
         * Notice, we'll need to keep track of whether or not we should actually care about anything
         * being recognised, to be able to support "abort" speech recognition, in addition to situations
         * where nothing was spoken, or recognised.
         *
         * In addition, we also need to reference "this" in events.
         */
        var self = this;
        this._handle = true;

        /*
         * This event is invoked when something has been captured by the speech recognition engine.
         */
        this._rec.onresult = function(e) {
            if (self._handle == true) {
                self._handle = false;
                self.recognised = e.results[0][0].transcript;
                whendone ();
            }
        };

        /*
         * This event is invoked when speech recognition has ended, either due to something having
         * been recognised, or because of a timeout.
         */
        this._rec.onend = function(event) {
            if (self._handle == true) {
                self.recognised = '';
                whendone ();
            }
        }
        this._rec.start();
    }

    /*
     * Helper function to abort speech recognition.
     */
    p5.speech._recognition.prototype.stop = function () {
        this._rec.abort ();
    }




    /*
     * "Query voices constructor".
     *
     * Will query the available voices on the client, and invoke a server side Ajax method once done.
     */
    p5.speech.queryVoices = function (widget) {

        /*
         * Pushing our voices query wrapper into our chain.
         */
        p5.speech._push (new p5.speech.query_voices (widget));
    }

    /*
     * "Query voices class constructor", wrapping the querying of supported voices on the client.
     */
    p5.speech.query_voices = function (widget) {

        /*
         * Creating and decorating our "query_voices" object.
         */
        this.widget = widget;
    }

    /*
     * "Interface" function for executing a "query voices object".
     */
    p5.speech.query_voices.prototype.do = function (onfinish) {

        /*
         * Invoking common function to query voices, passing in a callback which will
         * invoke our server once querying is done.
         */
        var self = this;
        p5.speech._queryVoices (function(){self.onfinish ();onfinish ();})
    }

    /*
     * "onfinish" callback for the "query_voices" class, which will invoke the
     * server passing in the existing voices.
     */
    p5.speech.query_voices.prototype.onfinish = function () {

        /*
         * Notice, we expect the given "this.widget" to be the HTML ID of an element
         * which have an [.onfinish] lambda callback which we can invoke, passing in
         * the voices from the client as a bunch of additional HTTP POST parameters.
         */
        p5.$(this.widget).raise('.onfinish', {
            onbefore: function (pars, evt) {
                for (var ix = 0; ix < p5.speech._voices.length;ix++) {
                    var cur = p5.speech._voices [ix];
                    pars.push (['p5-speech-voice.' + cur.name, cur.lang + ',' + cur.localService]);
                }
            }
        });
    }




    /*
     * Common "static" helper function.
     *
     * Queries the voices, caches them, and invokes the given "onfinish" callback once done.
     */
    p5.speech._queryVoices = function (onfinish) {

        /*
         * Checking to see if voices have already been queried, at which point
         * we immediately invoke callback, and return early.
         */
        if (p5.speech._voices) {
            onfinish ();
            return;
        }

        /*
         * Creating a callback function for our "onvoicechanged" event.
         */
        var getVoices = function (whendone) {
            p5.speech._voices = window.speechSynthesis.getVoices ();
            if (p5.speech._voices && p5.speech._voices.length > 0) {
                onfinish ();
            }
        }

        /*
         * Checking if the current browser supports the "onvoicechanged" event, which
         * might not necessarily be the case, since different browsers implement this part
         * of the Speech API differently.
         */
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = function() {
                getVoices (onfinish);
            }
        } else {
            getVoices (onfinish);
        }
    }

    p5.speech.stop = function () {
        if (p5.speech._chain.length == 0) {
            return;
        }

        // Making sure we stop any listeners, if any.
        var el = p5.speech._chain[0];
        if (el.stop !== undefined) {
            el._handled = true;
            el.stop();
        }
        (window.speechSynthesis || window.webkitSpeechSynthesis).cancel();
        p5.speech._chain = [];
    }
})();