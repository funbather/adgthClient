/**
 * UI/Components/SkillDescription/SkillDescription.js
 *
 * Skill Information
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
	var jQuery      = require('Utils/jquery');
	var SkillDB     = require('DB/Skills/SkillDescription');
	var Renderer    = require('Renderer/Renderer');
	var KEYS        = require('Controls/KeyEventHandler');
	var Mouse       = require('Controls/MouseEventHandler');
	var UIManager   = require('UI/UIManager');
	var UIComponent = require('UI/UIComponent');
	var htmlText    = require('text!./SkillDescription.html');
	var cssText     = require('text!./SkillDescription.css');
	var WinStats    = require('UI/Components/WinStats/WinStats');


	/**
	 * Create Component
	 */
	var SkillDescription = new UIComponent( 'SkillDescription', htmlText, cssText );


	/**
	* SkillDescription unique id
	*/
	SkillDescription.uid = -1;


	/**
	 * Once append to the DOM
	 */
	SkillDescription.onKeyDown = function onKeyDown( event )
	{
		if (event.which === KEYS.ESCAPE) {
			this.remove();
			event.stopImmediatePropagation();
			return false;
		}

		return true;
	};


	/**
	 * Once append
	 */
	SkillDescription.onAppend = function onAppend()
	{
		// Seems like "EscapeWindow" is execute first, push it before.
		var events = jQuery._data( window, 'events').keydown;
		events.unshift( events.pop() );
	};


	/**
	 * Once removed
	 */
	SkillDescription.onRemove = function onRemove()
	{
		this.uid = -1; // reset uid
	};


	/**
	 * Initialize UI
	 */
	SkillDescription.init = function init()
	{
		this.ui.find('.close').click(function(){
			this.remove();
		}.bind(this));

		this.draggable();
	};


	/**
	 * Add content to the box
	 *
	 * @param {number} skill id
	 */
	SkillDescription.setSkill = function setSkill( id , level )
	{
		this.uid = id;
		var desc = SkillDB[id] || '...';
		var var1 = level || 1; // Should always be Skill Level
		var var2 = 0;
		
		switch(id) { // TODO: Do this better
      
      case 19:
        if(var1) {
          var2 = WinStats.ui.find('.matak2').text();
          desc = desc.replace('$sklvl$', '^0000BB'+var1*100+'^000000%');
          desc = desc.replace('$matk$', '^FF0000'+var2*var1+'^000000');
        }
      
        if(level && var1 < 10) {
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*100)+100)+"^000000% (^FF0000" + (var2*(var1+1)) + "^000000)";
        }
      break;
      
      case 4001:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*.3).toFixed(1)+'^000000%');
        }
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nDamage Reduction: ^0000BB"+((var1+1)*.3).toFixed(1)+"^000000%";
        }
      break;
      
      case 4002:
        if(var1) {
          desc = desc.replace('$sklvl1$', '^0000BB'+Math.floor(var1*.5)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+Math.floor(var1*.5)+'^000000');
        }
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nBonus STR: ^0000BB"+Math.floor(((var1+1)*.5))+"^000000";
          desc += "\nBonus INT: ^0000BB"+Math.floor(((var1+1)*.5))+"^000000";
        }
      break;
      
      case 4003:
        if(var1) {
          desc = desc.replace('$sklvl1$', '^0000BB'+(var1*.2).toFixed(1)+'^000000%');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*.2).toFixed(1)+'^000000%');
        }
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nBonus ASPD: ^0000BB"+((var1+1)*.2).toFixed(1)+"^000000%";
          desc += "\nBonus Celerity: ^0000BB"+((var1+1)*.2).toFixed(1)+"^000000%";
        }
      break;
      
    
		}
		
		this.ui.find('.content').text(desc);

		this.ui.css({
			top:  Math.min( Mouse.screen.y + 10, Renderer.height - this.ui.height()),
			left: Math.min( Mouse.screen.x + 10, Renderer.width - this.ui.width())
		});
	};


	/**
	 * Create component and export it
	 */
	return UIManager.addComponent(SkillDescription);
});
