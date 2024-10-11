import { DataManager } from "cdda-event";
import { Flag } from "cdda-schema";
export declare function processAnimation(dm: DataManager, charName: string): Promise<void>;
/**初始化贴图包设置 */
export declare function initAnimation(dm: DataManager): Promise<void>;
export declare const animeFlag: Flag;
