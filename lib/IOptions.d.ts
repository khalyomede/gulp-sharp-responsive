import IFormatOptions from "./IFormatOptions";
export default interface IOptions {
    /**
     * Wether to include the original file in the outputs or not. Default to false.
     */
    includeOriginalFile?: boolean;
    /**
     * A list of transformations to operate on your original files, such as declining your files in multiple file formats and sizes.
     */
    formats: Array<IFormatOptions>;
}
