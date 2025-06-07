import { DataManager } from "@sosarciel-cdda/event";
import { mergeImage } from "./MergeImage";



export async function processImage(dm:DataManager,charName:string){
    await mergeImage(dm,charName);
}