if (ct.room.template.extends && ct.room.template.extends.isTilemap) {
  if (ct.traviso.speech && !ct.traviso.speechBubble) {
    const speechStyle = {
      fontFamily: 'Arial',
      dropShadow: ct.traviso.speech.stroke,
      dropShadowAlpha: 1,
      dropShadowAngle: 0,
      dropShadowBlur: 3,
      dropShadowColor: ct.traviso.speech.stroke,
      dropShadowDistance: 0,
      fill: ct.traviso.speech.color || '#000000',
      fontSize: 12 * ct.traviso.multiplier,
      wordWrap: true,
      wordWrapWidth: 320 * ct.traviso.multiplier,
      align: 'center',
      stroke: ct.traviso.speech.stroke,
      strokeThickness: ct.traviso.speech.stroke ? 2 : 0
    };
    const speechBubble = new PIXI.Text(ct.traviso.speech.text, speechStyle);
    speechBubble.x = ct.traviso.speech.sprite.transform.worldTransform.tx - speechBubble.getBounds().width / 2;
    speechBubble.y = ct.traviso.speech.sprite.transform.worldTransform.ty - 90 * ct.traviso.multiplier - speechBubble.getBounds().height;   
    ct.traviso.speech.bubble = speechBubble;
    ct.pixiApp.stage.addChild(speechBubble);
  }
  else if (ct.traviso.speechText) {
    const speechBubble = ct.traviso.speech.bubble;
    speechBubble.text = ct.traviso.speech.text;
    speechBubble.x = ct.traviso.speech.sprite.transform.worldTransform.tx - speechBubble.getBounds().width / 2;
    speechBubble.y = ct.traviso.speech.sprite.transform.worldTransform.ty - 90 - speechBubble.getBounds().height;   
    
  }
}