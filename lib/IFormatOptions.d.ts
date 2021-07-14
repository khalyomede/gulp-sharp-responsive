import { Specification } from "rename";
import { SharpOptions, AvifOptions, GifOptions, HeifOptions, JpegOptions, PngOptions, TiffOptions, WebpOptions } from "sharp";
import IFileMetadata from "./IFileMetadata";
export default interface IFormatOptions {
    /**
     * Resizes the image to the given width. The height will be updated according to the image proportion (no deformations).
     */
    width: number | ((metadata: IFileMetadata) => number);
    /**
     * Options to rename your image.
     *
     * @see https://www.npmjs.com/package/rename
     */
    rename?: Specification;
    /**
     * The desired format of the image. Let it empty to keep the original format.
     */
    format?: FileFormat;
    /**
     * JPEG optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#jpeg
     */
    jpegOptions?: JpegOptions;
    /**
     * PNG optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#png
     */
    pngOptions?: PngOptions;
    /**
     * WEBP optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#webp
     */
    webpOptions?: WebpOptions;
    /**
     * GIF optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#gif
     */
    gifOptions?: GifOptions;
    /**
     * TIFF optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#tiff
     */
    tiffOptions?: TiffOptions;
    /**
     * AVIF optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#avif
     */
    avifOptions?: AvifOptions;
    /**
     * HEIF optimizations options.
     *
     * @see https://sharp.pixelplumbing.com/api-output#heif
     */
    heifOptions?: HeifOptions;
    /**
     * Sharp specific options for the image being processed.
     *
     * @see https://sharp.pixelplumbing.com/api-constructor#sharp
     */
    sharp?: SharpOptions;
}
