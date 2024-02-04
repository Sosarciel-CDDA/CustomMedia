"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioEffect = exports.getAnimeMutID = void 0;
/**获取动画变异ID */
const getAnimeMutID = (charName) => `${charName}_anime`;
exports.getAnimeMutID = getAnimeMutID;
/**解析音频id */
function getAudioEffect(charName, str, volume = 100) {
    let soundName = charName;
    let varName = str;
    if (str.includes(":")) {
        const match = str.match(/(.+):(.+)/);
        if (match == null)
            throw `getAudioEffect 解析错误 charName:${charName} 字符串:${str}`;
        soundName = match[1];
        varName = match[2];
    }
    return {
        sound_effect: varName,
        id: soundName,
        volume
    };
}
exports.getAudioEffect = getAudioEffect;
