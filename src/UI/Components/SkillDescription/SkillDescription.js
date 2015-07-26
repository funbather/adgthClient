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
	SkillDescription.setSkill = function setSkill( id , level, val1, val2, val3 )
	{
		this.uid = id;
		var desc = SkillDB[id] || '...';
		var var1 = level || 1; // Should always be Skill Level
		var var2 = 0;
		var var3 = 0;
		var var4 = 0;
		
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
      
      case 4001: // SC_INVOKE
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*.66).toFixed(1)+'^000000');
        }
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nBonus VIT: ^0000BB"+(var1+1)+"^000000";
          desc += "\nDamage Reduction: ^0000BB"+((var1+1)*.66).toFixed(1)+"^000000%";
        }
      break;
      
      case 4002: // SC_ICESPIRIT
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nBonus STR: ^0000BB"+(var1+1)+"^000000";
          desc += "\nBonus INT: ^0000BB"+(var1+1)+"^000000";
        }
      break;
      
      case 4003: // SC_FIRESPIRIT
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
      
        if(level && var1 < 50) {
          desc += "\n\nNext Level:\nBonus AGI: ^0000BB"+(var1+1)+"^000000";
          desc += "\nBonus PRE: ^0000BB"+(var1+1)+"^000000";
        }
      break;
      
     case 4004: // SC_WINDSPIRIT
        if(var1)
          desc = desc.replace('$heal$', '^006600' + (200+(val1*10)) + '^000000');
        
        if(val1 < 50)
          desc += "\n\nNext Varuna Level:\nHealing: ^006600" + (210+(val1*10)) + "^000000%";
      break;
      
     case 4005: // SC_REJUVENATE
        if(var1) {
          desc = desc.replace('$ice$', '^0000BB'+(20+(val1*1))+'^000000');
          desc = desc.replace('$fire$', '^0000BB'+(10+val2)+'^000000');
        }
        
        if(val1 < 50)
          desc += "\n\nNext Varuna Level:\nBonus ATK/MAG: ^0000BB"+(20+((val1+1)*1))+"^000000%";
        if(val2 < 50)
          desc += "\n\nNext Agni Level:\nBonus PRE: ^0000BB"+(11+val2)+"^000000";
      break;
      
     case 4006: // SC_CALLSENTINEL
        if(var1) {
          desc = desc.replace('$ice$', '^0000BB'+(50+(val1*2))+'^000000');
          desc = desc.replace('$fire$', '^0000BB'+(30+val2)+'^000000');
        }
        
        if(val1 < 50)
          desc += "\n\nNext Varuna Level:\nHP: ^0000BB"+(50+((val1+1)*2))+"^000000%";
        if(val2 < 50)
          desc += "\n\nNext Agni Level:\nATK: ^0000BB"+(31+val2)+"^000000%";
      break;
      
    case 4007: // SC_ARCANECANNON
        if(var1) {
          desc = desc.replace('$fire$', '^0000BB' + (200+(val1*10)) + '^000000');
          desc = desc.replace('$fire2$', '^0000BB' + (200+(val1*10)) + '^000000');
        }
        
        if(val2 < 50) {
          desc += "\n\nNext Agni Level:\nDamage: ^0000BB" + (210+(val1*10)) + "^000000% MAG, ^0000BB" + (210+(val1*10)) + "^000000% ATK";
        }
      break;
      
    case 4008: // SC_SURGE
        if(var1) {
          desc = desc.replace('$fire$', '^0000BB'+(100+5*val2)+'^000000');
          desc = desc.replace('$wind$', '^0000BB'+Math.floor(3 + (val3/10))+'^000000');
        }
        
        if(val2 < 50)
          desc += "\n\nNext Agni Level:\nDamage: ^0000BB"+(105+5*val2)+"^000000%";
      break;
      
    case 4009: // SC_PLASMAFIELD
        if(var1) {
          desc = desc.replace('$cd$', '^0000BB'+(35-val3/2).toFixed(1)+'^000000');
          desc = desc.replace('$fire$', '^0000BB'+(150+5*val2)+'^000000');
          desc = desc.replace('$wind$', '^0000BB'+(1+.02*val3).toFixed(2)+'^000000');
        }
        
        if(val2 < 50) 
          desc += "\n\nNext Agni Level:\nDamage: ^0000BB"+(155+5*val2)+"^000000%";
        if(val3 < 50)
          desc += "\n\nNext Indra Level:\nCooldown: ^0000BB"+(34.5-val3/2).toFixed(1)+"^000000 seconds\nStun Duration: ^0000BB"+(1.02+.02*val3).toFixed(2)+"^000000 seconds";
      break;
      
     case 4010: // SC_ARCANEVORTEX
        if(var1) {
          desc = desc.replace('$cd$', '^0000BB'+(21-val3/3).toFixed(1)+'^000000');
          desc = desc.replace('$wind$', '^0000BB'+(150+5*val2)+'^000000');
        }
      
        if(val3 < 50)
          desc += "\n\nNext Indra Level:\nDamage: ^0000BB"+(155+5*val2)+"^000000%\nCooldown: ^0000BB"+(20.66 - val3/3).toFixed(1)+"^000000";
      break;
      
    case 4011: // SC_FROSTNOVA
        if(var1) {
          desc = desc.replace('$cd$', '^0000BB'+(12-val3/5).toFixed(1)+'^000000');
          desc = desc.replace('$ice$', '^0000BB'+(150+5*val1)+'^000000');
        }
        
        if(val3 < 50)
          desc += "\n\nNext Indra Level:\nCooldown: ^0000BB"+(11.8-val3/5).toFixed(1)+"^000000 seconds";  
        if(val1 < 50)
          desc += "\n\nNext Varuna Level:\nDamage: ^0000BB"+(155+5*val1)+"^000000%";
      break;
      
    case 4012: // SC_ENERGIZE
        if(var1) {
          desc = desc.replace('$wind$', '^0000BB'+(10 + val3 * .25).toFixed(1)+'^000000');
          desc = desc.replace('$ice$', '^0000BB'+(10 + val1 * .25).toFixed(1)+'^000000');
        }
        
        if(val3 < 50)
          desc += "\n\nNext Indra Level:\nBonus Celerity: ^0000BB"+(10.25 + val3 * .25).toFixed(1)+"^000000%";
        if(val1 < 50)
          desc += "\n\nNext Varuna Level:\nBonus ASPD: ^0000BB"+(10.25 + val1 * .25).toFixed(1)+"^000000%";
      break; 
      
      case 4015:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1 * 1.5).toFixed(1)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nDamage Reduction: ^0000BB"+((var1+1) * 1.5).toFixed(1)+"^000000%";
      break; 
      
      case 4016:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*2)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased CRIT: ^0000BB"+(var1+1)+"^000000\nIncreased CRIT DAM: ^0000BB"+(var1+2)+"^000000%";
      break;   
      
      case 4017:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased Damage: ^0000BB"+(var1+1)+"^000000%";
      break;   
      
      case 4018:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*2)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased MAG: ^0000BB"+((var1+1) * 2)+"^000000%";
      break;    
      
      case 4019:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased EVA: ^0000BB"+(var1+1)+"^000000";
      break;   
      
      case 4020:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*2)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased ASPD: ^0000BB"+((var1+1)*2)+"^000000%";
      break;   
      
      case 4021:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*2)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased MDEF: ^0000BB"+((var1+1)*2)+"^000000";
      break;   
      
      case 4022:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+var1+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*2.5).toFixed(1)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased HP: ^0000BB"+(var1+1)+"^000000%\nIncreased HP Regen: ^0000BB"+((var1+1)*2.5).toFixed(1)+"^000000%";
      break;   
      
      case 4023:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*3)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*2.5).toFixed(1)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased MP: ^0000BB"+((var1+1)*3)+"^000000\nIncreased MP Regen: ^0000BB"+((var1+1)*2.5).toFixed(1)+"^000000%";
      break;   
      
      case 4024:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1*2)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nIncreased Celerity: ^0000BB"+((var1+1)*2)+"^000000%";
      break;
      
      case 4025:
        if(var1)
          desc = desc.replace('$sklvl$', '^0000BB'+(var1)+'^000000');
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nBonus EVA: ^0000BB"+(var1+1)+"^000000\nBonus DEF: ^0000BB"+(var1+1)+"^000000";
      break;
      
      case 4026:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+(var1)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*3)+'^000000');
          desc = desc.replace('$sklvl3$', '^0000BB'+(var1*3)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nBonus CRIT: ^0000BB"+(var1+1)+"^000000\nIncreased CRIT DAM: ^0000BB"+((var1+1)*3)+"^000000%\nIncreased Weapon Power: ^0000BB"+((var1+1)*3)+"^000000%";
      break;
      
      case 4027:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*5)+70)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nWeapon Power: ^0000BB"+((var1*5)+75)+"^000000%";
      break;
      
      case 4028:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*5)+120)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*2)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nWeapon Power: ^0000BB"+((var1*5)+125)+"^000000%\nIncreased ASPD: ^0000BB"+((var1+1)*2)+"^000000%";
      break;  
      
      case 4029:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+(var1)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+(var1*4)+'^000000');
        }
      
        if(level && var1 < 10)
          desc += "\n\nNext Level:\nBase Damage Resistance: ^0000BB"+(var1+1)+"^000000%\nMax Damage Resistance: ^0000BB"+((var1+1)*4)+"^000000%";
      break;  
      
      case 4030:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*50)+150)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*50)+200)+"^000000%";
      break;  
      
      case 4031:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*25)+100)+'^000000');
          desc = desc.replace('$sklvl2$', '^0000BB'+((var1*.5)+1.5).toFixed(1)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*25)+125)+"^000000%\nStun Duration: ^0000BB"+((var1*.5)+2).toFixed(1)+"^000000 seconds";
      break;  
      
      case 4032:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*25)+150)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*25)+175)+"^000000%";
      break;  
      
      case 4033:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*75)+175)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*75)+250)+"^000000%";
      break;  
      
      case 4034:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*100)+300)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*100)+400)+"^000000%";
      break;  
      
      case 4035:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*50)+100)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*50)+150)+"^000000%";
      break;  
      
      case 4036:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*50)+100)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*50)+150)+"^000000%";
      break;  
      
      case 4037:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*75)+200)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*75)+275)+"^000000%";
      break;  
      
      case 62:
        if(var1) {
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*75)+100)+'^000000');
          desc = desc.replace('$sklvl$', '^0000BB'+((var1*75)+100)+'^000000');
        }
      
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nDamage: ^0000BB"+((var1*75)+175)+"^000000%";
      break;  
      
      case 6:     
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nMP Cost: ^0000BB"+(50-(var1*10))+"^000000";
      break;   
      
      case 255:     
        if(level && var1 < 5)
          desc += "\n\nNext Level:\nMP Cost: ^0000BB"+(50-(var1*10))+"^000000";
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
