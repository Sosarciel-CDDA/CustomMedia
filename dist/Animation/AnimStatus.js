"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimStatus = void 0;
const path = require("path");
const CMDefine_1 = require("../CMDefine");
const UtilGener_1 = require("./UtilGener");
const Export_1 = require("../Export");
const animEventMap = {
    Move: "MoveStatus",
    Attack: "TryAttack",
    Idle: "IdleStatus",
    //Death:"Death",
};
/**移除其他动作变异 */
function removeOtherAnimEoc(charName, animType, vaildAnim) {
    const otherAnim = vaildAnim.filter(item => item != animType);
    if (otherAnim.length <= 0)
        return null;
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(charName + "_RemoveOtherAnimEoc_" + animType),
        effect: [
            ...otherAnim.map(otherAnimType => ({
                u_lose_trait: (0, UtilGener_1.getAnimTypeMutID)(charName, otherAnimType)
            }))
        ]
    };
    return eoc;
}
/**切换动作EOC
 * (...)=> [切换动作,删除其余动作]
 */
function changeAnimEoc(charName, animType, vaildAnim) {
    const removeEoc = removeOtherAnimEoc(charName, animType, vaildAnim);
    if (removeEoc == null)
        return [];
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(charName + "_ChangeAnimEoc_" + animType),
        effect: [
            { run_eocs: removeEoc.id },
            { u_add_trait: (0, UtilGener_1.getAnimTypeMutID)(charName, animType) },
        ],
        condition: { not: { u_has_trait: (0, UtilGener_1.getAnimTypeMutID)(charName, animType) } }
    };
    return [eoc, removeEoc];
}
/**创建动画状态机事件 */
async function createAnimStatus(dm, charName, vaildAnim) {
    if (vaildAnim.length <= 0)
        return;
    const eocList = [];
    //添加切换动画
    for (const mtnName in animEventMap) {
        const animType = mtnName;
        if (vaildAnim.includes(mtnName)) {
            let eocs = changeAnimEoc(charName, animType, vaildAnim);
            eocList.push(...eocs);
            const eventName = animEventMap[animType];
            if (eventName != null && eocs != null && eocs.length > 0) {
                const changeEffect = {
                    if: { u_has_trait: (0, Export_1.getAnimeMutID)(charName) },
                    then: [{ run_eocs: [eocs[0]] }]
                };
                dm.addEvent(eventName, 0, [changeEffect]);
            }
        }
    }
    dm.addData(eocList, path.join((0, CMDefine_1.getOutAnimPath)(charName), 'anime_status'));
}
exports.createAnimStatus = createAnimStatus;
