type PixiBlendMode = 'NORMAL' | 'ADD' | 'MULTIPLY' | 'SCREEN';

interface ITemplate extends IScriptable {
    depth: number,
    texture: assetRef,
    visible: boolean,
    blendMode?: PixiBlendMode,
    playAnimationOnStart: boolean,
    loopAnimation: boolean,
    animationFPS: number,
    shape?: any,
    extends: {
        [key: string]: unknown
    }
}
