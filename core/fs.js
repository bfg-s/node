const fs = require('fs');
const path = require('path');

module.exports = class Fs {

    read_dir (path) {
        if (Array.isArray(path)) path = this.path(...path);
        return fs.readdirSync(path);
    }

    stat (path) {
        if (Array.isArray(path)) path = this.path(...path);
        return fs.lstatSync(path);
    }

    exists (path) {
        if (Array.isArray(path)) path = this.path(...path);
        return fs.existsSync(path);
    }

    is_file (file) {
        if (Array.isArray(file)) file = this.path(...file);
        return this.exists(file) ? this.stat(file).isFile() : false;
    }

    is_link (path) {
        if (Array.isArray(path)) path = this.path(...path);
        return this.exists(path) ? this.stat(path).isSymbolicLink() : false;
    }

    is_dir (dir) {
        if (Array.isArray(dir)) dir = this.path(...dir);
        return this.exists(dir) ? this.stat(dir).isDirectory() : false;
    }

    mkdir (path) {
        if (Array.isArray(path)) path = this.path(...path);
        return fs.mkdirSync(path, { recursive: true });
    }

    put_contents (file, content) {
        if (Array.isArray(file)) file = this.path(...file);
        let dir = app.str.dirname(file);
        if (!this.is_dir(dir)) this.mkdir(dir);
        return fs.writeFileSync(file, content);
    }

    append_contents (path, data, options = {}) {
        if (Array.isArray(path)) path = this.path(...path);
        return fs.appendFileSync(path, data, options);
    }

    get_contents (file) {
        if (Array.isArray(file)) file = this.path(...file);
        if (this.is_file(file)) {
            return fs.readFileSync(file).toString();
        }
        return '';
    }

    get_json_contents (file) {
        if (Array.isArray(file)) file = this.path(...file);
        let json = [];
        if (this.is_file(file)) {
            try {json = JSON.parse(this.get_contents(file));} catch (e) {}
        }
        return json;
    }

    path (...paths) {
        let result = app.str.trim(path.join(...paths), '/');
        return result === '.' ? '/' : "/" + result;
    }

    base_path (...paths) {
        if (0 in paths) paths[0] = app.str.trim(paths[0], '/');
        return path.resolve(...paths);
    }

    get pwd () {
        return process.env.PWD;
    }
}