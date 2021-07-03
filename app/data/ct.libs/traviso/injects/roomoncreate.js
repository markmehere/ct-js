(function () {
  let overallDawdle = 0;
  for (let r = 0; r < ct.traviso._objArray.length; r++) {
    for (let c = 0; c < ct.traviso._objArray[r].length; c++) {
      if (ct.traviso._objArray[r][c]) {
        for (let i = 0; i < ct.traviso._objArray[r][c].length; i++) {
          const obj = ct.traviso._objArray[r][c][i];
          if (obj._textures.dawdle) {
            obj.changeVisual('dawdle', overallDawdle);
            overallDawdle += Math.ceil(Math.random() * 2);
          }
        }
      }
    }
  }
})();
