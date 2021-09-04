if (ct.room.template.extends && ct.room.template.extends.isTilemap && ct.traviso) {
  let overallDawdle = 0;
  for (let r = 0; r < ct.traviso._objArray.length; r++) {
    for (let c = 0; c < ct.traviso._objArray[r].length; c++) {
      if (ct.traviso._objArray[r][c]) {
        for (let i = 0; ct.traviso._objArray[r][c] && (i < ct.traviso._objArray[r][c].length); i++) {
          const obj = ct.traviso._objArray[r][c][i];
          if (obj) {
            if (obj._textures.dawdle) {
              obj.changeVisual('dawdle', overallDawdle);
              overallDawdle += Math.ceil(Math.random() * 2);
            }
            const typeName = ct.room.template.traviso.objects[obj.type].spriteName;
            if (ct.types.templates[typeName].onCreate) {
                ct.types.templates[typeName].onCreate.apply({}, [obj]);
            }
          }
        }
      }
    }
  }
}
