/**
 * UI/Components/WinStats/WinStats.js
 *
 * Chararacter Statistiques Informations
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function(require)
{
	'use strict';


	/**
	 * Dependencies
	 */
	var UIComponent        = require('UI/UIComponent');
	var htmlText           = require('text!./WinStats.html');
	var cssText            = require('text!./WinStats.css');


	/**
	 * Create component
	 */
	var WinStats = new UIComponent( 'WinStats', htmlText, cssText );


	/**
	 * Initialize UI
	 */
	WinStats.init = function init()
	{
		this.statuspoint = 0;

		this.ui.find('.up button').mousedown(function(){
			switch (this.className) {
				case 'str': WinStats.onRequestUpdate( 13, 1 ); break;
				case 'agi': WinStats.onRequestUpdate( 14, 1 ); break;
				case 'vit': WinStats.onRequestUpdate( 15, 1 ); break;
				case 'int': WinStats.onRequestUpdate( 16, 1 ); break;
				case 'dex': WinStats.onRequestUpdate( 17, 1 ); break;
			}
		});
	};


	/**
	 * Stack to store things if the UI is not in html
	 */
	WinStats.stack = [];


	/**
	 * Execute elements in memory
	 */
	WinStats.onAppend = function onAppend()
	{
		var i, count;

		for (i = 0, count = this.stack.length; i < count; ++i) {
			this.update.apply( this, this.stack[i]);
		}

		this.stack.length = 0;
	};


	/**
	 * Update UI elements
	 *
	 * @param {string} type identifier
	 * @param {number} val1
	 * @param {number} val2 (optional)
	 */
	WinStats.update = function update( type, val )
	{
		var str;

		if (!this.__loaded) {
			this.stack.push(arguments);
			return;
		}

		switch (type) {
			case 'statuspoint':
				this.statuspoint = val;
				this.ui.find('.requirements div').each(function(){
					WinStats.ui.find('.up .'+ this.className)
						.css('opacity', parseInt(this.textContent, 10) <= val ? 1 : 0 );
				});
				this.ui.find('.' + type).text(val);
				break;

			case 'hit':
				this.ui.find('.' + type).text(val + '%');
				break;
				
			case 'def':
			case 'mdef':
				this.ui.find('.' + type).text((val/10).toFixed(1));
				break;
				
			case 'critical':
				this.ui.find('.' + type).text((val/10).toFixed(1) + '%');
				break;
				
			case 'aspd':
				this.ui.find('.' + type).text((500 / val).toFixed(2));
				break;
				
			case 'flee2':
				this.ui.find('.' + type).text((val + 100) + '%');
				break;
				
			case 'atak':
			case 'atak2':
			case 'matak2':
			case 'def2':
			case 'mdef2':
			case 'flee':
				this.ui.find('.' + type).text(val);
				break;

			case 'str':
			case 'agi':
			case 'vit':
			case 'int':
			case 'dex':
        this.ui.find('.stats .'+ type).text(val);
				break;

			case 'str2':
			case 'agi2':
			case 'vit2':
			case 'int2':
			case 'dex2':
				str = val < 0 ? '- ' + (-val) : val > 0 ? '+' + val : '';
				this.ui.find('.bonus .'+ type.replace('2','')).text( str );
				break;
			case 'luk2':
				//str = val < 0 ? '- ' + (-val) : val > 0 ? '+' + val : '';
				this.ui.find('.stats .'+ type.replace('2','')).text( val );
				break;

			case 'str3':
			case 'agi3':
			case 'vit3':
			case 'int3':
			case 'dex3':
				this.ui.find('.requirements .'+ type.replace('3','')).text(val);
				this.ui.find('.up .'+ type.replace('3','')).css('opacity', val <= this.statuspoint ? 1 : 0 );
				break;
			case 'luk3':
        this.ui.find('.requirements .'+ type.replace('3','')).text('');
				this.ui.find('.up .'+ type.replace('3','')).css('opacity', val <= this.statuspoint ? 1 : 0 );
				break;
		}
		
		// Update mitigation/avoid % values
		var def = parseFloat(this.ui.find('.def2').text());
		var def2 = parseFloat(this.ui.find('.def').text());
		var eva = parseFloat(this.ui.find('.flee').text());
		var mdef = parseFloat(this.ui.find('.mdef2').text());
		var mdef2 = parseFloat(this.ui.find('.mdef').text());
		
		this.ui.find('.physmit').text((100 - (100*calcMitigation(def))).toFixed(1));
		this.ui.find('.physavo').text(calcAvoidance(def2,eva).toFixed(1));
		this.ui.find('.magmit').text((100 - (100*calcMitigation(mdef))).toFixed(1));
		this.ui.find('.magavo').text(calcAvoidance(mdef2,0).toFixed(1));
	};
	
	function calcMitigation(x) {
		var a = 6000 + x;
		var b = 6000 + x * 12;
		return a/b;
	}
	
	function calcAvoidance(y, z) {
		var dodge = 1 - parseFloat(calcMitigation(z));
		return 100 - ((1 * (1-dodge) * (1-(y/100))) * 100);
	}

	/**
	 * Abstract method to define
	 */
	WinStats.onRequestUpdate = function onRequestUpdate(/*id, amount*/){};


	/**
	 * Export it (don't add it to component list)
	 */
	return WinStats;
});
