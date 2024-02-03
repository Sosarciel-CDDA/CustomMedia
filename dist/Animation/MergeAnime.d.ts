import { DataManager } from "cdda-event";
/**合并并创建序列帧 */
export declare function mergeAnime(dm: DataManager, charName: string, forcePackage?: boolean): Promise<("Idle" | "Move" | "Attack")[]>;
