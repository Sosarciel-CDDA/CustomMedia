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
exports.getGfxPackName = exports.getOutImagePath = exports.getOutAnimPath = exports.getOutAudioPathAbs = exports.getOutImagePathAbs = exports.getOutAnimPathAbs = exports.getAudioPath = exports.getImagePath = exports.getAnimPath = exports.PY_COMPOSE_PATH = exports.OUT_SOUND_PATH = exports.OUT_PATH = exports.TARGET_SOUNDPACK = exports.TARGET_GFXPACK = exports.GAME_PATH = exports.ENV_PATH = exports.MEDIA_PATH = exports.DATA_PATH = exports.CMDef = exports.MOD_PREFIX = void 0;
const utils_1 = require("@zwa73/utils");
const cdda_schema_1 = require("cdda-schema");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**mod物品前缀 */
exports.MOD_PREFIX = "CMEDIA";
exports.CMDef = new cdda_schema_1.ModDefine(exports.MOD_PREFIX);
/**data文件夹路径 */
exports.DATA_PATH = path.join(process.cwd(), 'data');
/**media数据文件夹路径 */
exports.MEDIA_PATH = path.join(exports.DATA_PATH, 'Media');
/**sosarcielEnv文件夹路径 */
exports.ENV_PATH = path.join(process.cwd(), '..');
/**build设定 */
const BuilfSetting = utils_1.UtilFT.loadJSONFileSync(path.join(exports.ENV_PATH, 'build_setting.json'));
/**build目标游戏路径 */
exports.GAME_PATH = BuilfSetting.game_path;
/**build目标贴图包 */
exports.TARGET_GFXPACK = BuilfSetting.target_gfxpack;
/**build目标音效包 */
exports.TARGET_SOUNDPACK = BuilfSetting.target_soundpack;
/**build输出路径 */
exports.OUT_PATH = path.join(exports.GAME_PATH, 'data', 'mods', 'CustomMedia');
/**build输出音效路径 */
exports.OUT_SOUND_PATH = path.join(exports.GAME_PATH, 'data', 'sound', exports.TARGET_SOUNDPACK, 'cnpc');
/**python打包工具路径 */
exports.PY_COMPOSE_PATH = path.join(exports.DATA_PATH, 'tools', "compose.py");
/**获取动画文件夹 */
const getAnimPath = (charName) => path.join(exports.MEDIA_PATH, charName, "anime");
exports.getAnimPath = getAnimPath;
/**获取图片文件夹 */
const getImagePath = (charName) => path.join(exports.MEDIA_PATH, charName, "image");
exports.getImagePath = getImagePath;
/**获取音效文件夹 */
const getAudioPath = (charName) => path.join(exports.MEDIA_PATH, charName, "audio");
exports.getAudioPath = getAudioPath;
/**获取输出的动画文件夹 */
const getOutAnimPathAbs = (charName) => path.join(exports.OUT_PATH, charName, "anime");
exports.getOutAnimPathAbs = getOutAnimPathAbs;
/**获取输出的图片文件夹 */
const getOutImagePathAbs = (charName) => path.join(exports.OUT_PATH, charName, "image");
exports.getOutImagePathAbs = getOutImagePathAbs;
/**获取输出的音效文件夹 */
const getOutAudioPathAbs = (charName) => path.join(exports.OUT_SOUND_PATH, charName);
exports.getOutAudioPathAbs = getOutAudioPathAbs;
/**获取输出的动画文件夹 */
const getOutAnimPath = (charName) => path.join(charName, "anime");
exports.getOutAnimPath = getOutAnimPath;
/**获取输出的图片文件夹 */
const getOutImagePath = (charName) => path.join(charName, "image");
exports.getOutImagePath = getOutImagePath;
/**获取目标贴图包的名称 */
let gfxName = null;
const getGfxPackName = async () => {
    if (gfxName != null)
        return gfxName;
    const gfxPath = path.join(exports.GAME_PATH, 'gfx', exports.TARGET_GFXPACK);
    const gfxTilesetTxtPath = path.join(gfxPath, 'tileset.txt');
    if (!(await utils_1.UtilFT.pathExists(gfxTilesetTxtPath)))
        throw "未找到目标贴图包自述文件 path:" + gfxTilesetTxtPath;
    const match = (await fs.promises.readFile(gfxTilesetTxtPath, "utf-8"))
        .match(/NAME: (.*?)$/m);
    if (match == null)
        throw "未找到目标贴图包NAME path:" + gfxTilesetTxtPath;
    //写入贴图名
    gfxName = match[1];
    return gfxName;
};
exports.getGfxPackName = getGfxPackName;
