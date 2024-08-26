
        

(function(){ 'use strict';

  
    var lastTime = 0;
    var vendors = [ 'webkit', 'moz' ];
    for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
      window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
      window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }
    
    if( !window.requestAnimationFrame ) {
      window.requestAnimationFrame = function( callback, element ) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
        var id = window.setTimeout(
          function() { 
            callback( currTime + timeToCall ); 
          }, timeToCall );
        lastTime = currTime + timeToCall;
        return id;
      }
    }
    
    if( !window.cancelAnimationFrame ) {
      window.cancelAnimationFrame = function( id ) {
        clearTimeout( id );
      }
    }
    
    })();
    
    
    (function(){ 'use strict';
    
    function hasClass( elem, className ) {
      return new RegExp( ' ' + className + ' ' ).test( ' ' + elem.className + ' ' );
    };
    
    function addClass( elem, className ) {
      if( !hasClass(elem, className ) ) {
        elem.className += ' ' + className;
      }
    };
    
    function removeClass( elem, className ) {
      var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
      if( hasClass( elem, className ) ) {
        while( newClass.indexOf(' ' + className + ' ' ) >= 0 ) {
          newClass = newClass.replace( ' ' + className + ' ', ' ' );
        }
        elem.className = newClass.replace( /^\s+|\s+$/g, '' );
      }
    };
    
    function toggleClass( elem, className ) {
      var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
      if( hasClass(elem, className ) ) {
        while( newClass.indexOf( ' ' + className + ' ' ) >= 0 ) {
          newClass = newClass.replace( ' ' + className + ' ' , ' ' );
        }
        elem.className = newClass.replace( /^\s+|\s+$/g, '' );
      } else {
        elem.className += ' ' + className;
      }
    };
    
    })();
    
    
    g = {};
    
    (function(){ 'use strict';
    
    
    g.m = Math;
    g.mathProps = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );
    for ( var i = 0; i < g.mathProps.length; i++ ) {
      g[ g.mathProps[ i ] ] = g.m[ g.mathProps[ i ] ];
    }
    g.m.TWO_PI = g.m.PI * 2;
    
    
    g.isset = function( prop ) {
      return typeof prop != 'undefined';
    };
    
    g.log = function() {
      if( g.isset( g.config ) && g.config.debug && window.console ){
        console.log( Array.prototype.slice.call( arguments ) );
      }
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.Group = function() {
      this.collection = [];
      this.length = 0;
    };
    
    g.Group.prototype.add = function( item ) {
      this.collection.push( item );
      this.length++;
    };
    
    g.Group.prototype.remove = function( index ) {
      if( index < this.length ) {
        this.collection.splice( index, 1 );
        this.length--;
      }
    };
    
    g.Group.prototype.empty = function() {
      this.collection.length = 0;
      this.length = 0;
    };
    
    g.Group.prototype.each = function( action, asc ) {
      var asc = asc || 0,
        i;
      if( asc ) {
        for( i = 0; i < this.length; i++ ) {
          this.collection[ i ][ action ]( i );
        }
      } else {
        i = this.length;
        while( i-- ) {
          this.collection[ i ][ action ]( i );
        }
      }
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.util = {};
    
    
    g.util.rand = function( min, max ) {
      return g.m.random() * ( max - min ) + min;
    };
    
    g.util.randInt = function( min, max ) {
      return g.m.floor( g.m.random() * ( max - min + 1) ) + min;
    };
    
    }());
    
    
    (function(){ 'use strict';
    
    g.states = {};
    
    g.addState = function( state ) {
      g.states[ state.name ] = state;
    };
    
    g.setState = function( name ) {
      if( g.state ) {
        g.states[ g.state ].exit();
      }
      g.state = name;
      g.states[ g.state ].init();
    };
    
    g.currentState = function() {
      return g.states[ g.state ];
    };
    
    }());
    
    
    (function(){ 'use strict';
    
    g.Time = function() {
      this.reset();
    }
    
    g.Time.prototype.reset = function() {
      this.now = Date.now();
      this.last = Date.now();
      this.delta = 60;
      this.ndelta = 1;
      this.elapsed = 0;
      this.nelapsed = 0;
      this.tick = 0;
    };
    
    g.Time.prototype.update = function() {
      this.now = Date.now();
      this.delta = this.now - this.last;
      this.ndelta = Math.min( Math.max( this.delta / ( 1000 / 60 ), 0.0001 ), 10 );
      this.elapsed += this.delta;
      this.nelapsed += this.ndelta;
      this.last = this.now;
      this.tick++;
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.Grid = function( cols, rows ) {
      this.cols = cols;
      this.rows = rows;
      this.tiles = [];
      for( var x = 0; x < cols; x++ ) {
        this.tiles[ x ] = [];
        for( var y = 0; y < rows; y++ ) {
          this.tiles[ x ].push( 'empty' );
        }
      }
    };
    
    g.Grid.prototype.get = function( x, y ) {
      return this.tiles[ x ][ y ];
    };
    
    g.Grid.prototype.set = function( x, y, val ) {
      this.tiles[ x ][ y ] = val;
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.BoardTile = function( opt ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.z = 0;
      this.w = opt.w;
      this.h = opt.h;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.elem.className = 'tile';
      this.parentState.stageElem.appendChild( this.elem );
      this.classes = {
        pressed: 0,
        path: 0,
        up: 0,
        down: 0,
        left: 0,
        right: 0
      }
      this.updateDimensions();
    };
    
    g.BoardTile.prototype.update = function() {
      for( var k in this.classes ) {
        if( this.classes[ k ] ) {
          this.classes[ k ]--;
        }
      }
    
      if( this.parentState.food.tile.col == this.col || this.parentState.food.tile.row == this.row ) {
        this.classes.path = 1;
        if( this.col < this.parentState.food.tile.col ) {
          this.classes.right = 1;
        } else {
          this.classes.right = 0;
        }
        if( this.col > this.parentState.food.tile.col ) {
          this.classes.left = 1;
        } else {
          this.classes.left = 0;
        }
        if( this.row > this.parentState.food.tile.row ) {
          this.classes.up = 1;
        } else {
          this.classes.up = 0;
        }
        if( this.row < this.parentState.food.tile.row ) {
          this.classes.down = 1;
        } else {
          this.classes.down = 0;
        }
      } else {
        this.classes.path = 0;
      }
    
      if( this.parentState.food.eaten ) {
        this.classes.path = 0;
      }
    };
    
    g.BoardTile.prototype.updateDimensions = function() {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
    };
    
    g.BoardTile.prototype.render = function() {
      var classString = '';
      for( var k in this.classes ) {
        if( this.classes[ k ] ) {
          classString += k + ' ';
        }
      }
      this.elem.className = 'tile ' + classString;
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.SnakeTile = function( opt ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.w = opt.w;
      this.h = opt.h;
      this.color = null;
      this.scale = 1;
      this.rotation = 0;
      this.blur = 0;
      this.alpha = 1;
      this.borderRadius = 0;
      this.borderRadiusAmount = 0;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.parentState.stageElem.appendChild( this.elem );
    };
    
    g.SnakeTile.prototype.update = function( i ) {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      if( i == 0 ) {
        this.color = '#fff';
        this.blur = this.parentState.dimAvg * 0.03 + Math.sin( this.parentState.time.elapsed / 200 ) * this.parentState.dimAvg * 0.015;
        if( this.parentState.snake.dir == 'n' ) {
          this.borderRadius = this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '% 0 0';
        } else if( this.parentState.snake.dir == 's' ) {
          this.borderRadius = '0 0 ' + this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '%';
        } else if( this.parentState.snake.dir == 'e' ) {
          this.borderRadius = '0 ' + this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '% 0';
        } else if( this.parentState.snake.dir == 'w' ) {
          this.borderRadius = this.borderRadiusAmount + '% 0 0 ' + this.borderRadiusAmount + '%';
        }
      } else {
        this.color = '#fff';
        this.blur = 0;
        this.borderRadius = '0';
      }
      this.alpha = 1 - ( i / this.parentState.snake.tiles.length ) * 0.6;
      this.rotation = ( this.parentState.snake.justAteTick / this.parentState.snake.justAteTickMax ) * 90;
      this.scale = 1 + ( this.parentState.snake.justAteTick / this.parentState.snake.justAteTickMax ) * 1;
    };
    
    g.SnakeTile.prototype.updateDimensions = function() {
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
    };
    
    g.SnakeTile.prototype.render = function( i ) {
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
      this.elem.style.backgroundColor = 'rgba(255, 255, 255, ' + this.alpha + ')';
      this.elem.style.boxShadow = '0 0 ' + this.blur + 'px #fff';
      this.elem.style.borderRadius = this.borderRadius;
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.FoodTile = function( opt ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.w = opt.w;
      this.h = opt.h;
      this.blur = 0;
      this.scale = 1;
      this.hue = 100;
      this.opacity = 0;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.parentState.stageElem.appendChild( this.elem );
    };
    
    g.FoodTile.prototype.update = function() {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      this.blur = this.parentState.dimAvg * 0.03 + Math.sin( this.parentState.time.elapsed / 200 ) * this.parentState.dimAvg * 0.015;
      this.scale = 0.8 + Math.sin( this.parentState.time.elapsed / 200 ) * 0.2;
    
      if( this.parentState.food.birthTick || this.parentState.food.deathTick ) {
        if( this.parentState.food.birthTick ) {
          this.opacity = 1 - ( this.parentState.food.birthTick / 1 ) * 1;
        } else {
          this.opacity = ( this.parentState.food.deathTick / 1 ) * 1;
        }
      } else {
        this.opacity = 1;
      }
    };
    
    g.FoodTile.prototype.updateDimensions = function() {
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
    };
    
    g.FoodTile.prototype.render = function() {
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
      this.elem.style[ 'transform' ] = 'translateZ(0) scale(' + this.scale + ')';
      this.elem.style.backgroundColor = 'hsla(' + this.hue + ', 100%, 60%, 1)';
      this.elem.style.boxShadow = '0 0 ' + this.blur + 'px hsla(' + this.hue + ', 100%, 60%, 1)';
      this.elem.style.opacity = this.opacity;
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.Snake = function( opt ) {
      this.parentState = opt.parentState;
      this.dir = 'e',
      this.currDir = this.dir;
      this.tiles = [];
      for( var i = 0; i < 5; i++ ) {
        this.tiles.push( new g.SnakeTile({
          parentState: this.parentState,
          parentGroup: this.tiles,
          col: 8 - i,
          row: 3,
          x: ( 8 - i ) * opt.parentState.tileWidth,
          y: 3 * opt.parentState.tileHeight,
          w: opt.parentState.tileWidth - opt.parentState.spacing,
          h: opt.parentState.tileHeight - opt.parentState.spacing
        }));
      }
      this.last = 0;
      this.updateTick = 10;
      this.updateTickMax = this.updateTick;
      this.updateTickLimit = 3;
      this.updateTickChange = 0.2;
      this.deathFlag = 0;
      this.justAteTick = 0;
      this.justAteTickMax = 1;
      this.justAteTickChange = 0.05;
    
      // sync data grid of the play state
      var i = this.tiles.length;
    
      while( i-- ) {
        this.parentState.grid.set( this.tiles[ i ].col, this.tiles[ i ].row, 'snake' );
      }
    };
    
    g.Snake.prototype.updateDimensions = function() {
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].updateDimensions();
      }
    };
    
    g.Snake.prototype.update = function() {
      if( this.parentState.keys.up ) {
        if( this.dir != 's' && this.dir != 'n' && this.currDir != 's' && this.currDir != 'n' ) {
          this.dir = 'n';
        }
      } else if( this.parentState.keys.down) {
        if( this.dir != 'n' && this.dir != 's' && this.currDir != 'n' && this.currDir != 's' ) {
          this.dir = 's';
        }
      } else if( this.parentState.keys.right ) {
        if( this.dir != 'w' && this.dir != 'e' && this.currDir != 'w' && this.currDir != 'e' ) {
          this.dir = 'e';
        }
      } else if( this.parentState.keys.left ) {
        if( this.dir != 'e' && this.dir != 'w' && this.currDir != 'e' && this.currDir != 'w' ) {
          this.dir = 'w';
        }
      }
    
      this.parentState.keys.up = 0;
      this.parentState.keys.down = 0;
      this.parentState.keys.right = 0;
      this.parentState.keys.left = 0;
    
      this.updateTick += this.parentState.time.ndelta;
      if( this.updateTick >= this.updateTickMax ) {
        // reset the update timer to 0, or whatever leftover there is
        this.updateTick = ( this.updateTick - this.updateTickMax );
    
        // rotate snake block array
        this.tiles.unshift( new g.SnakeTile({
          parentState: this.parentState,
          parentGroup: this.tiles,
          col: this.tiles[ 0 ].col,
          row: this.tiles[ 0 ].row,
          x: this.tiles[ 0 ].col * this.parentState.tileWidth,
          y: this.tiles[ 0 ].row * this.parentState.tileHeight,
          w: this.parentState.tileWidth - this.parentState.spacing,
          h: this.parentState.tileHeight - this.parentState.spacing
        }));
        this.last = this.tiles.pop();
        this.parentState.stageElem.removeChild( this.last.elem );
    
        this.parentState.boardTiles.collection[ this.last.col + ( this.last.row * this.parentState.cols ) ].classes.pressed = 2;
    
        // sync data grid of the play state
        var i = this.tiles.length;
    
        while( i-- ) {
          this.parentState.grid.set( this.tiles[ i ].col, this.tiles[ i ].row, 'snake' );
        }
        this.parentState.grid.set( this.last.col, this.last.row, 'empty' );
    
    
        // move the snake's head
        if ( this.dir == 'n' ) {
          this.currDir = 'n';
          this.tiles[ 0 ].row -= 1;
        } else if( this.dir == 's' ) {
          this.currDir = 's';
          this.tiles[ 0 ].row += 1;
        } else if( this.dir == 'w' ) {
          this.currDir = 'w';
          this.tiles[ 0 ].col -= 1;
        } else if( this.dir == 'e' ) {
          this.currDir = 'e';
          this.tiles[ 0 ].col += 1;
        }
    
        // wrap walls
        this.wallFlag = false;
        if( this.tiles[ 0 ].col >= this.parentState.cols ) {
          this.tiles[ 0 ].col = 0;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].col < 0 ) {
          this.tiles[ 0 ].col = this.parentState.cols - 1;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].row >= this.parentState.rows ) {
          this.tiles[ 0 ].row = 0;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].row < 0 ) {
          this.tiles[ 0 ].row = this.parentState.rows - 1;
          this.wallFlag = true;
        }
    
        // check death by eating self
        if( this.parentState.grid.get( this.tiles[ 0 ].col, this.tiles[ 0 ].row ) == 'snake' ) {
          this.deathFlag = 1;
          clearTimeout( this.foodCreateTimeout );
        }
    
        // check eating of food
        if( this.parentState.grid.get( this.tiles[ 0 ].col, this.tiles[ 0 ].row ) == 'food' ) {
          this.tiles.push( new g.SnakeTile({
            parentState: this.parentState,
            parentGroup: this.tiles,
            col: this.last.col,
            row: this.last.row,
            x: this.last.col * this.parentState.tileWidth,
            y: this.last.row * this.parentState.tileHeight,
            w: this.parentState.tileWidth - this.parentState.spacing,
            h: this.parentState.tileHeight - this.parentState.spacing
          }));
          if( this.updateTickMax - this.updateTickChange > this.updateTickLimit ) {
            this.updateTickMax -= this.updateTickChange;
          }
          this.parentState.score++;
          this.parentState.scoreElem.innerHTML = this.parentState.score;
          this.justAteTick = this.justAteTickMax;
    
          this.parentState.food.eaten = 1;
          this.parentState.stageElem.removeChild( this.parentState.food.tile.elem );
    
          var _this = this;
          
          this.foodCreateTimeout = setTimeout( function() {
            _this.parentState.food = new g.Food({
              parentState: _this.parentState
            });
          }, 300);
        }
    
        // check death by eating self
        if( this.deathFlag ) {
          g.setState( 'play' );
        }
      }
    
      // update individual snake tiles
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].update( i );
      }
    
      if( this.justAteTick > 0 ) {
        this.justAteTick -= this.justAteTickChange;
      } else if( this.justAteTick < 0 ) {
        this.justAteTick = 0;
      }
    };
    
    g.Snake.prototype.render = function() {
      // render individual snake tiles
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].render( i );
      }
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    g.Food = function( opt ) {
      this.parentState = opt.parentState;
      this.tile = new g.FoodTile({
        parentState: this.parentState,
        col: 0,
        row: 0,
        x: 0,
        y: 0,
        w: opt.parentState.tileWidth - opt.parentState.spacing,
        h: opt.parentState.tileHeight - opt.parentState.spacing
      });
      this.reset();
      this.eaten = 0;
      this.birthTick = 1;
      this.deathTick = 0;
      this.birthTickChange = 0.025;
      this.deathTickChange = 0.05;
    };
    
    g.Food.prototype.reset = function() {
      var empty = [];
      for( var x = 0; x < this.parentState.cols; x++) {
        for( var y = 0; y < this.parentState.rows; y++) {
          var tile = this.parentState.grid.get( x, y );
          if( tile == 'empty' ) {
            empty.push( { x: x, y: y } );
          }
        }
      }
      var newTile = empty[ g.util.randInt( 0, empty.length - 1 ) ];
      this.tile.col = newTile.x;
      this.tile.row = newTile.y;
    };
    
    g.Food.prototype.updateDimensions = function() {
      this.tile.updateDimensions();
    };
    
    g.Food.prototype.update = function() {
      // update food tile
      this.tile.update();
    
      if( this.birthTick > 0 ) {
        this.birthTick -= this.birthTickChange;
      } else if( this.birthTick < 0 ) {
        this.birthTick = 0;
      }
    
      // sync data grid of the play state
      this.parentState.grid.set( this.tile.col, this.tile.row, 'food' );
    };
    
    g.Food.prototype.render = function() {
      this.tile.render();
    };
    
    })();
    
    
    (function(){ 'use strict';
    
    function StatePlay() {
      this.name = 'play';
    }
    
    StatePlay.prototype.init = function() {
      this.scoreElem = document.querySelector( '.score' );
      this.stageElem = document.querySelector( '.stage' );
      this.dimLong = 28;
      this.dimShort = 16;
      this.padding = 0.25;
      this.boardTiles = new g.Group();
      this.keys = {};
      this.foodCreateTimeout = null;
      this.score = 0;
      this.scoreElem.innerHTML = this.score;
      this.time = new g.Time();
      this.getDimensions();
      if( this.winWidth < this.winHeight ) {
        this.rows = this.dimLong;
        this.cols = this.dimShort;
      } else {
        this.rows = this.dimShort;
        this.cols = this.dimLong;
      }
      this.spacing = 1;
      this.grid = new g.Grid( this.cols, this.rows );
      this.resize();
      this.createBoardTiles();
      this.bindEvents();
      this.snake = new g.Snake({
        parentState: this
      });
      this.food = new g.Food({
        parentState: this
      });
    };
    
    StatePlay.prototype.getDimensions = function() {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerHeight;
      this.activeWidth = this.winWidth - ( this.winWidth * this.padding );
      this.activeHeight = this.winHeight - ( this.winHeight * this.padding );
    };
    
    StatePlay.prototype.resize = function() {
      var _this = g.currentState();
    
      _this.getDimensions();
    
      _this.stageRatio = _this.rows / _this.cols;
    
      if( _this.activeWidth > _this.activeHeight / _this.stageRatio ) {
        _this.stageHeight = _this.activeHeight;
        _this.stageElem.style.height = _this.stageHeight + 'px';
        _this.stageWidth = Math.floor( _this.stageHeight /_this.stageRatio );
        _this.stageElem.style.width = _this.stageWidth + 'px';
      } else {
        _this.stageWidth = _this.activeWidth;
        _this.stageElem.style.width = _this.stageWidth + 'px';
        _this.stageHeight = Math.floor( _this.stageWidth * _this.stageRatio );
        _this.stageElem.style.height = _this.stageHeight + 'px';
      }
    
      _this.tileWidth = ~~( _this.stageWidth / _this.cols );
      _this.tileHeight = ~~( _this.stageHeight / _this.rows );
      _this.dimAvg = ( _this.activeWidth + _this.activeHeight ) / 2;
      _this.spacing = Math.max( 1, ~~( _this.dimAvg * 0.0025 ) );
    
      _this.stageElem.style.marginTop = ( -_this.stageElem.offsetHeight / 2 ) + _this.headerHeight / 2 + 'px';
    
      _this.boardTiles.each( 'updateDimensions' );
      _this.snake !== undefined && _this.snake.updateDimensions();
      _this.food !== undefined && _this.food.updateDimensions();
    };
    
    StatePlay.prototype.createBoardTiles = function() {
      for( var y = 0; y < this.rows; y++ ) {
        for( var x = 0; x < this.cols; x++ ) {
          this.boardTiles.add( new g.BoardTile({
            parentState: this,
            parentGroup: this.boardTiles,
            col: x,
            row: y,
            x: x * this.tileWidth,
            y: y * this.tileHeight,
            w: this.tileWidth - this.spacing,
            h: this.tileHeight - this.spacing
          }));
        }
      }
    };
    
    StatePlay.prototype.upOn = function() { g.currentState().keys.up = 1; }
    StatePlay.prototype.downOn = function() { g.currentState().keys.down = 1; }
    StatePlay.prototype.rightOn = function() { g.currentState().keys.right = 1; }
    StatePlay.prototype.leftOn = function() { g.currentState().keys.left = 1; }
    StatePlay.prototype.upOff = function() { g.currentState().keys.up = 0; }
    StatePlay.prototype.downOff = function() { g.currentState().keys.down = 0; }
    StatePlay.prototype.rightOff = function() { g.currentState().keys.right = 0; }
    StatePlay.prototype.leftOff = function() { g.currentState().keys.left = 0; }
    
    StatePlay.prototype.keydown = function( e ) {
      e.preventDefault();
      var e = ( e.keyCode ? e.keyCode : e.which ),
        _this = g.currentState();
      if( e === 38 || e === 87 ) { _this.upOn(); }
      if( e === 39 || e === 68 ) { _this.rightOn(); }
      if( e === 40 || e === 83 ) { _this.downOn(); }
      if( e === 37 || e === 65 ) { _this.leftOn(); }
    };
    
    StatePlay.prototype.bindEvents = function() {
      var _this = g.currentState();
      window.addEventListener( 'keydown', _this.keydown, false );
      window.addEventListener( 'resize', _this.resize, false );
    };
    
    StatePlay.prototype.step = function() {
      this.boardTiles.each( 'update' );
      this.boardTiles.each( 'render' );
      this.snake.update();
      this.snake.render();
      this.food.update();
      this.food.render();
      this.time.update();
    };
    
    StatePlay.prototype.exit = function() {
      window.removeEventListener( 'keydown', this.keydown, false );
      window.removeEventListener( 'resize', this.resize, false );
      this.stageElem.innerHTML = '';
      this.grid.tiles = null;
      this.time = null;
    };
    
    g.addState( new StatePlay() );
    
    })();
    
    
    (function(){ 'use strict';
    
    g.config = {
      title: 'Snakely',
      debug: window.location.hash == '#debug' ? 1 : 0,
      state: 'play'
    };
    
    g.setState( g.config.state );
    
    g.time = new g.Time();
    
    g.step = function() {
      requestAnimationFrame( g.step );
      g.states[ g.state ].step();
      g.time.update();
    };
    
    window.addEventListener( 'load', g.step, false );
    
    })();
    function showTime(){
      var date = new Date();
      var h = date.getHours(); // 0 - 23
      var m = date.getMinutes(); // 0 - 59
      var s = date.getSeconds(); // 0 - 59
      var session = "AM";
      
      if(h == 0){
          h = 12;
      }
      
      if(h > 12){
          h = h - 12;
          session = "PM";
      }
      
      h = (h < 10) ? "0" + h : h;
      m = (m < 10) ? "0" + m : m;
      s = (s < 10) ? "0" + s : s;
      
      var time = h + ":" + m + ":" + s + " " + session;
      document.getElementById("MyClockDisplay").innerText = time;
      document.getElementById("MyClockDisplay").textContent = time;
      
      setTimeout(showTime, 1000);
      
    }
    
    showTime();
    
    window.FontAwesomeKitConfig = {"id":118000300,"version":"5.15.4","token":"66aa7c98b3","method":"css","baseUrl":"https://ka-f.fontawesome.com","license":"free","asyncLoading":{"enabled":false},"autoA11y":{"enabled":true},"baseUrlKit":"https://kit.fontawesome.com","detectConflictsUntil":null,"iconUploads":{},"minify":{"enabled":true},"v4FontFaceShim":{"enabled":true},"v4shim":{"enabled":true},"v5FontFaceShim":{"enabled":false}};
    !function(t){"function"==typeof define&&define.amd?define("kit-loader",t):t()}((function(){"use strict";function t(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function e(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?t(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):t(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e,n){return(e=function(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,c=[],u=!0,f=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;u=!1}else for(;!(u=(r=i.call(n)).done)&&(c.push(r.value),c.length!==e);u=!0);}catch(t){f=!0,o=t}finally{try{if(!u&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(f)throw o}}return c}}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var a="sharp",c=["classic","duotone","sharp"],u=["fak","fa-kit","fakd","fa-kit-duotone"],f=["fa","fas","fa-solid","far","fa-regular","fal","fa-light","fat","fa-thin","fad","fa-duotone","fab","fa-brands","fass","fasr","fasl","fast"];function s(t,e){var n=e&&e.addOn||"",r=e&&e.baseFilename||t.license+n,o=e&&e.minify?".min":"",i=e&&e.fileSuffix||t.method,a=e&&e.subdir||t.method;return t.baseUrl+"/releases/"+("latest"===t.version?"latest":"v".concat(t.version))+"/"+a+"/"+r+o+"."+i}function d(t,e){var n=e||["fa"],r="."+Array.prototype.join.call(n,",."),o=t.querySelectorAll(r);Array.prototype.forEach.call(o,(function(e){var n=e.getAttribute("title");e.setAttribute("aria-hidden","true");var r=!e.nextElementSibling||!e.nextElementSibling.classList.contains("sr-only");if(n&&r){var o=t.createElement("span");o.innerHTML=n,o.classList.add("sr-only"),e.parentNode.insertBefore(o,e.nextSibling)}}))}var l,h=function(){},m="undefined"!=typeof global&&void 0!==global.process&&"function"==typeof global.process.emit,p="undefined"==typeof setImmediate?setTimeout:setImmediate,v=[];function b(){for(var t=0;t<v.length;t++)v[t][0](v[t][1]);v=[],l=!1}function y(t,e){v.push([t,e]),l||(l=!0,p(b,0))}function g(t){var e=t.owner,n=e._state,r=e._data,o=t[n],i=t.then;if("function"==typeof o){n="fulfilled";try{r=o(r)}catch(t){O(i,t)}}w(i,r)||("fulfilled"===n&&A(i,r),"rejected"===n&&O(i,r))}function w(t,e){var r;try{if(t===e)throw new TypeError("A promises callback cannot return that same promise.");if(e&&("function"==typeof e||"object"===n(e))){var o=e.then;if("function"==typeof o)return o.call(e,(function(n){r||(r=!0,e===n?S(t,n):A(t,n))}),(function(e){r||(r=!0,O(t,e))})),!0}}catch(e){return r||O(t,e),!0}return!1}function A(t,e){t!==e&&w(t,e)||S(t,e)}function S(t,e){"pending"===t._state&&(t._state="settled",t._data=e,y(E,t))}function O(t,e){"pending"===t._state&&(t._state="settled",t._data=e,y(P,t))}function j(t){t._then=t._then.forEach(g)}function E(t){t._state="fulfilled",j(t)}function P(t){t._state="rejected",j(t),!t._handled&&m&&global.process.emit("unhandledRejection",t._data,t)}function _(t){global.process.emit("rejectionHandled",t)}function F(t){if("function"!=typeof t)throw new TypeError("Promise resolver "+t+" is not a function");if(this instanceof F==!1)throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._then=[],function(t,e){function n(t){O(e,t)}try{t((function(t){A(e,t)}),n)}catch(t){n(t)}}(t,this)}F.prototype={constructor:F,_state:"pending",_then:null,_data:void 0,_handled:!1,then:function(t,e){var n={owner:this,then:new this.constructor(h),fulfilled:t,rejected:e};return!e&&!t||this._handled||(this._handled=!0,"rejected"===this._state&&m&&y(_,this)),"fulfilled"===this._state||"rejected"===this._state?y(g,n):this._then.push(n),n.then},catch:function(t){return this.then(null,t)}},F.all=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.all().");return new F((function(e,n){var r=[],o=0;function i(t){return o++,function(n){r[t]=n,--o||e(r)}}for(var a,c=0;c<t.length;c++)(a=t[c])&&"function"==typeof a.then?a.then(i(c),n):r[c]=a;o||e(r)}))},F.race=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.race().");return new F((function(e,n){for(var r,o=0;o<t.length;o++)(r=t[o])&&"function"==typeof r.then?r.then(e,n):e(r)}))},F.resolve=function(t){return t&&"object"===n(t)&&t.constructor===F?t:new F((function(e){e(t)}))},F.reject=function(t){return new F((function(e,n){n(t)}))};var C="function"==typeof Promise?Promise:F;function I(t,e){var n=e.fetch,r=e.XMLHttpRequest,o=e.token,i=t;return o&&!function(t){return t.indexOf("kit-upload.css")>-1}(t)&&("URLSearchParams"in window?(i=new URL(t)).searchParams.set("token",o):i=i+"?token="+encodeURIComponent(o)),i=i.toString(),new C((function(t,e){if("function"==typeof n)n(i,{mode:"cors",cache:"default"}).then((function(t){if(t.ok)return t.text();throw new Error("")})).then((function(e){t(e)})).catch(e);else if("function"==typeof r){var o=new r;o.addEventListener("loadend",(function(){this.responseText?t(this.responseText):e(new Error(""))}));["abort","error","timeout"].map((function(t){o.addEventListener(t,(function(){e(new Error(""))}))})),o.open("GET",i),o.send()}else{e(new Error(""))}}))}function U(t,e,n){var r=t;return[[/(url\("?)\.\.\/\.\.\/\.\./g,function(t,n){return"".concat(n).concat(e)}],[/(url\("?)\.\.\/webfonts/g,function(t,r){return"".concat(r).concat(e,"/releases/v").concat(n,"/webfonts")}],[/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g,function(t,n){return"".concat(n).concat(e)}]].forEach((function(t){var e=o(t,2),n=e[0],i=e[1];r=r.replace(n,i)})),r}function k(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},o=n.document||o,i=d.bind(d,o,[].concat(f,u,c.map((function(t){return"fa-".concat(t)}))));t.autoA11y.enabled&&r(i);var a=t.subsetPath&&t.baseUrl+"/"+t.subsetPath,l=[{id:"fa-main",addOn:void 0,url:a}];if(t.v4shim&&t.v4shim.enabled&&l.push({id:"fa-v4-shims",addOn:"-v4-shims"}),t.v5FontFaceShim&&t.v5FontFaceShim.enabled&&l.push({id:"fa-v5-font-face",addOn:"-v5-font-face"}),t.v4FontFaceShim&&t.v4FontFaceShim.enabled&&l.push({id:"fa-v4-font-face",addOn:"-v4-font-face"}),!a&&t.customIconsCssPath){var h=t.customIconsCssPath.indexOf("kit-upload.css")>-1?t.baseUrlKit:t.baseUrl,m=h+"/"+t.customIconsCssPath;l.push({id:"fa-kit-upload",url:m})}var p=l.map((function(r){return new C((function(o,i){var a=r.url||s(t,{addOn:r.addOn,minify:t.minify.enabled}),c={id:r.id},u=t.subset?c:e(e(e({},n),c),{},{baseUrl:t.baseUrl,version:t.version,id:r.id,contentFilter:function(t,e){return U(t,e.baseUrl,e.version)}});I(a,n).then((function(t){o(T(t,u))})).catch(i)}))}));return C.all(p)}function T(t,e){var n=e.contentFilter||function(t,e){return t},r=document.createElement("style"),o=document.createTextNode(n(t,e));return r.appendChild(o),r.media="all",e.id&&r.setAttribute("id",e.id),e&&e.detectingConflicts&&e.detectionIgnoreAttr&&r.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),r}function L(t,n){n.autoA11y=t.autoA11y.enabled,"pro"===t.license&&(n.autoFetchSvg=!0,n.fetchSvgFrom=t.baseUrl+"/releases/"+("latest"===t.version?"latest":"v".concat(t.version))+"/svgs",n.fetchUploadedSvgFrom=t.uploadsUrl);var r=[];return t.v4shim.enabled&&r.push(new C((function(r,o){I(s(t,{addOn:"-v4-shims",minify:t.minify.enabled}),n).then((function(t){r(x(t,e(e({},n),{},{id:"fa-v4-shims"})))})).catch(o)}))),r.push(new C((function(r,o){I(t.subsetPath&&t.baseUrl+"/"+t.subsetPath||s(t,{minify:t.minify.enabled}),n).then((function(t){var o=x(t,e(e({},n),{},{id:"fa-main"}));r(function(t,e){var n=e&&void 0!==e.autoFetchSvg?e.autoFetchSvg:void 0,r=e&&void 0!==e.autoA11y?e.autoA11y:void 0;void 0!==r&&t.setAttribute("data-auto-a11y",r?"true":"false");n&&(t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")),t.setAttribute("data-fetch-svg-from",e.fetchSvgFrom),t.setAttribute("data-fetch-uploaded-svg-from",e.fetchUploadedSvgFrom));return t}(o,n))})).catch(o)}))),C.all(r)}function x(t,e){var n=document.createElement("SCRIPT"),r=document.createTextNode(t);return n.appendChild(r),n.referrerPolicy="strict-origin",e.id&&n.setAttribute("id",e.id),e&&e.detectingConflicts&&e.detectionIgnoreAttr&&n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),n}function M(t){var e,n=[],r=document,o=r.documentElement.doScroll,i=(o?/^loaded|^c/:/^loaded|^i|^c/).test(r.readyState);i||r.addEventListener("DOMContentLoaded",e=function(){for(r.removeEventListener("DOMContentLoaded",e),i=1;e=n.shift();)e()}),i?setTimeout(t,0):n.push(t)}function N(t){"undefined"!=typeof MutationObserver&&new MutationObserver(t).observe(document,{childList:!0,subtree:!0})}try{if(window.FontAwesomeKitConfig){var D=window.FontAwesomeKitConfig,R={detectingConflicts:D.detectConflictsUntil&&new Date<=new Date(D.detectConflictsUntil),detectionIgnoreAttr:"data-fa-detection-ignore",fetch:window.fetch,token:D.token,XMLHttpRequest:window.XMLHttpRequest,document:document},H=document.currentScript,K=H?H.parentElement:document.head;(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"js"===t.method?L(t,e):"css"===t.method?k(t,e,(function(t){M(t),N(t)})):void 0})(D,R).then((function(t){t.map((function(t){try{K.insertBefore(t,H?H.nextSibling:null)}catch(e){K.appendChild(t)}})),R.detectingConflicts&&H&&M((function(){H.setAttributeNode(document.createAttribute(R.detectionIgnoreAttr));var t=function(t,e){var n=document.createElement("script");return e&&e.detectionIgnoreAttr&&n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),n.src=s(t,{baseFilename:"conflict-detection",fileSuffix:"js",subdir:"js",minify:t.minify.enabled}),n}(D,R);document.body.appendChild(t)}))})).catch((function(t){console.error("".concat("Font Awesome Kit:"," ").concat(t))}))}}catch(a){console.error("".concat("Font Awesome Kit:"," ").concat(a))}}));
        