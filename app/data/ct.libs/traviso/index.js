(() => {
    window.prepareTRAVISO = (ct, template) => {
        if (ct.traviso && ct.traviso.room === template.name) {
            ct.traviso.resume();
            return ct.traviso;
        }
        let multiplier = window.devicePixelRatio > 1 ? window.devicePixelRatio * 1.5 : 1
        if (window.travisoExtraZoom > 0.01) multiplier *= window.travisoExtraZoom;
        const instanceConfig = {
            mapData: JSON.parse(JSON.stringify(template.traviso)),
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
            defaultSpeed: template.speed,
            mapDraggable: template.mapDraggable,
            maxScale: 3
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
        engine.getSpriteName = (obj) => ct.room.template.traviso.objects[obj.type].spriteName;
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
        engine.relocateCurrentControllableTo = (pos) => {
            const r = pos.r, c = pos.c;
            const controllable = engine.getCurrentControllable();
            engine.removeObjectFromLocation(controllable);
            engine.addObjectToLocation(controllable, { r, c });
            engine.setCurrentControllable(controllable);
            engine.centralizeToLocation(c, r, true);
        };
        engine.setSpeech = (text, sprite, color, stroke, index) => {
            engine.speech = engine.speech || [];
            const ind = index || 0;
            engine.speech[ind] = engine.speech[ind] || {
                color: '#000000',
                stroke: null
            };
            engine.speech[ind] = {
                text: (typeof text === 'string') ? text : '',
                sprite: (sprite || ct.traviso.getCurrentControllable()),
                bubble: engine.speech[ind].bubble,
                callback: (typeof text === 'function') ? text : engine.speech[ind].callback,
                torigin: engine.speech[ind].torigin || Date.now(),
                color: engine.speech[ind].color,
                stroke: engine.speech[ind].stroke,
                justSet: true
            };
            if (color && color.length === 4) engine.speech[ind].color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            else if (color && color.length === 7) engine.speech[ind].color = color;
            if (stroke && stroke.length === 4) engine.speech[ind].stroke = `#${stroke[1]}${stroke[1]}${stroke[2]}${stroke[2]}${stroke[3]}${stroke[3]}`;
            else if (stroke && stroke.length === 7) engine.speech[ind].stroke = stroke;
        };
        engine.clearSpeech = (index) => {
            if (index === undefined) {
                for (let i = 0; i < engine.speech.length; i++) {
                    if (engine.speech[i] && engine.speech[i].bubble) engine.parent.removeChild(engine.speech[i].bubble);
                }
                engine.speech = null;
            }
            else {
                if (engine.speech[index] && engine.speech[index].bubble) engine.parent.removeChild(engine.speech[index].bubble);
                engine.speech[index] = null;
            }
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
                    if (ct.traviso.speech) {
                        for (let spind = 0; spind < ct.traviso.speech.length; spind++) {
                            if (ct.traviso.speech[spind]) {
                                if (ct.traviso.speech[spind].callback && !ct.traviso.speech[spind].justSet) {
                                    ct.traviso.speech[spind].text = ct.traviso.speech[spind].callback(obj.mapPos.r, obj.mapPos.c, Date.now() - ct.traviso.speech[spind].torigin) || ct.traviso.speech[spind].text;
                                }
                                ct.traviso.speech[spind].justSet = false;
                            }
                        }
                    }
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

