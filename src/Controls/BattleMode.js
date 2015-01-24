/**
 * Controls/BattleMode.js
 *
 * Manage the battle mode
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
	var KEYS        = require('Controls/KeyEventHandler');
	var Preferences = require('Preferences/BattleMode');
	var UIManager   = require('UI/UIManager');
	
	var Session     = require('Engine/SessionStorage');
	var Network     = require('Network/NetworkManager');
	var PACKET      = require('Network/PacketStructure');

	/**
	 * Create Namespace
	 */
	var BattleMode  = {};


	/**
	 * BattleMode processing
	 *
	 * @param {number} key pressed id
	 * @return {boolean} is shortcut found ?
	 */
	BattleMode.process = function process( keyId )
	{
		var key = Preferences[keyId];
		var key_ui = Preferences[keyId+300];
		
		if (key_ui && // UI Keybinds take precedence
		   ((!!key_ui.shift) === KEYS.SHIFT) &&
		   ((!!key_ui.alt)   === KEYS.ALT)   &&
		   ((!!key_ui.ctrl)  === KEYS.CTRL)
		) {
			var component = UIManager.getComponent(key_ui.component);
			if (component.onShortCut) {
				component.onShortCut(key_ui);
			}
			return true;
		} else if (keyId === KEYS.SPACE) { // Figure out how to do this better later
				var pkt = new PACKET.CZ.REQUEST_ACT();
				pkt.action = Session.Entity.action === Session.Entity.ACTION.SIT ? 3 : 2;
				Network.sendPacket(pkt);
				return true;
		} else if (key &&
		   ((!!key.shift) === KEYS.SHIFT) &&
		   ((!!key.alt)   === KEYS.ALT)   &&
		   ((!!key.ctrl)  === KEYS.CTRL)
		) {
			var component = UIManager.getComponent(key.component);
			if (component.onShortCut) {
				component.onShortCut(key);
			}
			return true;
		}
		

		return false;
	};


	/**
	 * Convert component key to a readable string
	 *
	 * @param {string} component name
	 * @param {string} command type
	 * @return {string} readable key pressed
	 */
	BattleMode.shortcutToKeyString = function shortcutToKeyString( component, cmd )
	{
		var keys, shortcut;
		var i, count;

		keys  = Object.keys(Preferences);
		count = keys.length;

		for (i = 0; i < count; ++i) {
			shortcut = Preferences[keys[i]];

			if (shortcut.component === component && shortcut.cmd === cmd) {
				var str = [];
				var tmp = KEYS.toReadableKey(parseInt(keys[i], 10));

				if (shortcut.alt) {
					str.push('ALT');
				}

				if (shortcut.shift) {
					str.push('SHIFT');
				}

				if (shortcut.ctrl) {
					str.push('CTRL');
				}

				if (tmp) {
					str.push(tmp);
				}

				return str.join(' + ');
			}
		}

		return 'None';
	};


	/**
	 * Exports
	 */
	return BattleMode;
});