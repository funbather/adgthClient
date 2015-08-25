/**
 * Renderer/ItemObject.js
 *
 * Manage Items in ground
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(['DB/DBManager', './EntityManager', './Entity/Entity', 'Renderer/Map/Altitude'],
function(   DB,            EntityManager,            Entity,                Altitude)
{
	'use strict';


	/**
	 * Find an Entity and return its index
	 *
	 * @param {number} gid
	 * @param {number} itemid
	 * @param {number} identify - Currently used to hold number of cards/enchantments, probably just make a new packet for this later
	 * @param {number} count
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	function add( gid, itemid, identify, count, x, y, z, quality, ilvl, slot1, slot2, slot3, slot4 )
	{
		var it     = DB.getItemInfo(itemid);
		var path   = DB.getItemPath(itemid, identify);
		var entity = new Entity();
		var name   = identify ? it.identifiedDisplayName : it.unidentifiedDisplayName;

		entity.GID          = gid;
		entity.objecttype   = Entity.TYPE_ITEM;
		entity.position[0]  = x;
		entity.position[1]  = y;
		entity.position[2]  = z;

		entity.display.load = entity.display.TYPE.COMPLETE;
		
		if(count > 1) // Consumable? Misc?
      entity.display.name = ' '+DB.getMessage(183).replace('%s',name).replace('%d', count)+' ';
    else if(!quality && !ilvl) // Accessories & Single misc items
      entity.display.name = ' '+name+' ';
    else
      entity.display.name = ' '+name+' -- Lv. '+ilvl+' | '+quality+'% ';
      
		entity.display.update('#FFEF94',1);
    switch(identify) {
      case 1: entity.display.update('#ffffff',1); break;
      case 2: entity.display.update('#ffefad',1); break;
      case 3: entity.display.update('#b9ffad',1); break;
      case 4: entity.display.update('#C4D2FF',1); break;
      case 5: entity.display.update('#D6BDFF',1); break;
    }

		entity.files.body.spr = path + '.spr';
		entity.files.body.act = path + '.act';

		entity.files.shadow.size = .5;
		entity.xSize = 8;
		entity.ySize = 8;
		
		// Unique?
		if(itemid >= 52000 && itemid <= 54999)
			entity.healthState = 0x4000;
			
		// Item falling
		entity.animations.add(function(tick) {
			var level          = Altitude.getCellHeight(entity.position[0], entity.position[1]);
			entity.position[2] = Math.max(level, z - (tick / 50));

			return entity.position[2] === level;
		});


		EntityManager.add(entity);
	}


	/**
	 * Remove an object from ground
	 *
	 * @param {number} gid
	 */
	function remove( gid )
	{
		EntityManager.remove(gid);
	}


	/**
	 * Export
	 */
	return {
		add:    add,
		remove: remove
	};
});