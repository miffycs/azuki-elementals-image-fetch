# Azuki Elementals Image Fetcher

## Overview

Azuki Elementals Image Fetcher is a dedicated repository designed to automatically fetch and update image data for revealed [Azuki Elementals](https://opensea.io/collection/azukielementals). This process is executed via a [GitHub workflow](https://github.com/miffycs/azuki-elementals-image-fetch/blob/master/.github/workflows/main.yml) scheduled to run **every 5 minutes**.

## Data Accessibility

To ensure data conciseness and accuracy, we maintain records of `{id}: {slug}`. 

We provide the data in various formats:
- [data.json](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.json)
- [data.js](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.js)
- [data.csv](https://raw.githubusercontent.com/miffycs/azuki-elementals-image-fetch/master/data.csv)

Feel free to download the files directly or utilize them as a reference database via the links provided.

For users who are interested in obtaining specific images, please refer to the next section.

## Guide to Image URL Construction

Azuki Elementals follow this format for images:
- Standard Images:
    - `https://elementals-images.azuki.com/{slug}.png`
- Extended Images (full-view):
    - `https://elementals-images.azuki.com/{slug}-bigazuki.png`

Replace the `{slug}` placeholder with the corresponding slug (to the id) found in any of the data files, you can access the specific image, or adapt the URL to work in another project.

For example:
- Standard Images:
    - https://elementals-images.azuki.com/bf8f5654-b4a1-4c59-9aa5-bacd4b7eaa9f.png
- Extended Images (full-view):
    - https://elementals-images.azuki.com/bf8f5654-b4a1-4c59-9aa5-bacd4b7eaa9f-bigazuki.png

## License

MIT (Free to Use)