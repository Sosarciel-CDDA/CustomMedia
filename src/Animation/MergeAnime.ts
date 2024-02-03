import * as path from "path";
import * as fs from "fs";
import { UtilFT, UtilFunc } from "@zwa73/utils";
import { AnimType } from "./AnimTool";
import { OverlayOrdering, PkgTilesetInfo, TilesetCfg, ModTileset } from "cdda-schema";
import { TARGET_GFXPACK, getAnimPath, getGfxPackName, getOutAnimPath, getOutAnimPathAbs } from "@src/CMDefine";
import { DataManager } from "cdda-event";
import { getAnimTypeMutID } from "./UtilGener";


/**动作图片信息 */
type AnimeInfo = Partial<Record<AnimType,{
    /**图片宽度 */
    sprite_width: number;
    /**图片高度 */
    sprite_height: number;
    /**图片偏移 X */
    sprite_offset_x?: number;
    /**图片偏移 Y */
    sprite_offset_y?: number;
    /**图片缩放比例 */
    pixelscale?: number;
    /**帧动画间隔 默认10 Cdda为60帧 */
    interval?:number;
    /**最后一帧的权重 默认等于interval */
    last_weight?:number;
    /**帧动画文件名的格式正则 顺序数字应位于捕获组1 如 Idle_(.*)\.png  默认为 Idle(.*)\.png*/
    format_regex?:string;
}>>;


/**合并并创建序列帧 */
export async function mergeAnime(dm:DataManager,charName:string,forcePackage:boolean=true){
    const imagePath = getAnimPath(charName);
    const validAnim:AnimType[] = [];
    if(!(await UtilFT.pathExists(imagePath))) return validAnim;

    //载入动作数据
    const info = await UtilFT.loadJSONFile(path.join(imagePath,'info')) as AnimeInfo;

    //缓存目录
    const tmpPath = path.join(imagePath,'tmp');
    //检测是否需要强制生成
    const needPackage = forcePackage || !(await UtilFT.pathExists(tmpPath));

    //检查是否有Idle动作
    if(info.Idle==null && Object.values(info).length>=1) throw `${charName} 若要使用其他动画, 则必须要有Idle动画`;

    //提供给打包脚本的info
    const tmpRawInfo:PkgTilesetInfo = [{
        width: 32,            // default sprite size
        height: 32,
        pixelscale: 1         //  Optional. Sets a multiplier for resizing a tileset. Defaults to 1.
    }];
    //显示层级
    const ordering:OverlayOrdering={
        type: "overlay_order",
        overlay_ordering: []
    };
    //处理动作
    //删除缓存
    if(forcePackage)
        await fs.promises.rm(tmpPath, { recursive: true, force: true });
    /**待处理的缓存动画 */
    const rawPath = path.join(tmpPath,'raw');
    /**合并完成的缓存动画 */
    const mergePath = path.join(tmpPath,'merge');

    //遍历动作数据
    for(const mtnName in info){
        const animType = mtnName as AnimType;
        const mtnInfo = info[animType];
        //添加有效动画
        validAnim.push(animType);

        if(mtnInfo==undefined) continue;

        const mtnPath = path.join(imagePath,mtnName);

        //在缓存构建py脚本所需的特殊文件夹名
        const wxh = `${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`;
        const uid = (charName+animType).replaceAll("_","");
        const tmpMthPath = path.join(rawPath, `pngs_${uid}_${wxh}`);
        await UtilFT.ensurePathExists(tmpMthPath,true);

        //复制数据到缓存
        if(needPackage)
            await fs.promises.cp(mtnPath,tmpMthPath,{ recursive: true });
        const {interval,last_weight,format_regex,...rest} = mtnInfo;

        //检查图片 创建动画数据
        const animages = (await fs.promises.readdir(tmpMthPath))
            .filter(fileName=> path.parse(fileName).ext=='.png')
            .sort((a,b)=>{
                const regStr = format_regex||(mtnName+"(.*)\\.png");
                const amatch = a.match(new RegExp(regStr));
                const bmatch = b.match(new RegExp(regStr));
                if(amatch==null||bmatch==null)
                    throw `文件名错误 path:${tmpMthPath} a:${a} b:${b}`;
                return parseInt(amatch[1])-parseInt(bmatch[1]);
            })
            .map(fileName=>({weight:(interval??10),sprite:path.parse(fileName).name}));
        //设置最后一帧循环
        if(animages.length>0 && last_weight!=null && last_weight>0)
            animages[animages.length-1].weight = last_weight;
        //写入动画数据
        await UtilFT.writeJSONFile(path.join(tmpMthPath,uid),{
            //id:`overlay_worn_${animData.armorID}`,
            id:`overlay_mutation_${getAnimTypeMutID(charName,animType)}`,
            fg:animages,
            animated: true,
        });
        //添加主info
        tmpRawInfo.push({
            [uid+'.png']:{
                ...rest
            }
        });
        //添加显示层级
        ordering.overlay_ordering.push({
            id : [getAnimTypeMutID(charName,animType)],
            order : 9999
        })
    }
    //创建info
    await UtilFT.writeJSONFile(path.join(rawPath,'tile_info.json'),tmpRawInfo);
    const str = `NAME: ${charName}\n`     +
                `VIEW: ${charName}\n`     +
                `JSON: tile_config.json\n`+
                `TILESET: tiles.png`      ;
    await fs.promises.writeFile(path.join(rawPath,'tileset.txt'), str);
    //打包
    await UtilFT.ensurePathExists(mergePath,true);
    const packageInfoPath = path.join(mergePath,'tile_config.json');
    //如果不存在目标info文件或强制打包则进行打包
    if(needPackage)
        await UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);

    //写入 mod贴图设置 到角色文件夹
    const charAnimPath = getOutAnimPathAbs(charName);
    await UtilFT.ensurePathExists(charAnimPath,true);
    const tilesetNew = ((await UtilFT.loadJSONFile(packageInfoPath))["tiles-new"] as TilesetCfg[])
        .filter(item => item.file!="fallback.png");
    const animModTileset:ModTileset = {
        type: "mod_tileset",
        compatibility: [await getGfxPackName()],
        "tiles-new": tilesetNew.map(item=>{
            item.file = path.join(getAnimPath(charName),item.file)
            return item;
        }),
    }
    dm.addStaticData([animModTileset,ordering], path.join(getOutAnimPath(charName),"anime_tileset"))

    //复制所有图片 到主目录
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName=> path.parse(fileName).ext=='.png');
    for(let pngName of pngs){
        const pngPath = path.join(mergePath,pngName);
        const outPngPath = path.join(charAnimPath,pngName);
        await fs.promises.copyFile(pngPath,outPngPath);
    }
    return validAnim;
}