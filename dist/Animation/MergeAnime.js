"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAnime = mergeAnime;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const CMDefine_1 = require("../CMDefine");
const UtilGener_1 = require("./UtilGener");
/**合并并创建序列帧 */
async function mergeAnime(dm, charName, forcePackage = true) {
    const imagePath = (0, CMDefine_1.getAnimPath)(charName);
    const validAnim = [];
    if (!(await utils_1.UtilFT.pathExists(imagePath)))
        return validAnim;
    //载入动作数据
    const info = await utils_1.UtilFT.loadJSONFile(path.join(imagePath, 'info'));
    //缓存目录
    const tmpPath = path.join(imagePath, 'tmp');
    //检测是否需要强制生成
    const needPackage = forcePackage || !(await utils_1.UtilFT.pathExists(tmpPath));
    //检查是否有Idle动作
    if (info.Idle == null && Object.values(info).length >= 1)
        throw `${charName} 若要使用其他动画, 则必须要有Idle动画`;
    //提供给打包脚本的info
    const tmpRawInfo = [{
            width: 32, // default sprite size
            height: 32,
            pixelscale: 1 //  Optional. Sets a multiplier for resizing a tileset. Defaults to 1.
        }];
    //显示层级
    const ordering = {
        type: "overlay_order",
        overlay_ordering: []
    };
    //处理动作
    //删除缓存
    if (forcePackage)
        await fs.promises.rm(tmpPath, { recursive: true, force: true });
    /**待处理的缓存动画 */
    const rawPath = path.join(tmpPath, 'raw');
    /**合并完成的缓存动画 */
    const mergePath = path.join(tmpPath, 'merge');
    //遍历动作数据
    for (const mtnName in info) {
        const animType = mtnName;
        const mtnInfo = info[animType];
        //添加有效动画
        validAnim.push(animType);
        if (mtnInfo == undefined)
            continue;
        const mtnPath = path.join(imagePath, mtnName);
        //在缓存构建py脚本所需的特殊文件夹名
        const wxh = `${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`;
        const uid = (charName + animType).replaceAll("_", "");
        const tmpMthPath = path.join(rawPath, `pngs_${uid}_${wxh}`);
        await utils_1.UtilFT.ensurePathExists(tmpMthPath, { dir: true });
        //复制数据到缓存
        if (needPackage)
            await fs.promises.cp(mtnPath, tmpMthPath, { recursive: true });
        const { interval, last_weight, format_regex, ...rest } = mtnInfo;
        //检查图片 创建动画数据
        const animages = (await fs.promises.readdir(tmpMthPath))
            .filter(fileName => path.parse(fileName).ext == '.png')
            .sort((a, b) => {
            const regStr = format_regex || (mtnName + "(.*)\\.png");
            const amatch = a.match(new RegExp(regStr));
            const bmatch = b.match(new RegExp(regStr));
            if (amatch == null || bmatch == null)
                throw `文件名错误 path:${tmpMthPath} a:${a} b:${b}`;
            return parseInt(amatch[1]) - parseInt(bmatch[1]);
        })
            .map(fileName => ({ weight: (interval ?? 10), sprite: path.parse(fileName).name }));
        //设置最后一帧循环
        if (animages.length > 0 && last_weight != null && last_weight > 0)
            animages[animages.length - 1].weight = last_weight;
        //写入动画数据
        await utils_1.UtilFT.writeJSONFile(path.join(tmpMthPath, uid), {
            //id:`overlay_worn_${animData.armorID}`,
            id: `overlay_mutation_${(0, UtilGener_1.getAnimTypeMutID)(charName, animType)}`,
            fg: animages,
            animated: true,
        });
        //添加主info
        tmpRawInfo.push({
            [uid + '.png']: {
                ...rest
            }
        });
        //添加显示层级
        ordering.overlay_ordering.push({
            id: [(0, UtilGener_1.getAnimTypeMutID)(charName, animType)],
            order: 9999
        });
    }
    //创建info
    await utils_1.UtilFT.writeJSONFile(path.join(rawPath, 'tile_info.json'), tmpRawInfo);
    const str = `NAME: ${charName}\n` +
        `VIEW: ${charName}\n` +
        `JSON: tile_config.json\n` +
        `TILESET: tiles.png`;
    await fs.promises.writeFile(path.join(rawPath, 'tileset.txt'), str);
    //打包
    await utils_1.UtilFT.ensurePathExists(mergePath, { dir: true });
    const packageInfoPath = path.join(mergePath, 'tile_config.json');
    //如果不存在目标info文件或强制打包则进行打包
    if (needPackage)
        await utils_1.UtilFunc.exec(`python "tools/compose.py" "${rawPath}" "${mergePath}"`);
    //写入 mod贴图设置 到角色文件夹
    const charAnimPath = (0, CMDefine_1.getOutAnimPathAbs)(charName);
    await utils_1.UtilFT.ensurePathExists(charAnimPath, { dir: true });
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(packageInfoPath))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    const animModTileset = {
        type: "mod_tileset",
        compatibility: [await (0, CMDefine_1.getGfxPackName)()],
        "tiles-new": tilesetNew.map(item => {
            item.file = path.join((0, CMDefine_1.getOutAnimPath)(charName), item.file);
            return item;
        }),
    };
    dm.addData([animModTileset, ordering], path.join((0, CMDefine_1.getOutAnimPath)(charName), "anime_tileset"));
    //复制所有图片 到主目录
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName => path.parse(fileName).ext == '.png');
    for (let pngName of pngs) {
        const pngPath = path.join(mergePath, pngName);
        const outPngPath = path.join(charAnimPath, pngName);
        await fs.promises.copyFile(pngPath, outPngPath);
    }
    return validAnim;
}
