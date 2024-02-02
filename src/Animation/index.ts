import { DataManager } from "cdda-event";
import { BodyPartList, Mutation, MutationID } from "cdda-schema";
import { getAnimHook, getAnimMainMutID } from "./UtilGener";
import { mergeAnime } from "./MergeAnime";
import { createAnimTool } from "./AnimTool";
import { createAnimStatus } from "./AnimStatus";




export async function createAnimation(dm:DataManager,charName:string) {
    const validAnim = await mergeAnime(dm,charName);
    await createAnimTool(dm,charName,validAnim);
    await createAnimStatus(dm,charName,validAnim);
}