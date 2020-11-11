if (app) {
    const Fs = require('./core/fs');
    app.bind('fs', new Fs);
}