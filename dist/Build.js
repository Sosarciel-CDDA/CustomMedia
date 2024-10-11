"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = build;
const cdda_event_1 = require("cdda-event");
const CMDefine_1 = require("./CMDefine");
const Animation_1 = require("./Animation");
const Audio_1 = require("./Audio");
const Image_1 = require("./Image");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function build() {
    const CMDm = new cdda_event_1.DataManager(CMDefine_1.DATA_PATH, CMDefine_1.OUT_PATH, "CMEDIA");
    const charNameList = await fs.promises.readdir(CMDefine_1.MEDIA_PATH);
    charNameList.filter((file) => fs.statSync(path.join(CMDefine_1.MEDIA_PATH, file)).isDirectory());
    const plist = [
        (0, Animation_1.initAnimation)(CMDm),
        charNameList.map((charName) => (0, Image_1.processImage)(CMDm, charName)),
        charNameList.map((charName) => (0, Animation_1.processAnimation)(CMDm, charName)),
        charNameList.map((charName) => (0, Audio_1.processSoundpack)(CMDm, charName)),
    ].flat();
    await Promise.all(plist);
    await CMDm.saveAllData();
}
