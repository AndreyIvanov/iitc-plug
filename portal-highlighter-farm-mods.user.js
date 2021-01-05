// ==UserScript==
// @id             iitc-plugin-highlight-portals-farm-mods@aai79
// @name           IITC plugin: highlight portals farm mods
// @author         aai79
// @category       Highlighter
// @version        0.0.1.20201031.000001
// @description	   Highlight portal with farm mods
// @include        https://intel.ingress.com/intel*
// @include        http://intel.ingress.com/intel*
// @match          https://intel.ingress.com/intel*
// @match          http://intel.ingress.com/intel*
// @grant          none
// ==/UserScript==
// Kindly stolen and modified from src: https://github.com/fl0o0l/iitc/raw/master/portal-highlighter-supply-base.user.js

function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function() {};

  //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
  //(leaving them in place might break the 'About IITC' page or break update checks)
  plugin_info.buildName = 'local';
  plugin_info.dateTimeVersion = '20201031.000001';
  plugin_info.pluginId = 'portal-highlighter-farm-mods';
  //END PLUGIN AUTHORS NOTE

  // PLUGIN START ////////////////////////////////////////////////////////

  // use own namespace for plugin
  window.plugin.portalHighlighterFarmMods = function() {};
 
  window.plugin.portalHighlighterFarmMods.highlighter = function(data) {
    
    // shorten some common vars
	var portal_level = data.portal.options.data.level;
    var guid = data.portal.options.guid;
    var p_opt = data.portal.options;
    var p_dat = data.portal.options.data;
    // variables per portal
    var myFillColor;
    var myFillOpacity;
    var myBorderRadius;
	var modHack = 0;


    // First make sure we want to check this portal (is a valid portal and captured)
    // TODO: currently this filters to ENL-only, but it can be interesting for RES. Consider making it a separate highlight mode.
	
    if (guid && data.portal.options.team !== undefined && p_dat.resCount !== undefined && p_dat.resCount >= 1 && portal_level >= 7) {
     //portalDetail.request(guid);
	  var detail = portalDetail.get(guid);
      // if we have details
	  //console.info('PORTAL JSON:'+JSON.stringify(p_opt));
      if (detail) {
        // and the portal has mods, run the coloring
        if (detail.mods.length !== 0) {
          // Initialization
          var shieldScore = 0.01;
          var mhScore = 0.01;
          var hsScore = 0.01;
          var itoScore = 0.10;
          var tmpValue = 0;
          var modCount = 0;
          //MOD Tabulation
		  
          $.each(detail.mods, function(ind, mod) {
            if (mod && mod !== undefined && mod !== null && mod.name !== undefined && mod.rarity !== undefined) {
				if (mod.name == 'Heat Sink' || mod.name == 'Multi-hack' || mod.name == 'Ito En Transmuter (-)' || mod.name == 'Ito En Transmuter (+)')
				{
					modHack = 1;
					console.info('"'+p_dat.title+'" MODS JSON:'+JSON.stringify(mod));
					
				  switch (mod.rarity) {
					case 'VERY_RARE':
					  tmpValue = 0.5;
					  modCount += 1;
					  break;
					case 'RARE':
					  tmpValue = 0.25;
					  modCount += 1;
					  break;
					case 'COMMON':
					  tmpValue = 0.1;
					  modCount += 1;
					  break;
					default:
					  tmpValue = 0;
				  }
				  
				  switch (mod.name) {
					case 'Aegis Shield':
					  shieldScore += 0.3; //0.5;
					  break;
					case 'Portal Shield':
					  shieldScore += (tmpValue / 2); // shield score needs knocked down to account for AXA
					  break;
					case 'Heat Sink':
					  hsScore += tmpValue;
					  break;
					case 'Multi-hack':
					  mhScore += tmpValue;
					  break;
					case 'Ito En Transmuter (-)':
					  itoScore += tmpValue;
					  break;
					case 'Ito En Transmuter (+)':
					  itoScore += (tmpValue / 2);
					  break;
				  }
				}
            }
          });

          
           
          // Multi-hack Score to Fill Color
          // examples:  1 VRMH = 0.5  (red)
          //            2 RMH  = 0.5  (red)
          //     1 RMH + 2 CMH = 0.35 (orange)
          //            1 RMH  = 0.25 (orange)
          //            2 CMH  = 0.2  (yellow)
          //            1 CMH  = 0.1  (yellow)
          mhScore += itoScore; // it just gives extra stuff, like a free... hack... err a multi... hack?
          if (mhScore > 0.5) {
            myFillColor = '#ff0000';
            //console.log('WARNING "' + data.portal.options.data.title + '"');
          } else if (mhScore >= 0.25) {
            myFillColor = '#ff8c00';
            //console.log('NOTE "' + data.portal.options.data.title + '"');
          } else if (mhScore >= 0.1) {
            myFillColor = '#ffff00';
            //console.log('NOTE "' + data.portal.options.data.title + '"');
          } else {
            myFillColor = '#ffffff';
          }
          // Heat Sink Score to Fill Opacity
          // see MH table for color, then add 0.5
          myFillOpacity = Math.min(0.5 + hsScore, 1);

          // Gear Payout to Border
          // examples:  1 ITO+ = 0.5   (red)
          //   1 ITO- + 1 VRMH = 1.0   (red)
          //   2 ITO- + 1 VRMH = 1.5   (red)
          //            4 RMH  = 1.0   (red)
          //            4 CMH  = 0.4   (red)
          var gear_payout = Math.floor(2*(hsScore + mhScore + itoScore));
          myBorderRadius = 10 + 4*gear_payout;
        }
      } else {
        // otherwise request the details
        portalDetail.request(guid);
        return;
      }
    }
//console.info('modHack='+modHack);

    if (guid && modHack == 1) {
      data.portal.setStyle({
        fillColor: myFillColor,
        fillOpacity: myFillOpacity,
        radius: myBorderRadius
      });
    }
  }

  var setup = function() {
  window.addPortalHighlighter('Farm Mods', window.plugin.portalHighlighterFarmMods.highlighter);
  }

/*
  // add a portalDetailLoaded hook to refresh the portal
  addHook('mapDataRefreshEnd', function(data) {
    if (window._current_highlighter === "Farm Mods") {
      // this is hacky, but I think it will work. Call the "regular" function (which takes portal data) using the GUID from the hook.
      // this will request the details from the cache and if not found it will re-request the details from IITC
      // TODO: how do we avoid an infiniate loop of detail requests?
      window.plugin.portalHighlighterFarmMods.colorPortal(portals[data.guid]);
    }
  });
*/

  // PLUGIN END //////////////////////////////////////////////////////////

  setup.info = plugin_info; //add the script info data to the function as a property
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end


// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
  version: GM_info.script.version,
  name: GM_info.script.name,
  description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
