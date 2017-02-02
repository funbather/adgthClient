/**
 * Renderer/Effects/Damage.js
 *
 * Rendering damage particles
 * TODO: Create a particle class to manage the process
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function( require )
{
	'use strict';


	// Load dependencies
	var WebGL          = require('Utils/WebGL');
	var Client         = require('Core/Client');
	var Sprite         = require('Loaders/Sprite');
	var Renderer       = require('Renderer/Renderer');
	var SpriteRenderer = require('Renderer/SpriteRenderer');
	var MapPreferences  = require('Preferences/Map');


	/**
	 * Damage Namespace
	 */
	function Damage()
	{
		this.entity   = null;
		this.start    = 0;
		this.type     = 0;
		this.color    = new Float32Array(4);
		this.delay    = 1500;
		this.texture  = null;
		this.width    = 0;
		this.height   = 0;
	}


	/**
	 * Damage type constant
	 */
	Damage.TYPE = {
		HEAL:        1 << 0,
		MISS:        1 << 1,
		DAMAGE:      1 << 2,
		ENEMY:       1 << 3,
		COMBO:       1 << 4,
		COMBO_FINAL: 1 << 5,
		SP:          1 << 6,
		CRIT:        1 << 7,
		MULTICRIT:   1 << 8,
		BLOCKED:     1 << 9,
		POISON:      1 << 10,
		BLEEDING:    1 << 11,
		IGNITE:      1 << 12
	};


	/**
	 * @var {string} Sprite of the damage sprite
	 */
	var _sprite = new Array(10);


	/**
	 * @var {Damage[]} List of damages
	 */
	var _list = [];


	/**
	 * Convert sprite to image Data
	 * @param {object} gl - WebGL context
	 */
	Damage.init = function init( gl )
	{
		// Already loaded
		if (_sprite[0]) {
			return;
		}

		Client.getFiles([
			'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/\xbc\xfd\xc0\xda.spr',
			'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/msg.spr'
		], function( damage, miss ) {
			var sprDamage, sprMiss;

			try {
				sprDamage = new Sprite(damage);
				sprMiss   = new Sprite(miss);
			}
			catch(e) {
				console.error('Damage::init() - ' + e.message );
				return;
			}

			// Create SpriteSheet
			for (var i = 0; i < 10; ++i) {
				_sprite[i]  = sprDamage.getCanvasFromFrame(i);
			}

			var source = sprMiss.getCanvasFromFrame(0);
			var canvas = document.createElement('canvas');
			var ctx    = canvas.getContext('2d');

			canvas.width  = WebGL.toPowerOfTwo( source.width );
			canvas.height = WebGL.toPowerOfTwo( source.height );
			ctx.drawImage( source, 0, 0, canvas.width, canvas.height );

			_sprite[10] = {
				texture: gl.createTexture(),
				canvas:  canvas
			};
			
			_sprite[11] = sprMiss.getCanvasFromFrame(1);
			
			gl.bindTexture( gl.TEXTURE_2D, _sprite[10].texture );
			gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.generateMipmap( gl.TEXTURE_2D );
		});
	};


	/**
	 * Add Damage to the scene
	 *
	 * @param {number} damage
	 * @param {Entity} entity to receive the damage
	 * @param {number} tick
	 * @param {number} type - Damage|Heal
	 */
	Damage.add = function add( damage, entity, tick, type, critical )
	{
		// Can not display negative damages.
		// Need to wait the client to load damage sprite
		if (damage < 0 || !_sprite[0]) {
			return;
		}

		// Can't render floating points
		damage = Math.floor(damage);

		var PADDING = 2;
		var i, count, start_x, start_y;
		var frame;

		var canvas  = document.createElement('canvas');
		var ctx     = canvas.getContext('2d');
		var numbers = damage.toString().split('');

		var width   = 0;
		var height  = 0;
		var gl      = Renderer.gl;
		var texture;


		var obj      = new Damage();

		obj.type     = type || (damage ? Damage.TYPE.DAMAGE : Damage.TYPE.MISS);
		obj.type     = damage ? obj.type : obj.type & ~(Damage.TYPE.CRIT); // Possible to "miss" a critical flagged attack, looked dumb in-client lol
		if (entity.objecttype === entity.constructor.TYPE_PC && obj.type != Damage.TYPE.BLOCKED) { // Don't apply red overlay to blocked attacks
			obj.type |= Damage.TYPE.ENEMY;
		}

		obj.color[3] = 1.0;
		obj.delay    = 1500;
		obj.start    = tick;
		obj.entity   = entity;

		if (obj.type & Damage.TYPE.SP) {
			obj.color[0] = 0.13;
			obj.color[1] = 0.19;
			obj.color[2] = 0.75;
		}
		else if (obj.type & Damage.TYPE.HEAL) {
			// green
			obj.color[1] = 1.0;
		}
		else if (obj.type & Damage.TYPE.POISON) {
			PADDING = 0;
			obj.color[0] = 0.45;
			obj.color[1] = 1.0;
			obj.color[2] = 0.45;
			obj.delay = 600;
		}
		else if (obj.type & Damage.TYPE.BLEEDING) {
			PADDING = 0;
			obj.color[0] = 0.5;
			obj.color[1] = 0.1;
			obj.color[2] = 0.1;
			obj.delay = 600;
		}
		else if (obj.type & Damage.TYPE.IGNITE) {
			PADDING = 0;
			obj.color[0] = 1.0;
			obj.color[1] = 0.4;
			obj.color[2] = 0.4;
			obj.delay = 600;
		}
		else if (obj.type & Damage.TYPE.ENEMY) {
			// red
			obj.color[0] = 1.0;
		}
		else if (obj.type & Damage.TYPE.COMBO) {
			// yellow
			obj.color[0] = 0.9;
			obj.color[1] = 0.9;
			obj.color[2] = 0.15;
			obj.delay    = 1000;
		} 	
		else if (obj.type & Damage.TYPE.CRIT) {
			obj.color[0] = 1.0;
			obj.color[1] = 0.7;
			obj.color[2] = 0.3;
			obj.delay    = 1500; // Signify critical hit to render, fix later
		}
		else if (obj.type & Damage.TYPE.BLOCKED) {
			obj.color[0] = 1.0;
			obj.color[1] = 1.0;
			obj.color[2] = 1.0;
			obj.delay = 800;
		}
		else {
			// white
			obj.color[0] = 1.0;
			obj.color[1] = 1.0;
			obj.color[2] = 1.0;
		}

		// Miss or Blocked
		if (!damage) {
			if (MapPreferences.miss) {
				if (obj.type == Damage.TYPE.BLOCKED) {
					ctx.canvas.width  = WebGL.toPowerOfTwo( _sprite[11].width );
					ctx.canvas.height = WebGL.toPowerOfTwo( _sprite[11].height );
					ctx.drawImage( _sprite[11], 0, 0, ctx.canvas.width, ctx.canvas.height );

					texture = gl.createTexture();
					gl.bindTexture( gl.TEXTURE_2D, texture );
					gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas );
					gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
					gl.generateMipmap( gl.TEXTURE_2D );
					
					obj.texture  = texture;
					obj.width    = _sprite[10].canvas.width;
					obj.height   = _sprite[10].canvas.height;
					_list.push( obj );
				} else {
					obj.texture  = _sprite[10].texture;
					obj.width    = _sprite[10].canvas.width;
					obj.height   = _sprite[10].canvas.height;
					_list.push(obj);				
				}
			}
			return;
		}

		// Calculate canvas width and height
		for (i = 0, count = numbers.length; i < count; ++i) {
			frame  = _sprite[ numbers[i] ];
			width += frame.width + PADDING;
			height = Math.max( height, frame.height );
		}

		// Set canvas size (pow of 2 for webgl).
		ctx.canvas.width  = WebGL.toPowerOfTwo( width );
		ctx.canvas.height = WebGL.toPowerOfTwo( height );

		// find where to start to get the image at the center
		start_x = (ctx.canvas.width  - width ) >> 1;
		start_y = (ctx.canvas.height - height) >> 1;

		// build texture
		width = 0;
		for (i = 0, count = numbers.length; i < count; ++i) {
			frame  = _sprite[ numbers[i] ];
			ctx.drawImage(
				frame,
				start_x + width,
				start_y + (height - frame.height) >> 1
			);
			width += frame.width + PADDING;
		}

		// Bind texture to GPU.
		texture = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.generateMipmap( gl.TEXTURE_2D );

		obj.texture  = texture;
		obj.width    = canvas.width;
		obj.height   = canvas.height;

		_list.push( obj );
	};


	/**
	 * Remove damages from map, clean up memory
	 *
	 * @param {object} gl context
	 */
	Damage.free = function free( gl )
	{
		var i, count;

		for (i = 0, count = _list.length ; i < count ; ++i) {
			if (_list[i].texture !== _sprite[10].texture) {
				gl.deleteTexture(_list[i].texture);
			}
		}

		_list.length = 0;
	};


	/**
	 * Rendering damages on maps
	 *
	 * @param {object} gl context
	 * @param {mat4} modelView
	 * @param {mat4} projection
	 * @param {object} fog structure
	 * @param {number} tick - game tick
	 */
	// Render all damages.
	Damage.render = function render( gl, modelView, projection, fog, tick )
	{
		// Nothing to render exiting
		if (!_list.length) {
			return;
		}

		// Init program
		SpriteRenderer.bind3DContext( gl, modelView, projection, fog );

		// Base parameters
		SpriteRenderer.shadow    = 1.0;
		SpriteRenderer.angle     = 0;
		SpriteRenderer.offset[0] = 0;
		SpriteRenderer.offset[1] = 0;
		SpriteRenderer.image.palette = null;

		var i, count, perc;
		var damage;
		var size;

		// Render all list
		for (i = 0, count = _list.length; i < count; ++i) {

			damage = _list[i];

			// Not now.
			if (damage.start > tick) {
				continue;
			}

			// Remove it from list, time passed.
			if (damage.start + damage.delay < tick) {
				if (damage.texture !== _sprite[10].texture) {
					gl.deleteTexture( damage.texture );
				}
				_list.splice( i, 1 );
				count--;
				i--;
				continue;
			}

			perc = (tick - damage.start) / damage.delay;

			// Combo title
			if (damage.type & Damage.TYPE.COMBO) {
				// TODO: fix it
				size = Math.min( perc, 0.05 ) * 75;

				// Remove it
				if (!(damage.type & Damage.TYPE.COMBO_FINAL) && perc > 0.15) {
					damage.start = 0;
				}

				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 5 + perc;
			}

			// Damage
			else if (damage.type & Damage.TYPE.DAMAGE) {
        size = 2;
				SpriteRenderer.position[0] = damage.entity.position[0] + perc * 7;
				SpriteRenderer.position[1] = damage.entity.position[1] - perc * 7;
				SpriteRenderer.position[2] = damage.entity.position[2] + 2 + Math.sin( -Math.PI/2 + ( Math.PI * (0.5 + perc * 1.5 ) ) ) * 5;
			}
			
      // Crit?
			else if (damage.type & Damage.TYPE.CRIT) {
				size = Math.max( (1-perc*10)/15, 0.025 ) * 100;

				SpriteRenderer.position[0] = damage.entity.position[0] + perc * 7;
				SpriteRenderer.position[1] = damage.entity.position[1] - perc * 7;
				SpriteRenderer.position[2] = damage.entity.position[2] + 2 + Math.sin( -Math.PI/2 + ( Math.PI * (0.5 + perc * 1.5 ) ) ) * 5;
			}
			
			// Heal
			else if (damage.type & Damage.TYPE.HEAL) {
				size = Math.max( (1 - perc * 2) * 3, 0.8);
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 2 + ( perc < 0.4 ? 0 : (perc - 0.4) *5 );
			}

			// Miss
			else if (damage.type & Damage.TYPE.MISS) {
				perc = (( tick - damage.start ) / 800);
				size = 0.6;
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 3.5 + perc * 7;
			}

			// Blocked
			else if (damage.type & Damage.TYPE.BLOCKED) {
				perc = (( tick - damage.start ) / 800);
				size = 0.9;
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 3.5 + perc;
			}

			// Poison
			else if (damage.type & Damage.TYPE.POISON) {
        size = 1.5;
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 2 + perc / 3;
			}

			// Bleeding
			else if (damage.type & Damage.TYPE.BLEEDING) {
        size = 1.5;
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + 1 + perc / 3;
			}

			// Ignite
			else if (damage.type & Damage.TYPE.IGNITE) {
        size = 1.5;
				SpriteRenderer.position[0] = damage.entity.position[0];
				SpriteRenderer.position[1] = damage.entity.position[1];
				SpriteRenderer.position[2] = damage.entity.position[2] + perc / 3;
			}

			SpriteRenderer.size[0] = damage.width  * size;
			SpriteRenderer.size[1] = damage.height * size;
			
			if (damage.type & Damage.TYPE.MISS)
				SpriteRenderer.size[1] = damage.height * 0.8;
				
			if ( !(damage.type & Damage.TYPE.COMBO) && (damage.type < Damage.TYPE.POISON) )
				damage.color[3] = 1.0 - perc;
			else
				if( perc < 0.8 )
					damage.color[3] = 1.0;
				else
					damage.color[3] = 1.0 - (perc - 0.8) * 5;

			SpriteRenderer.color.set( damage.color );
			SpriteRenderer.image.texture = damage.texture;
			SpriteRenderer.render();
		}

		SpriteRenderer.unbind( gl );
	};


	/**
	 * Export
	 */
	return Damage;
});