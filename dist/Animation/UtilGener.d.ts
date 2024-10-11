import { AnimType } from "./AnimTool";
/**获取对应类型的动画变异ID */
export declare const getAnimTypeMutID: (charName: string, animType: AnimType) => import("cdda-schema").MutationID;
/**获取对应类型的动画图片物品ID */
export declare const getAnimTypeItemID: (charName: string, animType: AnimType) => import("cdda-schema").GenericID;
/**获取对应类型的动画图片怪物ID */
export declare const getAnimTypeMonID: (charName: string, animType: AnimType) => import("cdda-schema").MonsterID;
