"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const cdda_event_1 = require("cdda-event");
const CMDefine_1 = require("./CMDefine");
const Animation_1 = require("./Animation");
const Audio_1 = require("./Audio");
const Image_1 = require("./Image");
const fs = require("fs");
const path = require("path");
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
exports.build = build;
