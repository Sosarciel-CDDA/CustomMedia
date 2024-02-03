"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimMainMutID = exports.getAnimTypeMutID = void 0;
const CMDefine_1 = require("../CMDefine");
/**获取对应类型的动画变异ID */
const getAnimTypeMutID = (charName, animType) => CMDefine_1.CMDef.genMutationID(`${charName}${animType}`);
exports.getAnimTypeMutID = getAnimTypeMutID;
/**获取主要动画变异ID */
const getAnimMainMutID = (charName) => `${charName}_anime`;
exports.getAnimMainMutID = getAnimMainMutID;
