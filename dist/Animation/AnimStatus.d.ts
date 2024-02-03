import { AnimType } from "./AnimTool";
import { DataManager } from "cdda-event";
/**创建动画状态机事件 */
export declare function createAnimStatus(dm: DataManager, charName: string, vaildAnim: AnimType[]): Promise<void>;
