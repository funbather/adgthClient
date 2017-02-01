define(["./SkillConst"], function( SK )
{
	"use strict";

	var SkillDesc = {};
	
	SkillDesc[SK.AL_TELEPORT] = {};
	SkillDesc[SK.ALL_RESURRECTION] = {};
	SkillDesc[SK.ALL_FIRSTAID] = {};
	SkillDesc[SK.SWD_SOUL] = {};
	
	SkillDesc[SK.SWD_HARDHEARTED] = {
		x: function(skl){ return (1 * skl); },
		y: function(skl){ return (3 * skl); }
	};
	
	SkillDesc[SK.SWD_DAUNTLESS] = {
		x: function(skl){ return (1 * skl); }
	};
	
	SkillDesc[SK.SWD_MAINTENANCE] = {
		x: function(skl){ return (3 * skl); }
	};
	
	SkillDesc[SK.SWD_PAVISE] = {
		x: function(skl){ return (1 * skl).toFixed(1); },
		y: function(skl){ return (0.5 * skl).toFixed(1); }
	};
	
	SkillDesc[SK.SWD_SWASHBUCKLING] = {
		x: function(skl){ return (15 + 3 * skl); },
		y: function(skl){ return (5 + parseInt(skl / 3)); }
	};
	
	SkillDesc[SK.SWD_SECONDWIND] = {
		x: function(skl){ return (30 + 2 * skl); },
		y: function(skl){ return (10 - parseInt(skl / 3)); },
		z: function(skl){ return (31 - skl); }
	};
	
	SkillDesc[SK.SWD_EYETOEYE] = {
		x: function(skl){ return (6 * skl); }
	};
	
	SkillDesc[SK.SWD_ENDURE] = {
		x: function(skl){ return (10 + 2 * skl); }
	};
	
	SkillDesc[SK.SWD_UMBOBLOW] = {
		x: function(skl){ return (100 + 25 * skl); },
		y: function(skl){ return (3.0 + 0.6 * skl).toFixed(1); }
	};
	
	SkillDesc[SK.SWD_SHIELDBOOMERANG] = {
		x: function(skl){ return (100 + 25 * skl); }
	};
	
	SkillDesc[SK.SWD_HILTBASH] = {
		x: function(skl){ return (100 + 10 * skl); },
		y: function(skl){ return Math.min((2 + parseInt((skl - 1) / 5)),4); }
	};
	
	SkillDesc[SK.SWD_HEAVYSWING] = {
		x: function(skl){ return (250 + 30 * skl); }
	};
	
	SkillDesc[SK.SWD_SLEDGEHAMMER] = {
		x: function(skl){ return (500 + 60 * skl); }
	};
	
	SkillDesc[SK.THF_SOUL] = { };
	
	SkillDesc[SK.THF_QUICKHANDS] = {
		x: function(skl){ return (2 * skl); }
	};
	
	SkillDesc[SK.THF_REFLEXES] = {
		x: function(skl){ return (3 * skl); }
	};
	
	SkillDesc[SK.THF_MERCILESS] = {
		x: function(skl){ return (0.6 * skl).toFixed(1); },
		y: function(skl){ return (3 * skl); }
	};
	
	SkillDesc[SK.THF_ADRENALINERUSH] = {
		x: function(skl){ return (2 * skl); }
	};
	
	SkillDesc[SK.THF_CAMOUFLAGE] = {
		x: function(skl){ return (100 + 20 * skl); }
	};
	
	SkillDesc[SK.THF_DOUBLETEAM] = {
		x: function(skl){ return (5 + skl); },
		y: function(skl){ return (5 + skl); }
	};
	
	SkillDesc[SK.THF_SONICSTRIKE] = {
		x: function(skl){ return (6 + parseInt(skl / 3)); },
		y: function(skl){ return (100 + 20 * skl); }
	};
	
	SkillDesc[SK.THF_BONECUTTER] = {
		x: function(skl){ return (175 + 25 * skl); }
	};
	
	SkillDesc[SK.THF_BLADEFLOURISH] = {
		x: function(skl){ return (150 + 30 * skl); }
	};
	
	SkillDesc[SK.THF_HAMSTRING] = {
		x: function(skl){ return (100 + 20 * skl); }
	};
	
	SkillDesc[SK.THF_STIFLE] = {
		x: function(skl){ return (100 + 20 * skl); }
	};
	
	SkillDesc[SK.THF_PUNCTURE] = {
		x: function(skl){ return (100 + 20 * skl); },
		y: function(skl){ return (4 + parseInt(skl / 3)); }
	};
	
	return SkillDesc;
});