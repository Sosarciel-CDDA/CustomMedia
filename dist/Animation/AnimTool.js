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
exports.AnimTypeList = void 0;
exports.formatAnimName = formatAnimName;
exports.createAnimTool = createAnimTool;
const path = __importStar(require("path"));
const UtilGener_1 = require("./UtilGener");
const CMDefine_1 = require("../CMDefine");
const _1 = require(".");
const Export_1 = require("../Export");
/**可用的动画类型列表 */
exports.AnimTypeList = ["Idle", "Move", "Attack"];
/**生成某角色的动作id */
function formatAnimName(charName, animType) {
    return `${charName}${animType}`;
}
/**创建动画辅助工具
 * @param charName 角色名
 */
async function createAnimTool(dm, charName, vaildAnim) {
    if (vaildAnim.length <= 0)
        return;
    const out = [];
    //动画变异标志
    const charAnimMut = {
        type: "mutation",
        id: (0, Export_1.getAnimeMutID)(charName),
        name: `${charName}的动画变异`,
        description: `${charName}动画变异标志`,
        points: 0,
        purifiable: false,
        valid: false,
        player_display: false,
        flags: [_1.animeFlag.id]
    };
    out.push(charAnimMut);
    for (const animType of vaildAnim) {
        //动画变异
        const animMut = {
            type: "mutation",
            id: (0, UtilGener_1.getAnimTypeMutID)(charName, animType),
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            points: 0,
            purifiable: false,
            valid: false,
            player_display: false,
            override_look: {
                tile_category: 'monster',
                id: (0, UtilGener_1.getAnimTypeMonID)(charName, animType),
            }
        };
        //动画物品
        const animMon = {
            id: (0, UtilGener_1.getAnimTypeMonID)(charName, animType),
            type: 'MONSTER',
            name: `${charName}的${animType}动画图片怪物`,
            description: `${charName}的${animType}动画图片怪物`,
            symbol: 'o',
            hp: 1,
            volume: 1,
            weight: 1,
            default_faction: 'human',
            speed: 1,
        };
        out.push(animMut, animMon);
    }
    dm.addData(out, path.join((0, CMDefine_1.getOutAnimPath)(charName), "anime_tool"));
}
