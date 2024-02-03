"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImage = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const CMDefine_1 = require("../CMDefine");
/**根据 PkgSpriteCfg 获得图片列表 */
function getImageFiles(cfg) {
    let subget = (imageCfg) => {
        if (imageCfg === undefined)
            return [];
        const imageNames = [];
        if (typeof imageCfg === 'string')
            imageNames.push(imageCfg);
        else if (Array.isArray(imageCfg)) {
            for (let item of imageCfg) {
                if (typeof item === 'string')
                    imageNames.push(item);
                else if ('sprite' in item) {
                    if (typeof item.sprite === 'string')
                        imageNames.push(item.sprite);
                    else
                        imageNames.push(...item.sprite);
                }
            }
        }
        else if ('sprite' in imageCfg) {
            if (typeof imageCfg.sprite === 'string')
                imageNames.push(imageCfg.sprite);
            else
                imageNames.push(...imageCfg.sprite);
        }
        return imageNames;
    };
    return [...subget(cfg.fg), ...subget(cfg.bg)];
}
/** 根据 PkgSpriteCfg 获得图集uid */
function getTilesetUID(cfg) {
    let W = cfg.sprite_width;
    let H = cfg.sprite_height;
    let result = `W${W}H${H}`;
    // 定义一个子函数来处理可选属性
    let concatSub = (shortName, value) => {
        if (value !== undefined)
            result += `${shortName}${value}`;
    };
    // 使用子函数来处理每个可选属性
    concatSub('ox', cfg.sprite_offset_x);
    concatSub('oy', cfg.sprite_offset_y);
    concatSub('ps', cfg.pixelscale);
    concatSub('sa', cfg.sprites_across);
    return result;
}
/**使用py工具合并图像 输出为modtileset */
async function mergeImage(dm, charName, forcePackage = true) {
    /**动画主目录 */
    const imagePath = (0, CMDefine_1.getImagePath)(charName);
    if (!(await utils_1.UtilFT.pathExists(imagePath)))
        return;
    /**处理缓存目录 */
    const tmpPath = path.join(imagePath, "tmp");
    /**未处理的图片目录 */
    const rawPath = path.join(tmpPath, "raw");
    /**打包后的图片输出目录 */
    const mergePath = path.join(tmpPath, "merge");
    /**用于输出的图集表 */
    const tileSetMap = {};
    //寻找图像配置
    const cfgFilepaths = utils_1.UtilFT.fileSearchGlob(path.join(imagePath, "*.json").replace("\\", "/"));
    for (const cfgPath of cfgFilepaths) {
        const cfgJson = (await utils_1.UtilFT.loadJSONFile(cfgPath));
        const tilesetcfg = cfgJson.tileset;
        //获取配置关联的所有图片
        const pngs = getImageFiles(cfgJson.sprite);
        //在缓存构建py脚本所需的特殊文件夹名
        const wxh = tilesetcfg.sprite_width + "x" + tilesetcfg.sprite_height;
        const uid = getTilesetUID(tilesetcfg);
        const tmpFolderPath = path.join(rawPath, `pngs_${uid}_${wxh}`);
        await utils_1.UtilFT.ensurePathExists(tmpFolderPath, true);
        //复制png到缓存
        for (let pngName of pngs) {
            pngName = pngName + ".png";
            const pngPath = path.join(imagePath, pngName);
            const outPngPath = path.join(tmpFolderPath, pngName);
            await fs.promises.copyFile(pngPath, outPngPath);
        }
        //复制配置
        const cfgName = path.parse(cfgPath).name;
        await utils_1.UtilFT.writeJSONFile(path.join(tmpFolderPath, cfgName), cfgJson.sprite);
        //注册入tileset表
        tileSetMap[uid] = tilesetcfg;
    }
    //创建tileset配置
    const rawinfo = [{
            width: 32,
            height: 32,
            pixelscale: 1
        },
        ...Object.keys(tileSetMap).map((uid) => ({
            [`${uid}.png`]: tileSetMap[uid]
        }))
    ];
    await utils_1.UtilFT.writeJSONFile(path.join(rawPath, 'tile_info.json'), rawinfo);
    const str = `NAME: ${charName}\n` +
        `VIEW: ${charName}\n` +
        `JSON: tile_config.json\n` +
        `TILESET: tiles.png`;
    await fs.promises.writeFile(path.join(rawPath, 'tileset.txt'), str);
    //开始打包
    await utils_1.UtilFT.ensurePathExists(mergePath, true);
    await utils_1.UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);
    //读取打包结果
    const packageInfoPath = path.join(mergePath, 'tile_config.json');
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(packageInfoPath))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    const imgModTileset = {
        type: "mod_tileset",
        compatibility: [await (0, CMDefine_1.getGfxPackName)()],
        "tiles-new": tilesetNew.map(item => {
            item.file = path.join((0, CMDefine_1.getImagePath)(charName), item.file);
            return item;
        }),
    };
    dm.addStaticData([imgModTileset], path.join((0, CMDefine_1.getOutImagePath)(charName), "image_tileset"));
    //复制所有图片 到输出目录
    const charImgPath = (0, CMDefine_1.getOutImagePathAbs)(charName);
    await utils_1.UtilFT.ensurePathExists(charImgPath, true);
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName => path.parse(fileName).ext == '.png');
    for (let pngName of pngs) {
        const pngPath = path.join(mergePath, pngName);
        const outPngPath = path.join(charImgPath, pngName);
        await fs.promises.copyFile(pngPath, outPngPath);
    }
}
exports.mergeImage = mergeImage;
