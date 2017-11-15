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
        if (p5.speech._chain.push (new p5.speech.recognition (lang, onfinish)) == 1) {
            p5.speech.next ();
        }
    }

    /*
     * Executes the next element in queue.
     *
     * Notice, this little chain trick, ensures that all of our speech utterings and
     * recognition objects are executed in FIFO order.
     * This allows us to invoke multiple [micro.speak] invocations for instance, and
     * intermix with multiple [micro.listen] invocations, in the same request, and yet
     * still have all our invocations execute in an orderly fashion, doing everything they're
     * supposed to do.
     */
    p5.speech.next = function () {

        // Executes the first element in queue.
        p5.speech._chain[0].do.apply (p5.speech._chain[0], [function () {

            // Invokes the finish handler for currently handled element.
            p5.speech._chain[0].onfinish.apply (p5.speech._chain[0]);

            // Removes the first element from queue.
            p5.speech._chain.splice (0,1);

            // Checks to see if we have more elements in queue, and if so, executing next element.
            if (p5.speech._chain.length != 0) {
                p5.speech.next ();
            }
        }]);
    }




    /*
     * "Utter class", wrapping speech synthesis.
     */
    p5.speech.utter = function (txt, voice, onfinish, pitch, rate) {

        // Setting properties for utter object.
        this.txt = txt;
        this.voice = voice;
        this.pitch = pitch;
        this.rate = rate;
        this.onfinish = onfinish;
    }
    p5.speech.utter._voices = null;

    p5.speech.utter.prototype.do = function (whendone) {
        this.speak (whendone);
    }

    p5.speech.utter.prototype.speak = function (whendone) {
        if (p5.speech.utter._voices != null) {

            // Creating our utterance object, wrapping specified text that should be spoken.
            this.utter = new SpeechSynthesisUtterance (this.txt);
            var self = this;
            this.utter.onend = function() {whendone.apply (self)};
            this.utter.pitch = this.pitch;
            this.utter.rate = this.rate;

            // Retrieving the specified voice, such that we support all possible permutations.
            var voice = this.voice;
            var voices = p5.speech.utter._voices.filter (function (ix) {

                // Checking if voice contains both name and locale.
                if (voice.indexOf (',') != -1) {
                    return ix.name == voice.split(',')[0];
                }

                // "voice" is either a name or a locale.
                return ix.name == voice || ix.lang == voice;
            });

            /*
             * If voice was in "name,locale" format, and the "name" voice was not found, we must look for the first voice matching
             * the "locale" (meaning the parts after the ",").
             */
            if (voices.length == 0 && this.voice.indexOf(',') != -1) {
                voices = p5.speech.utter._voices.filter (function (ix) {return ix.lang == voice.split (',')[1]});
            }

            // Checking if we have a voice matching the one specified from caller.
            if (voices.length > 0) {

                // Speaking utterance object, with the first voice from our list of matches.
                this.utter.voice = voices [0];
                window.speechSynthesis.speak(this.utter);

            } else {

                // Unsupported voice was supplied.
                window.speechSynthesis.speak (new SpeechSynthesisUtterance ('That voice is not supported!'));
            }

        } else {
            var getVoices = function (whendone) {
                p5.speech.utter._voices = window.speechSynthesis.getVoices ();
                if (p5.speech.utter._voices && p5.speech.utter._voices.length > 0) {
                    this.speak (whendone);
                }
            }
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                var self = this;
                window.speechSynthesis.onvoiceschanged = function() {
                    getVoices.apply (self, [whendone]);
                }
            } else {
                getVoices.apply (this, [whendone]);
            }
        }
    }

    p5.speech.speak.stop = function () {
        (window.speechSynthesis || window.webkitSpeechSynthesis).cancel();
    }

    p5.speech.speak.pause = function () {
        (window.speechSynthesis || window.webkitSpeechSynthesis).pause();
    }

    p5.speech.speak.resume = function () {
        (window.speechSynthesis || window.webkitSpeechSynthesis).resume();
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
            self._handled = true;
            self.recognised = e.results[0][0].transcript;
            whendone.apply (self);
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

    p5.speech.recognition.stop = function () {
        if (p5.speech._chain.length == 0) {
            return;
        }
        var el = p5.speech._chain[0];
        if (el.stop !== undefined) {
            el.stop();
        }
    }




    /*
     * Function that queries the speechSynthesis object, and sends the supported voices back to the server.
     *
     * "widget" must be the ID of an Ajax widget that contains an [.ondone] Ajax event.
     * This [.ondone] Ajax event, will be invoked when all voices have been retrieved, and one "p5-speech-voice.XXX" HTTP
     * POST parameter will be passed in, for each voice the client supports.
     * The locale/language of the voice, will be the value of the HTTP POST parameter(s).
     */
    p5.speech.query = function (widget) {

        // Checking if voices has already been initialized.
        if (p5.speech.utter._voices) {

            // Voices are already initialized, invoking "_query" function immediately.
            p5.speech._query (widget);

        } else {

            // Voices have NOT been initialized yet, provding our callback function, for retrieving all available voices on client.
            window.speechSynthesis.onvoiceschanged = function() {

                // To avoid callback from being evaluated twice, we return "early" if it has already been invoked previously.
                if (p5.speech.utter._voices) {
                  return;
                }

                // Retrieving voices, and storing them, such that we don't need another roundtrip through here later.
                p5.speech.utter._voices = window.speechSynthesis.getVoices ();
                p5.speech._query (widget);
            }
        }
    }


    /*
     * Private implementation for the above.
     * Expects "p5.speech._sys42_speech_voices" to have already beein initialized.
     */
    p5.speech._query = function (widget) {
        p5.$(widget).raise('.onfinish', {
            onbefore: function (pars, evt) {
                for (var ix = 0; ix < p5.speak._voices.length;ix++) {
                    var cur = p5.speak._voices[ix];
                    pars.push (['p5-speech-voice.' + cur.name, cur.lang + ',' + cur.localService]);
                }
            }
        });
    }
})();