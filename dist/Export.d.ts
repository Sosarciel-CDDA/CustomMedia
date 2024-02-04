import { MutationID, SoundEffectID, SoundEffectVariantID } from "cdda-schema";
/**获取动画变异ID */
export declare const getAnimeMutID: (charName: string) => MutationID;
/**解析音频id */
export declare function getAudioEffect(charName: string, str: string, volume?: number): {
    sound_effect: SoundEffectVariantID;
    id: SoundEffectID;
    volume: number;
};
