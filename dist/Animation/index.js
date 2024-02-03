"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeFlag = exports.initAnimation = exports.processAnimation = exports.BaseBodyMutId = void 0;
const MergeAnime_1 = require("./MergeAnime");
const AnimTool_1 = require("./AnimTool");
const AnimStatus_1 = require("./AnimStatus");
const CMDefine_1 = require("../CMDefine");
const path = require("path");
const utils_1 = require("@zwa73/utils");
/**基础素体变异ID */
exports.BaseBodyMutId = "BaseBody";
async function processAnimation(dm, charName) {
    const validAnim = await (0, MergeAnime_1.mergeAnime)(dm, charName);
    await (0, AnimTool_1.createAnimTool)(dm, charName, validAnim);
    await (0, AnimStatus_1.createAnimStatus)(dm, charName, validAnim);
}
exports.processAnimation = processAnimation;
/**初始化贴图包设置 */
async function initAnimation(dm) {
    //处理贴图包
    const gfxPath = path.join(CMDefine_1.GAME_PATH, 'gfx', CMDefine_1.TARGET_GFXPACK);
    const gfx_name = await (0, CMDefine_1.getGfxPackName)();
    //读取贴图包设置备份 无则创建
    let tileConfig;
    if ((await utils_1.UtilFT.pathExists(path.join(gfxPath, 'tile_config.json'))))
        tileConfig = await utils_1.UtilFT.loadJSONFile(path.join(gfxPath, 'tile_config.json'));
    else
        throw ("未找到贴图包 tile_config.json");
    //记录默认数据
    const defSet = tileConfig.tile_info[0];
    defSet.sprite_width = defSet.width;
    defSet.sprite_height = defSet.height;
    delete defSet.width;
    delete defSet.height;
    delete tileConfig.tile_info;
    //寻找npc素体 并将ID改为变异素体
    let findMale = false;
    let findFemale = false;
    //let count = 0;
    const fileObjList = tileConfig["tiles-new"];
    for (const fileObj of fileObjList) {
        const tilesList = fileObj.tiles;
        //载入默认数据
        for (const key in defSet) {
            if (fileObj[key] == null)
                fileObj[key] = defSet[key];
        }
        //删除ascii
        if (fileObj.ascii)
            fileObj.ascii = [];
        //替换目录名
        if (fileObj.file)
            fileObj.file = path.join('..', '..', '..', 'gfx', CMDefine_1.TARGET_GFXPACK, fileObj.file);
        fileObj.iso = undefined;
        fileObj.retract_dist_min = undefined;
        fileObj.retract_dist_max = undefined;
        //替换tiles
        fileObj.tiles = tilesList.filter(tilesObj => {
            if (tilesObj.id == "npc_female") {
                tilesObj.id = `overlay_female_mutation_${exports.BaseBodyMutId}`;
                findFemale = true;
                return true;
            }
            else if (tilesObj.id == "npc_male") {
                tilesObj.id = `overlay_male_mutation_${exports.BaseBodyMutId}`;
                findMale = true;
                return true;
            }
            return false;
        });
        //count++;
        //if(findMale&&findFemale) break;
    }
    //删除多余部分
    //tileConfig["tiles-new"] = (tileConfig["tiles-new"] as any[]).slice(0,count);
    if (!(findMale && findFemale))
        console.log("未找到贴图包素体");
    //设置基本属性
    tileConfig.compatibility = [gfx_name];
    tileConfig.type = "mod_tileset";
    //写入mod文件夹
    await dm.saveToFile("modgfx_tileset.json", [tileConfig]);
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
                        { id: "npc_female", fg: 0, bg: 0 },
                        { id: "npc_male", fg: 0, bg: 0 },
                        { id: "TransparentItem", fg: 0, bg: 0 },
                    ]
                }],
        }]);
    initAnimEvent(dm);
}
exports.initAnimation = initAnimation;
exports.animeFlag = {
    id: "has_anime",
    type: "json_flag",
};
function initAnimEvent(dm) {
    const e = CMDefine_1.CMDef.genActEoc("InitAnime", [{
            if: { and: [{ not: { u_has_flag: exports.animeFlag.id } }, { not: { u_has_trait: exports.BaseBodyMutId } }] },
            then: [{ u_add_trait: exports.BaseBodyMutId }]
        }]);
    const BaseBodyOrdering = {
        type: "overlay_order",
        overlay_ordering: [
            { id: [CMDefine_1.CMDef.genMutationID("BaseBody")], order: 0 }
        ]
    };
    const CnpcBaseBody = {
        type: "mutation",
        id: exports.BaseBodyMutId,
        name: "自定义NPC替代素体",
        description: "代替原素体的贴图变异",
        purifiable: false,
        valid: false,
        player_display: false,
        points: 0,
    };
    dm.addInvokeEoc("Init", 0, e);
    dm.addStaticData([exports.animeFlag, e, BaseBodyOrdering, CnpcBaseBody], "anime_base");
}
