import { UtilFT } from "@zwa73/utils";
import { AnyCddaJsonList, ModDefine, MutationID, Spell, SpellID } from "cdda-schema";
import * as path from 'path';
import * as fs from 'fs';
/**mod物品前缀 */
export const MOD_PREFIX = "CMEDIA";

export const CMDef = new ModDefine(MOD_PREFIX);

/**data文件夹路径 */
export const DATA_PATH = path.join(process.cwd(),'data');
/**media数据文件夹路径 */
export const MEDIA_PATH = path.join(DATA_PATH,'Media');
/**sosarcielEnv文件夹路径 */
export const ENV_PATH = path.join(process.cwd(),'..');
/**build设定 */
const BuilfSetting = UtilFT.loadJSONFileSync(path.join(ENV_PATH,'build_setting.json')) as any;
/**build目标游戏路径 */
export const GAME_PATH = BuilfSetting.game_path as string;
/**build目标贴图包 */
export const TARGET_GFXPACK = BuilfSetting.target_gfxpack as string;
/**build目标音效包 */
export const TARGET_SOUNDPACK = BuilfSetting.target_soundpack as string;
/**build输出路径 */
export const OUT_PATH = path.join(GAME_PATH,'data','mods','CustomMedia');
/**build输出音效路径 */
export const OUT_SOUND_PATH = path.join(GAME_PATH,'data','sound',TARGET_SOUNDPACK,'cnpc');
/**python打包工具路径 */
export const PY_COMPOSE_PATH = path.join(DATA_PATH,'tools',"compose.py");

/**获取动画文件夹 */
export const getAnimPath = (charName:string) => path.join(MEDIA_PATH,charName,"anime");
/**获取图片文件夹 */
export const getImagePath = (charName:string) => path.join(MEDIA_PATH,charName,"image");
/**获取音效文件夹 */
export const getAudioPath = (charName:string) => path.join(MEDIA_PATH,charName,"audio");

/**获取输出的动画文件夹 */
export const getOutAnimPathAbs = (charName:string) => path.join(OUT_PATH,charName,"anime");
/**获取输出的图片文件夹 */
export const getOutImagePathAbs = (charName:string) => path.join(OUT_PATH,charName,"image");
/**获取输出的音效文件夹 */
export const getOutAudioPathAbs = (charName:string) => path.join(OUT_SOUND_PATH,charName);

/**获取输出的动画文件夹 */
export const getOutAnimPath = (charName:string) => path.join(charName,"anime");
/**获取输出的图片文件夹 */
export const getOutImagePath = (charName:string) => path.join(charName,"image");

/**获取目标贴图包的名称 */
let gfxName:string|null = null;
export const getGfxPackName = async ()=>{
    if(gfxName!=null) return gfxName;
    const gfxPath = path.join(GAME_PATH,'gfx',TARGET_GFXPACK);
    const gfxTilesetTxtPath = path.join(gfxPath,'tileset.txt');
    if(!(await UtilFT.pathExists(gfxTilesetTxtPath)))
        throw "未找到目标贴图包自述文件 path:"+gfxTilesetTxtPath;
    const match = (await fs.promises.readFile(gfxTilesetTxtPath,"utf-8"))
                    .match(/NAME: (.*?)$/m);
    if(match==null) throw "未找到目标贴图包NAME path:"+gfxTilesetTxtPath;
    //写入贴图名
    gfxName = match[1];
    return gfxName;
}

