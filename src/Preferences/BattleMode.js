/**
 * Preferences/BattleMode.js
 *
 * BattleMode preferences
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define( ['Core/Preferences', 'Controls/KeyEventHandler'], function( Preferences, KEYS )
{
	'use strict';


	/**
	 * Default keys
	 */
	var defaultKey = {};

	// Shortcut -- First Row
	defaultKey[ KEYS.ONE ]    = { component:'ShortCut',        cmd:'EXECUTE0' };
	defaultKey[ KEYS.TWO ]    = { component:'ShortCut',        cmd:'EXECUTE1' };
	defaultKey[ KEYS.THREE ]  = { component:'ShortCut',        cmd:'EXECUTE2' };
	defaultKey[ KEYS.FOUR ]   = { component:'ShortCut',        cmd:'EXECUTE3' };
	defaultKey[ KEYS.FIVE ]   = { component:'ShortCut',        cmd:'EXECUTE4' };
	defaultKey[ KEYS.SIX ]    = { component:'ShortCut',        cmd:'EXECUTE5' };
	defaultKey[ KEYS.SEVEN ]  = { component:'ShortCut',        cmd:'EXECUTE6' };
	defaultKey[ KEYS.EIGHT ]  = { component:'ShortCut',        cmd:'EXECUTE7' };
	defaultKey[ KEYS.NINE ]   = { component:'ShortCut',        cmd:'EXECUTE8' };
	// Second Row
	defaultKey[ KEYS.Q ]      = { component:'ShortCut',        cmd:'EXECUTE9' };
	defaultKey[ KEYS.W ]      = { component:'ShortCut',        cmd:'EXECUTE10' };
	defaultKey[ KEYS.E ]      = { component:'ShortCut',        cmd:'EXECUTE11' };
	defaultKey[ KEYS.R ]      = { component:'ShortCut',        cmd:'EXECUTE12' };
	defaultKey[ KEYS.T ]      = { component:'ShortCut',        cmd:'EXECUTE13' };
	defaultKey[ KEYS.Y ]      = { component:'ShortCut',        cmd:'EXECUTE14' };
	defaultKey[ KEYS.U ]      = { component:'ShortCut',        cmd:'EXECUTE15' };
	defaultKey[ KEYS.I ]      = { component:'ShortCut',        cmd:'EXECUTE16' };
	defaultKey[ KEYS.O ]      = { component:'ShortCut',        cmd:'EXECUTE17' };
	// Third Row
	defaultKey[ KEYS.A ]      = { component:'ShortCut',        cmd:'EXECUTE18' };
	defaultKey[ KEYS.S ]      = { component:'ShortCut',        cmd:'EXECUTE19' };
	defaultKey[ KEYS.D ]      = { component:'ShortCut',        cmd:'EXECUTE20' };
	defaultKey[ KEYS.F ]      = { component:'ShortCut',        cmd:'EXECUTE21' };
	defaultKey[ KEYS.G ]      = { component:'ShortCut',        cmd:'EXECUTE22' };
	defaultKey[ KEYS.H ]      = { component:'ShortCut',        cmd:'EXECUTE23' };
	defaultKey[ KEYS.J ]      = { component:'ShortCut',        cmd:'EXECUTE24' };
	defaultKey[ KEYS.K ]      = { component:'ShortCut',        cmd:'EXECUTE25' };
	defaultKey[ KEYS.L ]      = { component:'ShortCut',        cmd:'EXECUTE26' };
	// Fourth Row
	defaultKey[ KEYS.Z ]      = { component:'ShortCut',        cmd:'EXECUTE27' };
	defaultKey[ KEYS.X ]      = { component:'ShortCut',        cmd:'EXECUTE28' };
	defaultKey[ KEYS.C ]      = { component:'ShortCut',        cmd:'EXECUTE29' };
	defaultKey[ KEYS.V ]      = { component:'ShortCut',        cmd:'EXECUTE30' };
	defaultKey[ KEYS.B ]      = { component:'ShortCut',        cmd:'EXECUTE31' };
	defaultKey[ KEYS.N ]      = { component:'ShortCut',        cmd:'EXECUTE32' };
	defaultKey[ KEYS.M ]      = { component:'ShortCut',        cmd:'EXECUTE33' };
	defaultKey[ KEYS.COM ]    = { component:'ShortCut',        cmd:'EXECUTE34' };
	defaultKey[ KEYS.PER ]    = { component:'ShortCut',        cmd:'EXECUTE35' };
	defaultKey[ KEYS.F12 ]    = { component:'ShortCut',        cmd:'EXTEND'   };

	// UI
	defaultKey[ KEYS.C + 300 ]   = { component:'ChatRoomCreate',  cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.E + 300 ]   = { component:'Inventory',       cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.G + 300 ]   = { component:'Guild',           cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.J + 300 ]   = { component:'PetInformations', cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.L + 300 ]   = { component:'Emoticons',       cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.Q + 300 ]   = { component:'Equipment',       cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.S + 300 ]   = { component:'SkillList',       cmd:'TOGGLE', alt:true };
	defaultKey[ KEYS.V + 300 ]   = { component:'BasicInfo',       cmd:'EXTEND', alt:true };
	defaultKey[ KEYS.H + 300 ]   = { component:'PartyFriends',    cmd:'FRIEND', alt:true };
	defaultKey[ KEYS.Z + 300 ]   = { component:'PartyFriends',    cmd:'PARTY',  alt:true };
	defaultKey[ KEYS.SPACE ]     = { };


	/**
	 * Export
	 */
	return Preferences.get( 'BattleMode', defaultKey, 1.9 );
});