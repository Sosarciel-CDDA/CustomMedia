import { AnimType } from "./AnimTool";
import { MutationID } from "cdda-schema";
/**获取对应类型的动画变异ID */
export declare const getAnimTypeMutID: (charName: string, animType: AnimType) => MutationID;
/**获取主要动画变异ID */
export declare const getAnimMainMutID: (charName: string) => MutationID;
