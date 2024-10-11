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
exports.processSoundpack = processSoundpack;
const CMDefine_1 = require("../CMDefine");
const utils_1 = require("@zwa73/utils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const defineList = [
    "fire_gun", //枪械射击
    "fire_gun_distant", //枪械射击 远距
    "reload", //枪械装弹
    "melee_hit_flesh", //近战攻击肉质
    "melee_hit_metal", //近战攻击金属质
    "melee_hit", //近战攻击
];
/**创建音效包 */
async function processSoundpack(dm, charName) {
    //删除旧的音效资源
    await fs.promises.rm((0, CMDefine_1.getOutAudioPathAbs)(charName), { recursive: true, force: true });
    //确认输出文件夹
    const outAudioPath = (0, CMDefine_1.getOutAudioPathAbs)(charName);
    await utils_1.UtilFT.ensurePathExists(outAudioPath, { dir: true });
    //遍历并找出所有音效文件夹
    const inAudioPath = (0, CMDefine_1.getAudioPath)(charName);
    if (!(await utils_1.UtilFT.pathExists(inAudioPath)))
        return;
    const inDirPathList = (await fs.promises.readdir(inAudioPath))
        .filter(fileName => fs.statSync(path.join(inAudioPath, fileName)).isDirectory());
    //复制音效文件夹到输出
    for (const inDirPath of inDirPathList) {
        const inPath = path.join(inAudioPath, inDirPath);
        const outPath = path.join(outAudioPath, inDirPath);
        await fs.promises.cp(inPath, outPath, { recursive: true });
        //找到所有子音效
        const subAudio = (await fs.promises.readdir(inPath))
            .filter(fileName => [".ogg", ".wav"].includes(path.parse(fileName).ext));
        //创建音效配置 音效id为角色名 变体id为文件夹名 内容为子文件
        const se = {
            type: "sound_effect",
            id: charName,
            variant: inDirPath,
            volume: 100,
            files: [...subAudio.map(fileName => path.join('cnpc', charName, inDirPath, fileName))]
        };
        //根据预留武器音效字段更改ID
        //(武器id)_(类型)
        const defmatch = inDirPath.match(/^(.+?)_(.+)$/);
        if (defmatch != null && defineList.includes(defmatch[2])) {
            se.id = defmatch[2];
            se.variant = defmatch[1];
            //se.variant = (await dm.getCharData(charName)).charConfig.weapon?.id as SoundEffectVariantID;
        }
        await utils_1.UtilFT.writeJSONFile(path.join(outPath, inDirPath), [se]);
    }
}
