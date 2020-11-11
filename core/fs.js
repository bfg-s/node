const fs = require('fs');

module.exports = class Fs {

    stat (path) {
        return fs.lstatSync(path);
    }

    exists (path) {
        return fs.existsSync(path);
    }

    is_file (file) {
        return this.exists(file) ? this.stat(file).isFile() : false;
    }

    is_link (path) {
        return this.exists(path) ? this.stat(path).isSymbolicLink() : false;
    }

    is_dir (dir) {
        return this.exists(dir) ? this.stat(dir).isDirectory() : false;
    }

    mkdir (path) {
        return fs.mkdirSync(path, { recursive: true });
    }

    put_contents (file, content) {
        let dir = app.str.dirname(file);
        if (!this.is_dir(dir)) this.mkdir(dir);
        return fs.writeFileSync(file, content);
    }

    get_contents (file) {
        if (this.is_file(file)) {
            return fs.readFileSync(file).toString();
        }
        return '';
    }

    path (...paths) {
        let p = process.env.PWD;
        paths = paths.filter(i => typeof i == 'string').map(i => app.str.trim(i.trim(), '/')).join('/')
        if (paths !== '') { p = `/${app.str.trim(p, '/')}/${paths}` }
        return p;
    }
}