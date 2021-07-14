import { expect } from "chai";
import glob from "glob-promise";
import { it, describe, beforeEach } from "mocha";
import { unlink, existsSync } from "fs";
import { promisify } from "util";
import { src, dest } from "gulp";
import sharpResponsive from "../lib";
import imageSize from "image-size";

const asyncUnlink = promisify(unlink);
const FILE_NAME = "image";
const FILE_EXTENSION = "jpg";

beforeEach(async () => {
	const files = await glob(__dirname + "/misc/dest/img/*.{png,jpg}");
	const fileDeletions = files.map(file => asyncUnlink(file));

	await Promise.all(fileDeletions);
});

describe("width", () => {
	it("should output an image of the given width", (done) => {
		const imageDestPath = __dirname + `/misc/dist/img/${FILE_NAME}-sm.${FILE_EXTENSION}`;
		const img = src(__dirname + "/misc/src/img/*.{jpg,png}")
			.pipe(sharpResponsive({
				formats: [
					{ width: 400, rename: { suffix: "-sm" } }
				]
			}))
			.pipe(dest(__dirname + "/misc/dist/img"))
			.on("finish", () => {
				expect(existsSync(imageDestPath)).to.be.true;
				expect(imageSize(imageDestPath).width).to.be.equal(400);

				done();
			});
	});
});
