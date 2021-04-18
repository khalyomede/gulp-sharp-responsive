import { Transform } from "stream";
import through2 from "through2";
import PluginError from "plugin-error";
import sharp, { Sharp } from "sharp";
import rename from "rename";
import Vinyl from "vinyl";
import IOptions from "./IOptions";
import IFormatOptions from "./IFormatOptions";

const getError = (error: string | Error): PluginError => new PluginError("gulp-sharp-responsive", error);

/**
 * @credits https://www.npmjs.com/package/file-extension Had to copy the source code because TS would not let me import it (no commonJS nor ES6 exports).
 */
const getFileExtension = (path: string): string => {
    let extension = (/[^./\\]*$/.exec(path) || [""])[0];

	if (extension === "jpg") {
		extension = "jpeg";
	}

    return extension.toLowerCase();
};

const getFormat = (filePath: string, format?: FileFormat): string => {
	if (typeof format === "string") {
		return format;
	}

	return getFileExtension(filePath);
};

const formatIsValid = (format: string): boolean => ["jpeg", "png", "webp", "gif", "tiff", "avif", "heif"].includes(format);

const addImageOptimizationStep = (promise: Sharp, format: string, option: IFormatOptions): Sharp => {
	let updatedPromise = promise;

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

const updateFilePathWithDesiredFormat = (originalFilePath: string, format?: FileFormat): string => {
	let updatedFilePath = originalFilePath;
	const originalFileExtension = getFileExtension(originalFilePath);

	if (typeof format === "string" && originalFileExtension !== format) {
		updatedFilePath = rename(updatedFilePath, {
			extname: `.${format}`,
		}).toString();
	}

	return updatedFilePath;
};

export default (options: IOptions): Transform => {
	return through2.obj(function (file, encoding, callback) {
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

		const promises: Array<Promise<void | Buffer>> = [];

		for (const option of options.formats) {
			const format = getFormat(file.path, option.format);

			if (!formatIsValid(format)) {
				this.emit("error", getError(`${file.path}: invalid file format detected (${format}).`));

				continue;
			}

			let promise = sharp(file.contents, option.sharp !== undefined && option.sharp !== null && typeof option.sharp === "object" ? option.sharp : {})
				.resize(option.width)
				// @ts-ignore FormatEnum from Sharp does not accepts strings, but documentation shows it accepts...
				.toFormat(format);

			promise = addImageOptimizationStep(promise, format, option);

			let filePath = file.path;

			if (option.rename) {
				if (typeof option.rename.extname === "string") {
					this.emit("error", getError(`${file.path}: detected rename.extname option, but it is insecure since this plugin take care of the output file extension (changing it may compromise the result).`));

					continue;
				}

				filePath = rename(filePath, option.rename).toString();
			}

			filePath = updateFilePathWithDesiredFormat(filePath, option.format);

			promises.push(promise.toBuffer().then(buffer => {
				this.push(new Vinyl({
					base: file.base,
					contents: buffer,
					path: filePath,
				}));
			}));
		}

		Promise.all(promises).then(() => {
			callback(null, options.includeOriginalFile === true ? file : null);
		}).catch(error => this.emit("error", getError(error)));
	});
};
