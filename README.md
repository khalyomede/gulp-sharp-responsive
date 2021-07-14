# gulp-sharp-responsive

A gulp plugin to generate responsives images.

[![Build Status](https://travis-ci.com/khalyomede/gulp-sharp-responsive.svg?branch=master)](https://travis-ci.com/khalyomede/gulp-sharp-responsive) [![npm](https://img.shields.io/npm/v/gulp-sharp-responsive)](https://www.npmjs.com/package/gulp-sharp-responsive) ![NPM](https://img.shields.io/npm/l/gulp-sharp-responsive)

## Summary

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Examples](#examples)
- [Options](#options)
- [Test](#test)

## About

I make web apps and I often need to generate images of multi formats and size from a single image. For example, an image "lion.jpeg", that is declined like this:

- lion-sm.jpeg
- lion-sm.webp
- lion-sm.avif
- lion-lg.jpeg
- lion-lg.webp
- lion-lg.avif

Sharp can do this, and since I use Gulp for my everyday tasks, I created a plugin to automatize this task.

## Features

- Based on [Sharp](https://github.com/lovell/sharp)
- Takes options to generate images by sizes and format
- Supports theses formats:
  - jpeg
  - png
  - gif
  - webp
  - avif
  - heif
  - tiff
- Can pass Sharp specific options to customize even more the image generation
- Written in TypeScript, so you get type hints for the options

## Installation

In your terminal:

```bash
npm install --save-dev gulp-sharp-responsive
```

With Yarn:

```bash
yarn add --dev gulp-sharp-responsive
```

## Examples

Sidenote: all the following example uses the TS version of gulpfile. This is why you will see ES6 syntaxes like "import ...".

If you are using the "classic" syntax (require), just convert the ES6 to CommonJS like following:

```js
// this
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

// becomes this
const { src, dest } = require("gulp");
const sharpResponsive = require("sharp-responsive");
```

Note that if you are using typescript, don't forget to add the "esModuleInterop" option to true in you `tsconfig.json` in order for the ES6 syntax mentioned above to work.

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

- [1. Generate image of different sizes](#1-generate-image-of-different-sizes)
- [2. Generate image of different formats](#2-generate-image-of-different-formats)
- [3. Include the original file in the output images](#3-include-the-original-file-in-the-output-images)
- [4. Pass format specific options](#4-pass-format-specific-options)
- [5. Pass sharp specific options](#5-pass-sharp-specific-options)
- [6. Use a callback to compute the width](#6-use-a-callback-to-compute-the-width)

### 1. Generate image of different sizes

In this example, we will generate a small and large image size from an image.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    formats: [
      { width: 640, rename: { suffix: "-sm" } },
      { width: 1024, rename: { suffix: "-lg" } },
    ]
  }))
  .pipe(dest("dist/img"));
```

### 2. Generate image of different formats

In this example, we will generate modern image format like webp and avif from an image.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    formats: [
      { width: 640, format: "webp" },
      { width: 640, format: "avif" },
    ]
  }))
  .pipe(dest("dist/img"));
```

### 3. Include the original file in the output images

In this example, we will tell the plugin to keep the original file to be outputed in the dist folder.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    includeOriginalFile: true,
  }))
  .pipe(dest("dist/img"));
```

### 4. Pass format specific options

In this example, we will use JPEG options to customize how we want our image to be generated.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    formats: [
      { width: 640, jpegOptions: { quality: 60, progressive: true } }
    ],
  }))
  .pipe(dest("dist/img"));
```

You can pass options for various formats. Here is all supported options and their documentation:

- [jpegOptions](https://sharp.pixelplumbing.com/api-output#jpeg)
- [pngOptions](https://sharp.pixelplumbing.com/api-output#png)
- [webpOptions](https://sharp.pixelplumbing.com/api-output#webp)
- [gifOptions](https://sharp.pixelplumbing.com/api-output#gif)
- [tiffOptions](https://sharp.pixelplumbing.com/api-output#tiff)
- [avifOptions](https://sharp.pixelplumbing.com/api-output#avif)
- [heifOptions](https://sharp.pixelplumbing.com/api-output#heif)

### 5. Pass sharp specific options

In this example, we will pass Sharp options to customize its behavior.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    formats: [
      { width: 640, sharp: { failOnError: false, density: 340 } }
    ],
  }))
  .pipe(dest("dist/img"));
```

Find all the available options in the [Sharp constructor documentation](https://sharp.pixelplumbing.com/api-constructor#sharp).

### 6. Use a callback to compute the width

In this example, we will use the file metadata to compute the width dynamically.

```typescript
import { src, dest } from "gulp";
import sharpResponsive from "gulp-sharp-responsive";

const img = () => src("src/img/**/*.{jpg,png}")
  .pipe(sharpResponsive({
    formats: [
      { width: (metadata) => metadata.width * 0.5 } // divides the original image width by 2
    ]
  }))
  .pipe(dest("dist/img"));
```

## Options

- [formats](#formats)
- [includeOriginalFile](#includeoriginalfile)
- [IFileMetadata](#ifilemetadata)

### formats

A list of transformations to operate on the file.

```typescript
format: [
  {
    width: number | ((metadata IFileMetadata) => number),
    format?: "jpeg" | "png" | "webp" | "gif" | "tiff" | "avif" | "heif",
    rename?: {
      dirname?: string,
      prefix?: string,
      basename?: string,
      suffix?: string,
      extname?: string,
    },
    sharp?: {
      // ...
    },
    jpegOptions?: {
      // ...
    },
    pngOptions?: {
      // ...
    },
    webpOptions?: {
      // ...
    },
    gifOptions?: {
      // ...
    },
    tiffOptions?: {
      // ...
    },
    avifOptions?: {
      // ...
    },
    heifOptions?: {
      // ...
    },
  },
];
```

### includeOriginalFile

Wether to include the original transformed file in the output or not. Default to false (not included).

```typescript
includeOriginalFile?: boolean,
```

### IFileMetadata

```typescript
interface IFileMetadata {
  width: number;
  height: number;
}
```

## Test

```bash
npm run test
```
