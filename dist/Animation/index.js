"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeFlag = void 0;
exports.processAnimation = processAnimation;
exports.initAnimation = initAnimation;
const MergeAnime_1 = require("./MergeAnime");
const AnimTool_1 = require("./AnimTool");
const AnimStatus_1 = require("./AnimStatus");
const CMDefine_1 = require("../CMDefine");
async function processAnimation(dm, charName) {
    const validAnim = await (0, MergeAnime_1.mergeAnime)(dm, charName);
    await (0, AnimTool_1.createAnimTool)(dm, charName, validAnim);
    await (0, AnimStatus_1.createAnimStatus)(dm, charName, validAnim);
}
/**初始化贴图包设置 */
async function initAnimation(dm) {
    //处理贴图包
    const gfx_name = await (0, CMDefine_1.getGfxPackName)();
    //写入基础贴图配置
    await dm.saveToFile("mod_tileset.json", [{
            type: "mod_tileset",
            compatibility: [gfx_name],
            "tiles-new": [{
                    file: "32xTransparent.png",
                    sprite_width: 32,
                    sprite_height: 32,
                    sprite_offset_x: 0,
                    sprite_offset_y: 0,
                    pixelscale: 1,
                    tiles: [
                        //{ id: "npc_female"  , fg: 0, bg: 0 },
                        //{ id: "npc_male"    , fg: 0, bg: 0 },
                        { id: "TransparentItem", fg: 0, bg: 0 },
                    ]
                }],
        }]);
    dm.addData([exports.animeFlag], "anime_base");
}
exports.animeFlag = {
    id: "has_anime",
    type: "json_flag",
};
