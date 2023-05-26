'use strict';

var through2 = require('through2');
var PluginError = require('plugin-error');
var sharp = require('sharp');
var rename = require('rename');
var Vinyl = require('vinyl');
var imageSize = require('image-size');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var through2__default = /*#__PURE__*/_interopDefaultLegacy(through2);
var PluginError__default = /*#__PURE__*/_interopDefaultLegacy(PluginError);
var sharp__default = /*#__PURE__*/_interopDefaultLegacy(sharp);
var rename__default = /*#__PURE__*/_interopDefaultLegacy(rename);
var Vinyl__default = /*#__PURE__*/_interopDefaultLegacy(Vinyl);
var imageSize__default = /*#__PURE__*/_interopDefaultLegacy(imageSize);

var getError = function (error) { return new PluginError__default['default']("gulp-sharp-responsive", error); };
/**
 * @credits https://www.npmjs.com/package/file-extension Had to copy the source code because TS would not let me import it (no commonJS nor ES6 exports).
 */
var getFileExtension = function (path) {
    var extension = (/[^./\\]*$/.exec(path) || [""])[0];
    if (extension === "jpg") {
        extension = "jpeg";
    }
    return extension.toLowerCase();
};
var getFormat = function (filePath, format) {
    if (typeof format === "string") {
        return format;
    }
    return getFileExtension(filePath);
};
var formatIsValid = function (format) { return ["jpeg", "png", "webp", "gif", "tiff", "avif", "heif"].includes(format); };
var addImageOptimizationStep = function (promise, format, option) {
    var updatedPromise = promise;
    if (format === "jpeg" && option.jpegOptions !== null && option.jpegOptions !== undefined && typeof option.jpegOptions === "object") {
        updatedPromise.jpeg(option.jpegOptions);
    }
    if (format === "png" && option.pngOptions !== null && option.pngOptions !== undefined && typeof option.pngOptions === "object") {
        updatedPromise.png(option.pngOptions);
    }
    if (format === "webp" && option.webpOptions !== null && option.webpOptions !== undefined && typeof option.webpOptions === "object") {
        updatedPromise.webp(option.webpOptions);
    }
    if (format === "gif" && option.gifOptions !== null && option.gifOptions !== undefined && typeof option.gifOptions === "object") {
        // @ts-ignore see issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52448
        updatedPromise.gif(option.gifOptions);
    }
    if (format === "avif" && option.avifOptions !== null && option.avifOptions !== undefined && typeof option.avifOptions === "object") {
        updatedPromise.avif(option.avifOptions);
    }
    if (format === "heif" && option.heifOptions !== null && option.heifOptions !== undefined && typeof option.heifOptions === "object") {
        updatedPromise.heif(option.heifOptions);
    }
    if (format === "tiff" && option.tiffOptions !== null && option.tiffOptions !== undefined && typeof option.tiffOptions === "object") {
        updatedPromise.tiff(option.tiffOptions);
    }
    return updatedPromise;
};
var updateFilePathWithDesiredFormat = function (originalFilePath, format) {
    var updatedFilePath = originalFilePath;
    var originalFileExtension = getFileExtension(originalFilePath);
    if (typeof format === "string" && originalFileExtension !== format) {
        updatedFilePath = rename__default['default'](updatedFilePath, {
            extname: "." + format,
        }).toString();
    }
    return updatedFilePath;
};
var index = (function (options) {
    return through2__default['default'].obj(function (file, encoding, callback) {
        var _this = this;
        if (file.isNull()) {
            this.emit('error', getError("File is null."));
            return callback(null, file);
        }
        if (file.isStream()) {
            this.emit('error', getError("Streams are not supported for the moment. If you think it should, please create an issue at https://github.com/khalyomede/gulp-sharp-responsive/issues"));
            return callback(null, file);
        }
        if (!file.isBuffer()) {
            this.emit("error", getError("Expected file to be a buffer."));
            return callback(null, file);
        }
        var promises = [];
        var _loop_1 = function (option) {
            var format = getFormat(file.path, option.format);
            if (!formatIsValid(format)) {
                this_1.emit("error", getError(file.path + ": invalid file format detected (" + format + ")."));
                return "continue";
            }
            var width = 0;
            // Processing width if it's an anonymous function
            if (typeof option.width === "function") {
                var fileSize = imageSize__default['default'](file.contents);
                if (fileSize.width === undefined) {
                    this_1.emit("error", getError(file.path + ": image size computation failed."));
                    return "continue";
                }
                if (fileSize.height === undefined) {
                    this_1.emit("error", getError(file.path + ": image size computation failed."));
                    return "continue";
                }
                width = option.width({ width: fileSize.width, height: fileSize.height });
                if (typeof width !== "number") {
                    this_1.emit("error", getError(file.path + ": callback must return a number."));
                    return "continue";
                }
            }
            else {
                width = option.width;
            }
            var promise = sharp__default['default'](file.contents, option.sharp !== undefined && option.sharp !== null && typeof option.sharp === "object" ? option.sharp : {})
                .rotate()
                .resize(width)
                // @ts-ignore FormatEnum from Sharp does not accepts strings, but documentation shows it accepts...
                .toFormat(format);
            promise = addImageOptimizationStep(promise, format, option);
            var filePath = file.path;
            if (option.rename) {
                if (typeof option.rename.extname === "string") {
                    this_1.emit("error", getError(file.path + ": detected rename.extname option, but it is insecure since this plugin take care of the output file extension (changing it may compromise the result)."));
                    return "continue";
                }
                filePath = rename__default['default'](filePath, option.rename).toString();
            }
            filePath = updateFilePathWithDesiredFormat(filePath, option.format);
            promises.push(promise.toBuffer().then(function (buffer) {
                _this.push(new Vinyl__default['default']({
                    base: file.base,
                    contents: buffer,
                    path: filePath,
                    _cachedKey: file._cachedKey,
                }));
            }));
        };
        var this_1 = this;
        for (var _i = 0, _a = options.formats; _i < _a.length; _i++) {
            var option = _a[_i];
            _loop_1(option);
        }
        Promise.all(promises).then(function () {
            callback(null, options.includeOriginalFile === true ? file : null);
        }).catch(function (error) { return _this.emit("error", getError(error)); });
    });
});

module.exports = index;
