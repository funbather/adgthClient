/**
 * Renderer/EntityDisplay.js
 *
 * Manage Entity Display (pseudo + guild + party)
 * Writing to canvas is very ugly, this file contain some hack to get some best results on Firefox and Chrome.
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(['Utils/gl-matrix', 'Renderer/Renderer'], function( glMatrix, Renderer )
{
	'use strict';


	/**
	 * Global methods
	 */
	var vec4  = glMatrix.vec4;
	var _pos  = new Float32Array(4);
	var _size = new Float32Array(2);


	// Some helper for Firefox to render text-border
	if (typeof CanvasRenderingContext2D !== 'undefined') {
		CanvasRenderingContext2D.prototype.outlineText =
			function outlineText(txt, x, y) {
				this.fillText( txt, x-1, y );
				this.fillText( txt, x,   y-1 );
				this.fillText( txt, x+1, y );
				this.fillText( txt, x,   y+1 );
			};
	}

	// Some helper for Chrome to render text-border
	function multiShadow( ctx, text, x, y, offsetX, offsetY, blur) {
		ctx.textBaseline = 'top';
		ctx.lineWidth = 1;
		ctx.shadowColor = '#000';
		ctx.shadowBlur = blur;
		ctx.shadowOffsetX = offsetX;
		ctx.shadowOffsetY = offsetY;
		ctx.fillStyle = 'black';
		ctx.fillText(text, x, y);
	}

	// Helper to render round rectangle
	function roundRect(ctx, x, y, width, height, radius)
	{
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	}

	/**
	 * @var {boolean} is the shadow ugly in the GPU ?
	 * Used to fallback to another renderer.
	 *
	 * For more informations, check :
	 * http://forum.robrowser.com/index.php?topic=32200
	 */
	var _isUglyShadow = function isUglyGPUShadow()
	{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var fontSize = 12;
		var text = 'Testing';
		var width, height, percent;

		// Create canvas
		ctx.font          = fontSize + 'px Arial';
		width             = ctx.measureText(text).width + 10;
		height            = fontSize * 3 * (text.length ? 2 : 1);
		ctx.canvas.width  = width;
		ctx.canvas.height = height;

		ctx.font          = fontSize + 'px Arial';
		ctx.textBaseline  = 'top';

		// Render text and shadows
		function testShadow()
		{
			multiShadow(ctx, text, 5, 0,  0, -1, 0);
			multiShadow(ctx, text, 5, 0,  0,  1, 0);
			multiShadow(ctx, text, 5, 0, -1,  0, 0);
			multiShadow(ctx, text, 5, 0,  1,  0, 0);

			ctx.fillStyle   = 'white';
			ctx.strokeStyle = 'black';
			ctx.strokeText( text, 5, 0);
			ctx.fillText( text, 5, 0);
		}

		// Read canvas pixels and get the average black
		function getBlackPercent()
		{
			var imageData = ctx.getImageData( 0, 0, width, height);
			var pixels    = imageData.data;
			var i, count  = pixels.length;
			var total = 0;

			for (i = 0; i < count; i+=4) {
				total += ((255-pixels[i]) / 255) * pixels[i + 3];
			}

			return (total / (count/4)) / 2.55;
		}

		// Do tests
		testShadow();
		percent = getBlackPercent();

		// 6.1% seems for the moment a good value
		// to check if there is too much black.
		return !window.chrome || percent > 6.15;
	}();


	/**
	 * Display structure
	 */
	function Display()
	{
		this.TYPE = {
			NONE:     0,
			LOADING:  1,
			COMPLETE: 2
		};

		this.load       =  this.TYPE.NONE;
		this.name       =  '';
		this.party_name =  '';
		this.guild_name =  '';
		this.guild_rank =  '';
		this.emblem     =  null;
		this.display    =  false;
		this.canvas     =  document.createElement('canvas');
		this.ctx        =  this.canvas.getContext('2d');
		this.canvas.style.position = 'absolute';
		this.canvas.style.zIndex   = 1;
	}


	/**
	 * Add GUI to html
	 */
	Display.prototype.add = function add()
	{
		this.display = true;
	};


	/**
	 * Remove GUI from html
	 */
	Display.prototype.remove = function remove()
	{
		if (this.canvas.parentNode) {
			document.body.removeChild(this.canvas);
		}
		this.display = false;
	};


	/**
	 * Clean it (remove informations)
	 */
	Display.prototype.clean = function clean()
	{
		this.remove();
	};


	/**
	 * Update the display
	 * @param {string} color {bool} bg
	 */
	Display.prototype.update = function update( color, bg )
	{
		// Setup variables
		var lines    = new Array(2);
		var fontSize = 16;
		var ctx      = this.ctx;
		var start_x  = (this.emblem ? 26 : 0) + 5;
		var width, height;

		// Skip the "#" in the pseudo
		lines[0] = this.name.split('#')[0];
		lines[1] = '';

		// Add the party name
		if (this.party_name.length && this.guild_name == "X") {
      lines[0] = this.party_name + ' ' + this.name.split('#')[0];
		} else if (this.party_name.length) { // Dumb workaround
			lines[0] += ' (' + this.party_name + ')';
		}

		// Add guild name
		if (this.guild_name.length && this.guild_name != "X") {
			lines[1]  = this.guild_name;

			// Add guild rank
			if (this.guild_rank.length) {
				lines[1] +=  ' [' + this.guild_rank + ']';
			}
		}
		
		// Setup the canvas
		ctx.font          = fontSize + 'px Arial';
		width             = Math.max( ctx.measureText(lines[0]).width, ctx.measureText(lines[1]).width ) + start_x + 5;
		height            = fontSize * 3 * (lines[1].length ? 2 : 1);
		ctx.canvas.width  = width;
		ctx.canvas.height = height;


		// Draw emblem
		if (this.emblem) {
			ctx.drawImage( this.emblem, 0, 8 );
		}


		// TODO: complete the color list in the Entity display
		color = color || 'white';
		ctx.font         = fontSize + 'px Arial';
		ctx.textBaseline = 'top';
		
		if(bg) {
			ctx.fillStyle="rgba(0,0,0,.6)";
			ctx.fillRect(0,0,width,height/2);
			ctx.strokeStyle = color;
			ctx.lineWidth = 3;
			roundRect(ctx, .5, .5, ctx.canvas.width-1, ctx.canvas.height/2, 3);
			ctx.stroke();
		}
		
		// Shadow renderer
		if (!_isUglyShadow) {
			multiShadow(ctx, lines[0], start_x, 4,  0, -1, 0);
			multiShadow(ctx, lines[0], start_x, 4,  0,  1, 0);
			multiShadow(ctx, lines[0], start_x, 4, -1,  0, 0);
			multiShadow(ctx, lines[0], start_x, 4,  1,  0, 0);
			multiShadow(ctx, lines[1], start_x, fontSize * 1.2,  0, -1, 0);
			multiShadow(ctx, lines[1], start_x, fontSize * 1.2,  0,  1, 0);
			multiShadow(ctx, lines[1], start_x, fontSize * 1.2, -1,  0, 0);
			multiShadow(ctx, lines[1], start_x, fontSize * 1.2,  1,  0, 0);
			ctx.fillStyle   = color;
			ctx.strokeStyle = 'black';
			ctx.strokeText(lines[0], start_x, 4);
			ctx.fillText(  lines[0], start_x, 4);
			ctx.strokeText(lines[1], start_x, fontSize * 1.2);
			ctx.fillText(  lines[1], start_x, fontSize * 1.2);
		}

		// fillText renderer
		else {
			ctx.translate(0.5, 0.5);
			ctx.fillStyle    = 'black';
			ctx.outlineText( lines[0], start_x, 4 );
			ctx.outlineText( lines[1], start_x, fontSize * 1.2 );
			ctx.fillStyle    = color;
			ctx.fillText( lines[0], start_x, 4 );
			ctx.fillText( lines[1], start_x, fontSize * 1.2 );
		}
	};


	/**
	 * Rendering GUI
	 */
	Display.prototype.render = function( matrix )
	{
		var canvas = this.canvas;
		var z;

		// Cast position
		_pos[0] =  0.0;
		_pos[1] = -0.5;
		_pos[2] =  0.0;
		_pos[3] =  1.0;

		// Set the viewport
		_size[0] = Renderer.width  / 2;
		_size[1] = Renderer.height / 2;

		// Project point to scene
		vec4.transformMat4( _pos, _pos, matrix );

		// Calculate position
		z = _pos[3] === 0.0 ? 1.0 : ( 1.0 / _pos[3] );
		_pos[0] = _size[0] + Math.round(_size[0] * (_pos[0] * z));
		_pos[1] = _size[1] - Math.round(_size[1] * (_pos[1] * z));

		canvas.style.top  = ((_pos[1] + 15 ) | 0) + 'px';
		canvas.style.left = ((_pos[0] - canvas.width / 2) | 0) + 'px';

		// Append to body
		if (!canvas.parentNode) {
			document.body.appendChild(canvas);
		}
	};


	/**
	 * Exporting
	 */
	return function Init()
	{
		this.display = new Display();
	};
});