const mix = require('laravel-mix');

const chokidarWatch = require('chokidar').watch;
const argv = require('yargs');
const events = {};

class BfgMix {

    constructor() {
        this.options = {
            path: '**/*.php',
            enabled: true,
            debug: false,
            chokidar: {
                ignoreInitial: true,
                ignored: /^vendor.*/,
            }
        };
    }

    /**
     * Get an extension name
     * @returns {string}
     */
    name() {
        return 'BFG';
    }

    /**
     * Get a dependencies
     * @returns {array[]}
     */
    dependencies() {
        return ['chokidar'];
    }

    /**
     * Get an extension name
     * @param {object} options
     * @returns {void}
     */
    register(options) {
        this.options = Object.assign(this.options, options || {});
    }

    /**
     * Booting up the extension
     * @returns {void}
     */
    boot() {
        if(!this.options.enabled) return;

        chokidarWatch(this.options.path, this.options.chokidar)
            .on('all', (event, path) => {
                Object.keys(events).map((key) => {
                    if (this.string_is(`${key}`, `${event}${path}`)) {
                        events[key].map((cb) => {
                            if (typeof cb === 'function') {
                                cb(path, event)
                            } else if (typeof cb === 'string') {
                                const { exec } = require("child_process");
                                exec(`cd  ${work_dir} && ${cmd.replace('{event}', event).replace('{path}', path)}`)
                            }
                        })
                    }
                });
                this.log('[' + event + '] ' + path);
            });
    }

    /**
     * Log a message if debug option is enabled
     * @param {string} message
     * @returns {void}
     */
    log(message) {
        if(this.options.debug === true) {
            console.log(this.name() + ': ' + message);
        }
    }

    /**
     * Test is string
     * @param pattern
     * @param text
     * @returns {boolean}
     */
    string_is (pattern, text) {

        pattern = pattern
            .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\#-]', 'g'), '\\$&')
            .replace(/\\\*/g, '.*');

        return (new RegExp(pattern + '$', 'u')).test(text);
    }
}


module.exports = BfgMix;
mix.extend('watch', function (info, path, cb) {
    if (!(path in events)) {
        events[path] = [cb];
    } else {
        events[path].push(cb);
    }
});
mix.extend('bfg', new BfgMix());