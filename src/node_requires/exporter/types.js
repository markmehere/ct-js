const {getTextureFromId} = require('../resources/textures');
const {getUnwrappedExtends} = require('./utils');

const stringifyTypes = function (proj) {
    /* Stringify types */
    var types = '';
    for (const k in proj.types) {
        var type = proj.types[k];
        types += `
ct.types.templates["${type.name}"] = {
    depth: ${type.depth},
    ${type.texture !== -1 ? 'texture: "' + getTextureFromId(type.texture).name + '",' : ''}
    onStep: function () {
        ${type.onstep}
    },
    onDraw: function () {
        ${type.ondraw}
    },
    onDestroy: function () {
        ${type.ondestroy}
    },
    onCreate: function () {
        ${type.oncreate}
    },
    onApproach: function(finishApproach) {
        ${type.onapproach || ''}
    },
    onStopNear: function(finishApproach) {
        ${type.onstopnear || ''}
    },
    onCollect: function(finishApproach) {
        ${type.oncollect || ''}
    },
    onReach: function(finishApproach) {
        ${type.onreach || ''}
    },
    extends: ${type.extends ? JSON.stringify(getUnwrappedExtends(type.extends), null, 4) : '{}'}
};
ct.types.list['${type.name}'] = [];`;
    }
    return types;
};

module.exports = {
    stringifyTypes
};
