
/** Type declaration for column-row pair objects */
declare type TColumnRowPair = {
    /** column index of the column-row pair */
    c: number;
    /** row index of the column-row pair */
    r: number;
};

/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param type {string} type-id of the tile as defined in the JSON file
 */
 declare class TileView {
    /**
     * Type-id of the map-tile as defined in the JSON file.
     * @property
     * @public
     */
    public type: string;
    /**
     * Defines the positions of the vertices of the tile.
     * @property
     * @public
     */
    public vertices: number[][];
    /**
     * Defines if the map-tile is movable onto by map-objects.
     * @property
     * @public
     */
    public isMovableTo: boolean;
    /**
     * Position of the tile in terms of column and row index.
     * @property
     * @public
     */
    public mapPos: TColumnRowPair;
}


/**
 * Visual class for the map-objects.
 *
 * @class ObjectView
 * @extends PIXI.Container
 */
 declare class ObjectView {
     
    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property
     * @public
     */
    public isMovableTo: boolean;
    /**
     * Defines if the map-object is interactive/selectable.
     * @property
     * @public
     */
    public isInteractive: boolean;
    /**
     * Number of tiles that map-object covers horizontally on the isometric map
     * @property
     * @public
     */
    public columnSpan: number;
    /**
     * Number of tiles that map-object covers vertically on the isometric map
     * @property
     * @public
     */
    public rowSpan: number;

    /**
     * If true doesn't allow transparency change on this object
     * @property
     * @public
     */
    public noTransparency: boolean;

    /**
     * Defines if the object is a floor object or not
     * @property
     * @public
     */
    public isFloorObject: boolean;

    /**
     * Interaction offset points for the active visual.
     * @property
     * @public
     */
    public currentInteractionOffset: TColumnRowPair;

    /**
     * Current direction of the object.
     * @property
     * @public
     */
    public currentDirection: number;

    /**
     * The collection of custom properties associated with this object.
     * @property
     * @public
     */
    public custom: any;

    /**
     * Position of the object in terms of column and row index.
     * @property
     * @public
     */
    public mapPos: TColumnRowPair;

    /**
     * Changes the map-object's texture(s) according to the specified visual-id.
     *
     * @method
     * @function
     * @public
     * @internal
     *
     * @param vId {string} visual-id
     * @param stopOnFirstFrame {boolean} if true stops on the first frame after changing the visuals, default `false`
     * @param noLoop {boolean} if true the animation will not loop after the first run, default `false`
     * @param onAnimComplete {Function} callback function to call if 'noLoop' is true after the first run of the animation, default `null`
     * @param animSpeed {number} animation speed for the animated visuals, stays the same if not defined, default `null`
     * @return {boolean} `true` if the visual-id was valid and the visual has changed without errors
     */
    public changeVisual(
        vId: string,
        stopOnFirstFrame: boolean,
        noLoop: boolean,
        onAnimComplete: (objectView: ObjectView) => void,
        animSpeed: number
    ): boolean;
}

declare namespace ct {
    namespace traviso {
        /**
         * Returns the TileView instance that sits in the location given by row and column indices.
         *
         * @param r {number} row index of the tile
         * @param c {number} column index of the tile
         * @return {TileView} the tile in the location given
         */
        function getTileAtRowAndColumn(r: number, c: number): TileView;

        /**
         * Returns all the ObjectView instances referenced to the given location with the specified row and column indices.
         *
         * @method
         * @function
         * @public
         *
         * @param r {number} the row index of the map location
         * @param c {number} the column index of the map location
         * @return {Array(ObjectView)} an array of map-objects referenced to the given location
         */
        function getObjectsAtRowAndColumn(level: number, sprite: number, exitRoom: String): ObjectView[];

        /**
         * Centralizes the EngineView instance to the map location specified by row and column index.
         *
         * @method centralizeToLocation
         * @param c {number} the column index of the map location
         * @param r {number} the row index of the map location
         * @param [instantRelocate=false] {boolean} specifies if the camera move will be animated or instant
         */
        function centralizeToLocation(c: number, r: number, instantRelocate: boolean): void;

        /**
         * Zooms the camera one level out.
         *
         * @param instantZoom {boolean} Specifies whether to zoom instantly or with a tween animation
         */
        function zoomOut(instantZoom: boolean): void;
        
        /**
         * Zooms the camera one level in.
         *
         * @method zoomIn
         * @param [instantZoom=false] {boolean} specifies whether to zoom instantly or with a tween animation
         */
        function zoomIn(instantZoom: boolean): void;

        /**
         * Returns the current controllable map-object.
         *
         * @method getCurrentControllable
         * @return {ObjectView} current controllable map-object
         */
        function getCurrentControllable(): ObjectView;

        /**
         * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.
         *
         * @method setCurrentControllable
         * @param obj {ObjectView} object to be set as current controllable
         */
         function setCurrentControllable(obj: ObjectView): void;

        /**
         * Removes the object and its references from the map.
         *
         * @method
         * @function
         * @public
         *
         * @param obj {ObjectView} Either an external display object or a map-object (ObjectView)
         * @param pos {TColumnRowPair} position object including row and column coordinates. If not defined, the engine will use `obj.mapPos` to remove the map-object
         */
         function removeObjectFromLocation(obj: ObjectView, pos?: TColumnRowPair): void ;

        /**
         * Centralizes and zooms the EngineView instance to the object specified.
         *
         * @method focusMapToObject
         * @param obj {ObjectView} the object that map will be focused with respect to
         */
        function focusMapToObject(obj: ObjectView): void;

        /**
         * Checks for a path and moves the map-object on map if there is an available path
         *
         * @method
         * @function
         * @public
         *
         * @param obj {ObjectView} map-object that is being moved
         * @param pos {TColumnRowPair} object including row and column coordinates for the target location
         * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
         * @return {boolean} if there is an available path to move to the target tile
         */
         function checkAndMoveObjectToLocation(obj: ObjectView, pos: TColumnRowPair, speed?: number): boolean;

        /**
         * Sets a callback for when any object reaches its destination
         *
         * @method
         * @function
         *
         * @param callback {Function} A function (or null) that will be called when the object reaches its destination - the completing object is the first argument
         */
         function setReachedDestinationCallback(callback: (obj: ObjectView) => void): void;

        /**
         * Sets a callback for when any object updates
         *
         * @method
         * @function
         *
         * @param callback {Function} A function (or null) that will be called when the object updates - the updating object is the first argument
         */
         function setObjectUpdateCallback(callback: (obj: ObjectView) => void): void;

        /**
         * Moves the current controllable map-object to a location if available.
         *
         * @method
         * @function
         * @public
         *
         * @param pos {TColumnRowPair} object including row and column coordinates for the target location
         * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
         * @return {boolean} if there is an available path to move to the target tile
         */
         function moveCurrentControllableToLocation(pos: TColumnRowPair, speed?: number): boolean;

        /**
         * Enables mouse/touch interactions.
         */
         function enableInteraction(): void;

        /**
         * Enables mouse/touch interactions.
         */
         function disableInteraction(): void;
    }
}
