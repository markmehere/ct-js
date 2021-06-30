(() => {
    window.prepareTRAVISO = (ct, template) => {
        if (ct.traviso && ct.traviso.room === template.name) {
            ct.traviso.resume();
            return ct.traviso;
        }
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
            initialZoomLevel: template.zoom - 1,
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
        engine._config.objectReachedDestinationCallback = (obj) => {
            if (template.traviso.initialControllableLocation) {
                if (obj.type == template.traviso.initialControllableLocation.controllableId) {
                    for (let r = obj.mapPos.r - 1; r <= obj.mapPos.r + 1; r++) {
                        for (let c = obj.mapPos.c - 1; c <= obj.mapPos.c + 1; c++) {
                            const objs = engine.getObjectsAtLocation({ r, c });
                            for (let i = 0; i < objs.length; i++) {
                                if (template.traviso.objects[objs[i].type]) {
                                    const typeName = template.traviso.objects[objs[i].type].spriteName;
                                    if (ct.types.templates[typeName].onStopNear) {
                                        const shouldDelete = ct.types.templates[typeName].onStopNear.apply(objs[i]);
                                        if (shouldDelete) {
                                            engine.removeObjectFromLocation(objs[i]);
                                        }
                                    }
                                    if (obj.mapPos.r === r && obj.mapPos.c === c) {
                                        if (ct.types.templates[typeName].onReach) {
                                            const shouldDelete = ct.types.templates[typeName].onReach.apply(objs[i]);
                                            if (shouldDelete) {
                                                engine.removeObjectFromLocation(objs[i]);
                                            }
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
                                if (template.traviso.objects[objs[i].type]) {
                                    const typeName = template.traviso.objects[objs[i].type].spriteName;
                                    if (ct.types.templates[typeName].onStopNear) {
                                        const shouldDelete = ct.types.templates[typeName].onApproach.apply(objs[i]);
                                        if (shouldDelete) {
                                            engine.removeObjectFromLocation(objs[i]);
                                        }
                                    }
                                    if (obj.mapPos.r === r && obj.mapPos.c === c) {
                                        if (ct.types.templates[typeName].onReach) {
                                            const shouldDelete = ct.types.templates[typeName].onCollect.apply(objs[i]);
                                            if (shouldDelete) {
                                                engine.removeObjectFromLocation(objs[i]);
                                            }
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

