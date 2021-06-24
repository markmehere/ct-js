function getTravisoExport(room) {
    const roomExport = {
        tiles: {},
        objects: {},
        tileHighlightImage: {},
        initialControllableLocation: {},
        groundMap: [],
        objectsMap: []
    };
    const currentProject = global.currentProject;
    const textures = {};
    let i, j, tileCnt, copyCnt;
    for (j = 0; j < room.height / 50; j++) {
        roomExport.groundMap[j] = { row: [] };
        roomExport.objectsMap[j] = { row: [] };
        for (i = 0; i < room.width / 50; i++) {
            roomExport.groundMap[j].row[i] = '0  ';
            roomExport.objectsMap[j].row[i] = '0  ';
        }
    }
    for (i = 0; i < currentProject.textures.length; i++) {
        textures[currentProject.textures[i].uid] = currentProject.textures[i];
    }
    tileCnt = 0;
    const tileCache = {}, copyCache = {};
    let id;
    for (i = 0; i < room.tiles[0].tiles.length; i++) {
        const tile = room.tiles[0].tiles[i];
        const texture = textures[tile.texture];
        const path = texture.name + '@frame' + (texture.grid[0] * tile.grid[1] + tile.grid[0]);
        const blockingTiles = (currentProject.libs.traviso && currentProject.libs.traviso.blockingTiles) || {};
        if (tileCache[path]) {
            id = tileCache[path];
        }
        else {
            tileCnt++;
            id = tileCache[path] = tileCnt;
            roomExport.tiles[id] = {
                path,
                movable: !blockingTiles[texture.name]
            };
        }
        roomExport.groundMap[Math.floor(tile.y / 50)].row[Math.floor(tile.x / 50)] = id.toString() + " ".repeat(3 - id.toString().length);
    }
    copyCnt = 0;
    for (i = 0; i < room.copies.length; i++) {
        const details = room.copies[i];
        const exts = details.exts || {};
        const sprite = currentProject.types.find(x => x.uid === details.uid);
        const texture = textures[sprite.texture];
        const grid = texture.grid;
        const path = texture.name;
        if (copyCache[path]) {
            id = copyCache[path];
        }
        else {
            copyCnt++;
            id = copyCache[path] = copyCnt + tileCnt;
            roomExport.objects[id] = {
                movable: !!exts.movable,
                interactive: !!exts.interactive,
                rowSpan: parseInt(exts.rowSpan || '1', 10),
                columnSpan: parseInt(exts.columnSpan || '1', 10),
                noTransparency: (exts.noTransparency === undefined ? texture.height < 96 : !!exts.noTransparency),
                floor: !!exts.floor,
                visuals: {}
            };
            if (grid[0] === 1 && grid[1] === 1) {
                roomExport.objects[id].visuals.idle = { frames: [{ path: `${path}@frame0` }] };
            }
            else if (grid[1] === 1) {
                roomExport.objects[id].visuals.idle = { frames: [] };
                if (exts.dawdle) {
                    roomExport.objects[id].visuals.idle.frames.push({ path: `${path}@frame0` })
                    roomExport.objects[id].visuals.dawdle = { frames: [] };
                    if (typeof (exts.dawdle) === 'string') {
                        dawdles = exts.dawdle.split(',');
                        for (let k = 0; k < dawdles.length; k++) {
                            if (parseInt(dawdles[k], 10) >= 0 && parseInt(dawdles[k], 10) < grid[0]) {
                                roomExport.objects[id].visuals.dawdle.frames.push({ path: `${path}@frame${parseInt(dawdles[k], 10)}` });
                            }
                            else {
                                roomExport.objects[id].visuals.dawdle.frames.push({ path: `${path}@frame0` });
                            }
                        }
                    }
                    else {
                        roomExport.objects[id].visuals.dawdle.frames.push({ path: `${path}@frame0` });
                    }
                }
                else {
                    for (let k = 0; k < grid[0]; k++) {
                        roomExport.objects[id].visuals.idle.frames.push({ path: `${path}@frame${k}` });
                    }
                }
            }
            else {
                roomExport.objects[id].visuals.idle = { frames: [{ path: exts.eastFacing ? `${path}@frame${grid[0] * 3}` : `${path}@frame0` }] };
                if (exts.idleDir) {
                    roomExport.objects[id].visuals.idle_sw = { frames: [{ path: `${path}@frame0` }] };
                    roomExport.objects[id].visuals.idle_nw = { frames: [{ path: `${path}@frame${grid[0]}` }] };
                    roomExport.objects[id].visuals.idle_ne = { frames: [{ path: `${path}@frame${grid[0] * 2}` }] };
                    roomExport.objects[id].visuals.idle_se = { frames: [{ path: `${path}@frame${grid[0] * 3}` }] };
                }
                else {
                    roomExport.objects[id].visuals.idle_sw = JSON.parse(JSON.stringify(roomExport.objects[id].visuals.idle));
                    roomExport.objects[id].visuals.idle_nw = JSON.parse(JSON.stringify(roomExport.objects[id].visuals.idle));
                    roomExport.objects[id].visuals.idle_ne = JSON.parse(JSON.stringify(roomExport.objects[id].visuals.idle));
                    roomExport.objects[id].visuals.idle_se = JSON.parse(JSON.stringify(roomExport.objects[id].visuals.idle));
                }
                roomExport.objects[id].visuals.move_sw = { path: `${path}@frame`, startIndex: 1, numberOfFrames: grid[0] - 1, extension: "" };
                roomExport.objects[id].visuals.move_nw = { path: `${path}@frame`, startIndex: grid[0] + 1, numberOfFrames: grid[0] - 1, extension: "" };
                roomExport.objects[id].visuals.move_ne = { path: `${path}@frame`, startIndex: grid[0] * 2 + 1, numberOfFrames: grid[0] - 1, extension: "" };
                roomExport.objects[id].visuals.move_se = { path: `${path}@frame`, startIndex: grid[0] * 3 + 1, numberOfFrames: grid[0] - 1, extension: "" };
                if (grid[1] === 5) {
                    const specialCount = exts.specialFrames || (texture.untill - grid[0] * 4) || grid[0] - 1;
                    roomExport.objects[id].visuals.special = { path: `${path}@frame`, startIndex: grid[0] * 4, numberOfFrames: specialCount, extension: "" };
                    roomExport.objects[id].visuals.despecial = { path: `${path}@frame`, startIndex: grid[0] * 4 + specialCount, numberOfFrames: specialCount, extension: "", reverse: true };
                }
            }
        }
        if (sprite.uid === currentProject.libs.traviso.controllable) {
            roomExport.initialControllableLocation = {
                rowIndex: details.y / 50,
                columnIndex: details.x / 50,
                controllableId: `${id}`
            };
        }
        roomExport.objectsMap[Math.floor(details.y / 50)].row[Math.floor(details.x / 50)] = id.toString() + " ".repeat(3 - id.toString().length);
    }
    for (j = 0; j < room.height / 50; j++) {
        roomExport.objectsMap[j].row = roomExport.objectsMap[j].row.join(', ');
        roomExport.groundMap[j].row = roomExport.groundMap[j].row.join(', ');
    }
    if (currentProject.libs.traviso.highlightTile) {
        roomExport.tileHighlightImage = { path: textures[currentProject.libs.traviso.highlightTile].name + '@frame0' };
    }

    return roomExport;
}

module.exports = {
    getTravisoExport
};
