"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = processImage;
const MergeImage_1 = require("./MergeImage");
async function processImage(dm, charName) {
    await (0, MergeImage_1.mergeImage)(dm, charName);
}
