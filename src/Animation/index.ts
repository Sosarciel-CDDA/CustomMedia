import { DataManager } from "cdda-event";
import { Flag, FlagID } from "cdda-schema";
import { mergeAnime } from "./MergeAnime";
import { createAnimTool } from "./AnimTool";
import { createAnimStatus } from "./AnimStatus";
import { getGfxPackName } from "@src/CMDefine";


export async function processAnimation(dm:DataManager,charName:string) {
    const validAnim = await mergeAnime(dm,charName);
    await createAnimTool(dm,charName,validAnim);
    await createAnimStatus(dm,charName,validAnim);
}

/**初始化贴图包设置 */
export async function initAnimation(dm:DataManager){
    //处理贴图包
    const gfx_name = await getGfxPackName();

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

    dm.addData([animeFlag],"anime_base");
}


export const animeFlag:Flag={
    id:"has_anime" as FlagID,
    type:"json_flag",
}
