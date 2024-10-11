"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimTypeMonID = exports.getAnimTypeItemID = exports.getAnimTypeMutID = void 0;
const CMDefine_1 = require("../CMDefine");
/**获取对应类型的动画变异ID */
const getAnimTypeMutID = (charName, animType) => CMDefine_1.CMDef.genMutationID(`${charName}${animType}`);
exports.getAnimTypeMutID = getAnimTypeMutID;
/**获取对应类型的动画图片物品ID */
const getAnimTypeItemID = (charName, animType) => CMDefine_1.CMDef.genGenericID(`${charName}${animType}`);
exports.getAnimTypeItemID = getAnimTypeItemID;
/**获取对应类型的动画图片怪物ID */
const getAnimTypeMonID = (charName, animType) => CMDefine_1.CMDef.genMonsterID(`${charName}${animType}`);
exports.getAnimTypeMonID = getAnimTypeMonID;
