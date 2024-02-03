import { AnimType } from "./AnimTool";
import { MutationID } from "cdda-schema";
/**获取对应角色的动画hook */
export declare const getAnimHook: (charName: string) => "TryMeleeAtkChar" | "TryMeleeAtkMon" | "TryRangeAtkChar" | "TryRangeAtkMon" | "TryMeleeAttack" | "TryRangeAttack" | "TryAttack" | "SucessMeleeAttack" | "MissMeleeAttack" | "Init" | "Update" | "SlowUpdate" | "TakeDamage" | "DeathPrev" | "Death" | "EnterBattle" | "LeaveBattle" | "BattleUpdate" | "NonBattleUpdate" | "MoveStatus" | "IdleStatus" | "AttackStatus" | "WieldItemRaw" | "WieldItem" | "StowItem" | "WearItem" | "EatItem" | "AvatarMove" | "AvatarUpdate" | "GameBegin";
/**获取对应类型的动画变异ID */
export declare const getAnimTypeMutID: (charName: string, animType: AnimType) => MutationID;
/**获取主要动画变异ID */
export declare const getAnimMainMutID: (charName: string) => MutationID;
