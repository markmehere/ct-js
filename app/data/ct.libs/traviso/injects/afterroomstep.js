if (ct.room.template.extends && ct.room.template.extends.isTilemap) {
  if (ct.traviso && ct.traviso.speech) {
    for (let spind = 0; spind < ct.traviso.speech.length; spind++) {
      const speechObj = ct.traviso.speech[spind];
      if (speechObj && !speechObj.bubble) {
        const speechStyle = {
          fontFamily: 'Arial',
          dropShadow: speechObj.stroke,
          dropShadowAlpha: 1,
          dropShadowAngle: 0,
          dropShadowBlur: 3 * ct.traviso.multiplier,
          dropShadowColor: speechObj.stroke,
          dropShadowDistance: 0,
          fill: speechObj.color || '#000000',
          fontSize: 12 * ct.traviso.multiplier,
          wordWrap: true,
          wordWrapWidth: 320 * ct.traviso.multiplier,
          align: 'center',
          stroke: speechObj.stroke,
          strokeThickness: (speechObj.stroke ? 2 : 0) * ct.traviso.multiplier
        };
        const speechBubble = new PIXI.Text(speechObj.text, speechStyle);
        speechBubble.x = speechObj.sprite.transform.worldTransform.tx - speechBubble.getBounds().width / 2;
        speechBubble.y = speechObj.sprite.transform.worldTransform.ty - 100 * Math.min(ct.traviso.multiplier, 2.5) - speechBubble.getBounds().height;   
        speechObj.bubble = speechBubble;
        // I can't work out why adding to ct.pixiApp.stage doesn't work
        ct.traviso.parent.addChild(speechBubble);
      }
      else if (speechObj && speechObj.text) {
        const speechBubble = speechObj.bubble;
        if (ct.traviso.parent.children.indexOf(speechBubble) === -1) {
          ct.traviso.parent.addChild(speechBubble);
          speechObj.sprite.changeVisual(speechObj.sprite._textures.dawdle ? "dawdle" : "idle");
        }
        speechBubble.text = speechObj.text;
        speechBubble.x = speechObj.sprite.transform.worldTransform.tx - speechBubble.getBounds().width / 2;
        speechBubble.y = speechObj.sprite.transform.worldTransform.ty - 100 * Math.min(ct.traviso.multiplier, 2.5) - speechBubble.getBounds().height;    
      }
    }
  }
}