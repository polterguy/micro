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
     * Main wrapper namespace object for speak parts of Phosphorus Five.
     */
    p5.speech = {};
    p5.speech._chain = [];


    /*
     * Function that speaks a given "txt" in a given "voice", resorting to default voice if no voice is given.
     *
     * Notice, "voice" can be for instance "en-US", or it can be "Samantha,en-US" or it can be "Fred".
     * If a name is given, this function will search for the specified name, and use that if it can, otherwise resort to the
     * first voice matching the "locale" parts after the ",".
     */
    p5.speech.speak = function (txt, voice, onfinish, pitch, rate) {

        /*
         * Notice, we only start our "chain execution" for the first object that is added to our queue.
         */
        if (p5.speech._chain.push (new p5.speech.utter (txt, voice, onfinish, pitch, rate)) == 1) {
            p5.speech.next ();
        }
    }

    /*
     * Functions that accepts speech input from user using the given "lang" as the language to do speech recognition for.
     *
     * Optionall pass in an onfinish function, which will be invoked with the event as "e" once speech has been captured.
     */
    p5.speech.listen = function (lang, onfinish) {

        /*
         * Notice, we only start our "chain execution" for the first object that is added to our queue.
         */
        if (p5.speech._chain.push (new p5.speech.recognition (lang, onfinish)) == 1) {
            p5.speech.next ();
        }
    }

    /*
     * Executes the next element in queue.
     *
     * Notice, this little chain trick, ensures that all of our speech utterings and
     * recognition objects are executed in FIFO order (First In First Out).
     *
     * This allows us to invoke multiple [micro.speak] invocations for instance, and
     * intermix with multiple [micro.listen] invocations, in the same request, and yet
     * still have all our invocations execute in an orderly fashion, doing everything they're
     * supposed to do, according to which position they have in their queue.
     */
    p5.speech.next = function () {

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
                exe.onfinish (exe);
            }

            /*
             * Removes the object we just executed from our queue, and checks to see if
             * we have more objects in our queue, at which point we execute the next object.
             */
            p5.speech._chain.splice (0,1);
            if (p5.speech._chain.length != 0) {
                p5.speech.next ();
            }
        });
    }




    /*
     * "Utter class constructor", wrapping speech synthesis.
     */
    p5.speech.utter = function (txt, voice, onfinish, pitch, rate) {

        /*
         * Creating and decorating our "utterance" object, in addition to
         * storing our onfinish and voice arguments for later.
         */
        this.utter = new SpeechSynthesisUtterance (txt);
        this.voice = voice;
        this.onfinish = onfinish;
        this.utter.pitch = pitch;
        this.utter.rate = rate;
    }

    /*
     * Cache of all voices in system.
     */
    p5.speech.utter._voices = null;

    /*
     * "Interface" function for executing an "utter object".
     */
    p5.speech.utter.prototype.do = function (onfinish) {

        /*
         * Checking if voices have already been initialised, and cached, and if not,
         * making sure we query our voices first, before we execute our speech synthesis utterance object.
         */
        if (p5.speech.utter._voices != null) {

            /*
             * Voices have already been queried previously, hence we can speak the given text immediately.
             */
            this.utter.onend = function() {onfinish ()};
            this.utter.voice = p5.speech.utter.findVoice (this.voice);

            /*
             * If we didn't find the specified voice, we simply show an alert.
             */
            if (this.utter.voice != null) {
                window.speechSynthesis.speak (this.utter);
            } else {
                throw "The voice '" + this.voice + "' was not found.";
            }

        } else {

            /*
             * Voices have not been initialised before, hence we'll need to fetch them, and then afterwards
             * invoke ourself again.
             */
            var self = this;
            p5.speech.queryVoices (function(){self.do (onfinish)});
        }
    }

    /*
     * Returns the first voice matching the given "voice" argument.
     */
    p5.speech.utter.findVoice = function (voice) {

        /*
         * Retrieving the specified voice, such that we support all possible permutations.
         *
         * Notice, we support multiple different formats of "voice", for instance "Veronica,en-US", "en-US", 
         * "en" and "Veronica".
         */
        var voiceEntities = voice.split(",");
        var voices = p5.speech.utter._voices.filter (function (ix) {

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
            voices = p5.speech.utter._voices.filter (function (ix) {return ix.lang == voiceEntities [1]});
        }

        /*
         * Returning first matching voice to caller.
         */
        return voices [0];
    }




    /*
     * "Recognition class", wrapping speech recognition.
     */
    p5.speech.recognition = function (lang, onfinish) {

        // Setting properties for speech recognition object.
        this.lang = lang;
        this.onfinish = onfinish;
    }

    p5.speech.recognition.prototype.do = function (whendone) {
        this.recognise (whendone);
    }

    p5.speech.recognition.prototype.recognise = function (whendone) {
        if (window.SpeechRecognition == null && 
            window.webkitSpeechRecognition == null && 
            window.mozSpeechRecognition == null && 
            window.msSpeechRecognition == null) {
            alert("Your browser doesn't support speech recognition. Hint; Google Chrome does!");
            return;
        }
        this.rec = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        this.rec.lang = this.lang;
        var self = this;
        this._handled = false;
        this.rec.onresult = function(e) {
            if (self._handled != true) {
                self._handled = true;
                self.recognised = e.results[0][0].transcript;
                whendone.apply (self);
            }
        };
        this.rec.onend = function(event) {
            if (self._handled != true) {
                self.recognised = '';
                whendone.apply (self);
            }
        }
        this.rec.start();
    }

    p5.speech.recognition.prototype.stop = function () {
        this.rec.abort ();
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




    /*
     * "Query voices class", will query the available voices on the client, and
     * invoke a specified callback when done, passing in all voices that exists on
     * the client.
     */
    p5.speech.query_voices = function (widget) {
        this.widget = widget;
    }

    /*
     * Function that queries the speechSynthesis object, and sends the supported voices back to the server.
     *
     * "widget" must be the ID of an Ajax widget that contains an [.ondone] Ajax event.
     * This [.ondone] Ajax event, will be invoked when all voices have been retrieved, and one "p5-speech-voice.XXX" HTTP
     * POST parameter will be passed in, for each voice the client supports.
     * The locale/language of the voice, will be the value of the HTTP POST parameter(s).
     */
    p5.speech.query_voices.prototype.do = function (onfinish) {

        /*
         * Invoking common function to query voices, passing in a callback which will
         * invoke our server once querying is done.
         */
        p5.speech.queryVoices (onfinish)
    }

    /*
     * "onfinish" callback for the "query_voices" class, which will invoke the
     * server passing in the existing voices.
     */
    p5.speech.query_voices.prototype.onfinish = function () {
        p5.$(this.widget).raise('.onfinish', {
            onbefore: function (pars, evt) {
                for (var ix = 0; ix < p5.speech.utter._voices.length;ix++) {
                    var cur = p5.speech.utter._voices[ix];
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
    p5.speech.queryVoices = function (onfinish) {

        /*
         * Creating a callback function for our "onvoicechanged" event.
         */
        var getVoices = function (whendone) {
            p5.speech.utter._voices = window.speechSynthesis.getVoices ();
            if (p5.speech.utter._voices && p5.speech.utter._voices.length > 0) {
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
})();