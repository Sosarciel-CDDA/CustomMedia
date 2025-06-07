import { MutationID, SoundEffectID, SoundEffectVariantID } from "@sosarciel-cdda/schema";






/**获取动画变异ID */
export const getAnimeMutID = (charName:string)=>`${charName}_anime` as MutationID;
/**解析音频id */
export function getAudioEffect(charName:string,str:string,volume:number=100){
    let soundName = charName;
    let varName = str;
    if(str.includes(":")){
        const match = str.match(/(.+):(.+)/);
        if(match==null) throw `getAudioEffect 解析错误 charName:${charName} 字符串:${str}`;
        soundName = match[1];
        varName = match[2];
    }
    return {
        sound_effect:varName    as SoundEffectVariantID ,
        id          :soundName  as SoundEffectID        ,
        volume
    };
}