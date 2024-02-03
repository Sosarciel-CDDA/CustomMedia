"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimTool = exports.formatAnimName = exports.AnimTypeList = void 0;
const path = require("path");
const cdda_schema_1 = require("cdda-schema");
const UtilGener_1 = require("./UtilGener");
const CMDefine_1 = require("../CMDefine");
/**可用的动画类型列表 */
exports.AnimTypeList = ["Idle", "Move", "Attack"];
/**生成某角色的动作id */
function formatAnimName(charName, animType) {
    return `${charName}${animType}`;
}
exports.formatAnimName = formatAnimName;
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
        id: (0, UtilGener_1.getAnimMainMutID)(charName),
        name: `${charName}的动画变异`,
        description: `${charName}动画变异标志`,
        restricts_gear: [...cdda_schema_1.BodyPartList],
        remove_rigid: [...cdda_schema_1.BodyPartList],
        points: 0,
        purifiable: false,
        valid: false,
        player_display: false,
    };
    out.push(charAnimMut);
    //动画变异
    for (const animType of vaildAnim) {
        const animMut = {
            type: "mutation",
            id: (0, UtilGener_1.getAnimTypeMutID)(charName, animType),
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            //integrated_armor:[animData.armorID],
            restricts_gear: [...cdda_schema_1.BodyPartList],
            remove_rigid: [...cdda_schema_1.BodyPartList],
            points: 0,
            purifiable: false,
            valid: false,
            player_display: false,
        };
        out.push(animMut);
    }
    dm.addStaticData(out, path.join((0, CMDefine_1.getOutAnimPath)(charName), "anime_tool"));
}
exports.createAnimTool = createAnimTool;
