import { ModDefine } from "cdda-schema";
/**mod物品前缀 */
export declare const MOD_PREFIX = "CMEDIA";
export declare const CMDef: ModDefine;
/**data文件夹路径 */
export declare const DATA_PATH: string;
/**media数据文件夹路径 */
export declare const MEDIA_PATH: string;
/**sosarcielEnv文件夹路径 */
export declare const ENV_PATH: string;
/**build目标游戏路径 */
export declare const GAME_PATH: string;
/**build目标贴图包 */
export declare const TARGET_GFXPACK: string;
/**build目标音效包 */
export declare const TARGET_SOUNDPACK: string;
/**build输出路径 */
export declare const OUT_PATH: string;
/**build输出音效路径 */
export declare const OUT_SOUND_PATH: string;
/**python打包工具路径 */
export declare const PY_COMPOSE_PATH: string;
/**获取动画文件夹 */
export declare const getAnimPath: (charName: string) => string;
/**获取图片文件夹 */
export declare const getImagePath: (charName: string) => string;
/**获取音效文件夹 */
export declare const getAudioPath: (charName: string) => string;
/**获取输出的动画文件夹 */
export declare const getOutAnimPathAbs: (charName: string) => string;
/**获取输出的图片文件夹 */
export declare const getOutImagePathAbs: (charName: string) => string;
/**获取输出的音效文件夹 */
export declare const getOutAudioPathAbs: (charName: string) => string;
/**获取输出的动画文件夹 */
export declare const getOutAnimPath: (charName: string) => string;
/**获取输出的图片文件夹 */
export declare const getOutImagePath: (charName: string) => string;
export declare const getGfxPackName: () => Promise<string>;
