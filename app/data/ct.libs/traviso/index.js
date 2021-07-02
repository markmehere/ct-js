(() => {
    window.prepareTRAVISO = (ct, template) => {
        if (ct.traviso && ct.traviso.room === template.name) {
            ct.traviso.resume();
            return ct.traviso;
        }
        const multiplier = window.devicePixelRatio > 1 ? window.devicePixelRatio * 1.5 : 1
        const instanceConfig = {
            mapData: template.traviso,
            externalPIXI: true,
            highlightPath: false,
            highlightTargetTile: true,
            initialPositionFrame: {
                x: 0,
                y: 0,
                w: ct.width,
                h: ct.height
            },
            initialZoomLevel: template.zoom * multiplier - 1,
            maxScale: 2,
        };
        const TRAVISO = window.TRAVISO;
        const engine = TRAVISO.getEngineInstance(instanceConfig);
        const customProperties = ct.room.template.traviso.custom;
        engine._objArray.forEach((row) => {
            row.forEach((arr) => {
                if (arr && arr[0]) {
                    obj = arr[0];
                    cpid = `${obj.type};${obj.mapPos.r};${obj.mapPos.c}`;
                    obj.custom = customProperties[cpid] || {};    
                }
            });
        });
        engine.multiplier = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
        engine.room = ct.room.name;
        engine.setReachedDestinationCallback = (callback) => {
            engine.reachedDestinationCallback = callback;
        };
        engine.setObjectUpdateCallback = (callback) => {
            engine.objectUpdateCallback = callback;
        };
        engine.suspend = () => {
            if (engine.moveEngine._ticker) {
                console.log("TRAVISO: Engine suspended");
                engine.moveEngine._ticker.stop();
            }
        };
        engine.resume = () => {
            console.log("TRAVISO: Engine resumed");
            engine.moveEngine._ticker.start();
        };
        engine.setSpeech = (text, sprite, color, stroke) => {
            engine.speech = {
                text: text,
                sprite: sprite || ct.traviso.getCurrentControllable(),
                color: '#000000',
                stroke: null
            };
            if (color && color.length === 4) engine.speech.color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            else if (color && color.length === 7) engine.speech.color = color;
            if (stroke && stroke.length === 4) engine.speech.stroke = `#${stroke[1]}${stroke[1]}${stroke[2]}${stroke[2]}${stroke[3]}${stroke[3]}`;
            else if (stroke && stroke.length === 7) engine.speech.stroke = stroke;
        };
        engine.clearSpeech = () => {
            engine.speechSprite = null;
            engine.speechColor = undefined;
        };
        engine.setMovable = (asset, isMovableTo) => {
            if (asset.verticies) {
                asset.isMovableTo = isMovableTo;
                engine._pathFinding.setCell(asset.mapPos.c, asset.mapPos.r, isMovableTo ? 1 : 0);
            }
            else {
                asset.isMovableTo = isMovableTo;
                engine._pathFinding.setDynamicCell(asset.mapPos.c, asset.mapPos.r, isMovableTo ? 1 : 0);
            }
        };
        engine.suspensions = [];
        engine._config.objectReachedDestinationCallback = (obj) => {
            if (template.traviso.initialControllableLocation) {
                if (obj.type == template.traviso.initialControllableLocation.controllableId) {
                    for (let r = obj.mapPos.r - 1; r <= obj.mapPos.r + 1; r++) {
                        for (let c = obj.mapPos.c - 1; c <= obj.mapPos.c + 1; c++) {
                            const objs = engine.getObjectsAtLocation({ r, c });
                            for (let i = 0; i < objs.length; i++) {
                                engine.suspensions = engine.suspensions.filter(x => x !== objs[i]);
                                const finishApproach = (result) => {
                                    if (result === 'suspend') {
                                        engine.suspensions.push(objs[i]);
                                    }
                                    else if (result === 'open') {
                                        objs[i].changeVisual('alternate');
                                        engine.setMovable(objs[i], true);
                                    }
                                    else if (result === 'close') {
                                        objs[i].changeVisual('idle');
                                        engine.setMovable(objs[i], false);
                                    }
                                    else if (result) {
                                        engine.removeObjectFromLocation(objs[i]);
                                    }
                                };
                                if (template.traviso.objects[objs[i].type]) {
                                    const typeName = template.traviso.objects[objs[i].type].spriteName;
                                    if (ct.types.templates[typeName].onStopNear) {
                                        ct.types.templates[typeName].onStopNear.apply(objs[i], [finishApproach]);
                                    }
                                    if (obj.mapPos.r === r && obj.mapPos.c === c) {
                                        if (ct.types.templates[typeName].onReach) {
                                            ct.types.templates[typeName].onReach.apply(objs[i], [finishApproach]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.reachedDestinationCallback) this.reachedDestinationCallback(obj);
        };
        engine._config.objectUpdateCallback = (obj) => {
            if (template.traviso.initialControllableLocation) {
                if (obj.type == template.traviso.initialControllableLocation.controllableId) {
                    for (let r = obj.mapPos.r - 1; r <= obj.mapPos.r + 1; r++) {
                        for (let c = obj.mapPos.c - 1; c <= obj.mapPos.c + 1; c++) {
                            const objs = engine.getObjectsAtLocation({ r, c });
                            for (let i = 0; i < objs.length; i++) {
                                if (engine.suspensions.find(x => x === objs[i])) continue;
                                const finishApproach = (result) => {
                                    if (result === 'suspend') {
                                    }
                                    else if (result === 'open') {
                                        objs[i].changeVisual('alternate');
                                        engine.setMovable(objs[i], true);
                                    }
                                    else if (result === 'close') {
                                        objs[i].changeVisual('idle');
                                        engine.setMovable(objs[i], false);
                                    }
                                    else if (result) {
                                        engine.removeObjectFromLocation(objs[i]);
                                    }
                                };
                                if (template.traviso.objects[objs[i].type]) {
                                    const typeName = template.traviso.objects[objs[i].type].spriteName;
                                    if (ct.types.templates[typeName].onStopNear) {
                                        ct.types.templates[typeName].onApproach.apply(objs[i], [finishApproach]);
                                    }
                                    if (obj.mapPos.r === r && obj.mapPos.c === c) {
                                        if (ct.types.templates[typeName].onReach) {
                                            ct.types.templates[typeName].onCollect.apply(objs[i], [finishApproach]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.objectUpdateCallback) this.objectUpdateCallback(obj);
        };
        return engine;
    }
})();

