import { DataManager } from "cdda-event";
import { Flag, MutationID } from "cdda-schema";
/**基础素体变异ID */
export declare const BaseBodyMutId: MutationID;
export declare function processAnimation(dm: DataManager, charName: string): Promise<void>;
/**初始化贴图包设置 */
export declare function initAnimation(dm: DataManager): Promise<void>;
export declare const animeFlag: Flag;
