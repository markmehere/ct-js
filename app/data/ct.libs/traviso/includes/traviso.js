/*!
 * traviso.js - v0.1.4
 * Copyright (c) 2021, Hakan Karlidag - @axaq
 * www.travisojs.com
 *
 * Compiled: Wed, 23 Jun 2021 10:01:03 UTC
 *
 * traviso.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var TRAVISO = (function (exports, pixi_js) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Checks if the value existy.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param value {unknown} value to check
     * @return {boolean} if the value existy or not
     */
    var existy = function existy(value) {
      return value !== null && value !== undefined;
    };
    /**
     * Linear maps a given number in a source range to a target range
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param v {number} value to map
     * @param min1 {number} minimum value of the source range
     * @param max1 {number} maximum value of the source range
     * @param min2 {number} minimum value of the target range
     * @param max2 {number} maximum value of the target range
     * @param noOutliers {boolean} If the outlier values won't be processed, default false
     * @return {number} mapped value according to target range
     */

    var mathMap = function mathMap(v, min1, max1, min2, max2, noOutliers) {
      if (noOutliers === void 0) {
        noOutliers = false;
      }

      if (noOutliers) {
        if (v < min1) {
          return min2;
        } else if (v > max1) {
          return max2;
        }
      }

      return min2 + (max2 - min2) * (v - min1) / (max1 - min1);
    };
    /**
     * Produces dot product of two vectors.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param v1 {TPositionPair} first vector
     * @param v2 {TPositionPair} second vector
     * @return {number} dot product of two vectors
     */

    var dotProduct = function dotProduct(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y;
    };
    /**
     * Produces unit vector of a given vector.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param v {TPositionPair} source vector
     * @return {TPositionPair} unit vector
     */

    var getUnit = function getUnit(v) {
      var m = Math.sqrt(v.x * v.x + v.y * v.y);
      return {
        x: v.x / m,
        y: v.y / m
      };
    };
    /**
     * Checks if the given point is the polygon defined by the vertices.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param gp {TPositionPair} point to check
     * @param vertices {Array(Array(Number))} array containing the vertices of the polygon
     * @return {boolean} if the point is inside the polygon
     */

    var isInPolygon = function isInPolygon(gp, vertices) {
      var testY = gp.y;
      var testX = gp.x;
      var nVert = vertices.length;
      var i,
          j,
          c = false;

      for (i = 0, j = nVert - 1; i < nVert; j = i++) {
        if (vertices[i][1] > testY !== vertices[j][1] > testY && testX < (vertices[j][0] - vertices[i][0]) * (testY - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]) {
          c = !c;
        }
      }

      return c;
    };
    /**
     * Calculates the distance between two points.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param p1 {TPositionPair} first point
     * @param p2 {TPositionPair} second point
     * @return {number} the distance between two points
     */

    var getDist = function getDist(p1, p2) {
      return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    };

    // export type Traviso = {
    //     DIRECTIONS: TDirections,
    // }

    /**
     * The direction IDs to be used in the engine
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @property
     * @static
     * @public
     * @constant
     */
    var DIRECTIONS = {
      O: 0,
      S: 1,
      SW: 2,
      W: 3,
      NW: 4,
      N: 5,
      NE: 6,
      E: 7,
      SE: 8
    };
    /**
     * Texture IDs reserved for internal use
     *
     * @static
     * @private
     * @constant
     * @property
     * @internal
     */

    var RESERVED_TEXTURE_IDS = ['idle', 'idle_s', 'idle_sw', 'idle_w', 'idle_nw', 'idle_n', 'idle_ne', 'idle_e', 'idle_se', 'move_s', 'move_sw', 'move_w', 'move_nw', 'move_n', 'move_ne', 'move_e', 'move_se'];
    /**
     * The types of available path finding algorithms
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @property
     * @static
     * @public
     * @constant
     */

    var PF_ALGORITHMS = {
      ASTAR_ORTHOGONAL: 0,
      ASTAR_DIAGONAL: 1
    };
    var KEY_EMPTY_TILE = '0';
    var KEY_NO_OBJECTS = '0';

    var logEnabled = true;
    /**
     * Writes logs to the browser console
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param s {string} text to log
     */

    function trace(s) {
      if (logEnabled) {
        // eslint-disable-next-line no-console
        self.console.log('TRAVISO: ' + s);
      }
    }
    /**
     * Determines if TRAVISO can log helper text.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param enabled {boolean} enable logging or not, default `true`
     * @return {boolean} logging enabled or not
     */

    function enableDisableLogging(enabled) {
      if (enabled === void 0) {
        enabled = true;
      }

      return logEnabled = enabled;
    }

    /**
     * Returns an object with all properties of a map-object defined by object-type
     *
     * @method
     * @function
     * @private
     * @static
     *
     * @param engine {EngineView} engine instance
     * @param objectType {string} type/id of the related object tag defined in the json file
     * @return {IObjectInfo} an object with certain properties of a map-object
     */

    var getObjectInfo = function getObjectInfo(engine, objectType) {
      var objInfo = engine.mapData.objects[objectType];

      if (objInfo) {
        var textures = {};

        for (var key in objInfo.textureNames) {
          if (Object.prototype.hasOwnProperty.call(objInfo.textureNames, key)) {
            textures[key] = getObjectTextures(engine, objectType, key);
          }
        }

        return {
          m: objInfo.m,
          i: objInfo.i,
          f: objInfo.f,
          nt: objInfo.nt,
          t: textures,
          io: objInfo.io,
          s: objInfo.s,
          rowSpan: objInfo.rowSpan,
          columnSpan: objInfo.columnSpan
        };
      }

      throw new Error('TRAVISO: No info defined for object type: ' + objectType);
    };
    /**
     * Returns an array of textures {PIXI.Texture} belong to a map-object defined by object-type and sprite-id
     *
     * @function getObjectTextures
     * @memberof TRAVISO
     * @static
     * @private
     * @param engine {EngineView} engine instance
     * @param objectType {string} type/id of the related object tag defined in the json file
     * @param visualId {string} id of the related v tag defined in the json file
     * @return {Array(PIXI.Texture)} an array of textures
     */

    var getObjectTextures = function getObjectTextures(engine, objectType, visualId) {
      var objInfo = engine.mapData.objects[objectType];

      if (objInfo) {
        var textures = null;
        var textureNames = objInfo.textureNames[visualId];

        if (textureNames && textureNames.length > 0) {
          textures = [];

          for (var j = 0; j < textureNames.length; j++) {
            textures[textures.length] = pixi_js.Texture.from(textureNames[j]);
          }
        } else {
          trace('No textures defined for object type: ' + objectType + ' and visualId: ' + visualId);
        }

        return textures;
      }

      throw new Error('TRAVISO: No info defined for object type: ' + objectType);
    };
    /**
     * Returns an object with all properties of a map-tile defined by tileType
     *
     * @method
     * @function
     * @static
     *
     * @param engine {EngineView} engine instance
     * @param tileType {string} type/id of the related tile tag defined in the json file
     * @return {TTileInfo} an information object with certain properties (movability and textures) of a map-tile
     */

    var getTileInfo = function getTileInfo(engine, tileType) {
      var tileInfo = engine.mapData.tiles[tileType];

      if (tileInfo) {
        return {
          // m : tileInfo.m,
          m: tileInfo.movable,
          t: tileInfo.path ? [pixi_js.Texture.from(tileInfo.path)] : []
        };
      } else if (engine.mapData.singleGroundImage) {
        return {
          m: parseInt(tileType) > 0,
          t: []
        };
      } else {
        throw new Error('TRAVISO: No info defined for tile type: ' + tileType);
      }
    };
    /**
     * Returns the predefined moving texture id for the given direction
     *
     * @method
     * @function
     * @static
     *
     * @param dir {TDirection} index of the direction
     * @return {ObjectVisualKey} texture id for the given direction
     */

    var getMovingDirVisualId = function getMovingDirVisualId(dir) {
      return RESERVED_TEXTURE_IDS[dir + 8];
    };
    /**
     * Returns the predefined stationary texture id for the given direction
     *
     * @method
     * @function
     * @static
     *
     * @param dir {TDirection} index of the direction
     * @return {ObjectVisualKey} texture id for the given direction
     */

    var getStationaryDirVisualId = function getStationaryDirVisualId(dir) {
      return RESERVED_TEXTURE_IDS[dir];
    };
    /**
     * Returns the direction (id) between two locations
     *
     * @function getDirBetween
     * @memberof TRAVISO
     * @static
     * @private
     * @param r1 {number} row index of the first location
     * @param c1 {number} column index of the first location
     * @param r2 {number} row index of the second location
     * @param c2 {number} column index of the second location
     * @return {TDirection} direction id
     */

    var getDirBetween = function getDirBetween(r1, c1, r2, c2) {
      var dir = DIRECTIONS.S;

      if (r1 === r2) {
        if (c1 === c2) {
          dir = DIRECTIONS.O;
        } else if (c1 < c2) {
          dir = DIRECTIONS.NE;
        } else {
          dir = DIRECTIONS.SW;
        }
      } else if (r1 < r2) {
        if (c1 === c2) {
          dir = DIRECTIONS.SE;
        } else if (c1 < c2) {
          dir = DIRECTIONS.E;
        } else {
          dir = DIRECTIONS.S;
        }
      } else if (r1 > r2) {
        if (c1 === c2) {
          dir = DIRECTIONS.NW;
        } else if (c1 < c2) {
          dir = DIRECTIONS.N;
        } else {
          dir = DIRECTIONS.W;
        }
      }

      return dir;
    };

    /**
     * Visual class for the map-objects.
     *
     * @class ObjectView
     * @extends PIXI.Container
     */

    var ObjectView =
    /** @class */
    function (_super) {
      __extends(ObjectView, _super);
      /**
       * Visual class constructor for the map-objects.
       *
       * @constructor
       *
       * @param engine {EngineView} the engine instance that the map-object sits in, required
       * @param type {number} type-id of the object as defined in the JSON file
       * @param animSpeed {number} animation speed for the animated visuals, default 0.5
       */


      function ObjectView(engine, type, animSpeed) {
        if (animSpeed === void 0) {
          animSpeed = 0.5;
        }

        var _this = _super.call(this) || this;

        _this.onContainerAnimComplete_delayed_binded = _this.onContainerAnimComplete_delayed.bind(_this);
        _this.onContainerAnimComplete_binded = _this.onContainerAnimComplete.bind(_this);
        _this._engine = engine;
        _this.type = type;
        var info = getObjectInfo(_this._engine, _this.type);
        _this.isMovableTo = info.m;
        _this.isInteractive = info.i;
        _this.interactive = _this.interactiveChildren = false;
        _this.isFloorObject = info.f;
        _this.noTransparency = info.nt;
        _this.rowSpan = info.rowSpan;
        _this.columnSpan = info.columnSpan;
        var xAnchor = _this.rowSpan / (_this.columnSpan + _this.rowSpan);
        _this._textures = info.t;
        _this._interactionOffsets = info.io;
        _this.currentInteractionOffset = _this._interactionOffsets.idle;
        _this._container = new pixi_js.AnimatedSprite(_this._textures.idle);
        _this._container.interactive = _this._container.interactiveChildren = false;
        _this._container.anchor.x = xAnchor;
        _this._container.anchor.y = 1;

        _this.addChild(_this._container);

        _this.animSpeed = animSpeed;

        _this._container.gotoAndStop(0);

        return _this;
      }

      Object.defineProperty(ObjectView.prototype, "animSpeed", {
        /**
         * Animation speed for the animated visuals included in the map-object visuals.
         *
         * @property
         * @default 0.5
         */
        get: function get() {
          return this._container.animationSpeed;
        },
        set: function set(value) {
          this._container.animationSpeed = existy(value) && value > 0 ? value : 0.5;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Changes the map-object's texture(s) according to the specified direction-id and the state of the map-object (moving or stationary).
       *
       * @method
       * @function
       * @public
       *
       * @param direction {TDirection} direction-id as defined in `TRAVISO.DIRECTIONS`
       * @param moving {boolean} if the requested visuals are for moving or stationary state, default `false`
       * @param stopOnFirstFrame {boolean} if true stops on the first frame after changing the visuals, default `false`
       * @param noLoop {boolean} if true the animation will not loop after the first run, default `false`
       * @param onAnimComplete {Function} callback function to call if 'noLoop' is true after the first run of the animation, default `null`
       * @param animSpeed {number} animation speed for the animated visuals, stays the same if not defined, default `null`
       */

      ObjectView.prototype.changeVisualToDirection = function (direction, moving, stopOnFirstFrame, noLoop, onAnimComplete, animSpeed) {
        if (moving === void 0) {
          moving = false;
        }

        if (stopOnFirstFrame === void 0) {
          stopOnFirstFrame = false;
        }

        if (noLoop === void 0) {
          noLoop = false;
        }

        if (onAnimComplete === void 0) {
          onAnimComplete = null;
        }

        if (animSpeed === void 0) {
          animSpeed = null;
        }

        if (!this.changeVisual(moving ? getMovingDirVisualId(direction) : getStationaryDirVisualId(direction), stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)) {
          if (!this.changeVisual('idle', stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)) {
            throw new Error("no 'idle' visual defined as backup for object type " + this.type);
          } else {
            this.currentDirection = DIRECTIONS.O;
          }
        } else {
          this.currentDirection = direction;
        }
      };
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


      ObjectView.prototype.changeVisual = function (vId, stopOnFirstFrame, noLoop, onAnimComplete, animSpeed) {
        if (stopOnFirstFrame === void 0) {
          stopOnFirstFrame = false;
        }

        if (noLoop === void 0) {
          noLoop = false;
        }

        if (onAnimComplete === void 0) {
          onAnimComplete = null;
        }

        if (animSpeed === void 0) {
          animSpeed = null;
        }

        if (!this._textures[vId]) {
          // trace("!!! No textures defined for vId: " + vId);
          return false;
        }

        this.currentInteractionOffset = this._interactionOffsets[vId];

        if (this._container.textures === this._textures[vId] && !noLoop) {
          this._container.loop = !noLoop;

          if (existy(animSpeed) && animSpeed > 0) {
            this.animSpeed = animSpeed;
          }

          return true;
        }

        this._container.textures = this._textures[vId];

        if (!stopOnFirstFrame && this._textures[vId].length > 1) {
          this._container.loop = !noLoop;

          if (noLoop && onAnimComplete) {
            this.onContainerAnimCompleteCallback = onAnimComplete;
            this._container.onComplete = this.onContainerAnimComplete_binded;
          }

          if (existy(animSpeed) && animSpeed > 0) {
            this.animSpeed = animSpeed;
          }

          this._container.gotoAndPlay(0);
        } else {
          this._container.gotoAndStop(0);
        }

        if (this._engine.objectUpdateCallback) {
          this._engine.objectUpdateCallback(this);
        }

        return true;
      };

      ObjectView.prototype.onContainerAnimComplete = function () {
        setTimeout(this.onContainerAnimComplete_delayed_binded, 100);
      };

      ObjectView.prototype.onContainerAnimComplete_delayed = function () {
        this.onContainerAnimCompleteCallback(this);
        this.onContainerAnimCompleteCallback = null;
      };
      /**
       * Clears all references.
       *
       * @method
       * @function
       * @public
       */


      ObjectView.prototype.destroy = function () {
        if (this._container) {
          this._engine = null;
          this._textures = null; // this.removeChild(this._container);
          // this._container.textures = null;

          this._container.onComplete = null;
          this._container = null;
        }
      };

      return ObjectView;
    }(pixi_js.Container);

    /**
     * Visual class for the map-tiles.
     *
     * @class TileView
     * @extends PIXI.Container
     * @constructor
     * @param engine {EngineView} the engine instance that the map-tile sits in
     * @param type {string} type-id of the tile as defined in the JSON file
     */

    var TileView =
    /** @class */
    function (_super) {
      __extends(TileView, _super);
      /**
       * Visual class constructor for the map-tiles.
       *
       * @constructor
       *
       * @param engine {EngineView} the engine instance that the map-tile sits in
       * @param type {string} type-id of the tile as defined in the JSON file
       */


      function TileView(engine, type) {
        var _this = _super.call(this) || this;
        /**
         * The highlight state of the map-tile.
         * @property
         * @private
         * @internal
         */


        _this._isHighlighted = false;
        _this.onHighlightTweenEnd_binded = _this.onHighlightTweenEnd.bind(_this);
        _this._engine = engine;
        _this.type = type;
        var halfHeight = _this._engine.tileHalfHeight;
        var halfWidth = _this._engine.tileHalfWidth;
        _this.vertices = [[-halfWidth, 0], [0, -halfHeight], [halfWidth, 0], [0, halfHeight]];
        var tileInfo = getTileInfo(_this._engine, _this.type);
        _this.isMovableTo = tileInfo.m;

        if (tileInfo.t.length > 0) {
          _this._tileGraphics = new pixi_js.AnimatedSprite(tileInfo.t);
          _this._tileGraphics.anchor.x = 0.5;
          _this._tileGraphics.anchor.y = 0.5;

          _this.addChild(_this._tileGraphics);

          _this._tileGraphics.gotoAndStop(parseInt(_this.type));
        } // const colorsArray = [0x0106ff, 0x3b6d14, 0x8789ff, 0xb32bf9, 0xeb36d0, 0xfe0000, 0xeb3647, 0xf27e31, 0xffea01, 0x00ff18, 0x3b6d14, 0xfa9bbb, 0xf9c7bc, 0x8d6729, 0x633e07];
        // const c = colorsArray[ this.type < 2 ? this.type : 0 ];
        // this._tileGraphics = new PIXI.Graphics();
        // this._tileGraphics.clear();
        // this._tileGraphics.beginFill(c);
        // this._tileGraphics.moveTo(this.vertices[0][0], this.vertices[0][1]);
        // for (let i=1; i < this.vertices.length; i++)
        // {
        // this._tileGraphics.lineTo(this.vertices[i][0], this.vertices[i][1]);
        // };
        // this._tileGraphics.endFill();


        if (_this._engine.mapData.tileHighlightImage) {
          _this._highlightedOverlay = new pixi_js.Sprite(pixi_js.Texture.from(_this._engine.mapData.tileHighlightImage.path));
          _this._highlightedOverlay.anchor.x = 0.5;
          _this._highlightedOverlay.anchor.y = 0.5;

          _this.addChild(_this._highlightedOverlay);
        } else {
          _this._highlightedOverlay = new pixi_js.Graphics();

          _this._highlightedOverlay.clear();

          _this._highlightedOverlay.lineStyle(_this._engine.tileHighlightStrokeAlpha <= 0 ? 0 : 2, _this._engine.tileHighlightStrokeColor, _this._engine.tileHighlightStrokeAlpha);

          _this._highlightedOverlay.beginFill(_this._engine.tileHighlightFillColor, _this._engine.tileHighlightFillAlpha);

          _this._highlightedOverlay.moveTo(_this.vertices[0][0], _this.vertices[0][1]);

          for (var i = 1; i < _this.vertices.length; i++) {
            _this._highlightedOverlay.lineTo(_this.vertices[i][0], _this.vertices[i][1]);
          }

          _this._highlightedOverlay.lineTo(_this.vertices[0][0], _this.vertices[0][1]);

          _this._highlightedOverlay.endFill();

          _this.addChild(_this._highlightedOverlay);
        }

        _this._highlightedOverlay.scale.x = _this._highlightedOverlay.scale.y = 0.1;
        _this._highlightedOverlay.visible = false;
        return _this;
      }
      /**
       * Changes the highlight state of the map-tile.
       *
       * @method
       * @function
       * @public
       *
       * @param isHighlighted {boolean} if the tile is being highlighted or not
       * @param instant {boolean} if the change will be instant or animated, default `false`
       */


      TileView.prototype.setHighlighted = function (isHighlighted, instant) {
        if (instant === void 0) {
          instant = false;
        }

        if (this._isHighlighted !== isHighlighted) {
          if (instant) {
            this._highlightedOverlay.scale.x = this._highlightedOverlay.scale.y = isHighlighted ? 1 : 0.1;
            this._highlightedOverlay.visible = isHighlighted;
            this._isHighlighted = isHighlighted;
            return;
          }

          if (isHighlighted) {
            this._highlightedOverlay.visible = isHighlighted;
          }

          this._isHighlighted = isHighlighted;
          var ts = isHighlighted ? 1 : 0.1;

          if (this._highlightedOverlay.scale.x === ts) {
            this._highlightedOverlay.visible = isHighlighted;
          } else {
            this._highlightedOverlay.scale.x = this._highlightedOverlay.scale.y = isHighlighted ? 0.1 : 1; // @formatter:off

            this._engine.moveEngine.addTween(this._highlightedOverlay.scale, 0.5, {
              x: ts,
              y: ts
            }, 0, 'linear', true, this.onHighlightTweenEnd_binded); // @formatter:on

          }
        }
      };
      /**
       * @method
       * @function
       * @private
       * @internal
       */


      TileView.prototype.onHighlightTweenEnd = function () {
        this._highlightedOverlay.visible = this._isHighlighted;
      };
      /**
       * Clears all references.
       *
       * @method
       * @function
       * @public
       */


      TileView.prototype.destroy = function () {
        if (this._engine) {
          if (this._engine && this._engine.moveEngine) {
            this._engine.moveEngine.killTweensOf(this._highlightedOverlay.scale);
          }

          this._engine = null;
          this._highlightedOverlay = null;
          this._tileGraphics = null;
        }
      };

      return TileView;
    }(pixi_js.Container);

    /**
     * Returns the proper easing method to use depending on the easing id specified.
     *
     * @method getEasingFunc
     * @private
     * @param e {string} the easing id
     * @return {Function} the easing method to use
     */
    var getEasingFunc = function getEasingFunc(e) {
      if (e === 'easeInOut' || e === 'easeInOutQuad' || e === 'Quad.easeInOut') {
        return easeInOutQuad;
      } else if (e === 'easeIn' || e === 'easeInQuad' || e === 'Quad.easeIn') {
        return easeInQuad;
      } else if (e === 'easeOut' || e === 'easeOutQuad' || e === 'Quad.easeOut') {
        return easeOutQuad;
      } else {
        return linearTween;
      }
    };
    /**
     * Linear tween calculation.
     *
     * @method linearTween
     * @private
     * @param t {number} current time
     * @param b {number} initial value
     * @param c {number} difference with the target value
     * @param d {number} total time
     * @return {number} result of the calculation
     */

    var linearTween = function linearTween(t, b, c, d) {
      return c * t / d + b;
    };
    /**
     * Quadratic ease-in tween calculation.
     *
     * @method easeInQuad
     * @private
     * @param t {number} current time
     * @param b {number} initial value
     * @param c {number} difference with the target value
     * @param d {number} total time
     * @return {number} result of the calculation
     */

    var easeInQuad = function easeInQuad(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    };
    /**
     * Quadratic ease-out tween calculation.
     *
     * @method easeOutQuad
     * @private
     * @param t {number} current time
     * @param b {number} initial value
     * @param c {number} difference with the target value
     * @param d {number} total time
     * @return {number} result of the calculation
     */

    var easeOutQuad = function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    };
    /**
     * Quadratic ease-in-out tween calculation.
     *
     * @method easeInOutQuad
     * @private
     * @param t {number} current time
     * @param b {number} initial value
     * @param c {number} difference with the target value
     * @param d {number} total time
     * @return {number} result of the calculation
     */

    var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
      t /= d / 2;

      if (t < 1) {
        return c / 2 * t * t + b;
      }

      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    /**
     * @author Hakan Karlidag - @axaq
     */
    /**
     * Holds and manages all the logic for tween animations and map-object movement on the map.
     * This is created and used by EngineView instances.
     *
     * @class MoveEngine
     */

    var MoveEngine =
    /** @class */
    function () {
      /**
       * Constructor function for MoveEngine.
       *
       * @constructor
       *
       * @param engine {EngineView} the engine instance that the animations will perform on
       * @param defaultSpeed {number} default speed for the map-objects to be used when they move on map, default 3
       */
      function MoveEngine(engine, defaultSpeed) {
        if (defaultSpeed === void 0) {
          defaultSpeed = 3;
        }
        /**
         * Specifies if the move-engine will process the object movements.
         * @property
         * @private
         * @default `false`
         */


        this._activeForMovables = false;
        /**
         * Specifies if the move-engine will process the tweens.
         * @property
         * @private
         * @default `false`
         */

        this._activeForTweens = false;
        /**
         * Specifies if the move-engine will process the tweens and object movements.
         * @property
         * @private
         * @default `true`
         */

        this._processFrame = true;
        /**
         * The list to store current map-objects in move.
         * @property
         * @private
         * @default `[]`
         */

        this._movables = [];
        /**
         * The list to store targets for the current tweens.
         * @property
         * @private
         * @default `[]`
         */

        this._tweenTargets = [];
        /**
         * Used to calculate how many frames a tween will take to process.
         * @property
         * @private
         * @default `60`
         */

        this._fps = 60;
        this._engine = engine;
        this._defaultSpeed = defaultSpeed;
        this._processFunc = this.run.bind(this);
        this._ticker = new pixi_js.Ticker();

        this._ticker.add(this._processFunc);

        this._ticker.start();
      }
      /**
       * Adds a single tween for the given object.
       *
       * @method
       * @function
       * @public
       *
       * @param o {ITweenTarget} the object to add tween animation to
       * @param duration {number} the duration of the tween animation in seconds
       * @param vars {{ [key: string]: number }} the object defining which properties of the target object will be animated
       * @param delay {number} the amount of waiting before the tween animation starts, in seconds, default `0`
       * @param easing {EasingType} type of the easing, default `'linear'`
       * @param overwrite {boolean} if the other tween animations assigned to the same object are going to be killed, default `false`
       * @param onComplete {Function} callback function to be called after the tween animation finished, default `null`
       */


      MoveEngine.prototype.addTween = function (o, duration, vars, delay, easing, overwrite, onComplete) {
        if (delay === void 0) {
          delay = 0;
        }

        if (easing === void 0) {
          easing = 'linear';
        }

        if (overwrite === void 0) {
          overwrite = false;
        }

        if (onComplete === void 0) {
          onComplete = null;
        }

        var v = null;

        for (var prop in vars) {
          if (o[prop] !== vars[prop]) {
            if (!v) {
              v = {};
            }

            v[prop] = {
              b: o[prop],
              c: vars[prop] - o[prop]
            };
          }
        }

        if (v) {
          var t = {
            target: o,
            duration: duration,
            delay: Number(delay) || 0,
            easingFunc: getEasingFunc(easing),
            overwrite: overwrite || false,
            onComplete: onComplete || null,
            totalFrames: duration * this._fps,
            currentFrame: 0,
            vars: v
          };

          var idx = this._tweenTargets.indexOf(o);

          if (idx >= 0) {
            var tweens = o.tweens;

            if (!tweens) {
              tweens = [];
            }

            if (t.overwrite) {
              for (var i = 0; i < tweens.length; i++) {
                tweens[i] = null;
              }

              tweens = [];
            }

            tweens[tweens.length] = t;
            o.tweens = tweens;
          } else {
            o.tweens = [t];
            this._tweenTargets[this._tweenTargets.length] = o;
          }

          if (this._tweenTargets.length > 0 && !this._activeForTweens) {
            this._activeForTweens = true;
          }
        }
      };
      /**
       * Removes a single tween from the given object.
       *
       * @method
       * @function
       * @public
       *
       * @param o {ITweenTarget} the object to remove the tween animation from
       * @param t {ITween} the tween to be removed from the object
       * @return {boolean} if the tween is found and removed
       */


      MoveEngine.prototype.removeTween = function (o, t) {
        var targetRemoved = false;

        if (o && t) {
          var idx = this._tweenTargets.indexOf(o);

          if (idx >= 0) {
            if (this._tweenTargets[idx].tweens && this._tweenTargets[idx].tweens.length > 0) {
              var tweens = this._tweenTargets[idx].tweens;
              var idx2 = tweens.indexOf(t);

              if (idx2 >= 0) {
                t.onComplete = null;
                t.easingFunc = null;
                t.target = null;
                tweens.splice(idx2, 1);

                if (tweens.length === 0) {
                  this._tweenTargets.splice(idx, 1);

                  targetRemoved = true;
                }
              } else {
                throw new Error('No tween defined for this object');
              }
            } else {
              throw new Error('No tween defined for this object');
            }
          } else {
            throw new Error('No tween target defined for this object');
          }

          if (this._tweenTargets.length === 0) {
            this._activeForTweens = false;
          }
        }

        return targetRemoved;
      };
      /**
       * Removes and kills all tweens assigned to the given object.
       *
       * @method
       * @function
       * @public
       *
       * @param o {ITweenTarget} the object to remove the tween animations from
       * @return {boolean} if any tween is found and removed from the object specified
       */


      MoveEngine.prototype.killTweensOf = function (o) {
        var targetRemoved = false;

        var idx = this._tweenTargets.indexOf(o);

        if (idx >= 0) {
          if (this._tweenTargets[idx].tweens && this._tweenTargets[idx].tweens.length > 0) {
            var tweens = this._tweenTargets[idx].tweens;

            for (var j = 0; j < tweens.length; j++) {
              tweens[j].onComplete = null;
              tweens[j].easingFunc = null;
              tweens[j].target = null;
              tweens[j] = null;
            }

            this._tweenTargets[idx].tweens = null;
          }

          this._tweenTargets.splice(idx, 1);

          targetRemoved = true;
        }

        if (this._tweenTargets.length === 0) {
          this._activeForTweens = false;
        }

        return targetRemoved;
      };
      /**
       * Removes and kills all the tweens in operation currently.
       *
       * @method
       * @function
       * @private
       */


      MoveEngine.prototype.removeAllTweens = function () {
        this._activeForTweens = false;
        var tweens, i, j;
        var len = this._tweenTargets.length;

        for (i = 0; i < len; i++) {
          tweens = this._tweenTargets[i].tweens;

          for (j = 0; j < tweens.length; j++) {
            tweens[j].onComplete = null;
            tweens[j].easingFunc = null;
            tweens[j].target = null;
            tweens[j] = null;
          }

          this._tweenTargets[i].tweens = null;
          this._tweenTargets[i] = null;
        }

        this._tweenTargets = [];
      };
      /**
       * Adds a map-object as movable to the engine.
       *
       * @method
       * @function
       * @public
       *
       * @param o {IMovable} the map-object to add as movable
       */


      MoveEngine.prototype.addMovable = function (o) {
        if (this._movables.indexOf(o) >= 0) {
          return;
        }

        this._movables[this._movables.length] = o;

        if (this._movables.length > 0 && !this._activeForMovables) {
          this._activeForMovables = true;
        } // all movables needs to have the following variables:
        // speedMagnitude, speedUnit (more to come...)
        // NOTE: might be a good idea to add all necessary parameters to the object here

      };
      /**
       * Removes a map-object from the current movables list.
       *
       * @method
       * @function
       * @public
       *
       * @param o {IMovable} the map-object to remove
       * @return {boolean} if the map-object is removed or not
       */


      MoveEngine.prototype.removeMovable = function (o) {
        var idx = this._movables.indexOf(o);

        if (idx !== -1) {
          o.speedUnit = {
            x: 0,
            y: 0
          };

          this._movables.splice(idx, 1);
        }

        if (this._movables.length === 0) {
          this._activeForMovables = false;
        } // TODO: might be a good idea to remove/reset all related parameters from the object here


        return idx !== -1;
      };
      /**
       * Removes all movables.
       *
       * @method
       * @function
       * @private
       */


      MoveEngine.prototype.removeAllMovables = function () {
        this._activeForMovables = false;
        var len = this._movables.length;

        for (var i = 0; i < len; i++) {
          this._movables[i] = null;
        }

        this._movables = [];
      };
      /**
       * Changes the current path of a map-object.
       *
       * @method
       * @function
       * @public
       *
       * @param o {IMovable} the map-object to add the path to
       * @param path {Array(GridNode)} the new path
       * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
       */


      MoveEngine.prototype.addNewPathToObject = function (o, path, speed) {
        if (o.currentPath && o.currentTarget) {
          path[path.length] = o.currentPath[o.currentPathStep];
        }

        o.currentPath = path;
        o.currentPathStep = o.currentPath.length - 1;
        o.speedMagnitude = speed || o.speedMagnitude || this._defaultSpeed;
      };
      /**
       * Prepares a map-object for movement.
       *
       * @method
       * @function
       * @public
       *
       * @param o {IMovable} the movable map-object
       * @param path {Array(GridNode)} the path for the object
       * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
       */


      MoveEngine.prototype.prepareForMove = function (o, path, speed) {
        if (speed === void 0) {
          speed = null;
        }

        o.currentPath = path;
        o.currentPathStep = o.currentPath.length - 1;
        o.speedMagnitude = speed || o.speedMagnitude || this._defaultSpeed;
      };
      /**
       * Sets movement specific parameters for the map-object according to target location.
       *
       * @method
       * @function
       * @public
       *
       * @param o {IMovable} the movable map-object
       * @param pos {TColumnRowPair} target location
       */


      MoveEngine.prototype.setMoveParameters = function (o, pos) {
        var px = this._engine.getTilePosXFor(pos.r, pos.c);

        var py = this._engine.getTilePosYFor(pos.r, pos.c) + this._engine.tileHalfHeight;

        o.speedUnit = getUnit({
          x: px - o.position.x,
          y: py - o.position.y
        });
        o.currentTarget = {
          x: px,
          y: py
        };
        o.currentReachThresh = Math.ceil(Math.sqrt(o.speedUnit.x * o.speedUnit.x + o.speedUnit.y * o.speedUnit.y) * o.speedMagnitude);
      };
      /**
       * Method that precesses a single frame.
       *
       * @method
       * @function
       * @private
       */


      MoveEngine.prototype.run = function () {
        // NOTE: Write an alternative with a real time driven animator
        if (this._processFrame) {
          var len = void 0,
              o = void 0,
              i = void 0;

          if (this._activeForMovables) {
            len = this._movables.length;
            var dist = void 0;

            for (i = 0; i < len; i++) {
              o = this._movables[i]; // move object
              // speed vector (magnitude and direction)

              o.prevPosition = {
                x: o.position.x,
                y: o.position.y
              }; // check for target reach

              if (o.currentTarget) {
                dist = getDist(o.position, o.currentTarget);

                if (dist <= o.currentReachThresh) {
                  // reached to the target
                  o.position.x = o.currentTarget.x;
                  o.position.y = o.currentTarget.y;

                  this._engine.onObjMoveStepEnd(o);

                  i--;
                  len--;
                  continue;
                }
              }

              o.position.x += o.speedMagnitude * o.speedUnit.x;
              o.position.y += o.speedMagnitude * o.speedUnit.y; // check for tile change

              this._engine.checkForTileChange(o);

              this._engine.checkForFollowCharacter(o); // check for direction change

            } // will need a different loop to process crashes
            // for (i=0; i < len; i++)
            // {
            // o = this._movables[i];
            // }

          }

          if (this._activeForTweens) {
            // and a loop for tween animations
            len = this._tweenTargets.length;
            var t = void 0,
                tt = void 0,
                tweens = void 0,
                j = void 0,
                vars = void 0;

            for (i = 0; i < len; i++) {
              tt = this._tweenTargets[i];
              tweens = tt.tweens;

              for (j = 0; j < tweens.length; j++) {
                t = tweens[j];
                t.currentFrame++;
                vars = t.vars;

                for (var prop in vars) {
                  tt[prop] = t.easingFunc(t.currentFrame, vars[prop].b, vars[prop].c, t.totalFrames);
                }

                if (t.currentFrame >= t.totalFrames) {
                  if (t.onComplete) {
                    t.onComplete();
                  }

                  if (this.removeTween(tt, t)) {
                    i--;
                    len--;
                  }

                  j--;
                }
              }
            }
          }
        }
      };
      /**
       * Clears all references and stops all animations and tweens.
       *
       * @method
       * @function
       * @public
       */


      MoveEngine.prototype.destroy = function () {
        trace('MoveEngine destroy');
        this._processFrame = false;

        if (this._ticker) {
          this._ticker.stop();
        }

        this.removeAllMovables();
        this.removeAllTweens();
        this._movables = null;
        this._tweenTargets = null;
        this._engine = null;
        this._ticker = null;
      };

      return MoveEngine;
    }();

    var GridNode =
    /** @class */
    function () {
      function GridNode(c, r, weight) {
        this.x = c;
        this.y = r;
        this.weight = weight;
        this.mapPos = {
          c: c,
          r: r
        };
      }

      GridNode.prototype.toString = function () {
        return '[' + String(this.x) + ' ' + String(this.y) + ']';
      };

      GridNode.prototype.getCost = function (fromNeighbor) {
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
          return this.weight * 1.41421;
        }

        return this.weight;
      };

      GridNode.prototype.isWall = function () {
        return this.weight === 0;
      };

      return GridNode;
    }();

    var BinaryHeap =
    /** @class */
    function () {
      function BinaryHeap(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
      }

      BinaryHeap.prototype.push = function (element) {
        // Add the new element to the end of the array.
        this.content.push(element); // Allow it to sink down.

        this.sinkDown(this.content.length - 1);
      };

      BinaryHeap.prototype.pop = function () {
        // Store the first element so we can return it later.
        var result = this.content[0]; // Get the element at the end of the array.

        var end = this.content.pop(); // If there are any elements left, put the end element at the
        // start, and let it bubble up.

        if (this.content.length > 0) {
          this.content[0] = end;
          this.bubbleUp(0);
        }

        return result;
      }; // private remove(node: unknown) {
      //     const i = this.content.indexOf(node);
      //     // When it is found, the process seen in 'pop' is repeated
      //     // to fill up the hole.
      //     const end = this.content.pop();
      //     if (i !== this.content.length - 1) {
      //         this.content[i] = end;
      //         if (this.scoreFunction(end) < this.scoreFunction(node)) {
      //             this.sinkDown(i);
      //         }
      //         else {
      //             this.bubbleUp(i);
      //         }
      //     }
      // }


      BinaryHeap.prototype.size = function () {
        return this.content.length;
      };

      BinaryHeap.prototype.rescoreElement = function (node) {
        this.sinkDown(this.content.indexOf(node));
      };

      BinaryHeap.prototype.sinkDown = function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n]; // When at 0, an element can not sink any further.

        while (n > 0) {
          // Compute the parent element's index, and fetch it.
          var parentN = (n + 1 >> 1) - 1,
              parent_1 = this.content[parentN]; // Swap the elements if the parent is greater.

          if (this.scoreFunction(element) < this.scoreFunction(parent_1)) {
            this.content[parentN] = element;
            this.content[n] = parent_1; // Update 'n' to continue at the new position.

            n = parentN;
          } // Found a parent that is less, no need to sink any further.
          else {
              break;
            }
        }
      };

      BinaryHeap.prototype.bubbleUp = function (n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);
        var conditionMet = true;

        while (conditionMet) {
          // Compute the indices of the child elements.
          var child2N = n + 1 << 1,
              child1N = child2N - 1; // This is used to store the new position of the element, if any.

          var swap = null,
              child1Score = void 0; // If the first child exists (is inside the array)...

          if (child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N];
            child1Score = this.scoreFunction(child1); // If the score is less than our element's, we need to swap.

            if (child1Score < elemScore) {
              swap = child1N;
            }
          } // Do the same checks for the other child.


          if (child2N < length) {
            var child2 = this.content[child2N],
                child2Score = this.scoreFunction(child2);

            if (child2Score < (swap === null ? elemScore : child1Score)) {
              swap = child2N;
            }
          } // If the element needs to be moved, swap it, and continue.


          if (swap !== null) {
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
          } // Otherwise, we are done.
          else {
              conditionMet = false;
              break;
            }
        }
      };

      return BinaryHeap;
    }();

    /**
     * Includes all path finding logic.
     *
     * @class PathFinding
     */

    var PathFinding =
    /** @class */
    function () {
      /**
       * Constructor function for the PathFinding class.
       *
       * @constructor
       *
       * @param mapSizeC {number} number of columns
       * @param mapSizeR {number} number of rows
       * @param options {PathFindingOptions}  settings for the search algorithm, default `{}`
       */
      function PathFinding(mapSizeC, mapSizeR, options) {
        if (options === void 0) {
          options = {};
        } //define map


        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.heuristic = this.diagonal ? PathFinding.HEURISTICS.diagonal : PathFinding.HEURISTICS.manhattan;
        this.closest = !!options.closest;
        this.grid = [];
        var c = 0,
            r = 0,
            node;

        for (c = 0; c < mapSizeC; c++) {
          this.grid[c] = [];

          for (r = 0; r < mapSizeR; r++) {
            node = new GridNode(c, r, 1);
            this.grid[c][r] = node;
            this.nodes.push(node);
          }
        }

        this.init();
      }
      /**
       * Cleans/resets all nodes.
       *
       * @method init
       * @private
       */


      PathFinding.prototype.init = function () {
        this.dirtyNodes = [];

        for (var i = 0; i < this.nodes.length; i++) {
          this.cleanNode(this.nodes[i]);
        }
      }; // /**
      //  * Cleans only dirty nodes.
      //  *
      //  * @method cleanDirty
      //  * @private
      //  */
      // private cleanDirty(): void {
      //     for (let i = 0; i < this.dirtyNodes.length; i++) {
      //         this.cleanNode(this.dirtyNodes[i]);
      //     }
      //     this.dirtyNodes = [];
      // }

      /**
       * Marks a node as dirty.
       *
       * @method markDirty
       * @private
       * @param node {TRAVISO.PathFinding.GridNode} node to be marked
       */


      PathFinding.prototype.markDirty = function (node) {
        this.dirtyNodes.push(node);
      };
      /**
       * Finds adjacent/neighboring cells of a single node.
       *
       * @method neighbors
       * @param node {TRAVISO.PathFinding.GridNode} source node
       * @return {Array(TRAVISO.PathFinding.GridNode)} an array of available cells
       */


      PathFinding.prototype.neighbors = function (node) {
        var ret = [],
            x = node.x,
            y = node.y,
            grid = this.grid; // West

        if (grid[x - 1] && grid[x - 1][y]) {
          ret.push(grid[x - 1][y]);
        } // East


        if (grid[x + 1] && grid[x + 1][y]) {
          ret.push(grid[x + 1][y]);
        } // South


        if (grid[x] && grid[x][y - 1]) {
          ret.push(grid[x][y - 1]);
        } // North


        if (grid[x] && grid[x][y + 1]) {
          ret.push(grid[x][y + 1]);
        }

        if (this.diagonal) {
          // Southwest
          if (grid[x - 1] && grid[x - 1][y - 1]) {
            ret.push(grid[x - 1][y - 1]);
          } // Southeast


          if (grid[x + 1] && grid[x + 1][y - 1]) {
            ret.push(grid[x + 1][y - 1]);
          } // Northwest


          if (grid[x - 1] && grid[x - 1][y + 1]) {
            ret.push(grid[x - 1][y + 1]);
          } // Northeast


          if (grid[x + 1] && grid[x + 1][y + 1]) {
            ret.push(grid[x + 1][y + 1]);
          }
        }

        return ret;
      };

      PathFinding.prototype.toString = function () {
        var graphString = [],
            nodes = this.grid; // when using grid

        var rowDebug, row, x, len, y, l;

        for (x = 0, len = nodes.length; x < len; x++) {
          rowDebug = [];
          row = nodes[x];

          for (y = 0, l = row.length; y < l; y++) {
            rowDebug.push(row[y].weight);
          }

          graphString.push(rowDebug.join(' '));
        }

        return graphString.join('\n');
      };
      /**
       * Solves path finding for the given source and destination locations.
       *
       * @method solve
       * @private
       * @param originC {number} column index of the source location
       * @param originR {number} row index of the source location
       * @param destC {number} column index of the destination location
       * @param destR {number} row index of the destination location
       * @return {Array(Object)} solution path
       */


      PathFinding.prototype.solve = function (originC, originR, destC, destR) {
        var start = this.grid[originC][originR];
        var end = this.grid[destC][destR];
        var result = this.search(start, end, {
          heuristic: this.heuristic,
          closest: this.closest
        });
        return result && result.length > 0 ? result : null;
      };
      /**
       * Finds available adjacent cells of an area defined by location and size.
       *
       * @method getAdjacentOpenCells
       * @param cellC {number} column index of the location
       * @param cellR {number} row index of the location
       * @param sizeC {number} column size of the area
       * @param sizeR {number} row size of the area
       * @return {Array(Object)} an array of available cells
       */


      PathFinding.prototype.getAdjacentOpenCells = function (cellC, cellR, sizeC, sizeR) {
        var r,
            c,
            cellArray = [];

        for (r = cellR; r > cellR - sizeR; r--) {
          for (c = cellC; c < cellC + sizeC; c++) {
            // NOTE: concat is browser dependent. It is fastest for Chrome. Might be a good idea to use for loop or "a.push.apply(a, b);" for other browsers
            cellArray = cellArray.concat(this.neighbors(this.grid[c][r]));
          }
        }

        return cellArray;
      };

      PathFinding.prototype.pathTo = function (node) {
        var curr = node;
        var path = [];

        while (curr.parent) {
          path.push(curr);
          curr = curr.parent;
        } // return path.reverse();


        return path;
      };

      PathFinding.prototype.getHeap = function () {
        return new BinaryHeap(function (node) {
          return node.f;
        });
      };
      /**
       * Perform an A* Search on a graph given a start and end node.
       *
       * @method
       * @function
       * @private
       *
       * @param start {GridNode} beginning node of search
       * @param end {GridNode} end node of the search
       * @param options {Object} Search options
       * @return {Array(GridNode)} resulting list of nodes
       */


      PathFinding.prototype.search = function (start, end, options) {
        if (options === void 0) {
          options = {};
        }

        this.init();
        var heuristic = options.heuristic || PathFinding.HEURISTICS.manhattan;
        var closest = options.closest || false;
        var openHeap = this.getHeap();
        var closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);
        openHeap.push(start);

        while (openHeap.size() > 0) {
          // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
          var currentNode = openHeap.pop(); // End case -- result has been found, return the traced path.

          if (currentNode === end) {
            return this.pathTo(currentNode);
          } // Normal case -- move currentNode from open to closed, process each of its neighbors.


          currentNode.closed = true; // Find all neighbors for the current node.

          var neighbors = this.neighbors(currentNode);

          for (var i = 0, il = neighbors.length; i < il; ++i) {
            var neighbor = neighbors[i];

            if (neighbor.closed || neighbor.isWall()) {
              // Not a valid node to process, skip to next neighbor.
              continue;
            } // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.


            var gScore = currentNode.g + neighbor.getCost(currentNode),
                beenVisited = neighbor.visited;

            if (!beenVisited || gScore < neighbor.g) {
              // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
              neighbor.visited = true;
              neighbor.parent = currentNode;
              neighbor.h = neighbor.h || heuristic(neighbor, end);
              neighbor.g = gScore;
              neighbor.f = neighbor.g + neighbor.h;
              this.markDirty(neighbor);

              if (closest) {
                // If the neighbor is closer than the current closestNode or if it's equally close but has
                // a cheaper path than the current closest node then it becomes the closest node
                if (neighbor.h < closestNode.h || neighbor.h === closestNode.h && neighbor.g < closestNode.g) {
                  closestNode = neighbor;
                }
              }

              if (!beenVisited) {
                // Pushing to heap will put it in proper place based on the 'f' value.
                openHeap.push(neighbor);
              } else {
                // Already seen the node, but since it has been re-scored we need to reorder it in the heap
                openHeap.rescoreElement(neighbor);
              }
            }
          }
        }

        if (closest) {
          return this.pathTo(closestNode);
        } // No result was found - empty array signifies failure to find path.


        return [];
      };

      PathFinding.prototype.cleanNode = function (node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
      };
      /**
       * Checks if the location is occupied/available or not.
       *
       * @method isCellFilled
       * @param c {number} column index of the location
       * @param r {number} row index of the location
       * @return {Array(Object)} if the location is not available
       */


      PathFinding.prototype.isCellFilled = function (c, r) {
        if (this.grid[c][r].weight === 0) {
          return true;
        }

        return false;
      };
      /**
       * Sets individual cell state for ground layer.
       *
       * @method setCell
       * @param c {number} column index of the location
       * @param r {number} row index of the location
       * @param movable {boolean} free to move or not
       */


      PathFinding.prototype.setCell = function (c, r, movable) {
        this.grid[c][r].staticWeight = this.grid[c][r].weight = movable;
      };
      /**
       * Sets individual cell state for objects layer.
       *
       * @method setDynamicCell
       * @param c {number} column index of the location
       * @param r {number} row index of the location
       * @param movable {boolean} free to move or not
       */


      PathFinding.prototype.setDynamicCell = function (c, r, movable) {
        // if it is movable by static tile property
        if (this.grid[c][r].staticWeight !== 0) {
          this.grid[c][r].weight = movable;
        }
      };
      /**
       * Clears all references.
       *
       * @method
       * @function
       * @public
       */


      PathFinding.prototype.destroy = function () {
        this.grid = null;
        this.nodes = null;
        this.dirtyNodes = null;
        this.heuristic = null;
      };
      /**
       * See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
       *
       * @property
       * @private
       * @static
       */


      PathFinding.HEURISTICS = {
        manhattan: function manhattan(pos0, pos1) {
          var d1 = Math.abs(pos1.x - pos0.x);
          var d2 = Math.abs(pos1.y - pos0.y);
          return d1 + d2;
        },
        diagonal: function diagonal(pos0, pos1) {
          var D = 1;
          var D2 = Math.sqrt(2);
          var d1 = Math.abs(pos1.x - pos0.x);
          var d2 = Math.abs(pos1.y - pos0.y);
          return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
        }
      };
      return PathFinding;
    }();

    /**
     * Main PIXI.Container class to hold all views within the engine and all map related logic.
     *
     * @class EngineView
     * @extends PIXI.Container
     */

    var EngineView =
    /** @class */
    function (_super) {
      __extends(EngineView, _super);
      /**
       * Constructor method for the main PIXI.Container class to hold all views within the engine and all map related logic.
       *
       * @constructor
       * @param config {TEngineConfiguration} configuration object for the isometric engine instance
       */


      function EngineView(config) {
        var _this = _super.call(this) || this;
        /**
         * Active position frame for the engine.
         *
         * @property
         * @private
         * @internal
         */


        _this._posFrame = {
          x: 0,
          y: 0,
          w: 800,
          h: 600
        };
        /**
         * @default `false`
         * @property
         * @private
         * @internal
         */

        _this._dragging = false;
        _this.onMouseUp_binded = _this.onMouseUp.bind(_this);
        _this.onMouseDown_binded = _this.onMouseDown.bind(_this);
        _this.onMouseMove_binded = _this.onMouseMove.bind(_this);
        _this._config = config; // set the properties that are set by default when not defined by the user

        _this._config.followCharacter = existy(_this._config.followCharacter) ? _this._config.followCharacter : true;
        _this._config.changeTransparencies = existy(_this._config.changeTransparencies) ? _this._config.changeTransparencies : true;
        _this._config.highlightPath = existy(_this._config.highlightPath) ? _this._config.highlightPath : true;
        _this._config.highlightTargetTile = existy(_this._config.highlightTargetTile) ? _this._config.highlightTargetTile : true;
        _this._config.tileHighlightAnimated = existy(_this._config.tileHighlightAnimated) ? _this._config.tileHighlightAnimated : true;
        _this._config.tileHighlightFillColor = existy(_this._config.tileHighlightFillColor) ? _this._config.tileHighlightFillColor : 0x80d7ff;
        _this._config.tileHighlightFillAlpha = existy(_this._config.tileHighlightFillAlpha) ? _this._config.tileHighlightFillAlpha : 0.5;
        _this._config.tileHighlightStrokeColor = existy(_this._config.tileHighlightStrokeColor) ? _this._config.tileHighlightStrokeColor : 0xffffff;
        _this._config.tileHighlightStrokeAlpha = existy(_this._config.tileHighlightStrokeAlpha) ? _this._config.tileHighlightStrokeAlpha : 1.0;
        _this._config.dontAutoMoveToTile = existy(_this._config.dontAutoMoveToTile) ? _this._config.dontAutoMoveToTile : false;
        _this._config.checkPathOnEachTile = existy(_this._config.checkPathOnEachTile) ? _this._config.checkPathOnEachTile : true;
        _this._config.mapDraggable = existy(_this._config.mapDraggable) ? _this._config.mapDraggable : true;
        _this._config.isoAngle = existy(_this._config.isoAngle) ? _this._config.isoAngle : EngineView.DEFAULT_ISO_ANGLE;
        _this._config.tileHeight = existy(_this._config.tileHeight) ? _this._config.tileHeight : EngineView.DEFAULT_TILE_H;

        _this.setZoomParameters(_this._config.minScale, _this._config.maxScale, _this._config.numberOfZoomLevels, _this._config.initialZoomLevel, _this._config.instantCameraZoom);

        _this.tileHalfHeight = _this._config.tileHeight / 2;
        _this.tileHalfWidth = _this.tileHalfHeight * Math.tan((90 - _this._config.isoAngle) * Math.PI / 180); // this.TILE_W = this.tileHalfWidth * 2;

        _this.loadAssetsAndData();

        return _this;
      }
      /**
       * Handles loading of necessary assets and map data for the given engine instance.
       *
       * @method
       * @function
       * @private
       * @internal
       */


      EngineView.prototype.loadAssetsAndData = function () {
        if (!this._config.mapDataPath && !this._config.mapData) {
          throw new Error("TRAVISO: No mapData or JSON-file path defined for map data. Please check your configuration object that you pass to the 'getEngineInstance' method.");
        } else if (!this._config.mapData && this._config.mapDataPath.split('.').pop() !== 'json') {
          throw new Error('TRAVISO: Invalid map-data file path. This file has to be a json file.');
        }

        if (this._config.externalPIXI) {
          this.assetsAndDataLoaded();
        } else {
          var loader = new pixi_js.Loader();
          loader.add('mapData', this._config.mapDataPath);

          if (this._config.assetsToLoad && this._config.assetsToLoad.length > 0) {
            loader.add(this._config.assetsToLoad);
          }

          loader.load(this.assetsAndDataLoaded.bind(this)); // TRAVISO.loadData();
        }
      };
      /**
       * Handles loading of map data for the given engine instance.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param loader {Loader} PIXI's loader instance
       */


      EngineView.prototype.assetsAndDataLoaded = function (loader) {
        // console.log('assetsAndDataLoaded', resources.mapData.data);
        var mapData = this._config.mapData || (loader === null || loader === void 0 ? void 0 : loader.resources.mapData.data); // initial controls

        if (!existy(mapData.initialControllableLocation)) {
          trace("Map-data file warning: No 'initialControllableLocation' defined. Ignore this warning if you are adding it later manually.");
        } else if (!existy(mapData.initialControllableLocation.columnIndex) || !existy(mapData.initialControllableLocation.rowIndex)) {
          trace("Map-data file warning: 'initialControllableLocation' exists but it is not defined properly.");
          mapData.initialControllableLocation = null;
        }

        if (mapData.tileHighlightImage && !mapData.tileHighlightImage.path) {
          trace("Map-data file warning: 'tileHighlightImage' exists but its 'path' is not defined properly.");
          mapData.tileHighlightImage = null;
        }

        if (mapData.singleGroundImage && !mapData.singleGroundImage.path) {
          trace("Map-data file warning: 'singleGroundImage' exists but its 'path' is not defined properly.");
          mapData.singleGroundImage = null;
        }

        var i, j, arr;
        var rows = mapData.groundMap;
        mapData.groundMapData = [];

        for (i = 0; i < rows.length; i++) {
          arr = String(rows[i].row).replace(/\s/g, '').split(','); // remove empty spaces in a row and cast to an array

          for (j = arr.length; j--;) {
            arr[j] = arr[j] || KEY_EMPTY_TILE;
          }

          mapData.groundMapData[i] = arr;
        }

        rows = mapData.objectsMap;
        mapData.objectsMapData = [];

        for (i = 0; i < rows.length; i++) {
          arr = String(rows[i].row).replace(/\s/g, '').split(','); // remove empty spaces in a row and cast to an array

          for (j = arr.length; j--;) {
            arr[j] = arr[j] || KEY_NO_OBJECTS;
          }

          mapData.objectsMapData[i] = arr;
        }

        if (!existy(mapData.tiles)) {
          trace("Map-data file warning: No 'tiles' defined.");
          mapData.tiles = {};
        }

        if (!existy(mapData.objects)) {
          trace("Map-data file warning: No 'objects' defined.");
          mapData.objects = {};
        }

        var obj, objId, visual, visualId, interactionOffsets, oTextures, m, n;

        for (objId in mapData.objects) {
          obj = mapData.objects[objId];

          if (!existy(obj.visuals)) {
            throw new Error('TRAVISO: No visuals defined in data-file for object type: ' + objId);
          }

          obj.id = objId;

          if (!existy(obj.rowSpan)) {
            obj.rowSpan = 1;
          }

          if (!existy(obj.columnSpan)) {
            obj.columnSpan = 1;
          }

          oTextures = {};
          interactionOffsets = {};

          for (visualId in obj.visuals) {
            visual = obj.visuals[visualId];

            if (existy(visual.ipor) && existy(visual.ipoc)) {
              interactionOffsets[visualId] = {
                c: Number(visual.ipoc),
                r: Number(visual.ipor)
              };
            } // visual = (visual  as MapDataObjectVisualType1);


            if (visual.frames && visual.frames.length > 0) {
              oTextures[visualId] = [];

              for (m = 0; m < visual.frames.length; m++) {
                oTextures[visualId][m] = visual.frames[m].path;
              }
            } else {
              if (!visual.path || !visual.numberOfFrames || visual.numberOfFrames < 1) {
                throw new Error('TRAVISO: Invalid or missing visual attributes detected in data-file for visual with id: ' + visualId);
              }

              oTextures[visualId] = [];

              if (visual.numberOfFrames === 1) {
                oTextures[visualId][0] = visual.path + (visual.extension ? '.' + visual.extension : '');
              } else {
                n = 0;

                for (m = visual.startIndex; m < visual.numberOfFrames + visual.startIndex; visual.reverse ? m-- : m++) {
                  oTextures[visualId][n++] = visual.path + String(m) + (visual.extension ? '.' + visual.extension : '');
                }
              }
            }
          }

          obj.textureNames = oTextures;
          obj.io = interactionOffsets;
          obj.f = !!obj.floor;
          obj.nt = !!obj.noTransparency;
          obj.m = !!obj.movable;
          obj.i = !!obj.interactive;
        }

        delete mapData.objectsMap;
        delete mapData.groundMap;
        this.mapData = mapData;
        this.onAllAssetsLoaded();
      };
      /**
       * This method is being called whenever all the assets are
       * loaded and engine is ready to initialize.
       *
       * @method
       * @function
       * @private
       * @internal
       */


      EngineView.prototype.onAllAssetsLoaded = function () {
        trace('All assets loaded');
        this.moveEngine = new MoveEngine(this);
        this._currentScale = 1.0;
        this._currentZoom = 0;
        this._posFrame = this._config.initialPositionFrame || {
          x: 0,
          y: 0,
          w: 800,
          h: 600
        };
        this._externalCenter = {
          x: this._posFrame.w >> 1,
          y: this._posFrame.h >> 1
        };
        this.createMap();
        this.repositionContent(this._config.initialPositionFrame);
        this.enableInteraction();

        if (this._config.engineInstanceReadyCallback) {
          this._config.engineInstanceReadyCallback(this);
        }
      };
      /**
       * Creates the map and setups necessary parameters for future map calculations.
       *
       * @method
       * @function
       * @private
       * @internal
       */


      EngineView.prototype.createMap = function () {
        // create background
        if (this._config.backgroundColor) {
          this._bg = new pixi_js.Graphics();
          this.addChild(this._bg);
        } // create mask


        if (this._config.useMask) {
          this._mapMask = new pixi_js.Graphics();
          this.addChild(this._mapMask);
        } // create containers for visual map elements


        this._mapContainer = new pixi_js.Container();
        this.addChild(this._mapContainer); // Define two layers of maps
        // One for the world and one for the objects (static/dynamic) over it
        // This enables us not to update the whole world in every move but instead just update the object depths over it

        this._groundContainer = new pixi_js.Container();

        this._mapContainer.addChild(this._groundContainer);

        this._objContainer = new pixi_js.Container();

        this._mapContainer.addChild(this._objContainer);

        var groundMapData = this.mapData.groundMapData;
        var objectsMapData = this.mapData.objectsMapData;
        var initialControllableLocation = this.mapData.initialControllableLocation; // set map size

        this._mapSizeR = groundMapData.length;
        this._mapSizeC = groundMapData[0].length; // add ground image first if it is defined

        var groundImageSprite;

        if (this.mapData.singleGroundImage) {
          groundImageSprite = new pixi_js.Sprite(pixi_js.Texture.from(this.mapData.singleGroundImage.path));

          this._groundContainer.addChild(groundImageSprite);

          groundImageSprite.scale.set(this.mapData.singleGroundImage.scale || 1);
        } // create arrays to hold tiles and objects


        this._tileArray = [];
        this._objArray = [];
        var i, j;

        for (i = 0; i < this._mapSizeR; i++) {
          this._tileArray[i] = [];
          this._objArray[i] = [];

          for (j = 0; j < this._mapSizeC; j++) {
            this._tileArray[i][j] = null;
            this._objArray[i][j] = null;
          }
        } // Map data is being sent to path finding and after this point
        // its content will be different acc to the path-finding algorithm.
        // It is still being stored in engine.mapData but you must be aware
        // of the structure if you want to use it after this point.


        this._pathFinding = new PathFinding(this._mapSizeC, this._mapSizeR, {
          diagonal: this._config.pathFindingType === PF_ALGORITHMS.ASTAR_DIAGONAL,
          closest: this._config.pathFindingClosest
        });
        var tile;

        for (i = 0; i < this._mapSizeR; i++) {
          for (j = this._mapSizeC - 1; j >= 0; j--) {
            this._tileArray[i][j] = null;

            if (groundMapData[i][j] && groundMapData[i][j] !== KEY_EMPTY_TILE) {
              tile = new TileView(this, groundMapData[i][j]);
              tile.position.x = this.getTilePosXFor(i, j);
              tile.position.y = this.getTilePosYFor(i, j);
              tile.mapPos = {
                c: j,
                r: i
              };
              this._tileArray[i][j] = tile;

              this._groundContainer.addChild(tile);

              if (!tile.isMovableTo) {
                this._pathFinding.setCell(j, i, 0);
              }
            } else {
              this._pathFinding.setCell(j, i, 0);
            }
          }
        }

        var obj,
            floorObjectFound = false;

        for (i = 0; i < this._mapSizeR; i++) {
          for (j = this._mapSizeC - 1; j >= 0; j--) {
            this._objArray[i][j] = null;

            if (objectsMapData[i][j] && objectsMapData[i][j] !== KEY_NO_OBJECTS) {
              obj = new ObjectView(this, objectsMapData[i][j]);
              obj.position.x = this.getTilePosXFor(i, j);
              obj.position.y = this.getTilePosYFor(i, j) + this.tileHalfHeight;
              obj.mapPos = {
                c: j,
                r: i
              };

              if (!floorObjectFound && obj.isFloorObject) {
                floorObjectFound = true;
              }

              this._objContainer.addChild(obj);

              this.addObjRefToLocation(obj, obj.mapPos); // if (initialControllableLocation && initialControllableLocation.c === j && initialControllableLocation.r === i)

              if (initialControllableLocation && initialControllableLocation.columnIndex === j && initialControllableLocation.rowIndex === i) {
                this._currentControllable = obj;
              }
            }
          }
        }

        if (floorObjectFound) {
          // run the loop again to bring the other objects on top of the floor objects
          var a = void 0,
              k = void 0;

          for (i = 0; i < this._mapSizeR; i++) {
            for (j = this._mapSizeC - 1; j >= 0; j--) {
              a = this._objArray[i][j];

              if (a) {
                for (k = 0; k < a.length; k++) {
                  if (!a[k].isFloorObject) {
                    this._objContainer.addChild(a[k]);
                  }
                }
              }
            }
          }
        } // cacheAsBitmap: for now this creates problem with tile highlights
        // this._groundContainer.cacheAsBitmap = true;


        this._mapVertices = [[this.getTilePosXFor(0, 0) - this.tileHalfWidth, this.getTilePosYFor(0, 0)], [this.getTilePosXFor(0, this._mapSizeC - 1), this.getTilePosYFor(0, this._mapSizeC - 1) - this.tileHalfHeight], [this.getTilePosXFor(this._mapSizeR - 1, this._mapSizeC - 1) + this.tileHalfWidth, this.getTilePosYFor(this._mapSizeR - 1, this._mapSizeC - 1)], [this.getTilePosXFor(this._mapSizeR - 1, 0), this.getTilePosYFor(this._mapSizeR - 1, 0) + this.tileHalfHeight]];
        this._mapVisualWidthReal = this.getTilePosXFor(this._mapSizeR - 1, this._mapSizeC - 1) - this.getTilePosXFor(0, 0);
        this._mapVisualHeightReal = this.getTilePosYFor(this._mapSizeR - 1, 0) - this.getTilePosYFor(0, this._mapSizeC - 1);

        if (groundImageSprite) {
          groundImageSprite.position.x = this._mapVertices[0][0] + this.tileHalfWidth + (this._mapVisualWidthReal - groundImageSprite.width) / 2;
          groundImageSprite.position.y = this._mapVertices[1][1] + this.tileHalfHeight + (this._mapVisualHeightReal - groundImageSprite.height) / 2;
        }

        this.zoomTo(this._config.initialZoomLevel, true);

        if (this._config.followCharacter && initialControllableLocation) {
          // this.centralizeToLocation(initialControllableLocation.c, initialControllableLocation.r, true);
          this.centralizeToLocation(initialControllableLocation.columnIndex, initialControllableLocation.rowIndex, true);
        } else {
          this.centralizeToCurrentExternalCenter(true);
        }
      };
      /**
       * Calculates 2D X position of a tile, given its column and row indices.
       *
       * @method
       * @function
       * @public
       *
       * @param r {number} row index of the tile
       * @param c {number} column index of the tile
       * @return {number} 2D X position of a tile
       */


      EngineView.prototype.getTilePosXFor = function (r, c) {
        return c * this.tileHalfWidth + r * this.tileHalfWidth;
      };
      /**
       * Calculates 2D Y position of a tile, given its column and row indices.
       *
       * @method
       * @function
       * @public
       *
       * @param r {number} row index of the tile
       * @param c {number} column index of the tile
       * @return {number} 2D Y position of a tile
       */


      EngineView.prototype.getTilePosYFor = function (r, c) {
        return r * this.tileHalfHeight - c * this.tileHalfHeight;
      };
      /**
       * Shows or hides the display object that includes the objects-layer
       *
       * @method
       * @function
       * @public
       *
       * @param show {boolean} show the object layer, default `false`
       */


      EngineView.prototype.showHideObjectLayer = function (show) {
        if (show === void 0) {
          show = false;
        }

        this._objContainer.visible = show;
      };
      /**
       * Shows or hides the display object that includes the ground/terrain layer
       *
       * @method
       * @function
       * @public
       *
       * @param show {boolean} show the ground layer, default `false`
       */


      EngineView.prototype.showHideGroundLayer = function (show) {
        if (show === void 0) {
          show = false;
        }

        this._groundContainer.visible = show;
      };
      /**
       * Returns the TileView instance that sits in the location given by row and column indices.
       *
       * @method
       * @function
       * @public
       *
       * @param r {number} row index of the tile
       * @param c {number} column index of the tile
       * @return {TileView} the tile in the location given
       */


      EngineView.prototype.getTileAtRowAndColumn = function (r, c) {
        return this._tileArray[r][c];
      };
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


      EngineView.prototype.getObjectsAtRowAndColumn = function (r, c) {
        if (!this._objArray[r] || !this._objArray[r][c]) return [];
        return this._objArray[r][c];
      };
      /**
       * Returns all the ObjectView instances referenced to the given location.
       *
       * @method
       * @function
       * @public
       *
       * @param pos {TColumnRowPair} position object including row and column coordinates
       * @return {Array(ObjectView)} an array of map-objects referenced to the given location
       */


      EngineView.prototype.getObjectsAtLocation = function (pos) {
        if (!this._objArray[pos.r] || !this._objArray[pos.r][pos.c]) return [];
        return this._objArray[pos.r][pos.c];
      };
      /**
       * Creates and adds a predefined (in json file) map-object to the map using the specified object type-id.
       *
       * @method
       * @function
       * @public
       *
       * @param type {number} type-id of the object as defined in the json file
       * @param pos {TColumnRowPair} position object including row and column coordinates
       * @return {ObjectView} the newly created map-object
       */


      EngineView.prototype.createAndAddObjectToLocation = function (type, pos) {
        return this.addObjectToLocation(new ObjectView(this, type), pos);
      };
      /**
       * Adds an already-created object to the map.
       *
       * @method
       * @function
       * @public
       *
       * @param obj {ObjectView} a map-object to add to the map and the given location
       * @param pos {TColumnRowPair} position object including row and column coordinates
       * @return {ObjectView} the newly added object
       */


      EngineView.prototype.addObjectToLocation = function (obj, pos) {
        obj.position.x = this.getTilePosXFor(pos.r, pos.c);
        obj.position.y = this.getTilePosYFor(pos.r, pos.c) + this.tileHalfHeight;
        obj.mapPos = {
          c: pos.c,
          r: pos.r
        };

        this._objContainer.addChild(obj);

        this.addObjRefToLocation(obj, obj.mapPos);
        this.arrangeDepthsFromLocation(obj.isFloorObject ? {
          c: this._mapSizeC - 1,
          r: 0
        } : obj.mapPos);
        return obj;
      };
      /**
       * Enables adding external custom display objects to the specified location.
       * This method should be used for the objects that are not already defined in json file and don't have a type-id.
       * The resulting object will be independent of engine mechanics apart from depth controls.
       *
       * @method
       * @function
       * @public
       *
       * @param displayObject {PIXI.DisplayObject} object to be added to location
       * @param displayObject.isMovableTo {boolean} if the object can be moved onto by other map-objects, default true
       * @param displayObject.columnSpan {number} number of tiles that map-object covers horizontally on the isometric map
       * @param displayObject.rowSpan {number} number of tiles that map-object covers vertically on the isometric map
       * @param pos {TColumnRowPair} position object including row and column coordinates
       * @return {PIXI.DisplayObject} the newly added object
       */


      EngineView.prototype.addCustomObjectToLocation = function (displayObject, pos) {
        displayObject.isMovableTo = existy(displayObject.isMovableTo) ? displayObject.isMovableTo : true;
        displayObject.columnSpan = displayObject.columnSpan || 1;
        displayObject.rowSpan = displayObject.rowSpan || 1;
        return this.addObjectToLocation(displayObject, pos); // this.removeObjRefFromLocation(displayObject, pos);
      };
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


      EngineView.prototype.removeObjectFromLocation = function (obj, pos) {
        pos = pos || obj.mapPos;

        this._objContainer.removeChild(obj);

        this.removeObjRefFromLocation(obj, pos);
      };
      /**
       * Centralizes and zooms the EngineView instance to the object specified.
       *
       * @method focusMapToObject
       * @param obj {ObjectView} the object that map will be focused with respect to
       * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
       * @param obj.mapPos.c {number} the column index of the map location
       * @param obj.mapPos.r {number} the row index of the map location
       * @param obj.columnSpan {number} number of tiles that map-object covers horizontally on the isometric map
       * @param obj.rowSpan {number} number of tiles that map-object covers vertically on the isometric map
       */


      EngineView.prototype.focusMapToObject = function (obj) {
        this.focusMapToLocation(obj.mapPos.c + (obj.columnSpan - 1) / 2, obj.mapPos.r - (obj.rowSpan - 1) / 2, 0);
      };
      /**
       * Centralizes and zooms the EngineView instance to the map location specified by row and column index.
       *
       * @method focusMapToLocation
       * @param c {number} the column index of the map location
       * @param r {number} the row index of the map location
       * @param zoomAmount {number} targeted zoom level for focusing
       */


      EngineView.prototype.focusMapToLocation = function (c, r, zoomAmount) {
        // NOTE: using zoomTo instead of setScale causes centralizeToPoint to be called twice (no visual problem)
        this.zoomTo(zoomAmount, false);
        this.centralizeToLocation(c, r, this._config.instantCameraRelocation);
      };
      /**
       * Centralizes the EngineView instance to the object specified.
       *
       * @method centralizeToObject
       * @param obj {ObjectView} the object that map will be centralized with respect to
       * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
       * @param obj.mapPos.c {number} the column index of the map location
       * @param obj.mapPos.r {number} the row index of the map location
       */


      EngineView.prototype.centralizeToObject = function (obj) {
        this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r, this._config.instantCameraRelocation);
      };
      /**
       * Centralizes the EngineView instance to the map location specified by row and column index.
       *
       * @method centralizeToLocation
       * @param c {number} the column index of the map location
       * @param r {number} the row index of the map location
       * @param [instantRelocate=false] {boolean} specifies if the camera move will be animated or instant
       */


      EngineView.prototype.centralizeToLocation = function (c, r, instantRelocate) {
        this._currentFocusLocation = {
          c: c,
          r: r
        };

        var px = this._externalCenter.x + (this._mapVisualWidthScaled >> 1) - this.getTilePosXFor(r, c) * this._currentScale;

        var py = this._externalCenter.y - this.getTilePosYFor(r, c) * this._currentScale;

        this.centralizeToPoint(px, py, instantRelocate);
      };
      /**
       * Centralizes the EngineView instance to the current location of the attention/focus.
       *
       * @method centralizeToCurrentFocusLocation
       * @param [instantRelocate=false] {boolean} specifies if the camera move will be animated or instant
       */


      EngineView.prototype.centralizeToCurrentFocusLocation = function (instantRelocate) {
        this.centralizeToLocation(this._currentFocusLocation.c, this._currentFocusLocation.r, instantRelocate);
      };
      /**
       * External center is the central point of the frame defined by the user to be used as the visual size of the engine.
       * This method centralizes the EngineView instance with respect to this external center-point.
       *
       * @method
       * @function
       * @public
       *
       * @param instantRelocate {boolean} specifies if the camera move will be animated or instant
       */


      EngineView.prototype.centralizeToCurrentExternalCenter = function (instantRelocate) {
        if (this._externalCenter) {
          this._currentFocusLocation = {
            c: this._mapSizeC >> 1,
            r: this._mapSizeR >> 1
          };
          this.centralizeToPoint(this._externalCenter.x, this._externalCenter.y, instantRelocate);
        }
      };
      /**
       * Centralizes the EngineView instance to the points specified.
       *
       * @method
       * @function
       * @public
       *
       * @param px {number} the x coordinate of the center point with respect to EngineView frame
       * @param py {number} the y coordinate of the center point with respect to EngineView frame
       * @param instantRelocate {boolean} specifies if the relocation will be animated or instant
       */


      EngineView.prototype.centralizeToPoint = function (px, py, instantRelocate) {
        if (this._tileArray) {
          px = px - (this._mapVisualWidthScaled >> 1);

          if (existy(instantRelocate) && instantRelocate || !existy(instantRelocate) && this._config.instantCameraRelocation) {
            this._mapContainer.position.x = px;
            this._mapContainer.position.y = py;
          } else {
            this.moveEngine.addTween(this._mapContainer.position, 0.5, {
              x: px,
              y: py
            }, 0, 'easeInOut', true);
          }
        }
      };
      /**
       * Sets all the parameters related to zooming in and out.
       *
       * @method
       * @function
       * @public
       *
       * @param minScale {number} minimum scale that the PIXI.Container for the map can get, default 0.5
       * @param maxScale {number} maximum scale that the PIXI.Container for the map can get, default 1.5
       * @param numberOfZoomLevels {number} used to calculate zoom increment, defined by user, default 5
       * @param initialZoomLevel {number} initial zoom level of the map, default 0
       * @param instantCameraZoom {boolean} specifies whether to zoom instantly or with a tween animation, default false
       */


      EngineView.prototype.setZoomParameters = function (minScale, maxScale, numberOfZoomLevels, initialZoomLevel, instantCameraZoom) {
        if (minScale === void 0) {
          minScale = 0.5;
        }

        if (maxScale === void 0) {
          maxScale = 1.5;
        }

        if (numberOfZoomLevels === void 0) {
          numberOfZoomLevels = 5;
        }

        if (initialZoomLevel === void 0) {
          initialZoomLevel = 0;
        }

        if (instantCameraZoom === void 0) {
          instantCameraZoom = false;
        }

        this._config.minScale = minScale;
        this._config.maxScale = maxScale;
        this._config.minZoom = -1;
        this._config.maxZoom = 2;
        this._config.zoomIncrement = existy(numberOfZoomLevels) ? numberOfZoomLevels <= 1 ? 0 : 2 / (numberOfZoomLevels - 1) : 0.5;
        this._config.initialZoomLevel = initialZoomLevel;
        this._config.instantCameraZoom = instantCameraZoom;
      };
      /**
       * Sets map's scale.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param s {number} Scale amount for both x and y coordinates
       * @param instantZoom {boolean} Specifies if the scaling will be animated or instant
       */


      EngineView.prototype.setScale = function (s, instantZoom) {
        if (s < this._config.minScale) {
          s = this._config.minScale;
        } else if (s > this._config.maxScale) {
          s = this._config.maxScale;
        }

        this._currentScale = s;
        this._mapVisualWidthScaled = this._mapVisualWidthReal * this._currentScale; // this.mapVisualHeightScaled = this._mapVisualHeightReal * this._currentScale;

        if (existy(instantZoom) && instantZoom || !existy(instantZoom) && this._config.instantCameraZoom) {
          this._mapContainer.scale.set(this._currentScale);
        } else {
          this.moveEngine.addTween(this._mapContainer.scale, 0.5, {
            x: this._currentScale,
            y: this._currentScale
          }, 0, 'easeInOut', true);
        }
      };
      /**
       * Zooms camera by to the amount given.
       *
       * @method
       * @function
       * @public
       *
       * @param zoomAmount {number} specifies zoom amount (between -1 and 1). Use -1, -0.5, 0, 0,5, 1 for better results.
       * @param instantZoom {boolean} specifies whether to zoom instantly or with a tween animation
       */


      EngineView.prototype.zoomTo = function (zoomAmount, instantZoom) {
        zoomAmount = zoomAmount || 0;
        var s = mathMap(zoomAmount, this._config.minZoom, this._config.maxZoom, this._config.minScale, this._config.maxScale, true);
        s = Math.round(s * 10) / 10;
        this._currentZoom = mathMap(s, this._config.minScale, this._config.maxScale, this._config.minZoom, this._config.maxZoom, true);
        this._externalCenter = this._externalCenter ? this._externalCenter : {
          x: this._mapVisualWidthScaled >> 1,
          y: 0
        };
        var diff = {
          x: this._mapContainer.position.x + (this._mapVisualWidthScaled >> 1) - this._externalCenter.x,
          y: this._mapContainer.position.y - this._externalCenter.y
        };
        var oldScale = this._currentScale;
        this.setScale(s, instantZoom);
        var ratio = this._currentScale / oldScale;
        this.centralizeToPoint(this._externalCenter.x + diff.x * ratio, this._externalCenter.y + diff.y * ratio, existy(instantZoom) && instantZoom || !existy(instantZoom) && this._config.instantCameraZoom); // trace("scalingTo: " + this._currentScale);
        // trace("zoomingTo: " + this._currentZoom);
      };
      /**
       * Zooms the camera one level out.
       *
       * @method
       * @function
       * @public
       *
       * @param instantZoom {boolean} Specifies whether to zoom instantly or with a tween animation
       */


      EngineView.prototype.zoomOut = function (instantZoom) {
        this.zoomTo(this._currentZoom - this._config.zoomIncrement, instantZoom);
      };
      /**
       * Zooms the camera one level in.
       *
       * @method zoomIn
       * @param [instantZoom=false] {boolean} specifies whether to zoom instantly or with a tween animation
       */


      EngineView.prototype.zoomIn = function (instantZoom) {
        this.zoomTo(this._currentZoom + this._config.zoomIncrement, instantZoom);
      };
      /**
       * Returns the current controllable map-object.
       *
       * @method getCurrentControllable
       * @return {ObjectView} current controllable map-object
       */


      EngineView.prototype.getCurrentControllable = function () {
        return this._currentControllable;
      };
      /**
       * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.
       *
       * @method setCurrentControllable
       * @param obj {ObjectView} object to be set as current controllable
       * @param obj.mapPos {Object} object including r and c coordinates
       * @param obj.mapPos.c {number} the column index of the map location
       * @param obj.mapPos.r {number} the row index of the map location
       */


      EngineView.prototype.setCurrentControllable = function (obj) {
        this._currentControllable = obj;
      };
      /**
       * Adds a reference of the given map-object to the given location in the object array.
       * This should be called when an object moved or transferred to the corresponding location.
       * Uses objects size property to add its reference to all relevant cells.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} object to be bind to location
       * @param obj.columnSpan {number} number of tiles that map-object covers horizontally on the isometric map
       * @param obj.rowSpan {number} number of tiles that map-object covers vertically on the isometric map
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.addObjRefToLocation = function (obj, pos) {
        var k, m;

        for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
          for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
            this.addObjRefToSingleLocation(obj, {
              c: k,
              r: m
            });
          }
        }
      };
      /**
       * Adds a reference of the given map-object to the given location in the object array.
       * Updates the cell as movable or not according to the object being movable onto or not.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} object to be bind to location
       * @param obj.isMovableTo {boolean} is the object is movable onto by the other objects or not
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.addObjRefToSingleLocation = function (obj, pos) {
        if (!this._objArray[pos.r][pos.c]) {
          this._objArray[pos.r][pos.c] = [];
        }

        var index = this._objArray[pos.r][pos.c].indexOf(obj);

        if (index < 0) {
          this._objArray[pos.r][pos.c].push(obj);
        }

        if (!obj.isMovableTo) {
          this._pathFinding.setDynamicCell(pos.c, pos.r, 0);
        }
      };
      /**
       * Removes references of the given map-object from the given location in the object array.
       * This should be called when an object moved or transferred from the corresponding location.
       * Uses objects size property to remove its references from all relevant cells.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} object to be bind to location
       * @param obj.columnSpan {number} number of tiles that map-object covers horizontally on the isometric map
       * @param obj.rowSpan {number} number of tiles that map-object covers vertically on the isometric map
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.removeObjRefFromLocation = function (obj, pos) {
        var k, m;

        for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
          for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
            this.removeObjRefFromSingleLocation(obj, {
              c: k,
              r: m
            });
          }
        }
      };
      /**
       * Removes a reference of the given map-object from the given location in the object array.
       * Updates the cell as movable or not according to the other object references in the same cell.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} object to be bind to location
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.removeObjRefFromSingleLocation = function (obj, pos) {
        if (this._objArray[pos.r][pos.c]) {
          var index = this._objArray[pos.r][pos.c].indexOf(obj);

          if (index > -1) {
            this._objArray[pos.r][pos.c].splice(index, 1);
          }

          if (this._objArray[pos.r][pos.c].length === 0) {
            this._pathFinding.setDynamicCell(pos.c, pos.r, 1);

            this._objArray[pos.r][pos.c] = null;
          } else {
            var a = this._objArray[pos.r][pos.c];
            var l = a.length;

            for (var i = 0; i < l; i++) {
              if (!a[i].isMovableTo) {
                this._pathFinding.setDynamicCell(pos.c, pos.r, 0);

                break;
              } else if (i === l - 1) {
                this._pathFinding.setDynamicCell(pos.c, pos.r, 1);
              }
            }
          }
        }
      }; // /**
      //  * Removes all map-object references from the given location in the object array.
      //  *
      //  * @private
      //  * @method removeAllObjectRefsFromLocation
      //  * @param {TColumnRowPair} pos object including r and c coordinates
      //  */
      // private removeAllObjectRefsFromLocation(pos: TColumnRowPair): void {
      //     if (this._objArray[pos.r][pos.c]) {
      //         this._pathFinding.setDynamicCell(pos.c, pos.r, 1);
      //         this._objArray[pos.r][pos.c] = null;
      //     }
      // }

      /**
       * Sets alphas of the map-objects referenced to the given location.
       *
       * @method changeObjAlphasInLocation
       * @param value {number} alpha value, should be between 0 and 1
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.changeObjAlphasInLocation = function (value, pos) {
        var a = this._objArray[pos.r][pos.c];

        if (a) {
          var l = a.length;

          for (var i = 0; i < l; i++) {
            if (!a[i].isFloorObject && !a[i].noTransparency) {
              a[i].alpha = value;
            }
          }
        }
      };
      /**
       * Sets a map-object's location and logically moves it to the new location.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} map-object to be moved
       * @param obj.mapPos {Object} object including r and c coordinates
       * @param obj.mapPos.c {number} the column index of the map location
       * @param obj.mapPos.r {number} the row index of the map location
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.arrangeObjLocation = function (obj, pos) {
        this.removeObjRefFromLocation(obj, obj.mapPos);
        this.addObjRefToLocation(obj, pos);
        obj.mapPos = {
          c: pos.c,
          r: pos.r
        };
      };
      /**
       * Sets occlusion transparencies according to given map-object's location.
       * This method only works for user-controllable object.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {ObjectView} current controllable map-object
       * @param prevPos {TColumnRowPair} previous location of the map-object in terms of row and column coordinates
       * @param pos {TColumnRowPair} new location of the map-object in terms of row and column coordinates
       */


      EngineView.prototype.arrangeObjTransparencies = function (obj, prevPos, pos) {
        if (this._config.changeTransparencies) {
          if (this._currentControllable === obj) {
            if (prevPos.c > 0) {
              this.changeObjAlphasInLocation(1, {
                c: prevPos.c - 1,
                r: prevPos.r
              });
            }

            if (prevPos.c > 0 && prevPos.r < this._mapSizeR - 1) {
              this.changeObjAlphasInLocation(1, {
                c: prevPos.c - 1,
                r: prevPos.r + 1
              });
            }

            if (prevPos.r < this._mapSizeR - 1) {
              this.changeObjAlphasInLocation(1, {
                c: prevPos.c,
                r: prevPos.r + 1
              });
            }

            if (pos.c > 0) {
              this.changeObjAlphasInLocation(0.7, {
                c: pos.c - 1,
                r: pos.r
              });
            }

            if (pos.c > 0 && pos.r < this._mapSizeR - 1) {
              this.changeObjAlphasInLocation(0.7, {
                c: pos.c - 1,
                r: pos.r + 1
              });
            }

            if (pos.r < this._mapSizeR - 1) {
              this.changeObjAlphasInLocation(0.7, {
                c: pos.c,
                r: pos.r + 1
              });
            }
          } // TODO: check if there is a way not to update main character alpha each time


          obj.alpha = 1;
        }
      };
      /**
       * Arranges depths (z-index) of the map-objects starting from the given location.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param pos {TColumnRowPair} position object including row and column coordinates
       */


      EngineView.prototype.arrangeDepthsFromLocation = function (pos) {
        var a, i, j, k;

        for (i = pos.r; i < this._mapSizeR; i++) {
          for (j = pos.c; j >= 0; j--) {
            a = this._objArray[i][j];

            if (a) {
              for (k = 0; k < a.length; k++) {
                if (!a[k].isFloorObject) {
                  this._objContainer.addChild(a[k]);
                }
              }
            }
          }
        }
      };
      /**
       * Clears the highlight for the old path and highlights the new path on map.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param currentPath {Array(GridNode)} the old path to clear the highlight from
       * @param newPath {Array(GridNode)} the new path to highlight
       */


      EngineView.prototype.arrangePathHighlight = function (currentPath, newPath) {
        var i, tile, pathItem;

        if (currentPath) {
          for (i = 0; i < currentPath.length; i++) {
            pathItem = currentPath[i];

            if (!newPath || newPath.indexOf(pathItem) === -1) {
              tile = this._tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
              tile.setHighlighted(false, !this._config.tileHighlightAnimated);
            }
          }
        }

        if (newPath) {
          for (i = 0; i < newPath.length; i++) {
            pathItem = newPath[i];

            if (!currentPath || currentPath.indexOf(pathItem) === -1) {
              tile = this._tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
              tile.setHighlighted(true, !this._config.tileHighlightAnimated);
            }
          }
        }
      };
      /**
       * Stops a moving object.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {IMovable} map-object to be moved on path
       */


      EngineView.prototype.stopObject = function (obj) {
        obj.currentPath = null;
        obj.currentTarget = null;
        obj.currentTargetTile = null;
        this.moveEngine.removeMovable(obj);
      };
      /**
       * Moves the specified map-object through a path.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {IMovable} map-object to be moved on path
       * @param path {Array(GridNode)} path to move object on
       * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
       */


      EngineView.prototype.moveObjThrough = function (obj, path, speed) {
        if (speed === void 0) {
          speed = null;
        }

        if (this._config.instantObjectRelocation) {
          var tile = this._tileArray[path[0].mapPos.r][path[0].mapPos.c];
          obj.position.x = tile.position.x;
          obj.position.y = tile.position.y + this.tileHalfHeight;
          this.arrangeObjTransparencies(obj, obj.mapPos, tile.mapPos);
          this.arrangeObjLocation(obj, tile.mapPos);
          this.arrangeDepthsFromLocation(tile.mapPos);
        } else {
          if (this._config.highlightPath && this._currentControllable === obj) {
            this.arrangePathHighlight(obj.currentPath, path);
          }

          if (obj.currentTarget) {
            // trace("Object has a target, update the path with the new one");
            // this.moveEngine.addNewPathToObject(obj, path, speed);
            this.stopObject(obj);
          }

          this.moveEngine.prepareForMove(obj, path, speed);
          obj.currentTargetTile = obj.currentPath[obj.currentPathStep];
          this.onObjMoveStepBegin(obj, obj.currentPath[obj.currentPathStep].mapPos);
        }
      };
      /**
       * Sets up the engine at the beginning of each tile change move for the specified object
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param obj {IMovable} map-object that is being moved
       * @param pos {TColumnRowPair} position object including row and column coordinates
       * @return {boolean} if the target tile was available and map-object has moved
       */


      EngineView.prototype.onObjMoveStepBegin = function (obj, pos) {
        // trace("onObjMoveStepBegin");
        // Note that mapPos is being updated prior to movement
        obj.currentDirection = getDirBetween(obj.mapPos.r, obj.mapPos.c, pos.r, pos.c);
        obj.changeVisualToDirection(obj.currentDirection, true); // check if the next target pos is still empty

        if (!this._pathFinding.isCellFilled(pos.c, pos.r)) {
          // pos is movable
          // this.arrangeObjTransparencies(obj, obj.mapPos, pos);
          // this.arrangeObjLocation(obj, pos);
          // this.arrangeDepthsFromLocation(obj.mapPos);
          // if there is other object(s) on the target tile, notify the game
          // const objects = this.getObjectsAtLocation(pos);
          // if (objects && objects.length > 1)
          // {
          // if (this._config.otherObjectsOnTheNextTileCallback) { this._config.otherObjectsOnTheNextTileCallback( obj, objects ); }
          // }
          this.moveEngine.setMoveParameters(obj, pos);
          this.moveEngine.addMovable(obj);
          return true;
        } else {
          // pos is NOT movable
          this.moveEngine.removeMovable(obj);
          this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
          return false;
        }
      };
      /**
       * Sets up the engine at the end of each tile change move for the specified object
       *
       * @method
       * @function
       * @public
       * @internal
       *
       * @param obj {IMovable} map-object that is being moved
       */


      EngineView.prototype.onObjMoveStepEnd = function (obj) {
        //trace("onObjMoveStepEnd");
        obj.currentPathStep--;
        obj.currentTarget = null;
        obj.currentTargetTile = null;
        var pathEnded = 0 > obj.currentPathStep;
        this.moveEngine.removeMovable(obj);

        if (!pathEnded) {
          if (this._config.checkPathOnEachTile) {
            this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
          } else {
            obj.currentPath.splice(obj.currentPath.length - 1, 1);
            this.moveObjThrough(obj, obj.currentPath);
          }
        } else {
          // reached to the end of the path
          obj.changeVisualToDirection(obj.currentDirection, false);
        }

        if (this._currentControllable === obj) {
          var tile = this._tileArray[obj.mapPos.r][obj.mapPos.c];
          tile.setHighlighted(false, !this._config.tileHighlightAnimated); // if (this._config.followCharacter) { this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r); }
        }

        if (pathEnded && this._config.objectReachedDestinationCallback) {
          this._config.objectReachedDestinationCallback(obj);
        }
      };
      /**
       * Checks and follows a character
       *
       * @method
       * @function
       * @public
       * @internal
       *
       * @param obj {IMovable} map-object to check if it is being followed
       */


      EngineView.prototype.checkForFollowCharacter = function (obj) {
        if (this._config.followCharacter && this._currentControllable === obj) {
          this._currentFocusLocation = {
            c: obj.mapPos.c,
            r: obj.mapPos.r
          };
          var px = this._externalCenter.x - obj.position.x * this._currentScale;
          var py = this._externalCenter.y - obj.position.y * this._currentScale; // this.centralizeToPoint(px, py, true);

          this.moveEngine.addTween(this._mapContainer.position, 0.1, {
            x: px,
            y: py
          }, 0, 'easeOut', true);
        }
      };
      /**
       * Checks if a map-object changes the tile it is on.
       *
       * @method
       * @function
       * @public
       * @internal
       *
       * @param obj {IMovable} map-object to be checked
       */


      EngineView.prototype.checkForTileChange = function (obj) {
        if (this._config.objectUpdateCallback) {
          this._config.objectUpdateCallback(obj);
        }

        var pos = {
          x: obj.position.x,
          y: obj.position.y - this.tileHalfHeight
        }; // const tile = this._tileArray[obj.mapPos.r][obj.mapPos.c];

        var tile = this._tileArray[obj.currentTargetTile.mapPos.r][obj.currentTargetTile.mapPos.c]; // move positions to parent scale

        var vertices = [];

        for (var i = 0; i < tile.vertices.length; i++) {
          vertices[i] = [tile.vertices[i][0] + tile.position.x, tile.vertices[i][1] + tile.position.y];
        }

        if (obj.currentTargetTile.mapPos.r !== obj.mapPos.r || obj.currentTargetTile.mapPos.c !== obj.mapPos.c) {
          if (isInPolygon(pos, vertices)) {
            this.arrangeObjTransparencies(obj, obj.mapPos, obj.currentTargetTile.mapPos);
            this.arrangeObjLocation(obj, obj.currentTargetTile.mapPos);
            this.arrangeDepthsFromLocation(obj.mapPos); // if there is other object(s) on the target tile, notify the game

            var objects = this.getObjectsAtLocation(obj.currentTargetTile.mapPos);

            if (objects && objects.length > 1) {
              if (this._config.otherObjectsOnTheNextTileCallback) {
                this._config.otherObjectsOnTheNextTileCallback(obj, objects);
              }
            }
          }
        }
      };
      /**
       * Searches and returns a path between two locations if there is one.
       *
       * @method
       * @function
       * @public
       *
       * @param from {TColumnRowPair} object including row and column coordinates of the source location
       * @param to {TColumnRowPair} object including row and column coordinates of the target location
       *
       * @return {Array(Object)} an array of path items defining the path
       */


      EngineView.prototype.getPath = function (from, to) {
        if (this._pathFinding) {
          return this._pathFinding.solve(from.c, from.r, to.c, to.r);
        } else {
          throw new Error("Path finding hasn't been initialized yet!");
        }
      };
      /**
       * Checks for a path and moves the map-object on map if there is an available path
       *
       * @method
       * @function
       * @public
       *
       * @param obj {ObjectView} map-object that is being moved
       * @param tile {TileView} target map-tile or any custom object that has 'mapPos' and 'isMovableTo' defined
       * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
       * @return {boolean} if there is an available path to move to the target tile
       */


      EngineView.prototype.checkAndMoveObjectToTile = function (obj, tile, speed) {
        if (speed === void 0) {
          speed = null;
        }

        if (tile.isMovableTo) {
          return this.checkAndMoveObjectToLocation(obj, tile.mapPos, speed);
        }

        return false;
      };
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


      EngineView.prototype.checkAndMoveObjectToLocation = function (obj, pos, speed) {
        if (speed === void 0) {
          speed = null;
        }

        var path = this.getPath(obj.mapPos, pos);

        if (path) {
          // begin moving process
          this.moveObjThrough(obj, path, speed);
          return path.length > 0;
        }

        return false;
      };
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


      EngineView.prototype.moveCurrentControllableToLocation = function (pos, speed) {
        if (speed === void 0) {
          speed = null;
        }

        if (!this._currentControllable) {
          throw new Error('TRAVISO: _currentControllable is not defined!');
        }

        return this.checkAndMoveObjectToLocation(this._currentControllable, pos, speed);
      };
      /**
       * Moves the current controllable map-object to one of the adjacent available tiles of the map-object specified.
       *
       * @method
       * @function
       * @public
       *
       * @param obj {ObjectView} target map-object
       * @param speed {number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
       * @return {boolean} if there is an available path to move to the target map-object
       */


      EngineView.prototype.moveCurrentControllableToObj = function (obj, speed) {
        if (speed === void 0) {
          speed = null;
        }

        if (!this._currentControllable) {
          throw new Error('TRAVISO: _currentControllable is not defined!');
        } // check if there is a preferred interaction point


        if (obj.currentInteractionOffset) {
          var targetPos = {
            c: obj.mapPos.c + obj.currentInteractionOffset.c,
            r: obj.mapPos.r + obj.currentInteractionOffset.r
          };

          if (this.checkAndMoveObjectToLocation(this._currentControllable, targetPos, speed)) {
            return true;
          }
        }

        var cellArray = this._pathFinding.getAdjacentOpenCells(obj.mapPos.c, obj.mapPos.r, obj.columnSpan, obj.rowSpan);

        var tile;
        var minLength = 3000;
        var path, minPath, tempFlagHolder;

        for (var i = 0; i < cellArray.length; i++) {
          tile = this._tileArray[cellArray[i].mapPos.r][cellArray[i].mapPos.c];

          if (tile) {
            if (tile.mapPos.c === this._currentControllable.mapPos.c && tile.mapPos.r === this._currentControllable.mapPos.r) {
              // already next to the object, do nothing
              this.arrangePathHighlight(this._currentControllable.currentPath, null);
              this.stopObject(this._currentControllable);
              tempFlagHolder = this._config.instantObjectRelocation;
              this._config.instantObjectRelocation = true;
              this.moveObjThrough(this._currentControllable, [new GridNode(tile.mapPos.c, tile.mapPos.r, 1)]);
              this._config.instantObjectRelocation = tempFlagHolder;

              this._currentControllable.changeVisualToDirection(this._currentControllable.currentDirection, false);

              if (this._config.objectReachedDestinationCallback) {
                this._config.objectReachedDestinationCallback(this._currentControllable);
              }

              return true;
            }

            path = this.getPath(this._currentControllable.mapPos, tile.mapPos);

            if (path && path.length < minLength) {
              minLength = path.length;
              minPath = path;
            }
          }
        }

        if (minPath) {
          this.moveObjThrough(this._currentControllable, minPath, speed);
          return true;
        }

        return false;
      };
      /**
       * Finds the nearest tile to the point given in the map's local scope.
       *
       * @method
       * @function
       * @public
       *
       * @param lp {TPositionPair} Point to check
       * @return {TileView} The nearest map-tile if there is one. Otherwise `null`
       */


      EngineView.prototype.getTileFromLocalPos = function (lp) {
        var closestTile = null;

        if (isInPolygon(lp, this._mapVertices)) {
          // Using nearest point instead of checking polygon vertices for each tile. Should be faster...
          // NOTE: there is an ignored bug (for better performance) that tile is not selected when u click on the far corner
          var thresh = this.tileHalfWidth / 2;
          var tile = void 0,
              i = void 0,
              j = void 0,
              dist = void 0;
          var closestDist = 3000;

          for (i = 0; i < this._mapSizeR; i++) {
            for (j = 0; j < this._mapSizeC; j++) {
              tile = this._tileArray[i][j];

              if (tile) {
                dist = getDist(lp, tile.position);

                if (dist < closestDist) {
                  closestDist = dist;
                  closestTile = tile;

                  if (dist < thresh) {
                    break;
                  }
                }
              }
            }
          }
        }

        return closestTile;
      };
      /**
       * Checks if an interaction occurs using the interaction data coming from PIXI.
       * If there is any interaction starts necessary movements or performs necessary callbacks.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param interactionData {PIXI.InteractionData} interaction data coming from PIXI
       */


      EngineView.prototype.checkForTileClick = function (interactionData) {
        var lp = this._mapContainer.toLocal(interactionData.global);

        var closestTile = this.getTileFromLocalPos(lp);
        var config = this._config;

        if (closestTile) {
          var a = this._objArray[closestTile.mapPos.r][closestTile.mapPos.c];

          if (a) {
            for (var k = 0; k < a.length; k++) {
              if (a[k].isInteractive) {
                if (config.objectSelectCallback) {
                  config.objectSelectCallback(a[k]);
                }

                break;
              } // TODO CHECK: this might cause issues when there is one movable and one not movable object on the same tile
              else if (a[k].isMovableTo) {
                  if (config.tilePreSelectCallback) {
                    config.tilePreSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
                  }

                  if (config.dontAutoMoveToTile || !this._currentControllable || this.checkAndMoveObjectToTile(this._currentControllable, closestTile)) {
                    if (config.highlightTargetTile) {
                      closestTile.setHighlighted(true, !config.tileHighlightAnimated);
                      setTimeout(function () {
                        return closestTile.setHighlighted(false, !config.tileHighlightAnimated);
                      }, 800);
                    }

                    if (config.tileSelectCallback) {
                      config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
                    }

                    break;
                  }
                }
            }
          } else {
            if (config.tilePreSelectCallback) {
              config.tilePreSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
            }

            if (config.dontAutoMoveToTile || !this._currentControllable || this.checkAndMoveObjectToTile(this._currentControllable, closestTile)) {
              if (config.highlightTargetTile) {
                closestTile.setHighlighted(true, !config.tileHighlightAnimated);
                setTimeout(function () {
                  return closestTile.setHighlighted(false, !config.tileHighlightAnimated);
                }, 800);
              }

              if (config.tileSelectCallback) {
                config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
              }
            }
          }
        }
      };
      /**
       * Enables mouse/touch interactions.
       *
       * @method
       * @function
       * @public
       */


      EngineView.prototype.enableInteraction = function () {
        // this.mousedown = this.touchstart = this.onMouseDown.bind(this);
        // this.mousemove = this.touchmove = this.onMouseMove.bind(this);
        // this.mouseup = this.mouseupout = this.touchend = this.onMouseUp.bind(this);
        this.on('pointerdown', this.onMouseDown_binded).on('pointerup', this.onMouseUp_binded) // .on('pointerout', this.onMouseUp_binded)
        .on('pointerupoutside', this.onMouseUp_binded).on('pointermove', this.onMouseMove_binded);
        this.interactive = true;
      };
      /**
       * Disables mouse/touch interactions.
       *
       * @method
       * @function
       * @public
       */


      EngineView.prototype.disableInteraction = function () {
        // this.mousedown = this.touchstart = null;
        // this.mousemove = this.touchmove = null;
        // this.mouseup = this.mouseupout = this.touchend = null;
        this.off('pointerdown', this.onMouseDown_binded).off('pointerup', this.onMouseUp_binded) // .off('pointerout', this.onMouseUp_binded)
        .off('pointerupoutside', this.onMouseUp_binded).off('pointermove', this.onMouseMove_binded);
        this.interactive = true;
        this._dragging = false;
      };
      /**
       * Checks if the given point is inside the masked area if there is a mask defined.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param p {TPositionPair} point to check
       * @return {boolean} if the point is inside the masked area
       */


      EngineView.prototype.isInteractionInMask = function (p) {
        if (this._config.useMask) {
          if (p.x < this._posFrame.x || p.y < this._posFrame.y || p.x > this._posFrame.x + this._posFrame.w || p.y > this._posFrame.y + this._posFrame.h) {
            return false;
          }
        }

        return true;
      }; // ******************** START: MOUSE INTERACTIONS **************************** //

      /**
       * Handler function for mouse-down event.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param event {InteractionEvent} interaction event object
       */


      EngineView.prototype.onMouseDown = function (event) {
        var globalPos = event.data.global;

        if (!this._dragging && this.isInteractionInMask(globalPos)) {
          this._dragging = true; //this.mouseDownTime = new Date();

          this._dragInitStartingX = this._dragPrevStartingX = globalPos.x;
          this._dragInitStartingY = this._dragPrevStartingY = globalPos.y;
        }
      };
      /**
       * Handler function for mouse-move event.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param event {InteractionEvent} interaction event object
       */


      EngineView.prototype.onMouseMove = function (event) {
        if (this._dragging && this._config.mapDraggable) {
          var globalPos = event.data.global;
          this._mapContainer.position.x += globalPos.x - this._dragPrevStartingX;
          this._mapContainer.position.y += globalPos.y - this._dragPrevStartingY;
          this._dragPrevStartingX = globalPos.x;
          this._dragPrevStartingY = globalPos.y;
        }
      };
      /**
       * Handler function for mouse-up event.
       *
       * @method
       * @function
       * @private
       * @internal
       *
       * @param event {InteractionEvent} interaction event object
       */


      EngineView.prototype.onMouseUp = function (event) {
        if (this._dragging) {
          this._dragging = false; //const passedTime = (new Date()) - this.mouseDownTime;

          var distX = event.data.global.x - this._dragInitStartingX;
          var distY = event.data.global.y - this._dragInitStartingY;

          if (Math.abs(distX) < 5 && Math.abs(distY) < 5) {
            // NOT DRAGGING IT IS A CLICK
            this.checkForTileClick(event.data);
          }
        }
      }; // ********************* END: MOUSE INTERACTIONS **************************** //

      /**
       * Repositions the content according to user settings. Call this method
       * whenever you want to change the size or position of the engine.
       *
       * @method
       * @function
       * @public
       *
       * @param posFrame {TPositionFrame} frame to position the engine, default is the previously set posFrame and if not set, it is `{ x : 0, y : 0, w : 800, h : 600 }`
       */


      EngineView.prototype.repositionContent = function (posFrame) {
        if (posFrame === void 0) {
          posFrame = null;
        }

        trace('EngineView repositionContent');
        posFrame = posFrame || this._posFrame || {
          x: 0,
          y: 0,
          w: 800,
          h: 600
        };
        this.position.x = posFrame.x;
        this.position.y = posFrame.y;
        this._externalCenter = {
          x: posFrame.w >> 1,
          y: posFrame.h >> 1
        };
        this.centralizeToCurrentFocusLocation(true);

        if (this._bg) {
          this._bg.clear(); // this._bg.lineStyle(2, 0x000000, 1);


          this._bg.beginFill(this._config.backgroundColor, 1.0);

          this._bg.drawRect(0, 0, posFrame.w, posFrame.h);

          this._bg.endFill();
        }

        if (this._mapMask && this._mapContainer) {
          this._mapMask.clear();

          this._mapMask.beginFill(0x000000);

          this._mapMask.drawRect(0, 0, posFrame.w, posFrame.h);

          this._mapMask.endFill();

          this._mapContainer.mask = this._mapMask;
        }

        this._posFrame = posFrame;
      };
      /**
       * Clears all references and stops all animations inside the engine.
       * Call this method when you want to get rid of an engine instance.
       *
       * @method
       * @function
       * @public
       */


      EngineView.prototype.destroy = function () {
        trace('EngineView destroy');
        this.disableInteraction();
        this.moveEngine.destroy();
        this.moveEngine = null;
        var item, i, j, k;

        for (i = 0; i < this._mapSizeR; i++) {
          for (j = this._mapSizeC - 1; j >= 0; j--) {
            item = this._tileArray[i][j];

            if (item) {
              item.destroy(); // this._groundContainer.removeChild(item);
            }

            this._tileArray[i][j] = null;
            item = this._objArray[i][j];

            if (item) {
              for (k = 0; k < item.length; k++) {
                if (item[k]) {
                  item[k].destroy(); // this._objContainer.removeChild(item[k]);
                }

                item[k] = null;
              }
            }

            this._objArray[i][j] = null;
          }
        }

        item = null;

        this._pathFinding.destroy();

        this._pathFinding = null;
        this._currentControllable = null;
        this._tileArray = null;
        this._objArray = null;
        this._bg = null;
        this._groundContainer = null;
        this._objContainer = null;

        if (this._mapContainer) {
          this._mapContainer.mask = null;
          this.removeChild(this._mapContainer);
          this._mapContainer = null;
        }

        if (this._mapMask) {
          this.removeChild(this._mapMask);
          this._mapMask = null;
        }

        this._config = null;
        this.mapData.groundMapData = null;
        this.mapData.objectsMapData = null;
        this.mapData.objects = null;
        this.mapData.tiles = null;
        this.mapData = null;
      };

      Object.defineProperty(EngineView.prototype, "instantCameraZoom", {
        // Externally modifiable properties for EngineView

        /**
         * specifies whether to zoom instantly or with a tween animation
         * @property
         * @default false
         */
        get: function get() {
          return this._config.instantCameraZoom;
        },
        set: function set(value) {
          this._config.instantCameraZoom = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "followCharacter", {
        /**
         * defines if the camera will follow the current controllable or not
         * @property
         * @default true
         */
        get: function get() {
          return this._config.followCharacter;
        },
        set: function set(value) {
          this._config.followCharacter = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "instantCameraRelocation", {
        /**
         * specifies whether the camera moves instantly or with a tween animation to the target location
         * @property
         * @default false
         */
        get: function get() {
          return this._config.instantCameraRelocation;
        },
        set: function set(value) {
          this._config.instantCameraRelocation = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "instantObjectRelocation", {
        /**
         * specifies whether the map-objects will be moved to target location instantly or with an animation
         * @property
         * @default false
         */
        get: function get() {
          return this._config.instantObjectRelocation;
        },
        set: function set(value) {
          this._config.instantObjectRelocation = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "changeTransparencies", {
        /**
         * make objects transparent when the controllable is behind them
         * @property
         * @default true
         */
        get: function get() {
          return this._config.changeTransparencies;
        },
        set: function set(value) {
          this._config.changeTransparencies = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "highlightPath", {
        /**
         * highlight the path when the current controllable moves on the map
         * @property
         * @default true
         */
        get: function get() {
          return this._config.highlightPath;
        },
        set: function set(value) {
          this._config.highlightPath = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "highlightTargetTile", {
        /**
         * Highlight the target tile when the current controllable moves on the map
         * @property
         * @default true
         */
        get: function get() {
          return this._config.highlightTargetTile;
        },
        set: function set(value) {
          this._config.highlightTargetTile = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileHighlightAnimated", {
        /**
         * animate the tile highlights
         * @property
         * @default true
         */
        get: function get() {
          return this._config.tileHighlightAnimated;
        },
        set: function set(value) {
          this._config.tileHighlightAnimated = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "dontAutoMoveToTile", {
        /**
         * When a tile selected don't move the controllable immediately but still call 'tileSelectCallback'
         * @property
         * @default false
         */
        get: function get() {
          return this._config.dontAutoMoveToTile;
        },
        set: function set(value) {
          this._config.dontAutoMoveToTile = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "checkPathOnEachTile", {
        /**
         * Engine looks for a path every time an object moves to a new tile on the path
         * (set to false if you don't have moving objects other then your controllable on your map)
         * @property
         * @default true
         */
        get: function get() {
          return this._config.checkPathOnEachTile;
        },
        set: function set(value) {
          this._config.checkPathOnEachTile = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "mapDraggable", {
        /**
         * enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map
         * @property
         * @default true
         */
        get: function get() {
          return this._config.mapDraggable;
        },
        set: function set(value) {
          this._config.mapDraggable = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "engineInstanceReadyCallback", {
        /**
         * callback function that will be called once everything is loaded and engine instance is ready
         * @property
         * @default null
         */
        get: function get() {
          return this._config.engineInstanceReadyCallback;
        },
        set: function set(value) {
          this._config.engineInstanceReadyCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileSelectCallback", {
        /**
         * callback function that will be called when a tile is selected. Params will be the row and column indexes of the tile selected.
         * @property
         * @default null
         */
        get: function get() {
          return this._config.tileSelectCallback;
        },
        set: function set(value) {
          this._config.tileSelectCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "objectSelectCallback", {
        /**
         * callback function that will be called when a tile with an interactive map-object on it is selected. Call param will be the object selected.
         * @property
         * @default null
         */
        get: function get() {
          return this._config.objectSelectCallback;
        },
        set: function set(value) {
          this._config.objectSelectCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "objectReachedDestinationCallback", {
        /**
         * callback function that will be called when any moving object reaches its destination. Call param will be the moving object itself.
         * @property
         * @default null
         */
        get: function get() {
          return this._config.objectReachedDestinationCallback;
        },
        set: function set(value) {
          this._config.objectReachedDestinationCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "otherObjectsOnTheNextTileCallback", {
        /**
         * callback function that will be called when any moving object is in move and there are other objects on the next tile. Call params will be the moving object and an array of objects on the next tile.
         * @property
         * @default null
         */
        get: function get() {
          return this._config.otherObjectsOnTheNextTileCallback;
        },
        set: function set(value) {
          this._config.otherObjectsOnTheNextTileCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "objectUpdateCallback", {
        /**
         * callback function that will be called every time an objects direction or position changed
         * @property
         * @default null
         */
        get: function get() {
          return this._config.objectUpdateCallback;
        },
        set: function set(value) {
          this._config.objectUpdateCallback = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileHighlightStrokeAlpha", {
        /**
         * alpha value for the tile highlight stroke (this will be overridden if a highlight-image is defined)
         * @property
         * @default 1.0
         */
        get: function get() {
          return this._config.tileHighlightStrokeAlpha;
        },
        set: function set(value) {
          this._config.tileHighlightStrokeAlpha = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileHighlightStrokeColor", {
        /**
         * color code for the tile highlight stroke (this will be overridden if a highlight-image is defined)
         * @property
         * @default 0xFFFFFF
         */
        get: function get() {
          return this._config.tileHighlightStrokeColor;
        },
        set: function set(value) {
          this._config.tileHighlightStrokeColor = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileHighlightFillAlpha", {
        /**
         * alpha value for the tile highlight fill (this will be overridden if a highlight-image is defined)
         * @property
         * @default 1.0
         */
        get: function get() {
          return this._config.tileHighlightFillAlpha;
        },
        set: function set(value) {
          this._config.tileHighlightFillAlpha = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(EngineView.prototype, "tileHighlightFillColor", {
        /**
         * color code for the tile highlight fill (this will be overridden if a highlight-image is defined)
         * @property
         * @default 0x80d7ff
         */
        get: function get() {
          return this._config.tileHighlightFillColor;
        },
        set: function set(value) {
          this._config.tileHighlightFillColor = value;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * The default height of a single isometric tile
       *
       * @default 74
       * @property
       * @private
       * @static
       */

      EngineView.DEFAULT_TILE_H = 74;
      /**
       * The default angle (in degrees) between the top-left edge and the horizontal diagonal of a isometric quad
       *
       * @default 30
       * @property
       * @private
       * @static
       */

      EngineView.DEFAULT_ISO_ANGLE = 30;
      return EngineView;
    }(pixi_js.Container);

    var saidHello = false;
    var VERSION$1 = '0.1.4';
    /**
     * Skips the hello message of renderers that are created after this is run.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @function
     * @method
     * @static
     * @public
     */

    function skipHello() {
      saidHello = true;
    }
    /**
     * Logs out the version information for this running instance of TRAVISO.
     * If you don't want to see this message you can run `TRAVISO.skipHello()` before
     * creating your engine.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @function
     * @method
     * @static
     * @public
     */

    function sayHello() {
      var _a;

      if (saidHello) {
        return;
      }

      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = ["\n %c %c %c Traviso.js - " + VERSION$1 + "  %c  %c  http://www.travisojs.com/  %c  \n\n", 'background: #18bc9c; padding:5px 0;', 'background: #18bc9c; padding:5px 0;', 'color: #18bc9c; background: #030307; padding:5px 0;', 'background: #18bc9c; padding:5px 0;', 'background: #5ad2ba; padding:5px 0;', 'background: #18bc9c; padding:5px 0;'];

        (_a = self.console).log.apply(_a, args);
      } else if (self.console) {
        self.console.log("Traviso.js " + VERSION$1 + " - http://www.travisojs.com/");
      }

      saidHello = true;
    }

    /**
     * String of the current TRAVISO version.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @property
     * @static
     * @public
     * @constant
     */
    var VERSION = '0.1.4';

    /**
     * Global configuration settings for traviso
     *
     * @property
     * @private
     * @internal
     */

    var config = {
      logEnabled: false
    };
    /**
     * Flag defining whether traviso is set or not
     *
     * @property
     * @private
     * @internal
     */

    var isReady = false;
    /**
     * Initializes traviso global settings if it hasn't been already.
     *
     * @method
     * @function
     * @internal
     *
     * @param globalConfig {TTravisoConfiguration} configuration object for the traviso engine
     */

    var init = function init(globalConfig) {
      // do necessary checks and assignments for global settings
      if (globalConfig) {
        config = __assign(__assign({}, config), globalConfig);
        config.logEnabled = enableDisableLogging(globalConfig.logEnabled);
      }

      if (isReady) {
        return;
      }

      isReady = true;
      sayHello();
      trace('Traviso initiated. (Version: ' + VERSION + ')');
    };
    /**
     * Creates and returns an isometric engine instance with the provided configuration.
     * Also initializes traviso global settings if it hasn't been already.
     *
     * @memberof TRAVISO
     * @for TRAVISO
     *
     * @method
     * @function
     * @public
     * @static
     *
     * @param instanceConfig {TEngineConfiguration} Configuration object for the isometric instance, required
     * @param globalConfig {TTravisoConfiguration} Configuration object for the traviso engine, default null
     *
     * @returns {EngineView} A new instance of the isometric engine
     */


    var getEngineInstance = function getEngineInstance(instanceConfig, globalConfig) {
      if (globalConfig === void 0) {
        globalConfig = null;
      }

      init(globalConfig);
      return new EngineView(instanceConfig);
    };

    exports.DIRECTIONS = DIRECTIONS;
    exports.EngineView = EngineView;
    exports.ObjectView = ObjectView;
    exports.PF_ALGORITHMS = PF_ALGORITHMS;
    exports.TileView = TileView;
    exports.VERSION = VERSION;
    exports.dotProduct = dotProduct;
    exports.enableDisableLogging = enableDisableLogging;
    exports.existy = existy;
    exports.getDist = getDist;
    exports.getEngineInstance = getEngineInstance;
    exports.getUnit = getUnit;
    exports.isInPolygon = isInPolygon;
    exports.mathMap = mathMap;
    exports.skipHello = skipHello;
    exports.trace = trace;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, PIXI));
//# sourceMappingURL=traviso.js.map
