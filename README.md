# Azuki Elementals Image Fetcher

## Overview

Azuki Elementals Image Fetcher is a dedicated repository designed to automatically fetch and update image data for revealed Azuki Elementals. This process is executed via a [GitHub workflow](https://github.com/miffycs/azuki-elementals-image-fetch/blob/master/.github/workflows/main.yml) scheduled to run **every 5 minutes**.

## Data Accessibility

We provide you with a variety of options to access the data according to your needs:
- [JSON format (data.json)](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.json)
- [JavaScript format (data.js)](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.js)
- [CSV format (data.csv)](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.csv)

Feel free to download the files directly or leverage them as a reference database using the provided links.

For users who are only interested in obtaining a specific image, please refer to our guide below.

## Guide to Image URL Construction

Azuki Elementals follow this format for images:

- Standard Images:
    - `https://elementals-images.azuki.com/{slug}.png`
- Extended Images (full-view):
    - `https://elementals-images.azuki.com/{slug}-bigazuki.png`

You can easily access your preferred image by substituting the `{slug}` placeholder with the corresponding slug from any of the provided data files. For example:
- https://elementals-images.azuki.com/bf8f5654-b4a1-4c59-9aa5-bacd4b7eaa9f.png
- https://elementals-images.azuki.com/bf8f5654-b4a1-4c59-9aa5-bacd4b7eaa9f-bigazuki.png

## License

MIT (Free to Use)