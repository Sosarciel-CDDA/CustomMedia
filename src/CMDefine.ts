import { UtilFT } from "@zwa73/utils";
import { AnyCddaJsonList, ModDefine, Spell, SpellID } from "cdda-schema";
import * as path from 'path';

/**mod物品前缀 */
export const MOD_PREFIX = "CMEDiA";

export const CMDef = new ModDefine(MOD_PREFIX);


export const DATA_PATH = path.join(process.cwd(),'data');
export const MEDIA_PATH = path.join(DATA_PATH,'media');
export const ENV_PATH = path.join(process.cwd(),'..');
const BuilfSetting = UtilFT.loadJSONFileSync(path.join(ENV_PATH,'build_setting.json'));
export const GAME_PATH = BuilfSetting.game_path as string;
export const TARGET_GFXPACK = BuilfSetting.target_gfxpack as string;
export const OUT_PATH = path.join(GAME_PATH,'data','mods','CustomMedia');

/**获取动画文件夹 */
export const getAnimPath = (charName:string) => path.join(MEDIA_PATH,charName,"animation");
/**获取图片文件夹 */
export const getImagePath = (charName:string) => path.join(MEDIA_PATH,charName,"image");
/**获取音效文件夹 */
export const getAudioPath = (charName:string) => path.join(MEDIA_PATH,charName,"audio");

/**获取输出的动画文件夹 */
export const getOutAnimPath = (charName:string) => path.join(OUT_PATH,charName,"animation");
/**获取输出的图片文件夹 */
export const getOutImagePath = (charName:string) => path.join(OUT_PATH,charName,"image");
/**获取输出的音效文件夹 */
export const getOutAudioPath = (charName:string) => path.join(OUT_PATH,charName,"audio");