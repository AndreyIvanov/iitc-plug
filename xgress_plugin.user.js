// ==UserScript==
// @author         lucyfox
// @name           IITC plugin: Ingress Tracker
// @category Layer
// @version        2.4.1
// @description    Extra features for the ingress intel map.
// @run-at         document-end
// @id             iitc-plugin-xgress-tracker
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://xgress.com/files/xgress_plugin.meta.js
// @downloadURL    https://xgress.com/files/xgress_plugin.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function() {};
    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'release';
    plugin_info.dateTimeVersion = '2020-02-22-224110';
    plugin_info.pluginId = 'iitc-plugin-xgress-tracker';
    //END PLUGIN AUTHORS NOTE
    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    plugin.xgress = function() {};
    plugin.xgress.user = {};
    plugin.xgress.NAME_WIDTH = 80;
    plugin.xgress.NAME_HEIGHT = 23;
    plugin.xgress.labelPlayerLayers = {};
    plugin.xgress.farmportals = {};
    plugin.xgress.fieldDrawLayers = {};
    plugin.xgress.rmnPortalsLayers = {};
    plugin.xgress.FTLayers = {};
    plugin.xgress.infoLayer = {};
    plugin.xgress.uniqList = {};
    plugin.xgress.keysList = {};
    plugin.xgress.keysListPlan = {};
    plugin.xgress.agentName = null;
    plugin.xgress.agentHistoryLayers = {};
    plugin.xgress.area_portals_cache = {};
    plugin.xgress.portal_area_lt6 = 0;
    plugin.xgress.portal_area_ln6 = 0;
    plugin.xgress.portal_area_zoom = 17;
    plugin.xgress.CHAT_REQUEST_OFFSET = 0;
    plugin.xgress.CHAT_REQUEST_SCROLL_TOP = 300;
    plugin.xgress.history_offset = 0;
    plugin.xgress._requestPortalHistory = false;
    
    ///// Portal info minifier
	plugin.xgress.obj = {};
	plugin.xgress.storage = {};

    // xgress panel variables
    plugin.xgress.panel_tab = 0;
    plugin.xgress.panel_sub_tab = 0;

    plugin.xgress.setupCSS = function() {
        $('head').append('<style>'
            // + '#xgressPlugin.mobile {border: 0 none !important; height: auto !important; width: 100% !important; left: 0 !important; top: 0 !important; position: absolute; overflow: auto; z-index: 9000 !important; }'
            + '#xgressPluginAgent{overflow-x: hidden;overflow-y: scroll; max-height:600px; position:relative;width:auto;}'
            + '</style>');
         // toastr
        $('head').append('<style>.toast-title{font-weight:700}.toast-message{-ms-word-wrap:break-word;word-wrap:break-word}.toast-message a,.toast-message label{color:#FFF}.toast-message a:hover{color:#CCC;text-decoration:none}.toast-close-button{position:relative;right:-.3em;top:-.3em;float:right;font-size:20px;font-weight:700;color:#FFF;-webkit-text-shadow:0 1px 0 #fff;text-shadow:0 1px 0 #fff;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80);line-height:1}.toast-close-button:focus,.toast-close-button:hover{color:#000;text-decoration:none;cursor:pointer;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}.rtl .toast-close-button{left:-.3em;float:left;right:.3em}button.toast-close-button{padding:0;cursor:pointer;background:0 0;border:0;-webkit-appearance:none}.toast-top-center{top:0;right:0;width:100%}.toast-bottom-center{bottom:0;right:0;width:100%}.toast-top-full-width{top:0;right:0;width:100%}.toast-bottom-full-width{bottom:0;right:0;width:100%}.toast-top-left{top:12px;left:12px}.toast-top-right{top:12px;right:12px}.toast-bottom-right{right:12px;bottom:12px}.toast-bottom-left{bottom:12px;left:12px}#toast-container{position:fixed;z-index:999999;pointer-events:none}#toast-container *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}#toast-container>div{position:relative;pointer-events:auto;overflow:hidden;margin:0 0 6px;padding:15px 15px 15px 50px;width:300px;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;background-position:15px center;background-repeat:no-repeat;-moz-box-shadow:0 0 12px #999;-webkit-box-shadow:0 0 12px #999;box-shadow:0 0 12px #999;color:#FFF;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80)}#toast-container>div.rtl{direction:rtl;padding:15px 50px 15px 15px;background-position:right 15px center}#toast-container>div:hover{-moz-box-shadow:0 0 12px #000;-webkit-box-shadow:0 0 12px #000;box-shadow:0 0 12px #000;opacity:1;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);filter:alpha(opacity=100);cursor:pointer}#toast-container>.toast-info{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=)!important}#toast-container>.toast-error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=)!important}#toast-container>.toast-success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==)!important}#toast-container>.toast-warning{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=)!important}#toast-container.toast-bottom-center>div,#toast-container.toast-top-center>div{width:300px;margin-left:auto;margin-right:auto}#toast-container.toast-bottom-full-width>div,#toast-container.toast-top-full-width>div{width:96%;margin-left:auto;margin-right:auto}.toast{background-color:#030303}.toast-success{background-color:#51A351}.toast-error{background-color:#BD362F}.toast-info{background-color:#2F96B4}.toast-warning{background-color:#F89406}.toast-progress{position:absolute;left:0;bottom:0;height:4px;background-color:#000;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}@media all and (max-width:240px){#toast-container>div{padding:8px 8px 8px 50px;width:11em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media all and (min-width:241px) and (max-width:480px){#toast-container>div{padding:8px 8px 8px 50px;width:18em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media all and (min-width:481px) and (max-width:768px){#toast-container>div{padding:15px 15px 15px 50px;width:25em}#toast-container>div.rtl{padding:15px 50px 15px 15px}}</style>');
        // spinner css
        $('<style>').prop('type', 'text/css').html(`
            /*-----------------------start spinner --------------------------*/
            .cssload-container > div {
                float: left;
                background: rgb(185,108,255);
                height: 100%;
                width: 3px;
                margin-right: 1px;
                display: inline-block;
            }

            .cssload-container {
                position: fixed;
                top: 50%;
                left: 50%;
                margin-right: -50%;
                z-index: 999999999;
                display: none;
            }
            .cssload-container > div {
                background: transparent;
                border: 6px solid transparent;
                border-color: rgb(185,108,255) transparent;
                border-radius: 100%;
                    -o-border-radius: 100%;
                    -ms-border-radius: 100%;
                    -webkit-border-radius: 100%;
                    -moz-border-radius: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate"("-50%, -50%")";
                    -o-transform: translate"("-50%, -50%")";
                    -ms-transform: translate"("-50%, -50%")";
                    -webkit-transform: translate"("-50%, -50%")";
                    -moz-transform: translate"("-50%, -50%")";
                transform: translate(-50%, -50%) rotate(0);
                    -o-transform: translate(-50%, -50%) rotate(0);
                    -ms-transform: translate(-50%, -50%) rotate(0);
                    -webkit-transform: translate(-50%, -50%) rotate(0);
                    -moz-transform: translate(-50%, -50%) rotate(0);
                animation: cssload-wave 1.3s infinite ease-in-out;
                    -o-animation: cssload-wave 1.3s infinite ease-in-out;
                    -ms-animation: cssload-wave 1.3s infinite ease-in-out;
                    -webkit-animation: cssload-wave 1.3s infinite ease-in-out;
                    -moz-animation: cssload-wave 1.3s infinite ease-in-out;
            }
            .cssload-container .cssload-shaft1 {
                animation-delay: 0.065s;
                    -o-animation-delay: 0.065s;
                    -ms-animation-delay: 0.065s;
                    -webkit-animation-delay: 0.065s;
                    -moz-animation-delay: 0.065s;
                width: 14px;
                height: 14px;
            }
            .cssload-container .cssload-shaft2 {
                animation-delay: 0.13s;
                    -o-animation-delay: 0.13s;
                    -ms-animation-delay: 0.13s;
                    -webkit-animation-delay: 0.13s;
                    -moz-animation-delay: 0.13s;
                width: 17px;
                height: 17px;
            }
            .cssload-container .cssload-shaft3 {
                animation-delay: 0.195s;
                    -o-animation-delay: 0.195s;
                    -ms-animation-delay: 0.195s;
                    -webkit-animation-delay: 0.195s;
                    -moz-animation-delay: 0.195s;
                width: 24px;
                height: 24px;
            }
            .cssload-container .cssload-shaft4 {
                animation-delay: 0.26s;
                    -o-animation-delay: 0.26s;
                    -ms-animation-delay: 0.26s;
                    -webkit-animation-delay: 0.26s;
                    -moz-animation-delay: 0.26s;
                width: 31px;
                height: 31px;
            }
            .cssload-container .cssload-shaft5 {
                animation-delay: 0.325s;
                    -o-animation-delay: 0.325s;
                    -ms-animation-delay: 0.325s;
                    -webkit-animation-delay: 0.325s;
                    -moz-animation-delay: 0.325s;
                width: 38px;
                height: 38px;
            }
            .cssload-container .cssload-shaft6 {
                animation-delay: 0.39s;
                    -o-animation-delay: 0.39s;
                    -ms-animation-delay: 0.39s;
                    -webkit-animation-delay: 0.39s;
                    -moz-animation-delay: 0.39s;
                width: 45px;
                height: 45px;
            }
            .cssload-container .cssload-shaft7 {
                animation-delay: 0.455s;
                    -o-animation-delay: 0.455s;
                    -ms-animation-delay: 0.455s;
                    -webkit-animation-delay: 0.455s;
                    -moz-animation-delay: 0.455s;
                width: 52px;
                height: 52px;
            }
            .cssload-container .cssload-shaft8 {
                animation-delay: 0.52s;
                    -o-animation-delay: 0.52s;
                    -ms-animation-delay: 0.52s;
                    -webkit-animation-delay: 0.52s;
                    -moz-animation-delay: 0.52s;
                width: 56px;
                height: 56px;
            }
            .cssload-container .cssload-shaft9 {
                animation-delay: 0.585s;
                    -o-animation-delay: 0.585s;
                    -ms-animation-delay: 0.585s;
                    -webkit-animation-delay: 0.585s;
                    -moz-animation-delay: 0.585s;
                width: 59px;
                height: 59px;
            }
            .cssload-container .cssload-shaft10 {
                animation-delay: 0.65s;
                    -o-animation-delay: 0.65s;
                    -ms-animation-delay: 0.65s;
                    -webkit-animation-delay: 0.65s;
                    -moz-animation-delay: 0.65s;
                width: 63px;
                height: 63px;
            }
            @keyframes cssload-wave {
                50% {
                    transform: translate(-50%, -50%) rotate(360deg);
                    border-color: rgb(86,215,198) transparent;
                }
            }

            @-o-keyframes cssload-wave {
                50% {
                    -o-transform: translate(-50%, -50%) rotate(360deg);
                    border-color: rgb(86,215,198) transparent;
                }
            }

            @-ms-keyframes cssload-wave {
                50% {
                    -ms-transform: translate(-50%, -50%) rotate(360deg);
                    border-color: rgb(86,215,198) transparent;
                }
            }

            @-webkit-keyframes cssload-wave {
                50% {
                    -webkit-transform: translate(-50%, -50%) rotate(360deg);
                    border-color: rgb(86,215,198) transparent;
                }
            }

            @-moz-keyframes cssload-wave {
                50% {
                    -moz-transform: translate(-50%, -50%) rotate(360deg);
                    border-color: rgb(86,215,198) transparent;
                }
            }
            /*-----------------------end spinner --------------------------*/
        `).appendTo('head');

        // Xgress panel CSS
        $('<style>').prop('type', 'text/css').html(`
            #xgresssidebar {
                position: fixed;
                top: 45px;
                left: 43px;
                z-index: 1001;
                width: 60%;
                height: 80%;
                display: none;
                background: rgba(8, 48, 78, 0.9);
                border: 1px solid #20A8B1;
                font-size: 13px;
                line-height: 15px;
                color: #eee;
            }
            .xgresspanel {
                height: 100%;
                overflow-x: auto;
                overflow-y: scroll;
            }
            .xgress_sub {
                padding: 5px;
            }
            .discoverers_table td {
                text-align: center;
            }
            .discoverers_table img {
                height: 200px;
            }
            .mission_table img {
                height: 100px;
            }
            .gold_span {
                color: #ffce00;
            }
            .own_enl {
                color: #03DC03 !important;
            }
            .own_res {
                color: #00c5ff !important;
            }
            .menu-list {
                display: block;
                padding: 0px;
                list-style-type: none;
                text-align: center;
                white-space: nowrap;
            }

            .menu-list-item {
                display: block;
                min-width: 55px;
                font-family: "Open Sans", sans-serif;
                font-size: 12px;
                letter-spacing: 2px;
                text-align: center;
                line-height: 18px;
            }

            .menu-list-item a {
                display: block;
                cursor: pointer;
                color: #ffce00;
                border: 1px solid #ffce00;
                padding: 3px 0;
                width: 80%;
                text-align: center;
                background: rgba(8,48,78,.9);
            }

            .menu-list-item:hover a {
                text-decoration: none;
                color: rgba(153, 153, 153, 1);
                -webkit-transition-duration: 0.4s;
                transition-duration: 0.4s;
            }

            @media(min-width: 480px) {
                .menu-list-item { display: inline-block; }
                .menu-list-item a { min-width: 90px; }
            }

            /*-----------------------site --------------------------*/

            .panel {
                padding: 0 18px;
                background-color: white;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.2s ease-out;
            }

            #chat_xgress > div {
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                padding: 2px;
                position:relative;
              }
              
              #chat_xgress table, #chat_xgressinput table {
                width: 100%;
                table-layout: fixed;
                border-spacing: 0;
                border-collapse: collapse;
              }
              
              #chat_xgressinput table {
                height: 100%;
              }
              
              #chat_xgress td, #chat_xgressinput td {
                font-size: 13px;
                vertical-align: top;
                padding-bottom: 3px;
              }
              
              /* time */
              #chat_xgress td:first-child, #chat_xgressinput td:first-child {
                width: 80px;
                overflow: hidden;
                padding-left: 2px;
                color: #bbb;
                white-space: nowrap;
              }
              
              #chat_xgress time {
                cursor: help;
              }
              
              /* nick */
              #chat_xgress td:nth-child(2), #chat_xgressinput td:nth-child(2) {
                width: 91px;
                overflow: hidden;
                padding-left: 2px;
                white-space: nowrap;
              }
              
              #chat_xgress td .system_narrowcast {
                color: #f66 !important;
              }

              .hide_fake {
                text-shadow: #ddd 0 0 10px;
                color: transparent;
                font-weight: bold;
            }
        `).appendTo('head');

        // ada, jarvis, fracker icons map tool

        $("<style>").prop("type", "text/css")
		.html(''+
		'.xgress_ada {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArxJREFUeNrEk0tsTGEUx//ffcy9c+/tdB53XqZv7ZSmHiGtd4JIQ7ohESK2W'+
			'BELWwsWIkIirIQFEYQFGyFBvIogqkFDVZV4pO1U606n09478839PrdISNhZOMvznfP7zjn/cwjnHP9iAv7RJH+o6g/nVFXBYKBdFcWaYpF2uYz2C4I0zFgJnHA4kxSMugABREkJ/JZKwJkLVTNSeiR5mpSZG72MhSIhLcSldXCpBsbsEnXz3zv3AET9rQJacuFTlERq2vQ'+
			'HNgTB2bILejRWZXU9G+S5bFicsPzEGoDQ92JfYeDDbkgyJIX8QDEPySU5HDdTN4XWhXVlK9dayfoKva4lyoamKyNvLt0+Z30euVqyxjWledkOmdpLefbLfVExouDezwLnRryqoSO3YlOzvGo9FNHwM8rFHFWE1NxEIrisZcnXR8+zrOPKGefVizNiTXqzbI92C1wUIUhMK'+
			'6+f3ZFpXRNgCeO83fkSsQUmuF/B8K13GO75Ci8M5eFIUIaVFQVamHzfe9xiMhfUkNkUrEzvdULm0fLOy7UNTXIm2taK3iP3MH7tKcbf9mOw28Fgh4WyCpLJFXyAWV2lLm0/GI3Gk5Lm16fNbEgHYpHg/Pj8pnWlz6XVevYx5OS41wbHQ60afem4J90YRnqyMd/6nRfUYHA'+
			'G7by1RyfIkEisGv5AZIFQ2XgYRvlYmTVwJ1TfuCFcmZpHhkah2g7epZrRZ0RANR3czsF37nCbPfTxhmmGQMxEHWTvwdMQxAhtdVINm2xVu1kxK9EfWrx8e0ZvXOJwHcXeXorrZy+SJ9cPjWVHnzJFQ8oM/wToBjwdQRiDtyymN9IDE9HaRZPb9ifV/AhVr5w8Jj2/e8Klh'+
			'U+eMMgXHTBR/guAT62xC+4FlCSlTaydk3Zed52SCM8Lsg8eHqUiRb5g/wL892v8JsAAA+sqvDde8pwAAAAASUVORK5CYII=");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.xgress_jarvis {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvRJREFUeNqkk99vFFUUx7/33rl7584MO7t2u7jQbsGllQhpsyZSFaKRxBAjU'+
			'ZDIEwkPGsOLj/LiP9Dw5ouJPvlIohh5wPCgMZjUmiA0Qa2Sqiy026XtbvfHMNPdmTtznaqgPvck5+Ek93vO99x8DtFaYzthPFk9jK0mrbYPQ/fB1SYgXGguQbQCY0QEm6rc7weLlMSQ0oLnecA/g43/9yOpKAEotZiwJrkQhwzDPkplNBE3aydV2Lv996tU/9DBv2KNOC0'+
			'3qQkB4gqePc9J7mRobIDafRSMibnW6sKU1snSf9dmQ6VyOhXwg9S+kPssd+y8lR/9EIXBM+qlJnAmaQTL6+f0YpiRcuh1yrmrVNRLEtUilIFUDlShYiq4u+czYRWOx7m1flJtL1lnD4+7O6uw2RhaK4utjV/nv/Fmrn1lNqzTlNs7G/WFaRWHPjNT66HCLqc48m7w4k9O+'+
			'PLczeKrp0q88JxTkdOwiYM9uUMWqQw/tc5/GPGta98qEe0yk8LzQtEvGSd57CiXzrWHa1Fb/Tijr49cnnpj5oxwpUyiCDfvfAHf3sBeYwrNeoe0L954+8QLJw7un5g8bkE2DDzmTniqc78zu3IhzgO5I5VXaCGbH6CD+7XrMJKt/6VoYhXSsX8Ziw8Se6Nyanb264/v/bH'+
			'wiWHZlu64936mnQDTxWNYWxncIO1ue7z+ID88n4fv5IB1gZbzG4L5xm5Zrt66cvXz71aX77xPKQXLZJy2wcWxeH/01mhx7+5xOT5k3l7zKNvxRFPCDqWAShQyXR/1q99nb83OvdPrrn2Q2uoSmjIxWt4HohhUzrngVevvWc/6c9TUNV4qZuXTk0dh2EnYaPDkI8PoXaq9Z'+
			'ujelQxnj0BijnQQ6wi6r0MryHeYFoRvZkdIL348vrtkJcu/Z3FJs+6nvTd95V82OYVBH3KbZnG49BfXJGNDSBeDByHYFmmEH2AZeQRJnPMG3btB5F1MGUfW1DD5o1NIIdzmNVJsM/4UYABhczyLk4yHJgAAAABJRU5ErkJggg==");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.xgress_fracker {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABRFBMVEX+///+/vv///3+/v769/Xz6uX88tXty8XyvbT4+4X053/3QlPkLDfLZTooLjoeNEsdP1kvPFUkR2o1RGQ1UnZjVWBNXX86apFKapVfc'+
			'pJ4kKn//v/9knL9hWX7dWLxa136gFn9qXfrdFLDT1WyP0mmNS+gPkGONEKNJy93LUh1Iy5eHzf8oGH7k2b5sGvrg234dW/RVFb7n2/9nH65Rz38sIvrdmLgbW/6g3b5jVb9uX3qnHLVak78w3D+yoXITkb92IS0TVOmVF2mWzzfYl76t3OgRFCLP1PovWzup2T7c1X8xpB'+
			'HDTb61HjnYFbzZk/8yXvbVEfiZ0zRnJPKcnm+XWHFXk3PZWDom1j1m5HZf1/944vzsqTSjIX+7Jr88oiIRjTvilzggkz8+6D71ZjZs2Tp2XH75cGqaXD40Lj7/JPOlFLHtb1VAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHd'+
			'ElNRQfgAg8QNBhMUzrFAAAAdUlEQVQY02NgQAY+IEIXwbdIBAvEQ3hACX0oS4eBwZWBwQqoAqrSnIFBjoFBMTYbplU3GGRaWpYM3LBkBl8GBlkthOm6YKsCkOzXtWZgMJRFEkiI9lRwRHGii4q2BYqAo7O6OIoAg4UoKp9BkB1NQEKCAQcAAHaAC9+tIFYpAAAAAElFTkS'+
			'uQmCC");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.xgress_hover {'+
			'color: #FFA700'+
		'}'+
		'.xgress_popup a {'+
			'color: #FFA700'+
		'}'+
		'.xgress_canvas {'+
			'background-color:white'+
		'}'
    ).appendTo("head");
    
        // Minifier
        $("<style>").prop("type", "text/css").html(''
			+'#portaldetails.minifyPortalInfo .mods{ height:auto; }'
			+'#portaldetails.minifyPortalInfo .mods > span{ height:16px; }'

			+'#portaldetails.minifyPortalInfo #resodetails td{ display:none; }'
			+'#portaldetails.minifyPortalInfo #resodetails tr{ width:50%; float:left; }'

			// +'#portaldetails.minifyPortalInfo .mods > span[title*="AXA"]{ background: #ffff00; }'
			// +'#portaldetails.minifyPortalInfo .mods > span[title*="AXA"]::after{ content: "ciao"; }'
        ).appendTo("head");
        
        $('<style>').prop('type', 'text/css').html(''
            +'.row_buttons{ display:block !important; width:96%; margin:7px auto 5px; font-size: small; }'
            +'.row_buttons a{ display:block; float:left; width:22%; border:1px solid #ffce00; text-align:center; background:rgba(0,0,0,.3); box-sizing:border-box; padding:2px 0; }'
            +'.row_buttons a.hidden{ display:none; }'
            +'.row_buttons a.regAll, .row_buttons a.convDr{ margin-left:2%; }'
            // +'.row_buttons.hidden{display:none !important;}'

            // +'.dlsBkmrks ul{margin:0;padding-left:15px;}'
            // +'.dlsBkmrks textarea{resize:vertical;width:95%;height:46px;margin-bottom:15px;}'

            // +'.ui-dialog-dls .ui-dialog-buttonpane .ui-dialog-buttonset button:first-child{ display:none; }'
            // +'.ui-dialog-dls .ui-dialog-buttonpane .ui-dialog-buttonset button{ margin:0 3px; cursor:pointer; }'
            // +'.ui-dialog-dls .btn.btn-delete{ color:#ff6666; padding:0 5px; border: 1px solid #ff6666; margin-right: 2px; }'
            // +'.ui-dialog-dls .btn.btn-delete:hover{ color:#222; background:#ff6666; }'
            // +'.ui-dialog-dls .dlsList li{ margin-bottom:3px; }'
        ).appendTo('head');

        $("<style>").prop("type", "text/css").html(''
            +'.xgress-plugin-field-names{'
            +'color:#FFFFBB;'
            +'font-size:11px;line-height:12px;'
            +'text-align:center;padding: 2px;'
            +'overflow:hidden;'
            +'display: -webkit-box;'
            +'-webkit-line-clamp: 2;'
            +'-webkit-box-orient: vertical;'
        
            +'text-shadow: 0 0 1px black, 0 0 1em black, 0 0 0.2em black;'
            +'pointer-events:none;'
            +'}'
            ).appendTo("head");

        // inject html
        
        // Panel Icon
        $('body').append('<div id="xgress_select"><img style="width: 25px;" src="https://xgress.com/img/logo.png"></div>');
        // spinner html
        $('body').append(`
            <div class="cssload-container">
                <div class="cssload-shaft1"></div>
                <div class="cssload-shaft2"></div>
                <div class="cssload-shaft3"></div>
                <div class="cssload-shaft4"></div>
                <div class="cssload-shaft5"></div>
                <div class="cssload-shaft6"></div>
                <div class="cssload-shaft7"></div>
                <div class="cssload-shaft8"></div>
                <div class="cssload-shaft9"></div>
                <div class="cssload-shaft10"></div>
            </div>
        `);

    }

    plugin.xgress.customCSS = function() {
        // change style
        $('head').append('<style>#sidebartoggle{background: rgba(0,0,0);}#chatcontrols{background: rgba(0,0,0);}.ui-dialog-titlebar{background: rgba(0,0,0);}#updatestatus{background: rgba(0,0,0);}#chatinput{background: rgba(0,0,0);}.ui-tooltip{background-image:repeating-linear-gradient(-49deg,#022 0,#022 4px,#000 4px,#000 8px) !important;}.ui-dialog{background-image:repeating-linear-gradient(-49deg,#022 0,#022 4px,#000 4px,#000 8px) !important;}#sidebar{background-image:repeating-linear-gradient(-49deg,#022 0,#022 4px,#000 4px,#000 8px) !important;}#chat{background-image:repeating-linear-gradient(-49deg,#022 0,#022 4px,#000 4px,#000 8px) !important;}body{background-image:repeating-linear-gradient(-49deg,#022 0,#022 4px,#000 4px,#000 8px) !important;}</style>')
    }

    // constants

    icon_lc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAUCAYAAAByKzjvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAInSURBVFhH7Zi/SsNQFMY7Fge1kw/QWdBBBAUHu1nEF3BwdPYtfATRqoPuDi0UFAQHXXQVhIqDi9BBwX+gcOP3XZJwm5w2SXM73NQPfkl6e04o30nuvT0lz/MEVMqxf+Jk804cLHgB6uADzBtjFslfgEUk7OH8BALhWo/hu1i8S6wDX2oURVjAfQ9wfgSBOhg7xln0zvwwBU5BkhjDWDPXFWqAxvvSRbDxUM2AQ5AkFmIShLnBxQS4A2nFWOaEN3KIVfAFfKlXHJaBFJsGGnoF0uoaTAOdH9yElQl132x6t5VKDxyLiDlBvmvYLMIJyKojoPN54CsYSjI/QCiCy2uCjSL0eJdR2jveJHz6u+22aLzJS6vlR2u5/BYQFoHG+9JF6PNQcScTgxuTIaXwFihdgHC306nVvJtyeSCMMdQFW26jdsE3rn2pNxyWAL1JwtztZBVzdQF+9EfooloVTTdhTPGVugi/YFgx978AA7QDooZHsVKAPFPQJzhznHNgTEGUgvnSnB8rgJUpKFyEucBKC69JfBEWf5grzIJnYGobCLHRYmisLMI9W6nLRkM0nhRsGwrz9VxvahNIsf2wsg0l4VtASUUo2B+xumA++0RSbBK5/4iRcWpFsBtqy3xipRVBxqEZtwEMqXccVoAUm4XczTgTzE2FbUez1UDTKZ7ngBQ3LGxH7+PcAYFSt6MNuMKnGXOSNfAAbJvvk807cbDgBRgxWbzzSn+NdjYQgEPTwgAAAABJRU5ErkJggg==";
    icon_dr = "data:image/png;base64,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"
    icon_beacon = "data:image/png;base64,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"
    icon_destr = "data:image/png;base64,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"
    icon_df = "data:image/png;base64,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"
    icon_fc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA+CAYAAACSqr0VAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPHSURBVHhe7drPitRAEAbwwT+nBXXXN5DFRXwKBRHx4juIyCqIVx9BRBG9+wgigoo38QlEURHBu4p68eIqM35fSGtsvkl3J1WZjDsFP2atVDKbTKerd8xkNpstyhpcg1ewU+PPzHGb2sedTA5gE97BvOA21qh9XcmkM376bRcjBGsGHyky6Yy3RG6wVh3DjUw64zyRG6xVx3Ajk844eeYGa9Ux3Miks9UFiaxumchqUo2s2q6wOZ1Ov+G1Lc6D2teVTA7gOPwCxgfg5EmcM54D4y3sA7W/G5kcwFNg3Id420H4BIwrEG93JZPOzsIMt8wPvBypc7GLwJqveNmoc4OQSUf7oZpQcbLXYRLU24O98BIYdyDe7kYmHV0Fxkc4AKomOAkMzjXHQNWYk0knhzESqs6C1wvN0RE0aoMHwHgCars5mXRyFxgvYA+omhi/EwlL/dOgakzJpAMO+dBmT4CqmecmMF6DexuWSQcc8gzeAmp7m0PwGRiXQdWYkUljZ4DBod/6taCaV2rb2M655wte1kO9B5k0xCHOFSfjBqiaHDxO9VcyLsrtOudCJg1xpcngypMrUFWT6xQwfsIWqJreZNLIBj5NrjQZXHmqmlIPgfEI1PbeZNIIV5gMrji58lQ1pY6CaxuWSQPNNssVp6rp6hYwXNqwTBro02ZTXNuwTPaU3WZjdYvN4daGZbIHqzab4taGZbIHyzab4tKGZbIjjzabYt6GZbIjjzabYt6GZbIDzzabYtqGZbKDx8DwaLMpzTZ8CVRNNpksxKHKKG6zhrgeYfDC8AKpmiwyWYBDlEOVwaGraoZg9nvIZAGzT8ZAc6RyslU1STKZab1eKXJxtA1qRZmlccy+2H4ZbMdqe5JM5sCJcIXI4Iqx9+xuhAs0LtQYXLipmlYymaH3G+eIR1KmXh+UTGboPTQd/XMrN/JZZDLBZPJy1nmyl8kWY2mzKZ1/T5lsMaY2m9JpJMvkHEVttrHfIhXPdTKp4CTH2GZTiruhTAqDtNk+4hHaUPRByqQw5jabUtSGm//gI5B8LpRXkhMR8ed7wBhzm00JzeA7vIHm+fGc/zz+GXbgn+2pZ0d5YUL9stnC6OAzbfOC5159dcHirAdpccD3eBn8QVoDWeeHYM0adxj1o9YGis6PO/A+yg3Wxm84dkXnxx04ueQGv0g+t2TCl985sVN6Qf73qC5IyZBi23q2ZPg750Z1y6wm1b9RTapFbQniNxy74rZLqYUZty3q/1wsZJ9fcydeSQ4vzilzl7ZLLOv84p12PZncvWaT31K+na+N9p4FAAAAAElFTkSuQmCC"
    icon_forceamp = "data:image/png;base64,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"
    icon_fracker = "data:image/png;base64,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"
    icon_heatsync = "data:image/png;base64,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"
    icon_itoenplus = "data:image/png;base64,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"
    icon_itoenminus = "data:image/png;base64,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"
    icon_lc_r = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAUCAYAAAByKzjvAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAC10lEQVRYCe2Yz2sTQRTHZ4sHqdq0oHgQJNizoAfJISiiEUEpHrxaBA9ir6H9K8SLN9HagPU/KMVDUSxWPGgvgiIYG8QcpAcravHSHT+T7sSZ3XR2swlptuTBY97M+/2d3WF3hBjQAAEp5Sn4E3xlgAYIAERByq0K42dYE/LWQyZnugkS8RT4v4Ikaix2M36vY1G/wu4B4xqsaS1YKzjrwXoEVsDH0WMMjjqDJVAS45yUvgZf57yWwLXvTCg+Bz/VTThGZZOLNMDiKPza4RhWLbMwEgmUcAHfiVDADeZXE7r3lRl1D8PvQv24psp22GqChTmXxw66eStIwgmxQuD7mQVftUw/1qnxYWFBvh0bs/jF7GwYwkoTLjScW6nJfa41s2wLZLlhZ2qAfzJklpkpvVjYtQJfb0aLTSgMbXfq30nfsX8rqS/FqjxPDPtvQnhnPc97b6xlTZzSBX9fXBSbk5N6GhkPTU8LZWPQlKcmAFNlOGEo2hG/AOB4nAM5ytjcM+z+Ir+C/xhrWRQvUXTjPK+WSmJ9ZcXZw5FiUYwvLWmb2r5AOq5XUoyxvi3AV2n2w6UU+frWpVariQMx1Skb42k9FhxBMV6dq9/wnv3sPMzei6DfgK+0lvYIUr5O4ohSn7f85UoOQC/4BpYcQfK+EEMfnc79r7xLiYdVmfl8XqzX686KlY1B9WAD/GWASLkBfvNAMwJHxGATLgP6MzZhFOYI8m5jeB3d84hDRhZ4sM5T6k1V7sFyWWysripxR8rNzJi6l40JQaxPKebtULufoUX+fn8YCTaRL5hVZUmmdgs712eo0oXoP3Yo5kLKJNP5NGAReK9tQuyPWAvwKxZ2gNLrq4g9swlg1/lVhNoNAvX6Mo7X1/9NXk1Kvmg9GRmZUHdnl3FmnwQDmMh1dJW1R+i6fR19OrQJE2YtWZMD7NJdR+9WsxTNJkj19GfyNnS3cBvk7QIC/wDsv+buhqPEaQAAAABJRU5ErkJggg=="
    icon_ld = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAoCAYAAAAMjY9+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALsSURBVHhe7ZtBitRAFIZHcSH2LARFcCc4a3EhuBLcCV5gwIUX0AuMo+ABPIEHED2AgifwACOoKC4El4LgbsRu/y9USab442Sm0+mXoX74SPrVq/deV3XSlXR6Y7FYnBSuJ1zb5LDGifI44domhzVOlHcJ1zY5rDEQ54zNcVHME+w7n5K+sdeCNQbikbhT2Bz3RRb7zqcNMYnt2kJgjYG4ITgKnorTyeZ4JbLYdz5ADGIRk9jOJwTWGIyPAr0V7jR1RvwUWexjK/3oSwxEzLI9FNYYjCci65u4Kdrtt0UpbG0f+tA3i5jt9nBYYzCuirb2xUPRtM/n82cY20q23B9f+rRFzNweEmsMCMvgUi/EpvjQvDoobLThU2oSS2prDMgD4fQlbZ262ojlcoTCGgNySfwWy4oYxHI5QmGNQXkjlhUxXOxwWOOInBLXBDcfryRY1p4XZ0Xb955YVsRoxyQHuciZ81MLNVFb23dU2i9mYkfsCVYxf8R7sStoa/sOyS3xVXSJOrg2+dW8Wk7EIBYxu0Qt1ORqHQLGkjFlbKmDsWbMGft/45ydt8QnYaXl52dt8Mn+Q7OpHM+1XatSDazmXI1DsJXGskvMQTPOODNLnZOSlQKu8siBu+K7GFvkJLeraShmh0xKFnMxowOHUF9xCJYJh+aCeCnGErnI6WoZEsaur3bowPltDJWFHsa2PmE/tF2JUuxt4XL/jzG0R6LydsWqVL7BPlwWr8XQIiaxXc7DGEP7JAoxMfoEO/uoE9NRQ8kYaiYmxKnMDMrop7JAE9Ocyo7y5c+PTFyQHYfyDR6gNShr+/LvOTHuvfWBseur5ss/xHI5Dcpal8s9J+a4HHm5DPUCU0o1hLnAzHA01FsywW7JrIt6E7MDawxKve0fkPpDWVDqT8tBqQ9jBKTz8SUtPcE+vkSbdqE+vrQi6gN/QamPyAakPlQelPo3jKDUPy6dAFgGT2Ip3AdrnCj1z7FB4eYjuLaJsdj4C/Z+aOryIhywAAAAAElFTkSuQmCC"
    icon_linkamp = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAACyCAYAAAAOCiBDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABxjSURBVHhe7Z0J3L7ZWMepoUQk0abNtElKNdlLRdJuMkk7ZqQ9EYn2hdJoo00LkwxGyTKUTDQhKSFJIVKTJUNFpcXU9Pv6vGc+Z+7/75znOvfyPPfzPOf3+Xw/77zX/z7nued97+s95z7nuq5zlcsvv7zT6QSxxk6n47HGzs65ofigga2zAqyxs3MeKX5mYOusAGvs7BRGlyT3750dYo2dnfJkkfQo4a7p7Ahr7OyMm4uhGHHctZ0dYI2dnfEaMdTzhbu2swOssbMTzhYl3VG4Np0tY42drfP+4p2ipDcK166zZayxs3UeKjbpAcK17WwRa+xsnXxlrKTfEK5tZ4tYY2frnCc26Vzh2na2iDV2ts6vi03qO/8rwBo7W6c7zJ5gjZ2tcFr2391h9gRr7CzOF4v7Zt+3OsxZ4vTs+86WsMbO4lwicgd4jNiknxbp+gvEs7PvO1vCGjuL8vkC3V0kW6vDPASDdAORbJ0tYI2dRWF0QVMc5lswSH2U2TLW2FmM+4mkORwGnSGSvbMw1thZhGuJXLnDPBrDBuXvPPfBcCIinJO9szDW2FkEQltyzeUwiEjn9G+dBbHGzux8nBhqTodB+b5OZyGssTM7LxZDze0wjxDp3zsLYY2dWUnLyEPN7TDoQ0W6prMA1tiZlTcIpyUc5nkiXdNZAGvszMbDRElLOAy6nUjXdWbGGjuzcH1R01IO8yaRruvMjDV2ZuG3RU1LOQz6NpGu7cyINXYm80lik5Z0mMtEurYzI9bYmcxfik1a0mEQfabrOzNhjZ1JfJF4u9ikpR0GsWGa2nRmwBo7k3iLiOg7RWoTSSDLgy+/D0NALxCpTWcGrLEzGkaBqG4jUrtWh7knhqDI7kztOhOxxs4oOAApqieIvG2rw7y3KG2IDvUOkX9WZwLW2BnFH4ioKA2bt211GPgsEdWDRN62MxJr7DRzSxHVg8WwfWsRjMRFIqrriGH7TiPW2GnmtSKiS4VrP9ZhbiSiulAM23cascZOE/cSUZ0pXB9jHQZ+TkR1U+H66ASxxk6Ya4qoLhauD5jiMFcXUb1cuD46QayxE+ZXRVQfK1wfMMVh4BwRVWmU6wSwxk6IjxZR/ZJwfSSmOgy8TkTEwU2ufSeANXZCvEhEdV3h+kjM4TC3ElE9XLg+Ohuwxs5G7iSiooaY6yNnDoeBp4qoPli4PjoVrLGzkX8QEb1ZuPZD5nKYDxHvOmGTniZcH50K1tipQnJWVLcXro8hczkM/IiIOAy6tXB9dApYY6cIIS1RtdQ9ntNhIOowfydc+04Ba+wUiRzemtRSWX9uh7mriOrewvXRMVhjx/IJIqphoOQm5nYYiGR9ov8R7yNcH50B1tixvFRE5drXWMJhInUFkn5WuD46A6yxcwotUxySu1wfNZZwGDhfRPURwvXRybDGzim8VUT0auHab2Iph3k/EdXzheujk2GNnSvBMm1UtxWuj00s5TBA8hhZlxF9hnB9dE6wxs4VXE9ENSXfZEmHgajDvFG49p0TrLFzBZuqV+aaktG4tMNQCCOqvJpNZ4A1dt4N05OoflS4PqIs7TDwQhFVP525gDV23s1fi4go2ufa1+Acl0/Nvm91GGoIEDeWvo/Qko7A8YKuj6PHGjuX30NE9eXC9VHjm0ReL6zVYe4svjH7PkpLwhv7OK6Po8YaO2H9qXDtazC6XCCmjDCUWHqiaB1lICoiBVz7o8Yaj5yfElGN+SvM6DLVYZiS4TBjRpnvEBEx1aROtOvjaLHGI+YjRVSPF66PGp8uHiuINfuUExv8mtikocP84gk3PrG1cImIiLwf1/5oscYj5pkiqvcVro8aFPHDWeZ0GDZWkz3KZ4qofly4Po4SazxSWh6iMaVXOU2Z0SU5zRwOg7PwdcwO/XNFVITYuD6ODms8UqLTFK5z7WswGqWRZW6HSVAjLf17BBYMonqGcH0cHdZ4hHy7iGrM8RFfL35Z/OAJjxCtDpOH4N9C/IL4gRNYLmapOf17FO4jqvx+jxZrPEKiGnNAEQsJPy8YBZZymB8T1D4bs8z8HyKiVwrX/qiwxiPjV0RUPPyujxrEZuEwyVmcwzDl2aTHiXT90GEAh4mUdBry1SKqrxOuj6PBGo+I00VUm6pXOthrGY4uwPQsdxhGiNcIwnEcnA7AMX3pehyGaVjuMA8R3CNL1+m6KK8SEf27cO2PBms8Iv5MRHUN4foo8V4C52Ak4OsPnYAD8ZVTxFy7COTg4yRM05LD5H27NjVuLqLCuV0fR4E1Hgl3EFF9s3B91GAZOTnL0GHmON2YKINHidxhUv+fK1ybGk8RUd1EuD4OHms8Ev5JRDRmt5v6ZbmzJIfhYT5buDatXFVQVDA5TXKY9DnXFq5diZajO462aqY1HgHfI6IasynIMnLJYcjidG1awWFuKNK0bOgwrS/oOAzvWlEdZTqzNR441xJRcdCr68PxnidQfWXoLMBI8GXCtZ3C3UQ+NQMefFbiiIx2bWq8TUTEQoRrf9BY44HDkd9RcZS468ORHIawmaHDnCt+WLh2U2FkIOPzJ0XuNDjM/YRrU+MrRFRMCV0fB4s1HjCfJqLKQ1Ei4Cy3ETgLTpM7DEvALYW/WbVqSR34HMHmZ+4waZThnlybGksWLdxrrPGAiT4I/yZc+xo4DJG9kDsMh7Z+l3BtSrxFtC42EKOWLzMnh+Fra5xZS1lcYtpcHweJNR4oLdUr7y5cHzXuIkgES47yvScwupBP79o4yKZMup1w1zg4Q5PR7ftPSAsAbJKOiX8j3yeqjxKuj4PDGg+UfxUR/Y1w7Wt8gHikSM6SHAZn+RpxmnDtHPlyN7v/7poSBJEmp8lXzRh5PlC4NiXeQ0T1x8L1cXBY4wHCC3FUvOe4PmqQKjx0GF70AWeKOgxTt6G+QbhrHZRHcg7DKHMv4dqUwGGYWkZ1FOnM1nhgtFSvfJJwfdT4REEMV+4swOhCNAHOEnEYzpwsyV1fgqknTpM7THKalqkhDgM9nTnDGg+MlpCP6wvXRw2mXhTOyB9OXrZ58b66cG0cteVu9llcGwdxZrzoc0+5A/M99+ra1Pg8EdV9hevjYLDGA4LMxKiYxrg+arDb/RjBg5g7DKNLXhVmE5GzXNjVd20dLEtzD7nDcI/c65gd+peIqA46ndkaDwh2oyNid9u1r0E0Mn+101/ufHShlJFrUyJyWtjLhGtbgr/2+SiTRkLg3l2bEi3pzJSQcn0cBNZ4IPCSGxVLwq6PGoSkpNFl6DAfLlwbBy/L1ACLiAho14fjY0Q+yqT75J65d9emBtPCqHivc33sPdZ4IERTb8mJce1rEKPFizXvCumBJKCTF+uvFARGunYONimjajmOgo1UsinJKGVTM90n98yKXmucGQsA/y0iYgrn+th7rPEA4IGI6pOF66MGqcA4DFmQ6UH8iROuK6IOQ/hNq/LMyxo4DCuELKlDuk/a8/NprZqJw5AXFNWYUXv1WOOew8txVL8pXB81cDDittIDmGB0+WyBs0QchsDOsXL9DcFh4PaCUSZ3bsBpWirBpGVmzvaP6L+E62evscY952IR1Zg04TSS5A8fIwVTsuQsEYchdWCsIi/WyWGAKVm+AAA4TMvKYHIYVuAiwmH4HNfX3mKNewx/4aNqDYiEOwqmYoTq5w8ftpYX3VuJqbqZcH07GEkIkkwLE4mx6cwXiahaQ3JWjTXuMbwUR3SpcO1rEOKSnCV3GGytOf+vE1P1V8L1XYL3rpLTtGaB4gRRceyh62MvscY9paV6JSOF66PGV4mSw3yYcG0cxIbNpa8V7jMcLHWXHIaVPdemxsNEVGNKP60Sa9xDWgo4PEe4PmoQvp47S3IYbGcJ18bRkh4dUWveDqellZyG1GrXpgTvRnx+RK8Wro+9wxr3kEip1aTWBwMeKFJ8GA8YX9PLv7vewULA+WJuEbpP/Jj7zCFUs0nLzCnRDHCYMXFg5A1FdY5wfewV1rhnsKMd1ZjsQF7Q2TFPzpIc5tHitsK1ceCoSynqMMCxHueJ3GHS/8+Y1Abyh6Jy7fcKa9wzOGcyKtd+E8zVgYcqOQujTWuBieeLpdQ6zby/4MiN3GEopDHm+PSWOgmMhq6PvcEa9wjKFkU1pnrlFwpGF6ZkaXQBNilJCXZtHKQILy1Sm91nOz5esJk5dBhGmTHLzOQRRUXej+tjL7DGPeLNIqLXC9e+BrkxjCS5owC2lixIiN7nFP29aNk45XBaFi3SyJJW/djQ5F3HtSnBkntUzxKuj73AGvcE/ipGNabUEE5RcpiWRDOmbtsSR2tEHYbQnJLD3FO4NjWIJoiKDWbXx+qxxj2AAMeoni5cHzWYspSchWmaa+OYEi82VlGHgS8RyWmSwySnYTHFtakRXWZuibpeFda4B7TMmVs2FRNpGXnoLHx115e4UGxbvJtEHQaGI0xymAcId30NHDCqvayaaY0rh5itiC4TPAiujxqk8LIvkT9AQOLVGcK1cZCivCu1HKdBGjdR28P/XxyvJc060XLmDpufro/VYo0rhxiqiHAY174Gpx1zYBDkDw9VYe4jXJsSnBy2K71YuHsqQSAqFTrz/2dONIOW0QoIg4mKVTnXx2qxxhXTsrNMUW3XRw1CRxhdnMO0FKHgqIldqyWBi7M7h6WicBZGGX4mrk0NKoBGRVla18cqscYV8y8iolcI174G7zrJWXKH4UGieqVrU4KzIHctKmi6eytBDYTcadIIg9NQINC1KUGeUVR7VTXTGlcKcVtRtWQSJngJxWHSRl5yHGhZRn6oWIsIEnX36MApkpNA+jlQ/OLewrWpQWxaVHcWro/VYY0rhFpXUf2OcH3UIO14uPONoxDU2bLzTQj92tSyCUnaA9Op3GEApxkzdYoW+NibZWZrXCGRc+yTxlSvJN99GFuVRhd3fYnnibXpt4S71xLDEQaIARtT6JA/NlGR4u36WBXWuDJY5o3qu4Xrowa1vohizh8QYHS5qXBtHCSYrVUtUdVU4WSUGf482ODk4CbXpkZL7YLVV820xpURrVJCvJZrX4NlZDbpmOszyiTYpCSl17UpwVLuWtV6hAdL6MON2zEjLrSkNZAv5PpYDda4InjZjGrMgass/w4dhhPEeFgoj+ralGiZfuxCLQlcPOTOYRiJv1S4NjVoF1XLUYVbxxpXRFStG3XAQ5GcJXcYHpTWZeTEk8Wa5e65BPUCcqdJIwwP/5gQ/XeKiKgz7dqvAmtcCTzMUbWEgiSYdgwdJp1ReR3h2mxiF8GWLWpJ4KL+QMlhxuQWtcwWKHHr+tg51rgCbiSiIsGLAnOunxKpemX+Ukuhbh6GMcdB5LDpRxG7tarlPEqS0oYRAMDPfMzUiSMII+J4Rdd+51jjCnihiCpVZHT9lGAT9OEidxicBadx17eyZodp3VnHQYZOQ6VPRmJ3fQ0OuY2KtHDXx06xxh2TnyK8SewmtzoM6cLD0SU5zE2Ea+M4XVxtYEsQx7VmtZzOTG5QaZQZc65lS8pDa+bn4ljjjnmDiIgzFZOzRB2GxLNUHil3FnL0W+flHKdRC+n4c7FW/aNw91yC9z32YXKHSe97rXsnLe95vytcHzvDGncEAXuk2EZFVXrXTw2infnLODxlmBiylgBDdsIRJV/dv8ONxZrVUvWGJXZGmZRsBiyU4ERs2Lo2NVriAil+7vrYCda4I1oiXH9PuD5qcIJwcpbcYXCWlr2Fa4tctYIYjxdrVks9M/a5cqdJq4s4DdM216ZGdJmZhQLXfidY445oyaEYE42MkwwdBmfhq7u+BDUChnLXAZEEa1ZLoCrT3uEIkxyGutauTY0zRVRnC9fH1rHGHUAkbFSUOXV91Li1yJ0ld5iWijJc68R+hbseOCB2zYqODjgMVTPTKJMcJjnNLYRrVyNaNZOjAksLLFvFGnfAC0RU1xCujxKcGMyL/fBFH2dpPSOmto9QOwh2G3XJxorKoe6eSxDgypJ8vgDAHzHOznTX12hJZ679Udoa1rhlSIGNaszQTKoyS8a5s/DLxWFaIgT47JoI7XftgAWKNaslDo/ZwGNF7jDAz5Mle9emBufHRNV6kO3sWOOWiaYdj3n5I15s6CzAMjKBl66N4+oiolrNsiVrK0/Vfwp3zyXuIfi55g6T/gi1njjWstjzh8L1sTWscYvw8EY1ZnmR+KWhwzA1I1mMPRnXxsEcPSLKtbr2sGT1/jlEarW7bwelYYlLY3l96DCtpzMD7aO6k3B9bAVr3BJkRkb1+8L1UYPpFmV8cmcB0m1bCnezo98iog9K71ktAaW7EJuK7r4d7PLnwatpMYXVzpZC7Ynoe95O05mtcUu0VK8ck3aMcwzTjnEWvrrrSzxXtKq2MLFmEbbi7tnBkjmOkpwmOQynNfPVtanRchLDmGXsWbDGLdBypggrMq6PGncQpdGlJcr2C8QY1QrUEYKzZrXEmbEfNnQYYJRhCdq1qdFy1g8byK6PRbHGLRBdf3+TcO1r8BJ5rnCjS2s93+ipzE61QE7OfFyrWhdXUl5R7jCMMiw1s6Tv2pRoOU2OAFrXx6JY48KwwhLR28WYaFhOBGYVLL2MJnj558XbtXFQjHuKCL50/QIbqWtWy4s7VTN52c//OAEbnHcTrk0N/rBFRbye62MxrHFhohqTqkpyFM7CLn7uLEwRWrL4WhYkaqrFqLkQm7VozDLzMGWCnztOg0O5NiWuJ6Jiw9v1sRjWuCAM01GNyejjVK2hw6QzKlumB4TRzKFaudZhEOfaxF96d98OHnJ+tzB0mDHLzEydo9pq1UxrXAh2aaN6gnB91OAFNDlL7jCMLi0vsi0LEhGV9jdwmJQmsFaRKu7u3UF9t3yUST9/nOZmwrWpQb5TRG8Vrv0iWONCsJcSVcumYiK9bKYXT35Z6QgHd32J6HEaLartb5C/vlb9kXD37CA4M/+ZJ8dhg5Ovrk0NigZGRQET18fsWOMCULM3Kv7quj5qsPzLFCI5C/CL46AgCl64No6WE7RaRPkl93mw5oqZiJ+tu+8hOAw/a2LDcocBRh6eAdeuBqEwUW3ldGZrXIBoum4ttKQEUxucg/cUHIWvOA+/tBZngegZjWPEVM99JrxcrFXE+rl7HoLDAA7G7yMPSSIcaUz5qpZ0Zk6Ic33MijXOTMspwmPOiOfEX35BOAuOwrTsruKawl1fAkdbUrVyrdRwXrMiNauTwwBn7VBqF6dJUzLeJccUSIzG8aExOTlNWOPMUCwioj8Rrn0NTgXjFwLsBbBK1nJSWCJ6buYUvUM8SLjPB6aPa1ZLPbME+S68X/C74Q8ZLFk1k2MSXfvZsMYZ4cyVqAhydH3U4C8XuRl8LR1gGtncukAgNkuXAoeB0oIGU0umPwnXx65Am86jpFBGqR41eTI4yxPFmNpvLUc1LrrMbI0z0RLlOybMgY1InKUUecyUjKka4jg6d02CbEmCCZcER0m4e0jgOOD62CWbRpiniHeJ0s+akYUNTpxmzAJAtGomMxrXfhascSaYYkXVGnPEyyAOU5p+MTVjfT5pq2v1R8jwHewlopR9SYwdo0zr1Jl8qKiIJXR9TMYaZ6BlGflbheujBoWynZ3RplRmll1o16YznZcJJ04/I6ByeD3pDy25N4nniKjGpIRsxBpn4FIR0d8K174VplQM9ZtECIdr3xlPJI+Fd8zW4iWOpZMON2KNE2lZRh5zBNyQllOLxxQA7NTJp741cUDsHPXFWpb/53i+roQ1TiSqqQUN2CFno7NVLenJnTpj9q4483Jq+ddo/e3Wowo3Yo0TaNlLYHPL9bEJAik5smGsKMS9uqrwewgBlVN0nmg9FjFB6ayoKITi+hiFNY6kZfNvTFE2HnKikedQy6nCHQ/VL6eKZejWYoqJlnAilsVdH81Y40j+QkT0NuHa1+AM9znivHgR7M4yD9RqY1ocTTev6bWCMzXd55RoCScihdr10Yw1jqClemWt2v0QUpTJvJwqjqVo+dxOG4w2c5y6xnkwLbkzjxNRjQntOQVrHAGjRkT8JXHthxDZyw9vDlHRxH0GUzzC+QneBAIDO2UIT4FSDWmWfOfKVCX2LFIWlt9hVC8Sro8mrLGRB4qobilcHwnKjPLDmkOEe5cC/YiKJvyfoTpBGE0O99HC3O3nZtPnDf99CJHHCRynVBKWpVwezqlixCJiw31GDhvfUU1eZrbGBljpiopYI9dHgnBwcuCn6mJBVRb3GRTSfrAgZBwnwWk6MVLqN+A0HEFeOwUOp6JM1lTxbrzpQY++344p23UlrLGBZ4mISPst5aeQC14KrWjRP4vSEiIjDb9AHAVwGvdQdMrkDgM4zPmClAU3c2BRAMhTmkNPFfzBG34OsNVAJHhEnNfj+ghhjUGiZ3tQa9i15yAfTsCaQxTtKzkk4d5EA7AkTeZfAltnPOS5QJrSUR2mVDSDWsukac8hHNUtExObRgpCRKOXma0xyKbqjdy8C7Dj1F1yI+YQ+eOu8DXVL5mW8YsldQByZ+kOM538/QfYtIaa47Dq2VIOtiRmE6QKuM8gioBogppIC3FtN2KNAZjelESlkdIxeOcIyuf8n5giNq2on+w+A4hmxmGAw2CBZcUcomg748EpHDywfHW/lwROFZ1C1YTzld6jSP+olWoaVTXTGgO4lNHXC8q0uutZlSKcBUdJjBEliSIrJ46rDnDXdLYHiXSM9HOINIJSugCb3k7k7Ljrq1hjgfQSxxLj/4pcvPidJoZtKBM619HbDPtM54af0dlvqOzzTDGHSEzjORw+i8SsURxyqOYjBq2xAM6CA+AsyWFwBmxUCsmv5YZxojn0DDHmmPHOfkHS4RxFFIlkLh3HOAzcrZXytVhjARyGDSmcha+c/5GX1knXcbPR8OuaXiUIucnvoXP4UFf5MjFVHIRV2ignbi3t+bEA5a6xWGMBTn3CWfiK8+TOAowCJGhNFZtQtXJEncOHY0nmikyvpRGk1drw1MwaDbw7cOinW1kYG0OULwCkRYBaOEvn+DhDPFtMFZVk2Hx1n0Fuzf1FqBCLNRquZmzArmm0yNpQubOwFL141cLO3sKeyyvFVLF3eBfhPsMtWp2CNQagFOvUPAgcpbYU3ekMYRVsDrHhXQqzqWKNFZiSpYJtUzWmSn+nw6ZopELQJrGwQOZvqWSXxRoNVF0nXmsOpaVo9zmdThSiOIhMnyrK8oYPC7bGAZTGmSM9mPMIS0dRE75N5f0WqNuc466Zk21/3rHDQlKCo+ddzCAQoU5s2VSx87/xEGJrPIGsx5eKqaJuVaneLjFeTxJdXRExyyGwdvgcEX08R1EOdKEoHpVijSfMMaqwFM2Huxvgr0ZXV6vYcCSlfPg8AS/y5M1MFU7j+i86DOHbU/Q0wRq663uuSICu41Ztis/ScfTUu5JslMApBsEL/lgxDyydz1ErFN7VNVa1RaQpae+2YMspBsFw1CreU0pV+G8gSODq6lpSpZ38KYVVTnn3vtI3giJ3rSLsvhSrQ9X2rq5tqbaTPybWkf3GK/VzpW/EK0RUVJEsnQxMJADF87q6diEilak54Z7NM0VLlAoDwhXt846iefaXiLNE3jaBozD36+pagy4SJcehOAsZvBFdkQ6fd4DDMGQlGEFy+HDKE+VtcnAWPBuH4SvLezmsnB0TTx/grunMByFbOTyvTNFqTkMVTzZGSSobPu+UEEuwePDuNsMOOp1OBWvsdDqOy6/y/3y76w5ykkreAAAAAElFTkSuQmCC"
    icon_multihack = "data:image/png;base64,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"
    icon_pc = "data:image/png;base64,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"
    icon_portalshield = "data:image/png;base64,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"
    icon_turrent = "data:image/png;base64,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"
    icon_ultralinkamp = "data:image/png;base64,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"
    icon_virus = "data:image/png;base64,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"
    icon_google = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUykVYAQgcAAADmTT7uSTn///9V/5z//wAcUDAskFIyklfQV03mSz3aUkbbT0PaTUDZT0JHlGNVonNJnmxRoHM9mGY5mGZQi2AA/7XPV0jgTkHjTUHfSz7YTEA+rGg2qmM1qWQrpmAup2QqpWQmpGMhpGO8XUjnS0DJRzzJRDnaSDw9l2A0qWJnvoshpmTOU0TnT0JmIyDiTD7aRztOmm0no1pCsHKOzapRtYAeol0kpGMeo2G8W0fJRzygNi/JRDnYRzs9lWMopV6QzavjTUDeTD/WRDgtj1kqpWJ7xZ3aTD/WVUmxjIkAdi03qm4aoVvcTD3GnpqT+/8gilQiomBrv5XeOiq/ycqniocciVMeoWAhpGHdPzHAyMmli4kXh1AboGAToGLWY1nBw8OinZwQhlIfoV8ppV/Sk43CwsKgn547kUsQnV/V003m5ui/v7+oqKgAcFkno1z/5Tj/+vTDw8OOjo4piUvZ0knYzmPR3fHm5+mjoqH/3TpIk+Y0ivk5gvJLjPHz8e3bTUHdTkHbSj2gNzDfSj1JsnOVz645rG0lpWEsnmCgODGfNi6e07TnTEDfSz5XuIFwwZUjpGAlpWMmo2ELp2Rxe1LqRj/dT0LbRzo6rW602sY0q24io18XoWMrp1/R0U3oZT3ZRT/cRzmr2MFpv5Nsv5MJnFktp2HW0k7/6z/ttVLZRULcRzprv5RQtX8ZomUppl/W1E//4Dzz2FrV287Xd3HSc2oUn1sQn2AopV7X1E//4zv75GLr5+DT3OPTsKvIpqMipGIqpmDW00//5jvTzWLP3ej++vnp7OvUzMzEvbwToGLV007/5jrb0WFHk+pFlPrV4e79+fPp6evBwMAnpV7/5Tna0GFJlOk5jvo6jPFIk/TU4PD9+fPGxsbR0Uza0GBJlOk3jPpAj/FAj/Q4iPNKkPPU4PDm5+n/5DpIlOo2jPpAj/I9jfQ+jPNDjPQ6hvRKj/T8+fTh0FlAju89i/I+i/E/ifE/iPJDivLX4O////9g+Nd6AAAAg3RSTlMAAAAAAAAAAAECAAABYeXnYAQSEhISEhUGYP7+/2Kp+u3v7+/v7vn+/fzeE+n+//3+///5E+f9/v7+/v7////+4BPp/v/9fBPp/v7uGxTq/v7pFBPp/v7qFBTp/v7pFBTp/v7pFBPp/v7pFBPp/v7pFBPo/v7oFBPp/v7pE7X9///9tAGt88sAAAABYktHRAX4b+nHAAAAB3RJTUUH4wYYDwEZMMWX4AAAARtJREFUGNMBEAHv/gAICQAKAQICCwwDDQ6DDxAEAAUREhMUFRYXGBmEGhschR0ABh4fICEiIyQlJicohimHKgArLIgtiYqLLowvMI0xjjIzADQ1jzY3ODk6OzyQPT4/kUAAQUKSQ5OUlZaXmJmaREWbRgBHSJxJnZ6foKGio6RKpUtMAE1Opk+nqKmqq6ytrlCvUVIAU1SwVbGys7S1tre4VrlXWABZWrpbu7y9vr/AwcJcw11eAF9gxGHFxsfIycrLzGLNY2QAZWbOZ8/Q0dLT1NXWaNdpagBrbNht2drb3N3e3+Bu4W9wAHFy4nPj5OXm5+jp6nTrdXYAd3jsee3u7/Dx8vP0evV7fAAHffZ+f/f4+fr7/ICB/YIFcmJ9i73LPQkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDYtMjRUMTU6MDE6MjUtMDc6MDB9sgB5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA2LTI0VDE1OjAxOjI1LTA3OjAwDO+4xQAAAABJRU5ErkJggg=="

    plain_to_icon = {
        1: icon_dr,
        2: icon_pc,
        3: icon_destr,
        4: icon_lc,
        40: icon_lc_r,
        5: icon_fc,
        6: icon_ld,
        60: icon_ld,
        7: icon_df,
        8: icon_fracker,
        9: icon_beacon,
        13: icon_virus,
        14: icon_beacon,
        16: icon_beacon,
        17: icon_beacon
    }

    plain_icon_style = {
        1: 'height="20" width="20"',
        2: 'height="20" width="20"',
        3: 'height="20" width="20"',
        4: 'height="7" width="26"',
        40: 'height="7" width="26"',
        5: 'height="20" width="20"',
        6: 'height="7" width="26"',
        60: 'height="7" width="26"',
        7: 'height="20" width="20"',
        8: 'height="20" width="20"',
        9: 'height="20" width="20"',
        13: 'height="20" width="20"',
        14: 'height="20" width="20"',
        16: 'height="20" width="20"',
        17: 'height="20" width="20"'
    }

    plains_history = {
        1: ' deployed a Resonator',
        2: ' captured portal',
        3: ' destroyed a Resonator',
        4: ' linked to ',
        5: ' created a Control Field',
        6: ' destroyed the Link to ',
        7: ' destroyed a Control Field',
        8: ' deployed a Portal Fracker',
        9: ' deployed a Beacon',
        11: ' upgraded resonator detected',
        12: ' portal lvl up detected',
        13: ' applied <span style="color: red">Virus</span>',
        14: ' deployed fireworks',
        15: ' detected installed Mod ',
        16: ' deployed a Battle Beacon ',
        17: ' won a Battle Beacon ',
        40: ' got link from ',
        60: ' destroyed the Link from ',
    };

    mod_types_image = {
        1: icon_portalshield,
        2: icon_portalshield,
        3: icon_portalshield,
        4: icon_portalshield,
        5: icon_multihack,
        6: icon_multihack,
        7: icon_multihack,
        8: icon_heatsync,
        9: icon_heatsync,
        10: icon_heatsync,
        11: icon_turrent,
        12: icon_itoenplus,
        13: icon_itoenminus,
        14: icon_forceamp,
        15: icon_ultralinkamp,
        16: icon_linkamp,
        17: icon_linkamp,
        'S': icon_portalshield,
        'MH': icon_multihack,
        'HS': icon_heatsync,
        'T': icon_turrent,
        'ITO+': icon_itoenplus,
        'ITO-': icon_itoenminus,
        'FA': icon_forceamp,
        'SBU': icon_ultralinkamp,
        'LA': icon_linkamp,
        'AES': icon_portalshield
    };

    mod_types = {
        1: 'Portal Shield',
        2: 'Portal Shield',
        3: 'Portal Shield',
        4: 'Aegis Shield',
        5: 'Multi-hack',
        6: 'Multi-hack',
        7: 'Multi-hack',
        8: 'Heat Sink',
        9: 'Heat Sink',
        10: 'Heat Sink',
        11: 'Turret',
        12: 'Ito En Transmuter (+)',
        13: 'Ito En Transmuter (-)',
        14: 'Force Amp',
        15: 'SoftBank Ultra Link',
        16: 'Link Amp',
        17: 'Link Amp',
    };

    mod_color = {
        1: '#8cffbf',
        2: '#73a8ff',
        3: '#b08cff',
        4: '#b08cff',
        5: '#8cffbf',
        6: '#73a8ff',
        7: '#b08cff',
        8: '#8cffbf',
        9: '#73a8ff',
        10: '#b08cff',
        11: '#73a8ff',
        12: '#b08cff',
        13: '#b08cff',
        14: '#73a8ff',
        15: '#b08cff',
        16: '#73a8ff',
        17: '#b08cff',
    };

    mod_types_less = {
        1: 'CPS',
        2: 'RPS',
        3: 'VRPS',
        4: 'AS',
        5: 'CMH',
        6: 'RMH',
        7: 'VRMH',
        8: 'CHS',
        9: 'RHS',
        10: 'VRHS',
        11: 'T',
        12: 'IET(+)',
        13: 'IET(-)',
        14: 'FA',
        15: 'SUL',
        16: 'LA',
        17: 'VRLA',
    };

    plugin.xgress.COLORS_MOD = {
        1: '#8cffbf',
        2: '#73a8ff',
        3: '#b08cff',
        4: '#b08cff',
        5: '#8cffbf',
        6: '#73a8ff',
        7: '#b08cff',
        8: '#8cffbf',
        9: '#73a8ff',
        10: '#b08cff',
        11: '#73a8ff',
        12: '#b08cff',
        13: '#b08cff',
        14: '#73a8ff',
        15: '#b08cff',
        16: '#73a8ff',
        17: '#b08cff',
    };

    plugin.xgress.COLORS_TEAM = {3: '#FF6600', 2: '#0088FF', 1: '#03DC03'};

    plugin.xgress.mod_parser_less = function (mods) {
        var mod = ''
        for (var i in mods) {
            if (mods[i]) {
                mod += '| <span title="Installed by ' + mods[i].agent + '"style="color: ' + plugin.xgress.COLORS_MOD[mods[i].mod_type] + ';">' + mod_types_less[mods[i].mod_type] + '</span>';
            }
        }
        return mod
    }

    plains_usage = {
        1: '+Resonator',
        2: 'Capture',
        3: '-Resonator',
        4: '+Link',
        5: '+Field',
        6: '-Link',
        7: '-Field',
        8: 'Fracker',
        9: 'Beacon',
        13: 'Virus',
        14: 'Fireworks',
        15: 'Mod',
        16: '+BattleBeacon',
        17: 'BattleWon'
    }

    TEAM_COLOR = {
        2: '#0088FF',
        1: '#03DC03',
        3: 'darkorange',
        'RESISTANCE': '#0088FF',
        'ALIENS': '#03DC03',
        'NEUTRAL': 'darkorange'
    }
    // time convertor
    unixTimeDiffDays = function (date) {
        if (!date) return '';
        if (typeof date == 'object') {
            date = date.$date;
        };
        if (date == -1) return ''
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    getGoogleUrl = function (late6, lnge6) {
        var urlG = 'https://maps.google.com/maps/dir//' + late6 / 1E6 + ',' + lnge6 / 1E6;
        return urlG;
    }

    plugin.xgress.unixTimeDeltaDays = function(time) {
        if (!time) return '';
        if (typeof time == 'object') {
            time = time.$date;
        };
        if (time === 0) return '';
        if (!time) return '(?)';
        if (time < 0) return '(?)';
        var diff = Math.floor(time / 86400000);
        return ' (±' + diff + ') ';
    }

    getShortUrl = function (short) {
        if (!short) return
        if (short.$oid) {
            short = short.$oid;
        }
        var urlG = 'https://xgress.com/p/' + short;
        return urlG;
    }

    portalUsage = function (usage) {
        if (!usage) return '';
        if (usage.timestamp > 1500046250000) {
            return ' (' + plains_usage[usage.plain] + ') ' + unixTimeDiffDays(usage.timestamp)
        };
        return ''
    }

    // Xgress Panel
    plugin.xgress.setupXgressSidebarToggle = function () {
        $('#xgress_select').on('click', function () {
            plugin.xgress.panel_tab = 0;
            plugin.xgress.rerenderMenu();
        });
    }

    plugin.xgress.setTab = function (newTab) {
        plugin.xgress.panel_tab = newTab;
        plugin.xgress.rerenderMenu();

        if (plugin.xgress.panel_tab === 2) {
            plugin.xgress.getFarmPortals(true);
        }

        if (plugin.xgress.panel_tab === 3) {
            plugin.xgress.getApGainPortals(true);
        }
    }

    plugin.xgress.setSubTab = function (newTab) {
        plugin.xgress.panel_sub_tab = newTab;
        plugin.xgress.rerenderMenu();
    }

    plugin.xgress.rerenderMenu = function(panel) {
        var html = '';

        
        element = document.querySelectorAll('[aria-describedby="dialog-plugin-xg-panel"]')
        if (element[0]) {
            style = window.getComputedStyle(element[0]);
            localStorage['xg-dialog-position'] = JSON.stringify({my: 'left top', at: 'left+' + style.left.slice(0, -2) + ' top+' + style.top.slice(0, -2)});
        }
        

        if (panel) {
            plugin.xgress.panel_tab = panel;
        }

        var xgress_panel_opened = false;

        for (var i in window.DIALOGS) {
            if (i == 'plugin-xg-panel') {
                xgress_panel_opened = true;
            }
        }

        if (!xgress_panel_opened) {
            plugin.xgress.xgressPanel();
        }

        if (plugin.xgress.panel_tab === 0) {
            // Agent main section
            html += `
            <div class="xgress_sub">
            <table>
                <tbody>
                    <tr>
                    <td>
                        <input placeholder="Agent name" id="agent_name" type="text"  maxlength="20"/>
                    </td>
                    <td class="menu-list-item">
                        <a onclick="plugin.xgress.searchAgentPortals()" tabindex="0">Search</a>
                    </td>
                    <td class="menu-list-item">
                        <a onclick="plugin.xgress.getAgentHistory()" tabindex="0">History</a>
                    </td>
                    <td class="menu-list-item">
                        <a onclick="plugin.xgress.getAgentChat()" tabindex="0">Chat</a>
                    </td>
                    <td class="menu-list-item">
                        <a onclick="plugin.xgress.getUniqPortals()" tabindex="0">Uniqs</a>
                    </td>
                    </tr>
                </tbody>
            </table>
            </div>
            `
            if (plugin.xgress.panel_sub_tab === 0) {
                // agent portals
                html += `
                <!-- START agent captured portals -->
                <p id='agent_portals_total' style="font-size: 10px;"></p>
    
                <div id="agent_portals"></div>
                <!-- END agent captured portals -->
        
                <!-- START agent owned portals -->
                <p id='agent_own_total' style="font-size: 10px;"></p>
                <div id="agent_own"></div>
                
                <!-- END agent owned portals -->
                `
            } else if (plugin.xgress.panel_sub_tab === 1) {
                // agent history
                html += `
                <!-- START agent history -->
                <p style="font-size: 10px;" id="agent_history_total"></p>
                <div class="menu-list-item">
                    <a onclick="plugin.xgress.drawAgentHistory()">Map</a>
                </div>
                <div id="chat_xgress">
                    <div id="agent_history"></div>
                </div>
                <!-- END agent history -->
                `
            } else if (plugin.xgress.panel_sub_tab === 2) {
                // agent chat
                html += `
                <!-- START agent chat -->
                <div id="agent_chat"></div>
                <!-- END agent chat -->
                `
            } else if (plugin.xgress.panel_sub_tab === 3) {
                // agent discovers
            }
            
        } else if (plugin.xgress.panel_tab === 1) {
            html += `
                <div ng-if="isSet(2)" class="xgress_sub">
                    <table>
                        <tbody>
                            <tr>
                            <td>
                                <input placeholder="Portal name or guid" id="portalname" type="text" maxlength="200"/>
                            </td>
                            <td class="menu-list-item">
                                <a onclick="plugin.xgress.searchPortal(true)" tabindex="0">Search</a>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- START portal search -->
                <div ng-if="portal.PortalSearchData">
                    <div id="search_portal_total"></div>
                    <div id="search_portal"></div>
            `;
                    if (plugin.xgress.sid) {
                        html += `
                        <div class="menu-list-item">
                            <a onclick="plugin.xgress.searchPortal()">Load more</a>
                        </div>`
                    }
            html += `
                </div>    
                <!-- END portal search -->
                `
        } else if (plugin.xgress.panel_tab === 2) {
            html += `
            <!-- START Tab 2 Farm -->
            <div class="xgress_sub">

            <div id="farm_portals"></div>
            
          </div>
          <!-- END Tab 2 Farm -->
            `
        } else if (plugin.xgress.panel_tab === 3) {
            html += `
            <!-- START Tab 3 Farm -->
            <div class="xgress_sub">

            <div id="ap_gain_portals"></div>
            
          </div>
          <!-- END Tab 3 Farm -->
            `
        } else if (plugin.xgress.panel_tab === 4) {
            html += `<!-- START Tab 4 Settings -->
            <div class="xgress_sub">
              <div class="main_search_area wrap">
                  <h4>Farm settings</h4>
                  
                  <div id="plugin_settings"></div>

                  <hr>
                  <div class="menu-list-item">
                      <a class="btn_main" href onclick="plugin.xgress.saveSettings()">Save && Reload</a>
                  </div>
      
                  <hr>
                  <section class="main_settings_profile wrap mar_ff">
                      <h4>Activate Plugin</h4>
                      
                      <form>
                          <label class="h4_white" for="tele_account">Token:</label>
                          <input type="text" name="activate_token" id="activate_token" placeholder="Insert activation token">
                          <button onclick="plugin.xgress.activatePlugin();" type="button"><p class="btn">Activate</p></button>
                      </form>
                  </section>
                  
                  <section class="main_settings_profile wrap mar_ff">
                      <h4>Profile Settings</h4>
                      <p>Pro Access: <span class="gold_span">` + plugin.xgress.user.pro_access + `</span></p>
                      <p>Account Email: <span class="gold_span">` + (plugin.xgress.user.email ? plugin.xgress.user.email : 'Unlinked account') + `</span></p>`
                      + (plugin.xgress.user.expired?'<p>Expires: <span class="gold_span">' 
                            + plugin.xgress.unixTimeToString(plugin.xgress.user.expired) + '</span></p>':'')
                      + (plugin.xgress.user.telegram_name? '<p>Telegram: ' + plugin.xgress.user.telegram_name 
                            + ' (ID: ' + plugin.xgress.user.telegram_id + ')</p>':'') +
                  `</section>
              </div>
            </div>
            <!-- END Tab 4 -->`
        } else if (plugin.xgress.panel_tab === 5) {
            html += `
            <div class="xgress_sub">
                <div id="other_info"></div>
            </div>
            `
        }

        elm = document.getElementById('main_menu_xgress');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(html);

        if (plugin.xgress.agentName) {
            $('#agent_name').val(plugin.xgress.agentName);
        }
    }

    plugin.xgress.xgressPanel = function() {
        var dialog_position;

        if (localStorage['xg-dialog-position']) {
            dialog_position = jQuery.parseJSON(localStorage['xg-dialog-position']);
        }
        
        var main_menu = '<div>';

        if (!plugin.xgress.user.pro_access) {
            main_menu += "<p>You are using free version of the service and can't see full information. You can buy Pro version <a href='https://xgress.com/' target='_blank'>Here</a></p>"
        }
        main_menu += `
            <nav>
            <ul class="menu-list">
                <li onclick="plugin.xgress.setTab(0)" class="menu-list-item">
                <a href="#">Agent</a>
                </li>
                <li onclick="plugin.xgress.setTab(1)" class="menu-list-item">
                <a>Portal</a>
                </li>
                <li onclick="plugin.xgress.setTab(2);" class="menu-list-item">
                <a>Farm</a>
                </li>
                <li onclick="plugin.xgress.setTab(3);" class="menu-list-item">
                <a>Top AP</a>
                </li>
                <li onclick="plugin.xgress.setTab(4); plugin.xgress.renderSettingsPanel()" class="menu-list-item">
                <a>Settings</a>
                </li>
                <li class="menu-list-item">
                <a href="https://xgress.com/#/missions" target="_blank">Missions</a>
                </li>
            </ul>
            </nav>
            </div>
            <div id="main_menu_xgress" class="xgress_sub"></div>
        `;

        if (window.isSmartphone()) {
            $('#xgressPlugin').remove();
            window.show('plugin-xg-panel');
            $('<div id="scrollwrapper"><div id="sidebar"><div id="xgressPlugin" class="mobile">'+ main_menu +'</div></div></div>').appendTo(document.body);
        } else {
          dialog({
            html: main_menu,
            id: 'plugin-xg-panel',
            width: 'auto',
            title: '[XG] Panel',
            position: dialog_position
          });
        }
    }

    plugin.xgress.startAjax = function() {
        $('.cssload-container').css('visibility', 'visible');
        $('.cssload-container').css('display', 'block');
    }
    plugin.xgress.stopAjax = function() {
        $('.cssload-container').css('visibility', 'hidden');
        $('.cssload-container').css('display', 'none');
    }

    plugin.xgress.distance = function(portal) {
        var latlngCenter = window.map.getCenter();
        lat2 = latlngCenter.lat;
        lon2 = latlngCenter.lng;
        lat1 = portal.late6/1E6;
        lon1 = portal.lnge6/1E6;

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = (dist * 1.609344).toFixed(1);
            return dist;
        }
    }

    plugin.xgress.calculate_speed_distance = function(p1, p2) {
        function rad(x) {
            return x * Math.PI / 180;
        };

        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.late6/1E6 - p1.late6/1E6);
        var dLong = rad(p2.lnge6/1E6 - p1.lnge6/1E6);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.late6/1E6)) * Math.cos(rad(p2.late6/1E6)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c / 1000;
        d = d.toFixed(3);
        return d; // returns the distance in km

    };

    plugin.xgress.getUrl = function(late6, lnge6) {
        var url = 'https://intel.ingress.com/?ll=' + late6 / 1E6 + ',' + lnge6 / 1E6 + '&z=15&pll=' + late6 / 1E6 + ',' + lnge6 / 1E6;
        return url;
    };

    plugin.xgress.unixTimeToString = function(time, full) {
        if (!time) return '';
        if (typeof time == 'object') {
            time = time.$date;
        };
        if(!time) return null;
        var d = new Date(typeof time === 'string' ? parseInt(time) : time);
        var time = d.toLocaleTimeString();
        var date = d.getFullYear()+'-'+zeroPad(d.getMonth()+1,2)+'-'+zeroPad(d.getDate(),2);
        if(typeof full !== 'undefined' && full) return date + ' ' + time;
        if(d.toDateString() == new Date().toDateString())
          return time;
        else
          return date;
    }

    plugin.xgress.ago = function(date) {
        if (!date) return '';
        if (typeof date == 'object') {
            date = date.$date;
        };
        if (date == -1) return 'was neutral'
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

    plugin.xgress.clearPlayerLabels = function() {
        for (var i in plugin.xgress.labelPlayerLayers) {
            var previousLayer = plugin.xgress.labelPlayerLayers[i];
            if(previousLayer) {
                delete plugin.xgress.labelPlayerLayers[i];
                plugin.xgress.playerportals.removeLayer(previousLayer);
            }
        }
    }

    plugin.xgress.getBothChat = function(offset) {

        if (plugin.xgress.CHAT_REQUEST_OFFSET % 300 != 0) return;
        plugin.xgress.startAjax();

        if (offset) {
            offset = plugin.xgress.CHAT_REQUEST_OFFSET;
        } else {
            offset = 0;
        }

        var latlngCenter = window.map.getCenter();

        var zoom = window.map.getZoom();
        var portalPoints = {};
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "chat",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    plugin: true,
                    zoom: zoom,
                    offset: offset
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error) {
                    toastr.error(response.error);
                }
                else if (response.error_access) {
                    toastr.error(response.error_access);
                } else if (response.result.chat.error) {
                    toastr.error(response.result.chat.error);
                } else {

                    var details = response.result.chat;
                    plugin.xgress.CHAT_REQUEST_OFFSET += details.length;
                    plugin.xgress.renderBothChat(details);
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );

    }

    plugin.xgress.renderBothChat = function(data) {
      var elm = $('#chatboth');

      var msgs = '';
      var prevTime = null;

      var likelyWereOldMsgs = data[0].timestamp.$date;

      for(var i = data.length; i--;) {
        msg = data[i];
        var nextTime = new Date(msg.timestamp.$date).toLocaleDateString();
        if(prevTime && prevTime !== nextTime)
          msgs += chat.renderDivider(nextTime);
          m = plugin.xgress.renderMsg(msg);
        msgs += m;
        prevTime = nextTime;
      };

      var scrollBefore = scrollBottom(elm);
      elm.prepend('<table>' + msgs + '</table>' );
      window.chat.keepScrollPosition(elm, scrollBefore, likelyWereOldMsgs);
    }


    plugin.xgress.renderDivider = function(text) {
      var d = ' ──────────────────────────────────────────────────────────────────────────';
      return '<tr><td colspan="3" style="padding-top:3px"><summary>─ ' + text + d + '</summary></td></tr>';
    }

    plugin.xgress.renderMsg = function(m) {
      msg = m.msg;
      nick = m.player;
      time = m.timestamp.$date;
      team = m.team === 1 ? 2 : 1;
      at_player = m.at_player;

      var ta = unixTimeToHHmm(time);
      var tb = unixTimeToDateTimeString(time, true);
      //add <small> tags around the milliseconds
      tb = (tb.slice(0,19)+'<small class="milliseconds">'+tb.slice(19)+'</small>').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

      // help cursor via “#chat time”
      var t = '<time title="'+tb+'" data-timestamp="'+time+'">'+ta+'</time>';


      if (m.type_msg == 2) {
        msg = msg.replace("[secure]", '');
        msg = '<span style="color: #f88; background-color: #500;">[faction]</span> ' + msg;
      } else {
        msg = msg.replace("[secure]", '');
      }

      if (nick) {
        msg = msg.replace(nick + ':', '')
      }

      if (at_player) {

        for (var atp in at_player) {

            z = at_player[atp];

            var thisToPlayer = (z.agent == (window.PLAYER.nickname));
            var spanClass = thisToPlayer ? "pl_nudge_me" : (z.team + " pl_nudge_player");

            k = $('<div/>').html($('<span/>')
                          .attr('class', spanClass)
                          .attr('onclick',"window.chat.nicknameClicked(event, '"+z.agent+"')")
                          .text('@' + z.agent)).html();

            msg = msg.replace('@' + z.agent, k)
        }


      }

      var color = COLORS[team];
      if (nick === window.PLAYER.nickname) color = '#fd6';
      var s = 'style="cursor:pointer; color:'+color+'"';
      var i = ['<span class="invisep">&lt;</span>', '<span class="invisep">&gt;</span>'];
      return '<tr><td>'+t+'</td><td>'+i[0]+'<mark class="nickname" ' + s + '>'+ nick+'</mark>'+i[1]+'</td><td>'+msg+'</td></tr>';
    }

    plugin.xgress.keepScrollPosition = function(box, scrollBefore, isOldMsgs) {
      // If scrolled down completely, keep it that way so new messages can
      // be seen easily. If scrolled up, only need to fix scroll position
      // when old messages are added. New messages added at the bottom don’t
      // change the view and enabling this would make the chat scroll down
      // for every added message, even if the user wants to read old stuff.

      if(box.is(':hidden') && !isOldMsgs) {
        box.data('needsScrollTop', 99999999);
        return;
      }

      if(scrollBefore === 0 || isOldMsgs) {
        box.data('ignoreNextScroll', true);
        box.scrollTop(box.scrollTop() + (scrollBottom(box)-scrollBefore));
      }
    }

    plugin.xgress.renderPortalHistory = function(data) {


        if (!data[0]) return '<div>Portal history not found</div>'
        var counts = '';

        var dia = false;

        for (var i in window.DIALOGS) {
            if (i == 'dialog-plugin-xgph-panel') {
                var dia = true;
            }
        }

        if (!dia) {
            plugin.xgress.showHistoryPanel();
        }

        if (plugin.xgress.history_offset == 300 || plugin.xgress.history_offset < 300) {
            plugin.xgress.getPortalVisits(data[0].pguid);
        }

          var msgs = '';
          var prevTime = null;

          var likelyWereOldMsgs = data[0].timestamp;

          for(var i = data.length; i--;) {
            msg = data[i];

            var nextTime = new Date(msg.timestamp).toLocaleDateString();
            if(prevTime && prevTime !== nextTime)
              msgs += plugin.xgress.renderDivider(nextTime, msg.timestamp);

            m = plugin.xgress.renderPortalHistoryMsg(msg);
            msgs += m;
            prevTime = nextTime;
          };


        counts += '<div>' + msgs + '</div>';

        var elm = $('#xgressPluginAgent');

        var scrollBefore = scrollBottom(elm);
        $('#xgressPluginAgent').prepend(counts);
        plugin.xgress.keepScrollPosition(elm, scrollBefore, likelyWereOldMsgs);

          if(elm.data('needsScrollTop')) {
            elm.data('ignoreNextScroll', true);
            elm.scrollTop(elm.data('needsScrollTop'));
            elm.data('needsScrollTop', null);
          }

         $('#xgressPluginAgent').scroll(function() {
            var t = $(this);
            if(t.data('ignoreNextScroll')) return t.data('ignoreNextScroll', false);

            if(t.scrollTop() < plugin.xgress.CHAT_REQUEST_SCROLL_TOP) plugin.xgress.getPortalHistory(data[0].pguid, plugin.xgress.history_offset, 300);
          });

    }

    plugin.xgress.renderDivider = function(text, timestamp) {

      days = Math.floor(Math.floor((Date.now() - timestamp) / 1000) / 86400);
      var d = ' ─────────────────────────────────────────────────────────────────';
      return '<tr><td colspan="3" style="padding-top:3px"><summary>─ ' + text + ' (' + days + ') days ago'
                                                                                + d + '</summary></td></tr>';
    }

    plugin.xgress.renderPortalHistoryMsg = function(m) {
        nick = m.player;
        time = m.timestamp;
        team = m.team === 1 ? 2 : 1;

        if (m.fake) {
            msg = '';
        } else {
            msg = ' <a title="show player history" onclick="plugin.xgress.agentName=\'' + nick + '\' ; plugin.xgress.getAgentHistory(\'' + nick + '\')">[H]</a>';
        }

        if (m.plain != 15) {
            if (plain_icon_style[m.plain]) {
                msg += '<span><img ' + plain_icon_style[m.plain] + ' src="' + plain_to_icon[m.plain] + '"></span>';
            }

            msg += plains_history[m.plain];

            if (m.plain == 2 && m.additional_info) {
                msg += '<span style="color: red"> [missed data]</span> '
            }

            if (m.plain == 4 || m.plain == 6 || m.plain == 40 || m.plain == 60) {
                if (m.fake) {
                    msg += '<a title="' + m.additional_info.address + '">' + m.additional_info.plain + '</a>';
                } else {
                    msg += '<a title="' + m.additional_info.address + '" onclick="plugin.xgress.getPortalDaysLatLng(' + m.additional_info.latE6 + ',' + m.additional_info.lngE6 + ')">' + m.additional_info.plain + '</a>';
                }
            }

            if (m.plain == 5) {
                if (m.additional_info.sign) {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '">+' + m.additional_info.MUs + 'MUs</span>';
                } else {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '">+' + m.additional_info + 'MUs</span>';
                }
            }

            if (m.plain == 7) {
                if (m.additional_info.sign) {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '">-' + m.additional_info.MUs + 'MUs</span>';
                } else {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '">-' + m.additional_info + 'MUs</span>';
                }
            }

            if (m.plain == 11) {
                if (m.additional_info.lvl) {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '"> to L' + m.additional_info.lvl + ' (was L'+ m.additional_info.previous_lvl + ' by ' + m.additional_info.previous_agent + ')</span>';
                }
            }

            if (m.plain == 12) {
                if (m.additional_info.lvl) {
                    msg += ' <span class="' + (m.team === 2 ? 'res' : 'enl') + '"> to L' + m.additional_info.lvl + '</span>';
                }
            }
        }

        if (m.plain == 15) {
            if (m.additional_info.mod_type) {
                msg += ' <span style="color: ' + mod_color[m.additional_info.mod_type] + '">';
                msg += '<img height="20" width="20" src="' + mod_types_image[m.additional_info.mod_type] + '"></img>';
                msg += mod_types[m.additional_info.mod_type] + '</span> slot ' + m.additional_info.slot;
            } else {
                msg += ' <span style="color: ' + mod_color[m.additional_info.mod_type] + '">';
                msg += '<img height="20" width="20" src="' + mod_types_image[m.additional_info.mod_type] + '"></img>';
                msg += mod_types[m.additional_info.mod_type] + '</span> slot ' + m.additional_info.slot;
            }
        }


      var ta = unixTimeToHHmm(time);
      var tb = unixTimeToDateTimeString(time, true);
      //add <small> tags around the milliseconds
      tb = (tb.slice(0,19)+'<small class="milliseconds">'+tb.slice(19)+'</small>').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

      // help cursor via “#chat time”
      var t = '<time title="'+tb+'" data-timestamp="'+time+'">'+ta+'</time>';

      var color = COLORS[team];
      if (nick === window.PLAYER.nickname) color = '#fd6';
      var s = 'style="cursor:pointer; color:'+color+'"';
      var i = ['<span class="invisep">&lt;</span>', '<span class="invisep">&gt;</span>'];
      if (m.fake) {
        return '<p>'+t+' '+i[0]+'<mark class="hide_fake">'+ nick+'</mark>'+i[1]+'  '+msg+'</p>';
      } else {
        return '<p>'+t+' '+i[0]+'<mark class="nickname" ' + s + '>'+ nick+'</mark>'+i[1]+'  '+msg+'</p>';
      }
    }

    // draw on map
    plugin.xgress.clearAgentHistoryLabels = function () {
        for (var i in plugin.xgress.agentHistoryLayers) {
            var previousLayer = plugin.xgress.agentHistoryLayers[i];
            if (previousLayer) {
                delete plugin.xgress.agentHistoryLayers[i];
                plugin.xgress.agenthistory.removeLayer(previousLayer);
            }
        }
    }

    plugin.xgress.drawAgentHistory  = function()  {
        var data = plugin.xgress.agent_history;
        if (!data) return;

        if (!plugin.xgress.agenthistory) {
            plugin.xgress.agenthistory = new L.LayerGroup();
            window.addLayerGroup('[XG] Agent history', plugin.xgress.agenthistory, true);
        }
        var options = {};
        var previous = null;

        function handle_agent_history(e) {
            var current = e.target.options.current;
            var previous = e.target.options.previous;
            var distance = plugin.xgress.calculate_speed_distance(previous, current);
            var speed = distance / ((current.timestamp - previous.timestamp) / 3600000 )

            var html = 
            '<div ><table><tr>' +
                '<td>' +
                    '<time title="'+window.unixTimeToDateTimeString(previous.timestamp, true)+'" data-timestamp="'+previous.timestamp+'">'+plugin.xgress.ago(previous.timestamp)+'<br> '+window.unixTimeToDateTimeString(previous.timestamp, true)+'</time>' +
                '</td>' +
                '<td>' +
                    ' action 1: <a onclick="window.renderPortalDetails(\''+previous.pguid+'\')">'+previous.name+'</a> (' + previous.address +  ')' +
                    '<br><span style="color: white">Distance: ' + distance + 'km, Speed: ' + speed.toFixed(3) + 'km/h</span>' +
                    '<br> <a onclick="plugin.xgress.clearAgentHistoryLabels()">Clear map</a>' +
                '</td>' +
                '<td>' +
                    '<time title="'+window.unixTimeToDateTimeString(current.timestamp, true)+'" data-timestamp="'+current.timestamp+'">'+plugin.xgress.ago(current.timestamp)+'<br> '+window.unixTimeToDateTimeString(current.timestamp, true)+'</time>' +
                '</td>' +
                '<td>' +
                    'action 2:  <a onclick="window.renderPortalDetails(\''+current.pguid+'\')">'+current.name+'</a>' +
                    ' (' + current.address +  ')' +
                '</td>' +
            '</tr></table></div>';

            plugin.xgress.link_popup.setContent(html);
            plugin.xgress.link_popup.setLatLng(e.latlng);
            map.openPopup(plugin.xgress.link_popup);
        }

        for (var i in data) {
            var history = data[i];

            if (history.plain == 15 || history.plain == 40 || history.plain == 60 || history.fake == 1 || history.plain == 11 || history.plain == 12) {continue};

            if (!previous) {
                previous = history;
                continue;
            }

            if (previous.late6 == history.late6 && previous.lnge6 == history.lnge6) {
                continue;
            }

            if (previous.timestamp == history.timestamp) {
                continue;
            }

            var link_popup = $('<div class="plugin_xgress_popup">').append('<table></table>');

            options.opacity = 0.7;
            options.weight = 8;
            options.info = link_popup[0];
            options.previous = history;
            options.current = previous;
            options.color = '#000';


            var latlng1 = L.latLng(previous.late6/1E6, previous.lnge6/1E6);
            var latlng2 = L.latLng(history.late6/1E6, history.lnge6/1E6);
            var poly = L.geodesicPolyline([latlng1, latlng2], options);
            
            poly.on('click', handle_agent_history);
            plugin.xgress.agentHistoryLayers[history['_id']] = poly;
            poly.addTo(plugin.xgress.agenthistory);

            previous = history;
        }
    }

    plugin.xgress.drawAgentPortals = function(onmap) {
        var portals = plugin.xgress.agent_portals_list;

        if (!portals) {
            return
        }

        if (!plugin.xgress.playerportals) {
            plugin.xgress.playerportals = new L.LayerGroup();
            window.addLayerGroup('[XG] Agent portals', plugin.xgress.playerportals, true);
        }

        var bounds = [];
        for (var f in portals ) {
            features = portals[f]
            guid = features.pguid

            if (features.fake) {
                continue
            }

            var isTouchDev = window.isTouchDevice();
            var previousLayer = plugin.xgress.labelPlayerLayers[guid];
            var ago = plugin.xgress.ago;

            var now = new Date().getTime();
            if (!previousLayer) {
                var d = Math.floor(Math.floor((Date.now() - features.timestamp) / 1000) / 86400);
                var latLng = {
                    lat: features.late6 / 1E6,
                    lng: features.lnge6 / 1E6
                }
                // tooltip for marker - no HTML - and not shown on touchscreen devices
                var tooltip = isTouchDev ? '' : (features.player + ', Captured ' + ago(features.timestamp, now) + ' ');
                // popup for marker
                var popup = $('<div>')
                    .addClass('plugin-ingress-guard-popup');
                $('<span>')
                    .addClass('nickname ' + (features.team === 2 ? 'res' : 'enl'))
                    .css('font-weight', 'bold')
                    .text(features.player).append((features.guardian ? '<img style="height: 15px" title="Awarded ' + plugin.xgress.unixTimeToString(features.guardian[1]) + '" src="' + G_BADGE[features.guardian[0]] + '">' : ''))
                    .appendTo(popup);
                popup
                    .append('<br>')
                    .append(features.name)
                    .append('<br>')
                    .append((features.delta != 0 ? plugin.xgress.unixTimeDeltaDays(features.delta) : '') + ago(features.timestamp, now));
                plugin.xgress.markerTemplate = '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n         width="35px" height="70px" viewBox="0 0 2481 2073" enable-background="new 0 0 2481 2073" xml:space="preserve">\n<g>\n        <path fill-rule="evenodd" clip-rule="evenodd" fill="#E81E25" stroke="#000000" stroke-width="37" stroke-miterlimit="10" d="\n                M730.94,1839.629c-38.766-190.301-107.116-348.665-189.903-495.44c-61.407-108.872-132.544-209.363-198.364-314.938\n                c-21.972-35.244-40.934-72.477-62.047-109.054c-42.216-73.137-76.444-157.935-74.269-267.932\n                c2.125-107.473,33.208-193.684,78.03-264.172c73.719-115.935,197.201-210.989,362.884-235.969\n                c135.466-20.424,262.475,14.082,352.543,66.748c73.6,43.038,130.596,100.527,173.92,168.28\n                c45.22,70.716,76.359,154.26,78.971,263.232c1.337,55.83-7.805,107.532-20.684,150.418\n                c-13.034,43.409-33.996,79.695-52.646,118.454c-36.406,75.659-82.049,144.982-127.855,214.346\n                C915.083,1340.208,787.024,1550.912,730.94,1839.629z"/>\n        <path opacity="0.09" fill-rule="evenodd" clip-rule="evenodd" d="M731.379,1934.407\n                c131.604-120.864,211.314-235.977,269.138-350.49c42.892-84.942,70.542-169.166,106.953-254.061\n                c12.156-28.34,28.508-56.568,42.519-85.3c28.018-57.449,72.657-118.133,169.03-178.096c94.16-58.588,193.955-93.756,291.58-114.697\n                c160.565-34.442,344.277-37.299,502.593,15.593c129.444,43.246,204.674,113.469,233.778,178.863\n                c23.783,53.438,21.428,108.185-1.045,163.103c-23.455,57.32-69.568,116.065-161.105,177.391\n                c-46.898,31.417-98.9,56.333-146.412,74.868c-48.088,18.761-96.6,30.392-145.328,44.32\n                c-95.119,27.188-192.42,47.153-289.891,67.076C1312.866,1732.316,1025.938,1797.298,731.379,1934.407z"/>\n        <circle fill-rule="evenodd" clip-rule="evenodd" cx="729.546" cy="651.047" r="183.333"/>\n</g>\n</svg>';

                var icon = L.divIcon({
                    iconSize: new L.Point(17, 35),
                    iconAnchor: new L.Point(8, 35),
                    html: plugin.xgress.markerTemplate,
                    className: 'leaflet-iitc-custom-icon',
                })

                var label = L.marker(latLng, {
                    icon: icon,
                    desc: popup[0],
                    title: tooltip,
                    guid: features.pguid
                });
                label.addEventListener('spiderfiedclick', plugin.xgress.onClickListener);
                plugin.xgress.labelPlayerLayers[guid] = label;

                bounds.push(latLng);

                label.addTo(plugin.xgress.playerportals);

                window.registerMarkerForOMS(label);
                if (!isTouchDev) {
                    window.setupTooltips($(label._icon));
                }
            }
        }
        if (onmap) {
            window.map.fitBounds(bounds);
        }
    }

    // agent portals
    plugin.xgress.searchAgentPortals = function() {
        plugin.xgress.agentName = $('#agent_name').val();
        if (!plugin.xgress.agentName) return
        plugin.xgress.getAgentPortals(plugin.xgress.agentName);
    }

    plugin.xgress.renderAgentPortals = function(data) {
        if (!data.agent_portals[0]) {
            agent_portals = '<p>¯\_(ツ)_/¯</p>';
        } else {
            agent_portals = `
            <div class="menu-list-item">
                <a onclick="plugin.xgress.drawAgentPortals()">Show map</a>
            </div>
            <table>
                <tr>
                <th>Portal Name, Lvl, Distance</th>
                <th>Captured</th>
                <th>Date</th>
                <th>Links</th>
                <th>Last activity</th>
                </tr>
            `
            for (var portal in data.agent_portals) {
                item = data.agent_portals[portal];
                // d = Math.floor(Math.floor((Date.now() - detail.timestamp) / 1000) / 86400);
                // agent_portals += '<tr><td><a title="'+detail.address+'"onclick=\'window.renderPortalDetails("' + detail.pguid
                // + '");\'>' + detail.name.substring(0, 30) + '</a></td><td>' + d + '</td><td>'
                // + plugin.xgress.unixTimeToString(detail.timestamp, true) + '</td></tr>';
                agent_portals += `
                <tr>
                <td>
                    <a title="` + item.address + `" onclick="window.renderPortalDetails('` + item.pguid + `')"><span class="` + (item.fake ? 'hide_fake': '') + `">`
                    + item.name.substring(0, 30) +
                    `</span></a> <span>L` + item.lvl + `</span> <span style="color: #06E2DF">` + plugin.xgress.distance(item) + `km</span>
                </td>
                <td>
                    <span>` + unixTimeDiffDays(item.timestamp) + ` `
                    + plugin.xgress.unixTimeDeltaDays(item.delta) +
                    `</span>
                </td>

                <td style="font-size: 10px;">
                    <span title="Portal capture date">`
                    + plugin.xgress.unixTimeToString(item.timestamp) +
                    `</span>
                </td>
                <td>
                    <a target="_blank" href="` 
                    + getGoogleUrl(item.late6, item.lnge6) + `">[G]</a>
                    <a onclick="plugin.xgress.getPortalHistory('` + item.pguid+ `', 0, 300)">[H]</a>
                    <a target="_blank" href="` + getShortUrl(item._id) + `">[S]</a>
                    <a onclick="plugin.xgress.getPortalPhotos('` + item.pguid + `');">[P:` + (item.photo_count ? item.photo_count : 0) + `]</a>

                </td>
                <td>
                    <span  style="color: darkorange" title="Last portal activity">`
                    + portalUsage(item.usage) +
                    `</span>
                </td>
                </tr>`
            }
            agent_portals += `</table>`;
        }

        elm = document.getElementById('agent_portals');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(agent_portals);
        elm_count = document.getElementById('agent_portals_total');
        if ($(elm_count).length > 0) {
            $(elm_count).empty();
        }
        $(elm_count).append('Found ' + data.count + ' portals');
    }

    plugin.xgress.getAgentPortals = function(player, onmap) {
        plugin.xgress.startAjax();
        plugin.xgress.agentName = player;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                        player: player
                },
                request: "agent_portals",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error_access) {
                    toastr.error(response.error_access);
                    return
                }
                
                plugin.xgress.setSubTab(0);

                plugin.xgress.clearPlayerLabels();
                if (onmap) {
                    plugin.xgress.addPlayerLabel(response.result.agent_portals, onmap);
                } else {
                    plugin.xgress.agent_portals_list = response.result.agent_portals;
                    plugin.xgress.renderAgentPortals(response.result);
                }
                plugin.xgress.getAgentOwnPortals();
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    // agent own portals
    plugin.xgress.renderAgentOwnPortals = function(data) {
        if (!data.agent_own[0]) return

        agent_own = `
        <span style="color: darkorange">Associated portals:</span>
        <table>
            <tr>
            <th>Agent</th>
            <th>Portal Name (Lvl, Distance)</th>
            <th>Captured</th>
            <th>Date</th>
            <th>Links</th>
            <th>Last activity</th>
            </tr>
        `

        for (var portal in data.agent_own) {
            item = data.agent_own[portal];
    
            agent_own += `
            <td><mark class="nickname" style="cursor:pointer; color:` + TEAM_COLOR[item.team]
            + `">` + item.player + `</mark>
            </td>
            <td>
                <a title="` + item.address + `" onclick="window.renderPortalDetails('` + item.pguid + `')"><span class="` + (item.fake ? 'hide_fake': '') + `">`
                + item.name.substring(0, 30) +
                `</span></a> <span>L` + item.lvl + `</span> <span style="color: #06E2DF">` + plugin.xgress.distance(item) + `km</span>
            </td>
            <td>
                <span>` + unixTimeDiffDays(item.timestamp) + ` `
                + plugin.xgress.unixTimeDeltaDays(item.delta) +
                `</span>
            </td>

            <td style="font-size: 10px;">
                <span title="Portal capture date">`
                + plugin.xgress.unixTimeToString(item.timestamp) +
                `</span>
            </td>
            <td>
                <a target="_blank" href="` 
                + getGoogleUrl(item.late6, item.lnge6) + `">[G]</a>
                <a onclick="plugin.xgress.getPortalHistory('` + item.pguid+ `', 0, 300)">[H]</a>
                <a target="_blank" href="` + getShortUrl(item._id) + `">[S]</a>
                <a onclick="plugin.xgress.getPortalPhotos('` + item.pguid + `')">
                [P:` + (item.photo_count ? item.photo_count: 0) + `]</a>

            </td>
            <td>
                <span  style="color: darkorange" title="Last portal activity">`
                + portalUsage(item.usage) +
                `</span>
            </td>
            </tr>`
        }
        agent_own += `</table>`;

        elm = document.getElementById('agent_own');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(agent_own);
        elm_count = document.getElementById('agent_own_total');
        if ($(elm_count).length > 0) {
            $(elm_count).empty();
        }
        $(elm_count).append('Found ' + data.count + 'associated portals');
    }

    plugin.xgress.getAgentOwnPortals = function() {
        plugin.xgress.startAjax();

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                        player: plugin.xgress.agentName
                },
                request: "agent_own",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error_access) {
                    toastr.error(response.error_access);
                    return
                }
                if (!response.result.agent_own[0]) {
                    
                } else {
                    plugin.xgress.renderAgentOwnPortals(response.result);
                }
                
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    // agent history
    plugin.xgress.retrieve_agent_history_html = function(data) {
        var modified_data = [];
        $.each(data, function(ind, json) {
            var time = json.timestamp;
            var nick = json.player;
            var plain = json.plain;
            var ta = unixTimeToHHmm(time);
            var tb = unixTimeToDateTimeString(time, true);
            //add <small> tags around the milliseconds
            tb = (tb.slice(0,19)+'<small class="milliseconds">'+tb.slice(19)+'</small>').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
            
            // help cursor via “#chat time”
            var t = '<time title="'+tb+'" data-timestamp="'+time+'">'+ta+'</time>';
            var msg = '';

            if (json.fake) {
                msg += '<span class="hide_fake" title="'+json.address+'">' + json.name + '</span>';
            } else {
                msg += '<a onclick="plugin.xgress.getPortalDaysLatLng(' + json.late6 + ',' + json.lnge6 + ')" '
                + ' title="'+json.address+'" class="help ' + (json.fake ? 'hide_fake': '') + '">'
                + json.name
                + '</a>';
            }

            msg += plains_history[json.plain];

            switch(plain) {
                case 4:
                case 40:
                case 6:
                case 60:
                    if (json.fake) {
                        msg += '<a title="' + json.additional_info.address + '">' + json.additional_info.plain + '</a>';
                    } else {
                        msg += '<a title="' + json.additional_info.address + '" onclick="plugin.xgress.getPortalDaysLatLng(' + json.additional_info.latE6 + ',' + json.additional_info.lngE6 + ')">' + json.additional_info.plain + '</a>';
                    }
                    break;
                case 5:
                    var tcolor = plugin.xgress.COLORS_TEAM[json.team];
                    if (json.additional_info.sign) {
                        msg += ' <span style="color:'+tcolor+'">' + json.additional_info.sign + json.additional_info.MUs + 'MUs</span>'
                    } else {
                        msg += ' <span style="color:'+tcolor+'">+' + json.additional_info + 'MUs</span>'
                    }
                    break;
                case 7:
                    var tcolor = plugin.xgress.COLORS_TEAM[json.team];
                    if (json.additional_info.sign) {
                        msg += ' <span style="color:'+tcolor+'">' + json.additional_info.sign + json.additional_info.MUs + 'MUs</span>'
                    } else {
                        msg += ' <span style="color:'+tcolor+'">-' + json.additional_info + 'MUs</span>'
                    }
                    break;
                case 11:
                    var tcolor = plugin.xgress.COLORS_TEAM[json.team];
                    if (json.additional_info.previous_agent) {
                        msg += ' <span style="color:'+tcolor+'"> to L' + json.additional_info.lvl + ' (was L'+ json.additional_info.previous_lvl + ' by ' + json.additional_info.previous_agent + ')</span>'
                    }
                    break;
                case 12:
                    var tcolor = plugin.xgress.COLORS_TEAM[json.team];
                    if (json.additional_info.lvl) {
                        msg += ' <span style="color:'+tcolor+'"> to L' + json.additional_info.lvl + '</span>'
                    }
                    break;
                case 15:
                    if (json.additional_info.mod_type.mod_type) {
                        msg += ' <span style="color: ' + mod_color[json.additional_info.mod_type.mod_type] + '">';
                        msg += mod_types[json.additional_info.mod_type.mod_type] + '</span> slot ' + json.additional_info.slot;
                    } else {
                        msg += ' <span style="color: ' + mod_color[json.additional_info.mod_type] + '">';
                        msg += mod_types[json.additional_info.mod_type] + '</span> slot ' + json.additional_info.slot;
                    }
                    break;
            }

            msg = '<div>' + msg + '</div>';

            var color = plugin.xgress.COLORS_TEAM[json.team];
            var s = 'style="cursor:pointer; color:'+color+'"';
            var i = ['<span class="invisep">&lt;</span>', '<span class="invisep">&gt;</span>'];
            modified_data[ind] = [time, true, '<tr><td>'+t+'</td><td>'+i[0]+'<mark class="nickname" ' + s + '>'+ nick+'</mark>'+i[1]+'</td><td>'+msg+'</td></tr>'];
        })
        return {processed: modified_data, raw: {result: data}};
    }

    
    plugin.xgress.renderAgentHistory = function(history) {
        if (!history.processed[0]) {
            var html = '<div>Player history not found</div>';
        } else {
            var html = '<table><tbody>';

            var prevTime = null;

            var modified_data = history.processed;

            for (var data in modified_data) {
                detail = modified_data[data];

                var time = detail[0];

                var nextTime = new Date(time).toLocaleDateString();
                if(prevTime && prevTime !== nextTime)
                html += plugin.xgress.renderDivider(nextTime, time);

                prevTime = nextTime;
                html += detail[2];
            }
            html += '</tbody></table>'
        }
        elm = document.getElementById('agent_history');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(html);
    }

    plugin.xgress.getAgentHistory = function() {
        plugin.xgress.agentName = $('#agent_name').val();
        if (!plugin.xgress.agentName) {
            return
        }
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                    player: plugin.xgress.agentName,
                    offset: 0,
                    limit: 1000
                },
                request: "agent_history",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                var portals = response.result.agent_history;
                plugin.xgress.setSubTab(1);
                plugin.xgress.agent_history = response.result.agent_history;
                var modified_data = plugin.xgress.retrieve_agent_history_html(portals);
                plugin.xgress.renderAgentHistory(modified_data);
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );

    }

    // agent chat
    plugin.xgress.getAgentChat = function() {
        plugin.xgress.agentName = $('#agent_name').val();
        if (!plugin.xgress.agentName) {
            return
        }
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "chat",
                args: {
                    player: plugin.xgress.agentName,
                },
                plugin_version: plugin.xgress.token
            }),
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
               withCredentials: true
            },
        }).done(
            function(response) {
                if (response.error) {
                    toastr.error(response.error);
                }
                else if (response.error_access) {
                    toastr.error(response.error_access);
                } else if (response.result.chat.error) {
                    toastr.error(response.result.chat.error);
                } else {
                    plugin.xgress.setSubTab(2);
                    plugin.xgress.renderAgentChat(response.result.chat);
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    plugin.xgress.renderAgentChat = function(data) {
        if (!data[0]) return
        agent_chat = '';

        for (var chat in data) {
            detail = data[chat];
            d = Math.floor(Math.floor((Date.now() - detail.timestamp) / 1000) / 86400);
            agent_chat += '<p>[' + plugin.xgress.unixTimeToString(detail.timestamp, true)
                + (detail.type_msg == 2 ? '] <span style="color: red">[secure]</span> ' : '] ')
                + detail.plain
                + '</p>';
        }
        elm = document.getElementById('agent_chat');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(agent_chat);

    }

    // agent uniqs

    ///// agent uniqs portals
    plugin.xgress.getUniqPortals = function() {
        plugin.xgress.agentName = $('#agent_name').val();
        if (!plugin.xgress.agentName) return
        plugin.xgress.startAjax();

        var latlngCenter = window.map.getCenter();

        var zoom = window.map.getZoom();

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "agent_uniq",
                args: {
                    player: plugin.xgress.agentName,
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    zoom: zoom
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.stopAjax();
                if (!plugin.xgress.uniq) {
                    plugin.xgress.uniq = new L.LayerGroup();
                    window.addLayerGroup('[XG] Uniqs', plugin.xgress.uniq, true);
                }
                if (response.error) {
                    toastr.error(response.error);
                    return
                }
                plugin.xgress.renderUniqPortals(response.result.agent_uniq);
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    plugin.xgress.clearUniqLabels = function () {
        for (var i in plugin.xgress.uniqList) {
            var previousLayer = plugin.xgress.uniqList[i];
            if (previousLayer) {
                delete plugin.xgress.uniqList[i];
                plugin.xgress.uniq.removeLayer(previousLayer);
            }
        }
    }

    plugin.xgress.renderUniqPortals = function (portals) {
        if (!plugin.xgress.uniq) {
            plugin.xgress.uniq = new L.LayerGroup();
            window.addLayerGroup('[XG] Uniqs', plugin.xgress.uniq, true);
        }
        plugin.xgress.clearUniqLabels();

        // plugin.xgress.hidePanel();
        for (var p in portals) {
            feature = portals[p];
            var scale = window.portalMarkerScale();
            var latlng = {
                lat: feature.late6 / 1E6,
                lng: feature.lnge6 / 1E6
            }

            if (!latlng.lat) return;

// aai79 modified rad11, weight 4
            var styleOptions = {
                radius: 7 * scale,
                stroke: true,
                color: 'black',
                weight: 2 * Math.sqrt(scale),
                opacity: 0.7,
                fill: true,
                fillColor: 'black',
                fillOpacity: 0.5,
                dashArray: [1, 2]
            };

            var options = L.extend({}, {}, styleOptions, { clickable: false });
            var marker = L.circleMarker(latlng, options);
            var pguid = feature.late6 - feature.lnge6 + Math.random();
            plugin.xgress.uniqList[pguid] = marker;
            marker.addTo(plugin.xgress.uniq);
        }
    }

    //
    plugin.xgress.getPortalVisits = function(pguid) {
        plugin.xgress.startAjax();
        plugin.xgress.portal_visits = {};
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                    pguid: pguid,
                    limit: 10
                },
                request: "portal_visit",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.result.portal_visit) {
                    plugin.xgress.stopAjax();

                    if (response.result.portal_visit) {

                        html = '<p>Top 10 users.</p><table class="portals">'
                                + '<tr>'
                                + '<th class="firstColumn">Agent</th>'
                                + '<th class="firstColumn" >Total actions</th>'
                                + '</tr>\n';

                            for (var v in response.result.portal_visit) {
                                pl = response.result.portal_visit[v]._id;
                                cnt = response.result.portal_visit[v].count;

                                html += '<tr><td><span class="nickname ' + (pl.team === 2 ? 'res' : 'enl') + '">'
                                    + pl.player + '</span></td><td>' + cnt + '</td></tr>';
                            }

                            html += '</table>';

                            $('#xgressPluginAgent').append(html);

                    }

                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );

    }

    // portal history
    plugin.xgress.getPortalHistory = function(pguid, offset, limit) {

        if (offset === 0) {plugin.xgress.history_offset = 0};

        if(plugin.xgress._requestPortalHistory) return;

        if (plugin.xgress.history_offset % 300 != 0) return;

        plugin.xgress.startAjax();
        plugin.xgress._requestPortalHistory = true;

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                    pguid: pguid,
                    limit: limit,
                    offset: offset
                },
                request: "portal_history",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.result.portal_history[0]) {
                    var portals = response.result.portal_history;
                    plugin.xgress.history_offset += portals.length;

                    plugin.xgress.renderPortalHistory(portals);

                }
                else {
                    toastr.error('History not found')
                }

            }
        ).always(
            function() {plugin.xgress.stopAjax();plugin.xgress._requestPortalHistory = false;}
        );

    }

    // search portals
    plugin.xgress.renderSearchPortal = function(data, total) {
        if (!data) {
            var html = '<p>Not found</p>';
        }
        var search_portal = '<div>'
        for (var i in data) {
            var item = data[i];
            search_portal += `
            <p class="t_name_portals"><span style="color: #06E2DF">` + plugin.xgress.distance(item) + `km</span>
            <span style="color: gold">` + item.name + `</span> ` + item.address + `
            <a class="google_ingress" target="_blank" href="` + getGoogleUrl(item.late6,item.lnge6) + `">
            <img src="` + icon_google + `"></a>
            <a class="google_ingress" href="` + plugin.xgress.getUrl(item.late6,item.lnge6) + `">[intel]</a>
            </p>
            `
        }
           
        search_portal += '</div>'
        plugin.xgress.rerenderMenu(1);

        elm_total = document.getElementById('search_portal_total');
        if ($(elm_total).length > 0) {
            $(elm_total).empty();
        }
        $(elm_total).append('<p>Found ' + total + ' portals</p>');

        elm = document.getElementById('search_portal');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(search_portal);
        
    }

    plugin.xgress.searchPortal = function(first) {
        var portalname = $('#portalname').val();
        var sid;
        var total;
        if (first) {
            sid = null;
        };
        if (!plugin.xgress.sid) { sid = null };

        if (portalname.length == 35 && portalname.charAt(32) == '.') {
            window.renderPortalDetails(portalname);
        };

        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                args: {
                    portal: portalname,
                    sid: sid
                },
                request: "portal_search",
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.result.portal_search.by_name) {
                    total = response.result.portal_search.total;
                    plugin.xgress.sid = response.result.portal_search.sid;
                    plugin.xgress.renderSearchPortal(response.result.portal_search.by_name, total);
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    // portal photos
    plugin.xgress.renderPortalPhotos = function(data) {
        var portal_photos = '<div>'
        for (var img in data) {
            pic = data[img];
            portal_photos += '<div class="imgpreview" style="background-image: url(\'' + pic.imageUrl + '\')"></div><p>'
            + (pic.attributionMarkup ? 'Photo by <span class="nickname ' + (pic.attributionMarkup[1]['team'] === 'RESISTANCE' ? 'res' : 'enl') + '">' + pic.attributionMarkup[1]['plain'] + '</span>'  : '')
            + ' Votes: ' + pic.voteCount + '</p><hr>'
        }
        portal_photos += '</div>'

        plugin.xgress.rerenderMenu(5);
        elm = document.getElementById('other_info');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(portal_photos);
    }

    plugin.xgress.getPortalPhotos = function(pguid) {
        if (!pguid) return
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "portal_photos",
                args: {
                    pguid: pguid
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {

                if (response.error) {
                    toastr.error(response.error);
                } else {
                    var details = response.result.portal_photos[0];
                    plugin.xgress.renderPortalPhotos(details.images);
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );

    }

    plugin.xgress.getPortalDaysLatLng = function (late6, lnge6) {
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "portal_by_latlng",
                args: {
                    late6: late6,
                    lnge6: lnge6
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
            withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                var pguid = response.result.portal_by_latlng[0].pguid;
                window.renderPortalDetails(pguid);
            }
        ).always(
        );
    }

    plugin.xgress.PortalDaysDetails = function() {
        if (window.selectedPortal && window.portals[window.selectedPortal]) {
            var guid = window.portals[window.selectedPortal].options.guid;
            var p = window.portals[window.selectedPortal].getLatLng();
            var details_cached = plugin.xgress.infoLayer[window.selectedPortal];
            if (details_cached) {
                plugin.xgress.renderPortalDetails(details_cached);
            } else {
                $.ajax({
                    url: "//xgress.com/api/v2",
                    data: JSON.stringify({
                        request: "portal_by_latlng",
                        args: {
                            late6: Math.round(p.lat * 1E6),
                            lnge6: Math.round(p.lng * 1E6),
                            pguid: guid
                        },
                        plugin_version: plugin.xgress.token
                    }),
                    xhrFields: {
                    withCredentials: true
                    },
                    type: 'POST',
                    cache: false,
                    crossDomain: true,
                    dataType: 'json',
                }).done(
                    function(response) {
                        var details = response.result.portal_by_latlng[0];
                        plugin.xgress.infoLayer[window.selectedPortal] = details;
                        plugin.xgress.renderPortalDetails(details);
                    }
                ).always(
                );

            }
        }

    }
    plugin.xgress.PortalDaysDetailsFromCache = function() {
        if (window.selectedPortal && window.portals[window.selectedPortal]) {
            var details_cached = plugin.xgress.infoLayer[window.selectedPortal];

            if (details_cached) {
                plugin.xgress.renderPortalDetails(details_cached);
            }
        }
    }

    plugin.xgress.generate_portal_details_html = function (details) {
        if (!details) { return }
        if (details) {
            var plains_history_usage = {
                1: '+Resonator',
                2: 'Capture',
                3: '-Resonator',
                4: '+Link',
                5: '+Field',
                6: '-Link',
                7: '-Field',
                8: 'Fracker',
                9: 'Beacon',
                13: 'Virus',
                15: 'Mod',
            };

            var ada = '';
            if (details.ada) {
                var ada = '<span style="color: red"> [VIRUS detected]</span>';
            }
            var ago = plugin.xgress.ago;
            var now = new Date().getTime();
            var xgress_portal = $('<div>').css('color', 'darkorange').addClass('xgress_portal');
            var xgress_portal_details = $('<div>').addClass('xgress_portal_details');
            var xgress_portal_extra_details = $('<div>').addClass('xgress_portal_extra_details').append('<hr>');

            // settings.PD - portal details, settings.CD = portal capture details

            if (plugin.xgress.settings.PD) {
                var actionHTML = '';
                actionHTML += '<div class="row_buttons">';
                    actionHTML += '<a onclick="plugin.xgress.getPortalHistory(\'' + details.pguid + '\', 0, 300);" title="Portal history">History</a> ';
                    actionHTML += '<a class="regAll" onclick="plugin.xgress.getPortalPhotos(\'' + details.pguid + '\')" title="Portal images">Images ' + (details.photo_count ? '[' + details.photo_count + ']' : '') + '</a> ';
                    actionHTML += '<div style="clear:both;"></div>';
                actionHTML += '</div>';
                $(actionHTML).appendTo(xgress_portal);
            }

            if (details.discoverers && details.discoverers[0]) {
                var discoverers = '<div style="max-width: 300px; word-wrap: break-word;">Discovered by ';
                for (discover in details.discoverers) {
                    discoverers += '<span class="nickname ' + (details.discoverers[discover].team === 'RESISTANCE' ? 'res' : 'enl') + '">' + details.discoverers[discover].agent + '</span>' + '|';
                }
                discoverers += '</div>';
                $(xgress_portal_extra_details).append(discoverers);
            }

            $(xgress_portal_extra_details)
                .append('<a onclick="plugin.xgress.add_farm_alert()">Add to telegram alert </a><br>')
                .append(details.description ? '<span style="color: #06E2DF">' + details.description + '</span><br>' : '')
                .append(details.mc ? 'Missions: ' + details.mc + '<br>': '')
                .append('Id: ' + details.pguid);

            status = '';

            var last_activity = ''
            if (details.usage) {
                if (details.usage.timestamp > 1500046250000) {
                    last_activity = '<span style="color: #06E2DF"> Portal activity: ' + ago(details.usage.timestamp) +
                        ' (' + plains_history_usage[details.usage.plain] + ')</span><br>'
                }
            }

            if (plugin.xgress.settings.CD) {
                if (!details.name) {
                    $(xgress_portal_details).append('don`t have data about this portal. Try later.').append('<br>')
                        .appendTo($(xgress_portal));
                } else if (details.team == 3) {
                    $(xgress_portal_details).append(last_activity)
                        .append((details.address ? '<span style="color: white">' + details.address + '</span><br>' : ''))
                        .appendTo($(xgress_portal));
                } else {
                    $(xgress_portal_details).append((status ? status : '') +
                        '<span class="nickname ' + (details.team === 2 ? 'res' : 'enl') + '">' +
                        details.player + '</span> ' +
                        ' <span style="color: yellow">' +
                        (details.delta != 0 ? plugin.xgress.unixTimeDeltaDays(details.delta) : '') +
                        ago(details.timestamp, now) + '</span>' + ada +
                        '(' + plugin.xgress.unixTimeToString(details.timestamp, true) + ')<br>' +
                        last_activity)
                        .append((details.address ? '<span style="color: white">' + details.address + '</span><br>' : ''))
                        .appendTo($(xgress_portal));
                }

                if (details.immune) {
                    $(xgress_portal_details).append(' <span style="color: red">Portal is immune</span> till ' + plugin.xgress.unixTimeToString(details.immune) + '.<br>')
                }

            } else {
                $(xgress_portal_details).appendTo($(xgress_portal));
            }

            if (details.name) {
                if (plugin.xgress.settings.PD) {
                    $(xgress_portal_extra_details).appendTo($(xgress_portal));
                }
            }

            return $(xgress_portal);
        }
    }

    plugin.xgress.renderPortalDetails = function(details) {
        var html = plugin.xgress.generate_portal_details_html(details);
        var portal_info_elm = $('#xgress_portal');
        if ($(portal_info_elm).length > 0) {
            $(portal_info_elm).remove();
        }
        var elm = $('#portaldetails > .imgpreview');
        $(html).insertAfter(elm);
    }

    plugin.xgress.UpdatePortalDetails = function(data) {
        if (plugin.xgress.settings.PD || plugin.xgress.settings.CD) {
            plugin.xgress.PortalDaysDetails();
        }
    }

    // farm

    plugin.xgress.onClickListener = function (event) {
        var guid = event.target.options.guid;
        var marker = event.target;
        if (marker.options.desc) {
            plugin.xgress.playerPopup.setContent(marker.options.desc);
            plugin.xgress.playerPopup.setLatLng(marker.getLatLng());
            map.openPopup(plugin.xgress.playerPopup);
        }

        if (typeof (guid) == "string") {
            window.renderPortalDetails(guid);
        }

    };

    plugin.xgress.renderFarmPortals = function () {
        var farm_portals = '';

        if (!plugin.xgress.farmportals) {
            farm_portals += 'Not found farm portals in current area'
        }
        for (p in plugin.xgress.farmportals) {
            var item = plugin.xgress.farmportals[p];
            if (item.status === 1 || item.status === 2) continue;
            farm_portals += `
                <p>
                    <a target="_blank" href="` + getGoogleUrl(item.late6,item.lnge6) + `">
                            <img src="`+icon_google+`"></a>
                    <a href="` + plugin.xgress.getUrl(item.late6,item.lnge6) + `">[i]</a>
                    <a target="_blank" href="` + getShortUrl(item._id) + `">[S]</a>
                    <span>` + plugin.xgress.mod_parser_less(item.portal_mod, item) + `</span>
                    <mark class="nickname" style="cursor:pointer; color:` + TEAM_COLOR[item.team] + `">` 
                    + item.player + `</mark><span> Lvl: ` + item.lvl + `</span>
                    <a onclick="window.renderPortalDetails('` + item.pguid + `');">` + item.name + `</a> ` + item.address + `
                </p>
            `
        }
        elm = document.getElementById('farm_portals');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(farm_portals);
    };

    // farm highlighter
    plugin.xgress.colorFarm = function(data) {
        var portal_level = data.portal.options.data.level;
        var pguid = data.portal.options.guid;
        var team_color = {
            'R': '#100399',
            'E': '#068f26',
            'N': '#ffaa00'
        }

        if (portal_level !== undefined) {
            if (plugin.xgress.farmportals[pguid]) {
                var farm_portal = plugin.xgress.farmportals[pguid];
                var mod_color = '#FD2992';
                for (var mod in farm_portal.portal_mod) {
                    var pm = farm_portal.portal_mod[mod];
                    if (pm) {
                        if (pm.mod_type in [7, 10, 12, 13]) {
                            mod_color = '#8600f7';
                        }
                    }
                }
                
                var opacity = .6;
                data.portal.setStyle({fillColor: mod_color, fillOpacity: opacity});
                data.portal.options.color = team_color[data.portal.options.data.team];
            }
        }
    }

    plugin.xgress.getFarmPortals = function(render) {
        if (plugin.xgress._requestFarmPortals) return;
        var latlngCenter = window.map.getCenter();
        var b = clampLatLngBounds(map.getBounds());
        var ne = b.getNorthEast();
        var sw = b.getSouthWest();
        var data = {
            minLatE6: Math.round(sw.lat*1E6),
            minLngE6: Math.round(sw.lng*1E6),
            maxLatE6: Math.round(ne.lat*1E6),
            maxLngE6: Math.round(ne.lng*1E6),
        }

        var lvl = plugin.xgress.settings.lvl;
        var mhhs = plugin.xgress.settings.mhhs;
        if (!lvl) {lvl = 1};
        plugin.xgress._requestFarmPortals = true;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "portal_area_farm",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    lvl: lvl,
                    bounds: data,
                    mhhs: mhhs,
                    mods: plugin.xgress.settings.mods
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.result.portal_area_farm[0]) {
                    var rndr = window.mapDataRequest.render;
                    for (fp in response.result.portal_area_farm) {
                        var farm_portal = response.result.portal_area_farm[fp];
                        if (farm_portal.status === 1 || farm_portal.status === 2) {
                            continue;
                        };
                        if (!rndr.bounds.contains(L.latLng(farm_portal.late6/1E6, farm_portal.lnge6/1E6))) {
                            continue;
                        }
                        plugin.xgress.farmportals[farm_portal.pguid] = farm_portal;
                        var teams = {
                            1: 'E',
                            2: 'R',
                            3: 'N'
                        }
                        rndr.createPortalEntity([
                            farm_portal.pguid,
                            new Date(), [
                            'p',
                            teams[farm_portal.team],
                            farm_portal.late6,
                            farm_portal.lnge6,
                            farm_portal.lvl,
                            0,
                            0,
                            farm_portal.img,
                            farm_portal.name, [],
                            false,
                            false,
                            null,
                            farm_portal.timestamp,
                            ]
                        ]);
                        
                    }
                }
                if (render) {
                    plugin.xgress.renderFarmPortals();
                }
                plugin.xgress._requestFarmPortals = false;
            }).always(
            function() {plugin.xgress._requestFarmPortals = false;}
        );
    }

    plugin.xgress.updateLabels = function(timeout) {
        for (var i = 0, plugins = ['portalNames', 'portalLevelNumbers'], ln = plugins.length; i < ln; i++)
          if (plugins[i] in window.plugin)
            window.plugin[plugins[i]].delayedUpdatePortalLabels(timeout);
    }

    ////// Area portals

    plugin.xgress.countAreaRange = function() {
        var center = map.getCenter();
        var zoom = map.getZoom();


        var multiplier;
        if (zoom == 7 || zoom == 8) {
            multiplier = 1000 * 1000;
        }
        else if (zoom == 9 || zoom == 10) {
            multiplier = 400 * 1000;
        }
        else if (zoom == 11 || zoom == 12) {
            multiplier = 200 * 1000;
        }

        else if (zoom == 13 || zoom == 14) {
            multiplier = 20 * 1000;
        }
        else if (zoom > 14) {
            multiplier = 2 * 1000;
        }
        else {
            multiplier = 10000 * 1000;
        }

        if (Math.abs(center.lat * 1E6 - plugin.xgress.portal_area_lt6) > multiplier ||
            Math.abs(center.lng * 1E6 - plugin.xgress.portal_area_ln6) > multiplier) {
                return true;
            }
    }

    plugin.xgress.handleAreaPortals = function(portals) {
  
        var portals_r = {};
        for (ap in portals) {
            area_portal = portals[ap];
            pguid = area_portal.pguid;
            delete area_portal._id
            delete area_portal.pguid
            portals_r[pguid] = area_portal;
        }
  
        plugin.xgress.renderAreaPortals(portals_r);
        Object.assign(plugin.xgress.area_portals_cache, portals_r);
    }

    plugin.xgress.renderAreaPortals = function(portals) {
        var rndr = window.mapDataRequest.render;
        for (pguid in portals) {
            var area_portal = portals[pguid];

            if (!rndr.bounds.contains(L.latLng(area_portal.late6/1E6, area_portal.lnge6/1E6))) {
                continue;
            }
            var teams = {
                1: 'E',
                2: 'R',
                3: 'N'
            }

            timestamp = 0;
            team = teams[area_portal.team];
    
            if (pguid in window.portals) {
                props = window.portals[pguid].options.data;
    
                switch (props.timestamp) {
                case 0:
                case 1:
                    break;

                default: 
                    continue;
                }
            }

            rndr.createPortalEntity([
                pguid,
                timestamp, [
                'p',
                team,
                area_portal.late6,
                area_portal.lnge6,
                area_portal.lvl,
                0,
                0,
                null,
                area_portal.name, [],
                false,
                false,
                null,
                area_portal.timestamp,
                ]
            ]);
            
        }
    }

    plugin.xgress.getAreaPortals = function(offset) {
        if (plugin.xgress._requestAreaPortals) return;

        if (window.map.getZoom() >= 15) {
            return;
        }

        if (!offset) {
            // clear cache
            plugin.xgress.area_portals_cache = {};
            offset = 0;
        }
        if (offset == plugin.xgress.settings.area_portals_limit) {
            offset = 0;
            return;
        }

        var latlngCenter = window.map.getCenter();
        var b = clampLatLngBounds(map.getBounds());
        var ne = b.getNorthEast();
        var sw = b.getSouthWest();
        var data = {
            minLatE6: Math.round(sw.lat*1E6),
            minLngE6: Math.round(sw.lng*1E6),
            maxLatE6: Math.round(ne.lat*1E6),
            maxLngE6: Math.round(ne.lng*1E6),
        }
        plugin.xgress.portal_area_lt6 = latlngCenter.lat * 1E6;
        plugin.xgress.portal_area_ln6 = latlngCenter.lng * 1E6;
        plugin.xgress.portal_area_zoom = window.map.getZoom();
        plugin.xgress._requestAreaPortals = true;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "portals_in_area",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    bounds: data,
                    offset: offset
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.result.portals_in_area[0]) {
                    plugin.xgress.handleAreaPortals(response.result.portals_in_area);
                    plugin.xgress._requestAreaPortals = false;
                    offset += 1000;
                    setTimeout(plugin.xgress.getAreaPortals(offset));
                } else {
                    offset = 0;
                    plugin.xgress._requestAreaPortals = false;
                }
            }).always(
            function() {plugin.xgress._requestAreaPortals = false;}
        );
    }

    ///// AP Gain
    plugin.xgress.renderApGainPortals = function (portals, render) {
        var ap_portals = '';

        if (!portals[0]) {
            ap_portals += 'Not found portals in current area'
        }
        for (p in portals) {
            var item = portals[p];
            if (item.status === 1 || item.status === 2) continue;
            ap_portals += `
                <p>
                    <a target="_blank" href="` + getGoogleUrl(item.late6,item.lnge6) + `">
                            <img src="`+icon_google+`"></a>
                    <a href="` + plugin.xgress.getUrl(item.late6,item.lnge6) + `">[i]</a>
                    <a target="_blank" href="` + getShortUrl(item._id) + `">[S]</a>
                    <mark class="nickname" style="cursor:pointer; color:` + TEAM_COLOR[item.team] + `">` 
                    + item.player + `</mark><span> Lvl: ` + item.lvl + `</span></mark><span> AP: ` 
                    + item.ap + `</span><span style="color: #06E2DF"> ` + plugin.xgress.distance(item) + `km</span>
                    <a onclick="window.renderPortalDetails('` + item.pguid + `');">` + item.name + `</a> ` + item.address + `
                </p>
            `
        }

        if (render) {
            elm = document.getElementById('ap_gain_portals');
            if ($(elm).length > 0) {
                $(elm).empty();
            }
            $(elm).append(ap_portals);
        }
    };

    plugin.xgress._requestGainPortals = false;

    plugin.xgress.getApGainPortals = function(render) {
        if (plugin.xgress._requestGainPortals) return;
        var latlngCenter = window.map.getCenter();
        var zoom = window.map.getZoom();

        plugin.xgress._requestGainPortals = true;
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "portals_ap_gain",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    zoom: zoom,
                    ap: 6000
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.renderApGainPortals(response.result.portals_ap_gain, render);
                plugin.xgress._requestGainPortals = false;
            }).always(
            function() {plugin.xgress._requestGainPortals = false; plugin.xgress.stopAjax();}
        );
    }



    ///// Removed, new, moved portals
    plugin.xgress.clearRMNLabels = function () {
        for (var i in plugin.xgress.rmnPortalsLayers) {
            var previousLayer = plugin.xgress.rmnPortalsLayers[i];
            if (previousLayer) {
                delete plugin.xgress.rmnPortalsLayers[i];
                plugin.xgress.rmn.removeLayer(previousLayer);
            }
        }
    }

    plugin.xgress.addRemovedLabel = function (features) {
        var isTouchDev = window.isTouchDevice();
        var previousLayer = plugin.xgress.rmnPortalsLayers[guid];
        var ago = plugin.xgress.ago;

        if (features.status == 1) {
            var guid = features.late6 + features.lnge6;
        } else {
            var guid = features.pguid;
        }

        var now = new Date().getTime();
        if (!previousLayer) {
            var d = Math.floor(Math.floor((Date.now() - features.timestamp) / 1000) / 86400);
            var latLng = {
                lat: features.late6 / 1E6,
                lng: features.lnge6 / 1E6
            }

            plugin.xgress.markerTemplate = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"\n version="1.1" baseProfile="full"\n width="17px" height="35px" viewBox="0 0 25 41">\n\n <path d="M1.36241844765,18.67488124675 A12.5,12.5 0 1,1 23.63758155235,18.67488124675 L12.5,40.5336158073 Z" style="stroke:none; fill: %COLOR%;" />\n <path d="M1.80792170975,18.44788599685 A12,12 0 1,1 23.19207829025,18.44788599685 L12.5,39.432271175 Z" style="stroke:#000000; stroke-width:1px; stroke-opacity: 0.15; fill: none;" />\n <path d="M2.921679865,17.8803978722 A10.75,10.75 0 1,1 22.078320135,17.8803978722 L12.5,36.6789095943 Z" style="stroke:#ffffff; stroke-width:1.5px; stroke-opacity: 0.35; fill: none;" />\n\n <path d="M19.86121593215,17.25 L12.5,21.5 L5.13878406785,17.25 L5.13878406785,8.75 L12.5,4.5 L19.86121593215,8.75 Z M7.7368602792,10.25 L17.2631397208,10.25 L12.5,18.5 Z M12.5,13 L7.7368602792,10.25 M12.5,13 L17.2631397208,10.25 M12.5,13 L12.5,18.5 M19.86121593215,17.25 L16.39711431705,15.25 M5.13878406785,17.25 L8.60288568295,15.25 M12.5,4.5 L12.5,8.5" style="stroke:%COLOR_TEAM%; stroke-width:1.25px; stroke-opacity: 1; fill: none;" />\n\n</svg>';

            if (features.status == 1) {
                var color_team = '#ff0000';
                var status = ' Removed ';
                var tooltip = (isTouchDev ? '' : (features.name + status) + ago(features.updated, now));
                var date_portal = status + ago(features.updated, now)
            } else if (features.status == 2) {
                var color_team = '#bfaf26';
                var status = ' Moved ';
                var tooltip = (isTouchDev ? '' : (features.name + status) + ago(features.updated, now));
                var date_portal = status + ago(features.updated, now)
            } else {
                var color_team = '#ffffff';
                var status = ' Discovered ';
                var tooltip = (isTouchDev ? '' : (features.name + status) + ago(features.found, now));
                var date_portal = status + ago(features.found, now)
            }

            var popup = $('<div>')
                .addClass('plugin-ingress-guard-popup');
            $('<span>')
                .css('font-weight', 'bold')
                .text(features.name)
                .appendTo(popup);
            popup.append('<br> <a onclick="plugin.xgress.getPortalHistory(\'' + features.pguid + '\', 0, 300)">History</a>')
                .append('<br><a onclick="plugin.xgress.getPortalPhotos(\'' + features.pguid + '\')">Images ' + (features.photo_count ? '[' + features.photo_count + ']' : ''))
                .append('<br>')
                .append(date_portal)
                .append('<br>Discovered by ');

            if (features.discoverers) {
                for (discover in features.discoverers) {
                    $(popup).append('<span class="nickname ' + (features.discoverers[discover].team === 'RESISTANCE' ? 'res' : 'enl') + '">' + features.discoverers[discover].agent + ' </span>');
                }
            }

            var color = '#000000';

            var svgIcon = plugin.xgress.markerTemplate.replace(/%COLOR%/g, color).replace(/%COLOR_TEAM%/g, color_team);
            var icon = L.divIcon({
                iconSize: new L.Point(17, 35),
                iconAnchor: new L.Point(8, 35),
                html: svgIcon,
                className: 'leaflet-iitc-custom-icon',
                color: color
            })

            var label = L.marker(latLng, {
                icon: icon,
                desc: popup[0],
                title: tooltip,
                guid: guid
            });

            label.addEventListener('spiderfiedclick', plugin.xgress.onClickListener);
            plugin.xgress.rmnPortalsLayers[guid] = label;

            label.addTo(plugin.xgress.rmn);

            window.registerMarkerForOMS(label);
            if (!isTouchDev) {
                window.setupTooltips($(label._icon));
            }
        }
    };

    plugin.xgress._load_rmn_portals = false;

    plugin.xgress.getRemovedPortalLabels = function () {
        if (plugin.xgress._load_rmn_portals) return;
        var latlngCenter = window.map.getCenter();
        var zoom = window.map.getZoom();
        plugin.xgress.startAjax();
        plugin.xgress._load_rmn_portals = true;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "area_removed",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    zoom: zoom
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function (response) {
                plugin.xgress.stopAjax();
                plugin.xgress._load_rmn_portals = false;
                var portals = response.result.area_removed;
                plugin.xgress.clearRMNLabels();
                $.each(portals, function (index, feature) {
                    plugin.xgress.addRemovedLabel(feature);
                });
            }
        ).always(
            function () { plugin.xgress._load_rmn_portals = false; plugin.xgress.stopAjax();}
        );
    }

    //// links
    plugin.xgress.getLinkDetails = function(event) {
        var link = event.target.options;

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "link_info",
                args: {
                    late6: link.data.oLatE6,
                    lnge6: link.data.oLngE6,
                    pguid: link.data.oGuid,
                    dlate6: link.data.dLatE6,
                    dlnge6: link.data.dLngE6,
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.stopAjax();

                if (!response.result.link_info[0]) return;
                var xlink = response.result.link_info[0];
                xlink.additional_info.late6 = xlink.additional_info.latE6;
                xlink.additional_info.lnge6 = xlink.additional_info.lngE6;

                var html = 
                '<div class="plugin_xgress_popup"><table><tr>' +
                    '<td>' +
                        '<time title="'+window.unixTimeToDateTimeString(xlink.timestamp, true)+'" data-timestamp="'+xlink.timestamp+'">'+plugin.xgress.ago(xlink.timestamp)+'<br> '+window.unixTimeToDateTimeString(xlink.timestamp, true)+'</time>' +
                        '<br><span style="color: white">Length: ' + plugin.xgress.calculate_speed_distance(xlink, xlink.additional_info) + 'km</span>' +
                    '</td>' +
                    '<td>' +
                        '<mark class="nickname" style="cursor:pointer; color:'+plugin.xgress.COLORS_TEAM[xlink.team]+'">'+xlink.player+'</mark>' +
                    '</td>' +
                    '<td>' +
                        ' link <a onclick="window.renderPortalDetails(\''+link.data.oGuid+'\')">'+xlink.name+'</a> (' + xlink.address +  ')<br> to <a onclick="window.renderPortalDetails(\''+link.data.dGuid+'\')">'+xlink.additional_info.name+'</a>' +
                        ' (' + xlink.additional_info.address +  ')' +
                    '</td>' +
                '</tr></table></div>';
   
                plugin.xgress.link_popup.setContent(html);
                plugin.xgress.link_popup.setLatLng(event.latlng);
                map.openPopup(plugin.xgress.link_popup);

            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    plugin.xgress.removeFieldLabel = function(guid) {
        var previousLayer = plugin.xgress.fieldDrawLayers[guid];
        if(previousLayer) {
            plugin.xgress.drawfield.removeLayer(previousLayer);
            delete plugin.portalNames.labelLayers[guid];
        }
    }

    plugin.xgress.clearAllFieldLabels = function() {
        for (var guid in plugin.xgress.fieldDrawLayers) {
            plugin.xgress.removeFieldLabel(guid);
        }
    }

    plugin.xgress.addFieldLabel = function(guid, latLng, mus) {
        var previousLayer = plugin.xgress.fieldDrawLayers[guid];
        if (!previousLayer) {        
            var label = L.marker(latLng, {
            icon: L.divIcon({
                className: 'xgress-plugin-field-names',
                iconAnchor: [40,0],
                iconSize: [80,23],
                html: mus + 'MUs'
            }),
            guid: guid,
            interactive: false
            });
            plugin.xgress.fieldDrawLayers[guid] = label;
            label.addTo(plugin.xgress.drawfield);
        }
    }

    plugin.xgress.getFieldDetails = function(event) {
        var field = event.target.options;

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "field_info",
                args: {
                    field: field.data
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.stopAjax();

                if (!response.result.field_info[0]) return;
                var field_info = response.result.field_info[0];

                if (!plugin.xgress.drawfield) {
                    plugin.xgress.drawfield = new L.LayerGroup();
                    window.addLayerGroup('[XG] Draw field', plugin.xgress.drawfield, true);
                }
                
                if (field_info.late6_center) {

                    var mus;
                    if (!field_info.accuracy && field_info.mus) {
                        mus = '(?)' + field_info.mus;
                    } else if (field_info.accuracy && field_info.mus) {
                        mus = field_info.mus;
                    } else {
                        mus = '(?)';
                    }
                    
                    plugin.xgress.addFieldLabel(field_info.late6_center, {'lat': field_info.late6_center/1E6, 'lng': field_info.lnge6_center/1E6}, mus);
                    var options = {};
                    options.opacity = 1;
                    options.weight = 1;
                    options.color = '#000';
        
                    var latlng1 = L.latLng(field_info.p_0.late6/1E6, field_info.p_0.lnge6/1E6);
                    var latlng2 = L.latLng(field_info.p_1.late6/1E6, field_info.p_1.lnge6/1E6);
                    var latlng3 = L.latLng(field_info.p_2.late6/1E6, field_info.p_2.lnge6/1E6);
                    var poly = L.geodesicPolyline([latlng1, latlng2, latlng3, latlng1], options);

                    plugin.xgress.fieldDrawLayers['poly' + field_info.guid] = poly;
                    poly.addTo(plugin.xgress.drawfield);

                } else {
                    toastr.warning('Field was not found');
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    //cell stats
    plugin.xgress.getCellStats = function() {

        var latlngCenter = window.map.getCenter();
        plugin.xgress.startAjax();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "stats_cell",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.stopAjax();
                var stats_cell = response.result.stats_cell;

                var html = '';
                html += '<p>' + stats_cell.cell_name + ' (' + stats_cell.portal_count + ' portals in this cell)</p>';
//                html += '<p>Cell Score: ' + stats_cell.game_score[0] + '/' + stats_cell.game_score[1] + '</p>';
                html += '<p  title="active users in cell for the last 30 days">Users: <span class="enl">'
                    + stats_cell.user_count.enl + '</span> / <span class="res">'
                    + stats_cell.user_count.res + '</span></p>';

                html += '<table class="portals">'
                    + '<tr>'
                    + '<th class="firstColumn">Agent</th>'
                    + '<th class="firstColumn" >Captured portals</th>'
                    + '</tr>\n';

                for (var sc in stats_cell.top_users) {
                    sc = stats_cell.top_users[sc];


                    html += '<tr><td><span class="nickname ' + (sc.team === 2 ? 'res' : 'enl') + '">'
                    + sc.player + '</span></td><td>' + sc.d + '</td></tr>';
                }

                html += '</table>';

                plugin.xgress.rerenderMenu(5);

                elm = document.getElementById('other_info');
                if ($(elm).length > 0) {
                    $(elm).empty();
                }
                $(elm).append(html);

            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    //plan panel

    plugin.xgress.removePlanKey = function(pguid) {
        var previousLayer = plugin.xgress.keysListPlan[pguid];
        if(previousLayer) {
            delete plugin.xgress.keysListPlan[pguid]
            plugin.xgress.renderPlanKeys(plugin.xgress.keysListPlan);
            plugin.xgress.savePlan();
        }

    }
    plugin.xgress.renderPlanKeys = function(data) {
        if (!data) return;

        keyslist = ''
        for (var i in data) {
            if (!data[i]) continue

            keyslist += '<p>'
                + '<a onclick=\'window.renderPortalDetails("' + data[i].pguid + '");\'>' + data[i].name.substring(0, 30)
                + '</a>'
                + '<a title="remove from list" onclick=\'plugin.xgress.removePlanKey("'
                + data[i].pguid + '");\'> [X]</a>'
                + '</p>';
            plugin.xgress.keysListPlan[data[i].pguid] = data[i];
        }
        $("#xgressPluginPlan").html('');
        $(keyslist).appendTo($("#xgressPluginPlan"));
    }
    plugin.xgress.addSelectedPlan = function() {
        if (!window.selectedPortal) {
            dialog({
                html: 'Select portal portal on the map first',
                id: 'plugin-ig-error',
                dialogClass: 'ui-dialog-drawtoolsSet',
                title: 'Select error'
              });
            return
        }
        var pguid = window.selectedPortal;
        var name = window.portals[window.selectedPortal].options.data.title;
        var late6 = window.portals[window.selectedPortal].options.data.latE6;
        var lnge6 = window.portals[window.selectedPortal].options.data.lngE6;
        var p = {'pguid': pguid, 'late6': late6, 'lnge6': lnge6, 'name': name}
        plugin.xgress.keysListPlan[pguid] = p;
        // plugin.xgress.renderMfPortals();
        plugin.xgress.renderPlanKeys(plugin.xgress.keysListPlan);
        plugin.xgress.savePlan();

    }

    plugin.xgress.removeSelectedPlan = function() {
        if (!window.selectedPortal) {
            dialog({
                html: 'Select portal portal on the map first',
                id: 'plugin-ig-error',
                dialogClass: 'ui-dialog-drawtoolsSet',
                title: 'Select error'
              });
            return
        }
        var pguid = window.selectedPortal;
        var previousLayer = plugin.xgress.keysListPlan[pguid];
        if(previousLayer) {
            delete plugin.xgress.keysListPlan[pguid];
            plugin.xgress.renderPlanKeys(plugin.xgress.keysListPlan);
        }
        plugin.xgress.savePlan();

    }
    plugin.xgress.showPlan = function() {
        if (!plugin.xgress.keysListPlan) return
        if (!plugin.xgress.Plan) {
            plugin.xgress.Plan = new L.LayerGroup();
            window.addLayerGroup('[SE] Show Plan', plugin.xgress.Plan, true);
        }
        for (var i in plugin.xgress.keysListPlan) {
            feature = plugin.xgress.keysListPlan[i];
            if (!feature) continue
            var scale = window.portalMarkerScale();
            var latlng = {
                lat: feature.late6 / 1E6,
                lng: feature.lnge6 / 1E6
            }
            if (!latlng.lat) return;
            var styleOptions = {
                radius: 11 * scale,
                stroke: true,
                color: 'red',
                weight: 4 * Math.sqrt(scale),
                opacity: 0.7,
                fill: true,
                fillColor: 'black',
                fillOpacity: 0.5,
                dashArray: [1,2]
            };

            var options = L.extend({}, {}, styleOptions, { clickable: false });

            var marker = L.circleMarker(latlng, options);
            var previousLayer = plugin.xgress.Plan[feature.pguid];
            if (previousLayer) continue
            plugin.xgress.Plan[feature.pguid] = marker;
            marker.addTo(plugin.xgress.Plan);
        }

    }

    plugin.xgress.loadPlan = function() {
        if (localStorage['ig-plan']) {
            plugin.xgress.keysListPlan = jQuery.parseJSON(localStorage['ig-plan']);
        }
        else {
            plugin.xgress.keysListPlan = {}
        }

        plugin.xgress.renderPlanKeys(plugin.xgress.keysListPlan);
    }

    plugin.xgress.savePlan = function() {
        if (!plugin.xgress.keysListPlan) return
        localStorage['ig-plan'] = JSON.stringify(plugin.xgress.keysListPlan)
    }

    plugin.xgress.planOpt = function() {

        if (!window.plugin.drawTools) {
            dialog({
                html: 'You must install Draw Tools plugin for enabling this feature. <a href="https://iitc.me" target="_blank">Download</a>',
                id: 'plugin-ig-error',
                dialogClass: 'ui-dialog-drawtoolsSet',
                title: 'Draw Tools plugin error'
              });
            return
        }
        var html = '<div class="drawtoolsSetbox">'
               + '<a onclick="plugin.xgress.addSelectedPlan();" tabindex="0">Add selected portal</a>'
               + '<a onclick="plugin.xgress.showPlan();" tabindex="0">Show on the map</a>'
               + '</div>'
               + '<div id="planStatus"></div>'
               + '<div id="xgressPluginPlan"></div>';

      dialog({
        html: html,
        id: 'plugin-ig-plan',
        width: 'auto',
        title: '[XG] Bookmark Panel',
        position: {my: 'right-10', at: 'top-100', of: window, collision: 'fit'}
      });
      plugin.xgress.loadPlan();

    }

    plugin.xgress.activatePlugin = function() {
        var token = $('#activate_token').val()
        if (!token) return
        plugin.xgress.startAjax();

        $.ajax({
            url: "//xgress.com/token",
            data: JSON.stringify({
                request: "permissions",
                args: {},
                token: token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                plugin.xgress.stopAjax();

                if (response.error) {
                    toastr.error(response.error);
                    return
                }
                if (response.status) {
                    if (response.plugin_version) {
                        localStorage['xgress_version'] = JSON.stringify({'plugin_version': response.plugin_version})
                        plugin.xgress.token = response.plugin_version;
                    }
                    toastr.info(response.status);
                    return
                }
            }
        ).always(
            function() {plugin.xgress.stopAjax();}
        );
    }

    // Main panel
    plugin.xgress.onPaneChanged = function(pane) {
        if (pane == 'plugin-xgressPlugin') {
            plugin.xgress.panel_tab = 0;
            plugin.xgress.rerenderMenu();
        } else {
            $('#xgressPlugin').remove();
        }
    };

    plugin.xgress.showHistoryPanel = function(data) {
        if (window.isSmartphone()) {
            if (!$("#xgressPlugin").length) {
                plugin.xgress.igOpt();
            }
            window.show('plugin-xgph-panel');
            $("#xgressPluginAgent").html('');
            $(data).appendTo($("#xgressPluginAgent"));
        }
        else {
            plugin.xgress.igOpt();
            $("#xgressPluginAgent").html('');
            $(data).appendTo($("#xgressPluginAgent"));
        }
    }

    plugin.xgress.igOpt = function() {
        var html = '<div id="xgressPluginAgent"></div>';

        if (window.isSmartphone()) {
            $('#xgressPlugin').remove();
            window.show('plugin-xgph-panel');
            $('<div id="scrollwrapper"><div id="sidebar"><div id="xgressPlugin" class="mobile">'+ html +'</div></div></div>').appendTo(document.body);
        } else {
          dialog({
            html: html,
            id: 'plugin-xgph-panel',
            width: 'auto',
            title: '[XG] History Panel',
            position: {my: 'right-10', at: 'top-100', of: window, collision: 'fit'}
          });
        }
    }

    // Settings panel
    plugin.xgress.saveSettings = function () {

        mods = [];
        if ($('input[name=mod6]').is(':checked')) {
            mods.push(6)
        }
        if ($('input[name=mod7]').is(':checked')) {
            mods.push(7)
        }
        if ($('input[name=mod9]').is(':checked')) {
            mods.push(9)
        }
        if ($('input[name=mod10]').is(':checked')) {
            mods.push(10)
        }
        if ($('input[name=mod12]').is(':checked')) {
            mods.push(12)
        }
        if ($('input[name=mod13]').is(':checked')) {
            mods.push(13)
        }

        var nickname = $('input[name=nicknamehook]').is(':checked');
        var link_hook = $('input[name=linkhook]').is(':checked');
        var field_hook = $('input[name=fieldhook]').is(':checked');
        var virus = $('input[name=virushook]').is(':checked');
        var theme = $('input[name=theme]').is(':checked');
        var PD = $('input[name=portaldetails]').is(':checked');
        var CD = $('input[name=capturedetails]').is(':checked');
        var farmload = $('input[name=farmload]').is(':checked');
        var mhhs = $('input[name=mhhs]').is(':checked');
        var lvl = $('#farm_max_lvl').val();
        var control = $('input[name=xgress_control]').is(':checked');
        var xgress_minifier = $('input[name=xgress_minifier]').is(':checked');
        var map_tool = $('input[name=xgress_map_tool]').is(':checked');
        var full_time = $('input[name=xgress_full_time]').is(':checked');
        var area_portals_auto = $('input[name=area_portals_auto]').is(':checked');
        var area_portals_limit = $('#chbx-area_portals_limit').val();

        localStorage['ig-settings'] = JSON.stringify({ 'Virus': virus, 'lvl': lvl, 'Theme': theme, 'nick': nickname, 'mods': mods, 'mhhs': mhhs, 
                                                        "PD": PD, "CD": CD, "farmload": farmload, 'control': control,
                                                        "minifier": xgress_minifier, "map_tool": map_tool, "full_time": full_time, 'linkhook': link_hook,
                                                        'fieldhook': field_hook, "area_portals_auto": area_portals_auto, "area_portals_limit": area_portals_limit
                                                    });
        toastr.info('Saved! Reload page.');
    }

    plugin.xgress.loadSettings = function() {
        var default_settings =  { "nick": true, "PD": true, "CD": true, "Virus": true, "lvl": 8, 
            "Theme": false, "mods": [6, 7, 9, 10, 12, 13], 'mhhs': false, 
            "farmload": false, "control": false,
            "minifier": true, "map_tool": true, "full_time": false, "linkhook": true, "fieldhook": false,
            "area_portals_auto": false, "area_portals_limit": "3000" };

        if (localStorage['ig-settings']) {
            plugin.xgress.settings = jQuery.parseJSON(localStorage['ig-settings']);
            // fix new features
            for (ds in default_settings) {
                if (plugin.xgress.settings[ds] == undefined) {
                    plugin.xgress.settings[ds] = default_settings[ds];
                }
            }
        } else {
            plugin.xgress.settings = default_settings;
        }

        if (plugin.xgress.settings.Theme) {
            plugin.xgress.customCSS();
        }

        if (plugin.xgress.settings.control) {
            // Xgress Icon CSS
            $('<style>').prop('type', 'text/css').html('' +
                '#xgress_select {' +
                ' position: absolute;' +
                ' top: 10px;' +
                ' left:50px;' +
                ' z-index: 2500;' +
                ' font-size:11px;' +
                ' font-family: "coda",arial,helvetica,sans-serif;' +
                ' color:#ffce00;' +
            '}').appendTo('head');
            plugin.xgress.setupXgressSidebarToggle();
        }

        if (plugin.xgress.settings.full_time) {
            // Full time
            $('<style>').prop('type', 'text/css').html('' +
                '#chat td:first-child, #chatinput td:first-child {' +
                ' width: 80px;' +
            '}').appendTo('head');
            
            window.unixTimeToHHmm = function(time) {
                if(!time) return null;
                var d = new Date(typeof time === 'string' ? parseInt(time) : time);
                var h = '' + d.getHours(); h = h.length === 1 ? '0' + h : h;
                var s = '' + d.getMinutes(); s = s.length === 1 ? '0' + s : s;
                return  h + ':' + s + ':' +zeroPad(d.getSeconds(),2) + ' .' + zeroPad(d.getMilliseconds(),3);
            }
        }

        if (localStorage['xgress_version']) {
            plugin.xgress.token = jQuery.parseJSON(localStorage['xgress_version']).plugin_version;
            plugin.xgress.a = jQuery.parseJSON(localStorage['xgress_version']).plugin_version;
        }
        // nickname hook
        try {
            window.chat.nicknameClicked = function(event, nickname) {
              var hookData = { event: event, nickname: nickname };
              if (window.runHooks('nicknameClicked', hookData)) {
                if (!plugin.xgress.settings.nick) {
                    window.chat.addNickname('@' + nickname);
                }
                else {
                    plugin.xgress.getAgentPortals(nickname);
                }
              }
    
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
        } catch(err) {
    
        }
        
        // link-field hooks
        if (plugin.xgress.settings.linkhook) {
            window.addHook('linkAdded', function(data) {
                
                poly = data.link;
            
                poly.addEventListener('click', plugin.xgress.getLinkDetails);
                ent = poly.options.ent;
                poly.options.interactive = true;
                poly.options.clickable = true;
            
                window.links[ent[0]] = poly;
            });
        }

        if (plugin.xgress.settings.fieldhook) {
            window.addHook('fieldAdded', function(data) {
                poly = data.field;
            
                poly.addEventListener('click', plugin.xgress.getFieldDetails);
                ent = poly.options.ent;
                poly.options.interactive = true;
                poly.options.clickable = true;
                window.fields[ent[0]] = poly;
            });
        }
    }

    plugin.xgress.renderSettingsPanel = function() {

      var Nick = plugin.xgress.settings.nick;
      var link_hook = plugin.xgress.settings.linkhook;
      var field_hook = plugin.xgress.settings.fieldhook;
      var CD = plugin.xgress.settings.CD;
      var PD = plugin.xgress.settings.PD;
      var Virus = plugin.xgress.settings.Virus;
      var aTheme = plugin.xgress.settings.Theme;
      var PLvl = (typeof plugin.xgress.settings.lvl === 'undefined') ? 8 : plugin.xgress.settings.lvl;
      var PMods = (typeof plugin.xgress.settings.mods === 'undefined') ? [6, 7, 9, 10, 12, 13] : plugin.xgress.settings.mods;
      var PMhhs = (typeof plugin.xgress.settings.mhhs === 'undefined') ? false : plugin.xgress.settings.mhhs;
      var farmload = (typeof plugin.xgress.settings.farmload === 'undefined') ? false : plugin.xgress.settings.farmload;
      var xgress_control = (typeof plugin.xgress.settings.control === 'undefined') ? false : plugin.xgress.settings.control;
      var xgress_minifier = (typeof plugin.xgress.settings.minifier === 'undefined') ? false : plugin.xgress.settings.minifier;
      var map_tool = (typeof plugin.xgress.settings.map_tool === 'undefined') ? false : plugin.xgress.settings.map_tool;
      var full_time = (typeof plugin.xgress.settings.full_time === 'undefined') ? false : plugin.xgress.settings.full_time;
      var area_portals_auto = (typeof plugin.xgress.settings.area_portals_auto === 'undefined') ? false : plugin.xgress.settings.area_portals_auto;
      var area_portals_limit = (typeof plugin.xgress.settings.area_portals_limit === 'undefined') ? "3000" : plugin.xgress.settings.area_portals_limit;
      
      var lvl_options = [{
            name: 'Min lvl 5',
            value: '5'
        }, {
            name: 'Min lvl 6',
            value: '6'
        }, {
            name: 'Min lvl 7',
            value: '7'
        }, {
            name: 'Min lvl 8',
            value: '8'
        }];

        var html = '<select id="farm_max_lvl">'
            for (var l in lvl_options) {
                html += '<option value="' + lvl_options[l].value + '" ' + (PLvl === lvl_options[l].value?' selected ':'') + '>' + lvl_options[l].name + '</option>'
            }
            html += '</select>'

        html += `<div><p>Mods types</p>`

        html += `<input class="option-input checkbox" type="checkbox" id="chbx-6" name="mod6" ` + ((PMods.indexOf(6) > -1)?'checked':'') + `>
            <label style="color: #73a8ff" for="chbx-6">Multi-hack (R)</label>
            <input class="option-input checkbox" type="checkbox" id="chbx-7" name="mod7" ` + ((PMods.indexOf(7) > -1)?'checked':'') + `>
            <label style="color: #b08cff" for="chbx-7">Multi-hack (VR)</label>
            <input class="option-input checkbox" type="checkbox" id="chbx-9" name="mod9" ` + ((PMods.indexOf(9) > -1)?'checked':'') + `>
            <label style="color: #73a8ff" for="chbx-9">Heat Sink (R)</label>
            <input class="option-input checkbox" type="checkbox" id="chbx-10" name="mod10" ` + ((PMods.indexOf(10) > -1)?'checked':'') + `>
            <label style="color: #b08cff" for="chbx-10">Heat Sink (VR)</label>
            <input class="option-input checkbox" type="checkbox" id="chbx-12" name="mod12" ` + ((PMods.indexOf(12) > -1)?'checked':'') + `>
            <label style="color: #b08cff" for="chbx-12">Transmuter (+)</label>
            <input class="option-input checkbox" type="checkbox" id="chbx-13" name="mod13" ` + ((PMods.indexOf(13) > -1)?'checked':'') + `>
            <label style="color: #b08cff" for="chbx-13">Transmuter (-)</label>
        </div>
        `
        // range label
        var rangeValues =
        {
            "1000": "Limit 1k",
            "2000": "Limit 2k",
            "3000": "Limit 3k",
            "4000": "Limit 4k",
            "5000": "Limit 5k",
            "6000": "Limit 6k",
            "7000": "Limit 7k",
            "8000": "Limit 8k",
            "9000": "Limit 9k",
            "10000": "Limit 10k"
        };

        $(function () {

            $('#rangeText').text(rangeValues[$('#chbx-area_portals_limit').val()]);

            $('#chbx-area_portals_limit').on('input change', function () {
                $('#rangeText').text(rangeValues[$(this).val()]);
            });
            $('#rangeText').text(rangeValues[$(this).val()]);
        
        });
        html += `
            <div>
                <input class="option-input checkbox" type="checkbox" id="chbx-farmload" name="farmload" `+(farmload?' checked':'')+`>
                <label style="color: #73a8ff" for="chbx-farmload">Enable farm feature</label>
                <input class="option-input checkbox" type="checkbox" id="chbx-mhhs" name="mhhs" `+(PMhhs?' checked':'')+`>
                <label style="color: #73a8ff" for="chbx-mhhs">Only portals with MH + HS</label>
            </div>
            <hr>
            <div>
                <h4>Hooks</h4>
                
                <input class="option-input checkbox" type="checkbox" id="chbx-nick" name="nicknamehook" `+(Nick?' checked':'')+`>
                <label style="color: #73a8ff" for="chbx-nick">Nickname hook</label>

                <input type="checkbox" id="chbx-virushook" name="virushook" `+(Virus?' checked':'')+`>
                <label for="chbx-virushook">Virus hook</label>
                
                <input type="checkbox" id="chbx-control" name="xgress_control" `+(xgress_control?' checked':'')+`>
                <label for="chbx-control">Control button</label>

                <input type="checkbox" id="chbx-linkhook" name="linkhook" `+(link_hook?' checked':'')+`>
                <label for="chbx-linkhook">Link hook</label>

                <input type="checkbox" id="chbx-fieldhook" name="fieldhook" `+(field_hook?' checked':'')+`>
                <label for="chbx-fieldhook">Field hook (in Test mode)</label>
            </div>
            <hr>
            <div>
                <h4>Portal Info</h4>
                
                <input class="option-input checkbox" type="checkbox" id="chbx-portaldetails" name="portaldetails" `+(PD?' checked':'')+`>
                <label style="color: #73a8ff" for="chbx-portaldetails">Additional portal details</label>

                <input type="checkbox" id="chbx-capturedetails" name="capturedetails" `+(CD?' checked':'')+`>
                <label for="chbx-capturedetails">Portal capture details</label>
            </div>
            <hr>
            <div>
                <h4>Interface</h4>
                <input type="checkbox" id="chbx-theme" name="theme" `+(aTheme?' checked':'')+`>
                <label for="chbx-theme">Dark theme</label>

                <input class="option-input checkbox" type="checkbox" id="chbx-minifier" name="xgress_minifier" `+(xgress_minifier?' checked':'')+`>
                <label for="chbx-minifier">Minify portal info</label>

                <input class="option-input checkbox" type="checkbox" id="chbx-map-tool" name="xgress_map_tool" `+(map_tool?' checked':'')+`>
                <label for="chbx-map-tool">Map tool</label>

                <input class="option-input checkbox" type="checkbox" id="chbx-full-time" name="xgress_full_time" `+(full_time?' checked':'')+`>
                <label for="chbx-full-time">Message's time with seconds and ms</label>
            </div>
            <hr>
            <div>
                <h4>Load portals on the area</h4>
                <input type="checkbox" id="chbx-area-load" name="area_portals_auto" `+(area_portals_auto?' checked':'')+`>
                <label for="chbx-area-load">Autoload portals</label>

                <p>Portals limit (High value can affect intel performance)</p>
                <label id="rangeText" for="chbx-area_portals_limit" />
                <input class="option-input checkbox" id="chbx-area_portals_limit" type="range" min="1000" max="10000" step="1000" value="`+area_portals_limit+`" name="area_portals_limit" />
                
            </div>
        `
        elm = document.getElementById('plugin_settings');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(html);
        $('#rangeText').text(rangeValues[area_portals_limit]);
    };

    plugin.xgress.add_farm_alert = function () {
        if (window.selectedPortal && window.portals[window.selectedPortal]) {
            var p = window.portals[window.selectedPortal].getLatLng();
            var late6 = Math.round(p.lat * 1E6);
            var lnge6 = Math.round(p.lng * 1E6);
        } else {
            toastr.error('Bad argument. Select portal first')
            return
        }

        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "add_portal_alert",
                args: {
                    late6: late6,
                    lnge6: lnge6
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error) {
                    toastr.error(response.error);
                    return
                }
                if (response.status) {
                    toastr.info(response.status);
                }
            }
        ).always(
            function() {}
        );
    };

    ///// region score
    plugin.xgress.CHECKPOINT = 5*60*60; //5 hours per checkpoint
    plugin.xgress.CYCLE = 7*25*60*60; //7 25 hour 'days' per cycle
    
    plugin.xgress.getRegionScore = function() {
        var latlngCenter = window.map.getCenter();
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "region_score",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    limit: 200
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error) {
                    toastr.error(response.error);
                }
                else if (response.error_access) {
                    toastr.error(response.error_access);
                } else if (response.region_stats) {
                    var details = response.region_stats;
                    if (details) {
                        plugin.xgress.cycleupdate(details);
                    } else {
                        plugin.xgress.cycleupdate();
                    }
                }
            }
        ).always(
            function() {}
        );

    }

    plugin.xgress.cycleupdate = function(data) {
      var formatRow = function(label,time,score) {
        var timeStr = plugin.xgress.unixTimeToString(time,true);
        var weekday = new Date(time);
        var wd=new Array(7);
        wd[0]="Sun";
        wd[1]="Mon";
        wd[2]="Tue";
        wd[3]="Wed";
        wd[4]="Thu";
        wd[5]="Fri";
        wd[6]="Sat";

        weekday = weekday.getDay();

        timeStr = timeStr.replace(/:00$/,'');
        if (score) {

            score_html = '<span class="res">' + score.gameScore[1] + '</span>/<span class="enl">' + score.gameScore[0] + '</span>'
            if (score.topAgents[0]) {
                score_html += ' [ '
                for (a in score.topAgents) {
                    ag = score.topAgents[a];
                    score_html += '<span class="nickname ' + (ag.team === 'RESISTANCE' ? 'res' : 'enl') + '">' + ag.nick + '</span> '
                }
                score_html += ']'
            }
            return '<tr><td>'+label+'</td><td>'+timeStr+' '+ wd[weekday] + ' </td><td>' + score_html + '</td></tr>';
        } else {
            return '<tr><td>'+label+'</td><td>'+timeStr+' '+ wd[weekday] + ' </td></tr>';
        }

      };
      var now = new Date().getTime();
      var html = '<table>';
      var checkpointStart;
      var prevTime = null;
      var current_checkpoint =  Math.floor(now / (plugin.xgress.CHECKPOINT*1000)) * (plugin.xgress.CHECKPOINT*1000);
      var cycleStart = Math.floor(now / (plugin.xgress.CYCLE*1000)) * (plugin.xgress.CYCLE*1000);
      cycleStart -= plugin.xgress.CYCLE*1000*4;

      for (var i=0; i < 20; i++) {
          var cycleEnd = cycleStart + plugin.xgress.CYCLE*1000;

          html += formatRow('<span style="color: yellow">Cycle start</span>', cycleStart);
          for (; cycleStart < cycleEnd; cycleStart+=plugin.xgress.CHECKPOINT*1000) {
            checkpointStart = cycleStart;
            var nextTime = new Date(checkpointStart).toLocaleDateString();
            if(prevTime && prevTime !== nextTime)
              html +='<tr><td colspan="3" style="padding-top:3px"><summary>───────────────────────────────</summary></td></tr>';

            prevTime = nextTime;
            if (current_checkpoint == checkpointStart) {
                html += formatRow('<span style="color: red">Current checkpoint</span>', checkpointStart)
            } else {
                f_data = false;
                if (data) {
                    for (d in data) {

                        if (data[d]['startTimestamp'] == checkpointStart) {
                            html += formatRow('Checkpoint', checkpointStart, data[d])
                            f_data = true
                            break
                        }
                    }
                    if (!f_data) {
                        html += formatRow('Checkpoint', checkpointStart)
                    }
                } else {
                    html += formatRow('Checkpoint', checkpointStart)
                }
            }
          }
          html += formatRow('<span style="color: yellow">Cycle end</span>', cycleEnd);
      }

        html += '</table>';

        plugin.xgress.rerenderMenu(5);

        elm = document.getElementById('other_info');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(html);
    }

    plugin.xgress.globalcycleupdate = function(data) {
        var formatRow = function(label,time,score) {
          var timeStr = plugin.xgress.unixTimeToString(time,true);
          var weekday = new Date(time);
          var wd=new Array(7);
          wd[0]="Sun";
          wd[1]="Mon";
          wd[2]="Tue";
          wd[3]="Wed";
          wd[4]="Thu";
          wd[5]="Fri";
          wd[6]="Sat";
  
          weekday = weekday.getDay();
  
          timeStr = timeStr.replace(/:00$/,'');
          if (score) {
  
              score_html = '<span class="res">' + score.score[1] + '</span>/<span class="enl">' + score.score[0]
              + '</span>'
              return '<tr><td>'+label+'</td><td>'+timeStr+' '+ wd[weekday] + ' </td><td>' + score_html + '</td></tr>';
          } else {
              return '<tr><td>'+label+'</td><td>'+timeStr+' '+ wd[weekday] + ' </td></tr>';
          }
  
        };
        var now = new Date().getTime();
        var html = '<table>';
        var checkpointStart;
        var prevTime = null;
        var current_checkpoint =  Math.floor(now / (plugin.xgress.CHECKPOINT*1000)) * (plugin.xgress.CHECKPOINT*1000);
        var cycleStart = Math.floor(now / (plugin.xgress.CYCLE*1000)) * (plugin.xgress.CYCLE*1000);
        cycleStart -= plugin.xgress.CYCLE*1000*10;
        end_hist = false;
        for (var i=0; i < 20; i++) {
            var cycleEnd = cycleStart + plugin.xgress.CYCLE*1000;
  
            html += formatRow('<span style="color: yellow">Cycle start</span>', cycleStart);
            for (; cycleStart <= cycleEnd; cycleStart+=plugin.xgress.CHECKPOINT*1000) {
              checkpointStart = cycleStart;
              var nextTime = new Date(checkpointStart).toLocaleDateString();
              if(prevTime && prevTime !== nextTime)
                html +='<tr><td colspan="3" style="padding-top:3px"><summary>───────────────────────────────</summary></td></tr>';
  
              prevTime = nextTime;
              if (current_checkpoint == checkpointStart) {
                  html += formatRow('<span style="color: red">Current checkpoint</span>', checkpointStart)
                  end_hist = true;
                  break
              } else {
                  if (data) {
                      for (d in data) {
                          if ((checkpointStart + 60*60*1000) > data[d]['timestamp'] && data[d]['timestamp'] >= (checkpointStart - 60*60*1000)) {
                              html += formatRow('Checkpoint', checkpointStart, data[d])
                              f_data = true
                              break
                          }
                      }
                  }
              }
            }
            if (end_hist) break;
            html += formatRow('<span style="color: yellow">Cycle end</span>', cycleEnd);
        }
            html += '</table>';

            plugin.xgress.rerenderMenu(5);

            elm = document.getElementById('other_info');
            if ($(elm).length > 0) {
                $(elm).empty();
            }
            $(elm).append(html);
      }

    plugin.xgress.getGlobalScore = function() {
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "global_stats",
                args: {
                    limit: 400
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
               withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function(response) {
                if (response.error) {
                    toastr.error(response.error);
                }
                else if (response.error_access) {
                    toastr.error(response.error_access);
                } else if (response.result.global_stats) {
                    var details = response.result.global_stats;
                    if (details) {
                        plugin.xgress.globalcycleupdate(details);
                    }
                }
            }
        ).always(
            function() {}
        );

    }

    plugin.xgress.about = function() {

        var about_html = `
        <!-- START xgress about panel -->
    
        <div>
            <div class="drawtoolsSetbox">
            <p>Ingress tracker plugin with a lot of features:</p>
            <p> - Tracking agents</p>
            <p> - Portal history</p>
            <p> - Agent history</p>
            <p> - Farm portals in area</p>
            <p> - Removed and moved portals</p>
            <p> - Agent uniq captures</p>
            <p> - Portal information (discovers, address, photos)</p>
            <p> - Searching of missions by agent name</p>
            <p> - Tracker notifier by telegram bot</p>
            <p> - Cell scores, global scores, region scores (allows get time for the next cycles and checkpoints)</p>
            <p> - ... you can request some another features by email or telegram</p>

            <br />
            <p>Telegram bot and channels:</p>
            <p>
                <a target="_blank" href="https://t.me/Premovedingress">Removed portals tracker</a></p>
            <p>
                <a target="_blank" href="https://t.me/IngressNewPortals"
                >New discovered portals tracker</a
                >
            </p>
            <p>
                <a target="_blank" href="https://t.me/globalalerts"
                >Global links and fields tracker</a
                >
            </p>
            <p><a target="_blank" href="https://t.me/IngressGuardFreeBot">Bot</a></p>
            <br />
            <p>
                For linking plugin with your account use token from
                <a target="_blank" href="https://xgress.com/#/settings">settings</a> page.
            </p>
            </div>
        </div>

        <!-- END xgress about panel -->
        `
        plugin.xgress.rerenderMenu(5);

        elm = document.getElementById('other_info');
        if ($(elm).length > 0) {
            $(elm).empty();
        }
        $(elm).append(about_html);
    }

    //// FT
    plugin.xgress.onClickFTListener = function (event) {
        var guid = event.target.options.guid;
        if (typeof (guid) == "string") {
            plugin.xgress.renderFT(guid);
        }

    };
    plugin.xgress.clearFTLabels = function () {
        for (var i in plugin.xgress.FTLayers) {
            var previousLayer = plugin.xgress.FTLayers[i];
            if (previousLayer) {
                delete plugin.xgress.FTLayers[i];
                plugin.xgress.ft.removeLayer(previousLayer);
            }
        }
    }

    plugin.xgress.addFTLabel = function (features) {
        var isTouchDev = window.isTouchDevice();
        var previousLayer = plugin.xgress.FTLayers[guid];
        var guid = features.guid;

        if (!previousLayer) {
            var latLng = {
                lat: features.late6 / 1E6,
                lng: features.lnge6 / 1E6
            }

            var ftIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAQCAYAAADnEwSWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzQjI4NUZDMjUyMTExRTQ5Q0E4QjQ0NDJCQjgwNEU1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzQjI4NUZEMjUyMTExRTQ5Q0E4QjQ0NDJCQjgwNEU1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNCMjg1RkEyNTIxMTFFNDlDQThCNDQ0MkJCODA0RTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNCMjg1RkIyNTIxMTFFNDlDQThCNDQ0MkJCODA0RTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6dzL6aAAACSElEQVR42rzVS0hUURjA8e/a2J3JKEZp06J3RgkVJmGBk0FUELgxapEWWKDSJnosxCQoy4UGboSKrDZFSEmMIBXRojbRGEZEr1UFCS2aEhtzfMz0PzPfldvg3MaNB37z3ce55zvn3HPuWMlkUuaq+JyDzRLbQjiOJxjHEtg4g1OIoBxFWIo8PEQ7fqD2tRR890pmmZGVSayC4xb04CyWZ9RL4BwuZFyfdHW4ZUAKWv87Ml+6dz4d1bAmdZdfCOEmvuGjxu1o1aQGQ48VE9p0BkI6I1UvGHUq2XyxygiXn8mCzyEZNY38RFAbPYGF2IDH+I3zWIV12ple3ObZI7RVybFpb5ne22raRo0mk3lOz0g4sUtG33C4Aw3a8FpNWqejN70vcY38gMpWDk4n84uYF1vq3OH8C+EptsG8z1rcwyC60J+RLKeFmPqxxRog7K6WP4VmoJwvJj4yc62V++5LYIr4iTrtem82ZdCVTK4R9ulKfKm9foCViN6RwLDzlJ2exigKc0hitsQQ6kX3itBYOCBWM4oRxBrEMY5FR2XMdp6mboJrEYiHEXRgNfU3IvLPpu4W/yVJ7eqxJkJlaq2kF8gK7NQN7LzT94Q9M4zkA66a5rrEP5L1C+IUKrU5x6cl3qt7pcadjB4nZkj0yizzDrET2eY0z2vC2Wi3EMWhixJvNNeIhzlfH9SNqO6i2ivR9OfKq1yXib2EMPLxHFdwQzvabSbjmOS/zWVJWrl89cMyuYmwX5OdxDt0Vonv62zWvzWXfzF/BRgA99uXbLCg1AUAAAAASUVORK5CYII=';

            var tooltip = (isTouchDev ? '' : (features.title));

            var popup = $('<div>')
                .addClass('plugin-ingress-guard-popup');
            $('<span>')
                .css('font-weight', 'bold')
                .text(features.title)
                .appendTo(popup);
            popup.append('<br> <a onclick="plugin.xgress.getPortalHistory(\'' + features.guid + '\')">History</a>');

            var size = 20;
            var icon = L.icon({
                iconUrl: ftIcon,
                iconSize: [size, size],
                iconAnchor: [size / 2, size],
                // className: 'no-pointer-events'
            });

            var label = L.marker(latLng, {
                icon: icon,
                desc: popup[0],
                title: tooltip,
                guid: guid
            });

            label.addEventListener('spiderfiedclick', plugin.xgress.onClickFTListener);
            plugin.xgress.FTLayers[guid] = label;

            label.addTo(plugin.xgress.ft);

            window.registerMarkerForOMS(label);
            if (!isTouchDev) {
                window.setupTooltips($(label._icon));
            }
        }
    };

    plugin.xgress._load_ft = false;

    plugin.xgress.getFieldTestsLabels = function () {
        if (plugin.xgress._load_ft) return;
        var latlngCenter = window.map.getCenter();
        var zoom = window.map.getZoom();
        plugin.xgress._load_ft = true;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: "field_test",
                args: {
                    late6: latlngCenter.lat * 1E6,
                    lnge6: latlngCenter.lng * 1E6,
                    zoom: zoom
                },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function (response) {
                plugin.xgress._load_ft = false;
                var portals = response.result.field_test;
                plugin.xgress.clearFTLabels();
                $.each(portals, function (index, feature) {
                    plugin.xgress.addFTLabel(feature);
                });
            }
        ).always(
            function () { plugin.xgress._load_ft = false; }
        );
    }

    plugin.xgress.renderFT = function (guid) {
        if (!guid) return;
        $.ajax({
            url: "//xgress.com/api/v2",
            data: JSON.stringify({
                request: 'field_test_by_guid',
                args: { "guid": [guid] },
                plugin_version: plugin.xgress.token
            }),
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            cache: false,
            crossDomain: true,
            dataType: 'json',
        }).done(
            function (response) {
                if (response.error_access) {
                    toastr.error(response.error_access);
                    return
                }
    
                if (!response.result.field_test_by_guid[0]) {
                    toastr.info('Was not found.');
                    return
                } else {
                    var ft = response.result.field_test_by_guid[0];
                    var ft_html = `
                    <!-- START ft info -->
                    <div>
                        <div>
                            <h4>Description</h4>
                            ` + ft.description + `
                            <img src="` + ft.imageUrl + `">
                            <h4>Links</h4>`
                            + ft.publisherInfo.blurb + 
                        `</div>
                        <hr>
                    </div>
                    <!-- END ft info -->
                    `
                }

                plugin.xgress.rerenderMenu(5);
                elm = document.getElementById('other_info');
                if ($(elm).length > 0) {
                    $(elm).empty();
                }
                $(elm).append(ft_html);
            }
        ).always(
            function () { plugin.xgress._load_ft = false; }
        );
    };

    //virus part
    plugin.xgress.addVirused = function(data, time) {
        if (!plugin.xgress.Vir) {
            plugin.xgress.Vir = new L.LayerGroup();
            window.addLayerGroup('[XG] Show VIRUS', plugin.xgress.Vir, true);
        }

        var portal = data.markup[2][1]

        var player = data.markup[0][1]

        var tguid = portal.latE6 + portal.lngE6;

        var previousLayer = plugin.xgress.Vir[tguid];
        if (previousLayer) return
        var lat = portal.latE6 / 1E6;
        var lng = portal.lngE6 / 1E6;

        var size = 20;
        var latlng = {
            lat: portal.latE6 / 1E6,
            lng: portal.lngE6 / 1E6
        }
        if (!latlng.lat) return;

       var virusIcon = 'data:image/png;base64,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';
        var icon = L.icon({
            iconUrl: virusIcon,
            iconSize: [size, size],
            iconAnchor: [size/2, size],
            className: 'no-pointer-events'
        });

        var marker = L.marker(latlng, {icon: icon, clickable: false, keyboard: false, opacity: 1 });

        plugin.xgress.Vir[tguid] = marker;
        marker.addTo(plugin.xgress.Vir);
        toastr.options.escapeHtml = false;
        toastr.options.timeOut = 10000;
        var permalinkUrl = '/intel?ll='+lat+','+lng+'&z=15&pll='+lat+','+lng;
        toastr.warning('<b>Virus applied by <span class="nickname '
        + (player.team === 'RESISTANCE' ? 'res' : 'enl') + '">' + player.plain
        + '</span></b> Portal: <a href="' + permalinkUrl + '">' + portal.name + '</a>  '
        + plugin.xgress.ago(time));
    }

    plugin.xgress.process_virus = function(data) {
        if (!plugin.xgress.settings.Virus) return
        var temp_time = 1
        var tguid = 1
        $.each(data.raw.result, function(ind, json) {
            var current_data = json[2].plext;

            var time = json[1];

            if (current_data.plextType != 'SYSTEM_BROADCAST') {
                // Not an event (a player is speaking in /all)
                return;
            }
            var category = current_data.markup[1][1].plain;
            var portal = current_data.markup[2][1];

            if (temp_time == time && category == ' destroyed a Resonator on ' && tguid == portal.latE6 + portal.lngE6) {
                plugin.xgress.addVirused(current_data, time)
            }
            temp_time = time;
            tguid = portal.latE6 + portal.lngE6;
        });
    };

    ///// Portal info minifier

	//-----------------------------------
	// STORAGE
	//-----------------------------------
	plugin.xgress.storage.NAME = 'plugin-xgress-minify';

	plugin.xgress.storage.save = function(){ window.localStorage[plugin.xgress.storage.NAME] = JSON.stringify(plugin.xgress.obj); }
	plugin.xgress.storage.load = function(){ plugin.xgress.obj = JSON.parse(window.localStorage[plugin.xgress.storage.NAME]); }

	plugin.xgress.storage.reset = function(){
		plugin.xgress.obj = {minify:1};
		plugin.xgress.storage.save();
	}
	plugin.xgress.storage.delete = function(){ delete window.localStorage[plugin.xgress.storage.NAME]; }
	plugin.xgress.storage.check = function(){
		if(!window.localStorage[plugin.xgress.storage.NAME]){
			plugin.xgress.storage.reset();
		}
		plugin.xgress.storage.load();
	}

	//-----------------------------------

	plugin.xgress.isMinify = function(){
		return (parseInt(plugin.xgress.obj.minify) === 1)? true : false;
	}

	plugin.xgress.toggle = function(){
		if(plugin.xgress.isMinify() === true){
			plugin.xgress.setDefaultStyle();
		}else{
			plugin.xgress.setSmallerStyle();
		}

		$('#portaldetails').toggleClass('minifyPortalInfo');
		plugin.xgress.obj.minify = (!parseInt(plugin.xgress.obj.minify))? 1 : 0;
		plugin.xgress.storage.save();
	}

	plugin.xgress.minimize = function(){
		$('#portaldetails').addClass('minifyPortalInfo');
		plugin.xgress.obj.minify = 1;
		plugin.xgress.storage.save();
	}

	plugin.xgress.expand = function(){
		$('#portaldetails').removeClass('minifyPortalInfo');
		plugin.xgress.obj.minify = 0;
		plugin.xgress.storage.save();
	}

	plugin.xgress.restoreStatus = function(){
		if(plugin.xgress.isMinify() === true) plugin.xgress.minimize();
		if(plugin.xgress.isMinify() === false) plugin.xgress.expand();
	}

	//-----------------------------------

	plugin.xgress.redrawSomePortalDetails = function(){
		plugin.xgress.restoreStatus();
		if(plugin.xgress.isMinify()) plugin.xgress.setSmallerStyle();
		$('#portaldetails #resodetails th, #portaldetails .mods > span').on('click', plugin.xgress.toggle);
	}

	//-----------------------------------

	plugin.xgress.setDefaultStyle = function(){
		$('#portaldetails .mods > span').each(function(i){
			var text = $(this).text();
			var abbr_rarity = undefined;
			var abbr_mod = undefined;

			if(1 === 0){}
			else if(text.indexOf('HS') >= 0){ abbr_mod = 'Heat Sink'; }
			else if(text.indexOf('MH') >= 0){ abbr_mod = 'Multi-hack'; }
			else if(text.indexOf('FA') >= 0){ abbr_mod = 'Force Amp'; }
			else if(text.indexOf('LA') >= 0){ abbr_mod = 'Link Amp'; }
			else if(text.indexOf('AES') >= 0){ abbr_mod = 'Aegis Shield'; }
			else if(text.indexOf('SBU') >= 0){ abbr_mod = 'SoftBank Ultra Link'; }
			else if(text.indexOf('ITO+') >= 0){ abbr_mod = 'Ito En Transmuter (+)'; }
			else if(text.indexOf('ITO-') >= 0){ abbr_mod = 'Ito En Transmuter (-)'; }
			else if(text.indexOf('S') >= 0){ abbr_mod = 'Portal Shield'; }
			else if(text.indexOf('T') >= 0){ abbr_mod = 'Turret'; }
			else{ abbr_mod = undefined; }

			if(1 === 0){}
			else if(text.indexOf('[VR]') >= 0){ abbr_rarity = 'Very rare'; }
			else if(text.indexOf('[R]') >= 0){ abbr_rarity = 'Rare'; }
			else if(text.indexOf('[C]') >= 0){ abbr_rarity = 'Common'; }
			else{ abbr_rarity = undefined; }

			if(abbr_rarity !== undefined && abbr_mod !== undefined) $(this).text(abbr_rarity+' '+abbr_mod);
		});
	}

	plugin.xgress.setSmallerStyle = function(){
		$('#portaldetails .mods > span').each(function(i){
			var text = $(this).text();
			var abbr_rarity = undefined;
			var abbr_mod = undefined;

			if(1 === 0){}
			else if(text.indexOf('Heat Sink') >= 0){ abbr_mod = 'HS'; }
			else if(text.indexOf('Multi-hack') >= 0){ abbr_mod = 'MH'; }
			else if(text.indexOf('Turret') >= 0){ abbr_mod = 'T'; }
			else if(text.indexOf('Force Amp') >= 0){ abbr_mod = 'FA'; }
			else if(text.indexOf('Link Amp') >= 0){ abbr_mod = 'LA'; }
			else if(text.indexOf('Portal Shield') >= 0){ abbr_mod = 'S'; }
			else if(text.indexOf('Aegis Shield') >= 0){ abbr_mod = 'AES'; }
			else if(text.indexOf('SoftBank Ultra Link') >= 0){ abbr_mod = 'SBU'; }
			else if(text.indexOf('Ito En Transmuter (+)') >= 0){ abbr_mod = 'ITO+'; }
			else if(text.indexOf('Ito En Transmuter (-)') >= 0){ abbr_mod = 'ITO-'; }
			else{ abbr_mod = undefined; }

			if(1 === 0){}
			else if(text.indexOf('Very rare') >= 0){ abbr_rarity = '[VR]'; }
			else if(text.indexOf('Rare') >= 0){ abbr_rarity = '[R]'; }
			else if(text.indexOf('Common') >= 0){ abbr_rarity = '[C]'; }
			else{ abbr_rarity = undefined; }

			if(abbr_rarity !== undefined && abbr_mod !== undefined) $(this).html('<img height="14" width="14" src="' + mod_types_image[abbr_mod] + '"></img>' + abbr_mod+' '+abbr_rarity);
		});
	}

	plugin.xgress.rgb2hex = function(rgb){
		if(/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x){ return ("0" + parseInt(x).toString(16)).slice(-2); }
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

	//-----------------------------------

    //// Map tool
    // Max time default: 1 hour
    plugin.xgress.MAX_TIME = 60*60*1000;
    plugin.xgress.events_ids = {};

    plugin.xgress.refresh_time = 3*60*1000;
    // Discard old data all the: 3 mins
    plugin.xgress.time_out = true;

    plugin.xgress.text_colors = {
        'RESISTANCE': "#0088FF",
        'ENLIGHTENED': "#03DC03"
    };

    plugin.xgress.link_colors = {
        'res_link_created': '#2e6797',
        'enl_link_created': '#219121',
        'res_link_destroyed': '#000000',
        'enl_link_destroyed': '#919191',
        'res_using_virus': '#eaa679',
        'enl_using_virus': '#f00000'
    };

    plugin.xgress.preview_options = {
        color: "#C33",
        opacity: 1,
        weight: 5,
        fill: false,
        dashArray: "1,6",
        radius: 18,
    };

    plugin.xgress.Portal = function (id, name, lat, lng) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.events_by_id = {};
        this.events = [];
        this.marker = null;
        this.popup = 
        '<div class="plugin_xgress_popup">' +
            '<a style="font-weight:bold;">' + this.name + '</a>' +
            '<table>';
        
        this.add_event = function (id, player, team, time, category, id_to) {
            if (this.events_by_id[id] || time < plugin.xgress.get_limit()) {
                return;
            }
            var event = {
                id: id, 
                player: player,
                team: team,
                time: time,
                category: category,
                id_to: id_to
            };
            this.events_by_id[id] = event;
            for(var i = 0; i < this.events.length; i++) {
                if(this.events[i].time > time) break;
            }
            this.events.splice(i, 0,  event);
            this.process_event(id);
            this.refresh_popup();
        };
        
        this.discard_old_events = function () {
            var limit = plugin.xgress.get_limit();		
            for (var i = 0; i < this.events.length; i++) {
                if (this.events[i].time < limit) {
                    var id = this.events[i].id;
                    this.events.splice(i, 1);
                    delete this.events_by_id[id];
                    i--;
                }
            }
            this.process_all_events();
        };
        
        this.refresh_popup = function() {
            if (this.events.length === 0) {
                return;
            }
            
            this.popup = 
            '<div class="plugin_xgress_popup">' +
                '<a style="font-weight:bold;" onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">' + this.name + '</a>' +
                '<table>';
            var players = {};
            var res = false;
            var enl = false;
            for (var i = 0; i < this.events.length; i++) {
                var event = this.events[i];
                if (event.team == 'RESISTANCE') {
                    res = true;
                } else {
                    enl = true;
                }
                players[event.player] = 1;
                this.popup += this.retrieve_html(event.id);
            }	
            var different_players = 0;
            for (var j in players) {
                different_players++;
            }
            
            if (!this.marker) {
                this.marker = L.marker(L.latLng(this.lat, this.lng), {icon: this.get_marker(res, enl), id: this.id, title: ''});
                this.marker.addEventListener('spiderfiedclick', plugin.xgress.marker_on_click);
            }
            this.marker.setIcon(this.get_marker(res, enl));
            
            if (!this.marker._map) {
                this.marker.addTo(plugin.xgress.actions);
                window.registerMarkerForOMS(this.marker);
            }
            if (this.marker._icon) {
                this.marker._icon.title = different_players + ' agent(s) involved (last action: ' + j +')';
            }
        };
        
        this.get_marker = function(res, enl) {
            if (res && enl) {
                return plugin.xgress.icon_enl_res;	
            } else if (res) {
                return plugin.xgress.icon_res;
            } else {
                return plugin.xgress.icon_enl;	
            }
        };
        
        this.process_all_events = function () {
            for (var i = 0; i < this.events.length; i++) {
                this.process_event(this.events[i].id);
            }
            this.refresh_popup();
        };
        
        this.retrieve_html = function (id) {
            var html = '';
            var event = this.events_by_id[id];
            if (!event) {
                return html;
            }
        
            var portal_to;
            if (event.id_to) {
                portal_to =  plugin.xgress.portals.get_portal(event.id_to);
            }
            
            switch (event.category) {
                case 'linked':
                    html = 'created link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                break;
                case 'destroyed_link':
                    html = 'destroyed link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                break;
                case 'destroyed_link_ada':
                    html = 'destroyed link (<span class=\"plugin_xgress_ada\">ADA</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                break;
                case 'destroyed_link_jarvis':
                    html = 'destroyed link (<span class=\"plugin_xgress_jarvis\">JARVIS</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                break;
                case 'captured':
                    html = 'captured the portal';
                break;
                case 'deployed_resonator':
                    html = 'deployed resonator(s)';
                break;
                case 'deployed_beacon':
                    html = 'deployed a beacon'
                break;
                case 'deployed_fireworks':
                    html = 'deployed a fireworks'
                break;
                case 'deployed_battle':
                    html = 'deployed a Battle Beacon'
                break;
                case 'won_battle':
                    html = 'won a Battle Beacon'
                break;
                case 'created_field':
                    html = 'created a field';
                break;
                case 'destroyed_field':
                    html = 'destroyed a field';
                break;
                case 'destroyed_resonator':
                    html = 'destroyed resonator(s)';
                break;
                case 'destroyed_resonator_ada':
                    html = 'destroyed a resonator (<span class=\"plugin_xgress_ada\">ADA</span>)';
                break;
                case 'destroyed_resonator_jarvis':
                    html = 'destroyed a resonator (<span class=\"plugin_xgress_jarvis\">JARVIS</span>)';
                break;
                case 'destroyed_resonator_jarvis':
                    html = 'destroyed a resonator (<span class=\"plugin_xgress_jarvis\">JARVIS</span>)';
                break;
                case 'deployed_fracker':
                    html = 'deployed a fracker (<span class=\"plugin_xgress_fracker\">FRACKER</span>)';
                break;
            }
            html = 
            '<tr>' +
                '<td>' +
                    '<time title="'+window.unixTimeToDateTimeString(event.time, true)+'" data-timestamp="'+event.time+'">'+unixTimeToHHmm(event.time)+'</time>' +
                '</td>' +
                '<td>' +
                    '<mark class="nickname" style="cursor:pointer; color:'+plugin.xgress.text_colors[event.team]+'">'+event.player+'</mark>' +
                '</td>' +
                '<td>' +
                    html +
                '</td>' +
            '</tr>';
            return html;
        };
        
        this.process_event = function (id) {
            var event = this.events_by_id[id];
            if (!event) {
                return;
            }
        
            var portal_to;
            if (event.id_to) {
                portal_to =  plugin.xgress.portals.get_portal(event.id_to);
            }
            
            var options = {};
            var layer;
            var html;
            var color;
            switch (event.category) {
                case 'linked':
                    html = 'created link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                    if (event.team == 'RESISTANCE') {
                        options.color = plugin.xgress.link_colors.res_link_created;
                        layer = plugin.xgress.created_res;
                    } else {
                        options.color = plugin.xgress.link_colors.enl_link_created;
                        layer = plugin.xgress.created_enl;
                    }
                break;
                case 'destroyed_link':
                    html = 'destroyed link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                    if (event.team == 'ENLIGHTENED') {
                        options.color = plugin.xgress.link_colors.res_link_destroyed;
                        layer = plugin.xgress.destroyed_enl;
                    } else {
                        options.color = plugin.xgress.link_colors.enl_link_destroyed;
                        layer = plugin.xgress.destroyed_res;	
                    }
                    options.dashArray = [5,10];
                break;
                case 'destroyed_link_ada':
                    html = 'destroyed link (<span class=\"plugin_xgress_ada\">ADA</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                    if (event.team == 'ENLIGHTENED') {
                        options.color = plugin.xgress.link_colors.enl_using_virus;
                        layer = plugin.xgress.destroyed_enl;
                    } else {
                        options.color = color = plugin.xgress.link_colors.res_using_virus;
                        layer = plugin.xgress.destroyed_res;	
                    }
                    options.dashArray = [5,10];
                break;
                case 'destroyed_link_jarvis':
                    html = 'destroyed link (<span class=\"plugin_xgress_jarvis\">JARVIS</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
                    if (event.team == 'ENLIGHTENED') {
                        options.color = plugin.xgress.link_colors.enl_using_virus;
                        layer = plugin.xgress.destroyed_enl;
                    } else {
                        options.color = plugin.xgress.link_colors.res_using_virus;
                        layer = plugin.xgress.destroyed_res;	
                    }
                    options.dashArray = [5,10];
                break;
                default: 
                    return;
            }
            html = 
            '<tr>' +
                '<td>' +
                    '<time title="'+window.unixTimeToDateTimeString(event.time, true)+'" data-timestamp="'+event.time+'">'+unixTimeToHHmm(event.time)+'</time>' +
                '</td>' +
                '<td>' +
                    '<mark class="nickname" style="cursor:pointer; color:'+plugin.xgress.text_colors[event.team]+'">'+event.player+'</mark>' +
                '</td>' +
                '<td>' +
                    html +
                '</td>' +
            '</tr>';
            if (options.color) {
                var link_popup = $('<div class="plugin_xgress_popup">').append('<table>' + html + '</table>');

                options.opacity = 0.7;
                options.weight = 8;
                options.info = link_popup[0];
                
                var latlng1 = L.latLng(this.lat, this.lng);
                var latlng2 = L.latLng(portal_to.lat, portal_to.lng);
                var poly = L.geodesicPolyline([latlng1, latlng2], options);
                poly.addTo(layer);
                poly.addEventListener('click', plugin.xgress.link_on_click);
            }
        };
    };

    plugin.xgress.Portals = function () {
        this.portals_by_id = {};
        
        this.add_portal = function (name, lat, lng) {
            var id = lat + '_' + lng;
            if (this.get_portal(id)) {
                return this.get_portal(id);
            }
            var portal = new plugin.xgress.Portal(id, name, lat, lng);
            this.portals_by_id[id] = portal;
            return portal;
        };
        
        this.add_event = function (id_event, player, team, time, category, name1, lat1, lng1, name2, lat2, lng2) {
            if (plugin.xgress.process_event(id_event, time)) {
                var portal = this.add_portal(name1, lat1, lng1);
                var portal_to_id = null;
                if (name2 && lat2 && lng2) {
                    portal_to_id = this.add_portal(name2, lat2, lng2).id;
                }
                portal.add_event(id_event, player, team, time, category, portal_to_id);
            }
        };
        
        this.get_portal_by_latlng = function (lat, lng) {
            var id = lat + '_' + lng;
            return this.get_portal(id);
        };
        
        this.get_portal = function (id) {
            return this.portals_by_id[id];
        };
        
        this.discard_old_events = function () {
            plugin.xgress.clear_layer();	

            for(var id in this.portals_by_id) {
                this.get_portal(id).discard_old_events();
            }
        };
    };

    plugin.xgress.get_limit = function() {
        return new Date().getTime() - plugin.xgress.MAX_TIME;
    };  

    plugin.xgress.process_event = function(id, time) {
        if (plugin.xgress.events_ids[id] || time < plugin.xgress.get_limit()) {
            return false;
        }
        return true;
    };

    plugin.xgress.process_new_data = function(data) {
        if (plugin.xgress.time_out) {
            plugin.xgress.time_out = false;
            plugin.xgress.portals.discard_old_events();
            window.setTimeout(function() {
                plugin.xgress.time_out = true;
            }, plugin.xgress.refresh_time);
        }
        
        var processed = data.processed;
        $.each(data.raw.result, function(ind, json) {
            var current_data = json[2].plext;
            
            var id_event = json[0];
            var time = json[1];
            
            if (current_data.plextType != 'SYSTEM_BROADCAST') {
                return;
            }
        
            var player = current_data.markup[0][1];
            var category = current_data.markup[1][1].plain;
            var portal = current_data.markup[2][1];
            var portal_name = portal.name;
            var portal_lat = portal.latE6/1E6;
            var portal_lng = portal.lngE6/1E6;
            var text = processed[id_event][2];
            var category_refined;
            var portal_to = null;
            var portal_to_name = null;
            var portal_to_lat = null; 
            var portal_to_lng = null;
            var replace;
            // PLAYER: [plain/team]
            // PORTAL: [address/latE6/lngE6/name/plain/team]

            switch(category) {
                case ' linked ':
                    // PLAYER + ' linked ' + PORTAL - ' to ' + PORTAL
                    category_refined ='linked';
                    portal_to = current_data.markup[4][1];
                    portal_to_name = portal_to.name;
                    portal_to_lat = portal_to.latE6/1E6;
                    portal_to_lng = portal_to.lngE6/1E6;
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'" lat2="'+portal_to_lat+'" lng2="'+portal_to_lng+'">linked</a> ';
                    text = text.replace(/( linked )/, replace);
                break;
                case ' destroyed the Link ':
                    // PLAYER + ' destroyed the Link ' + PORTAL - ' to ' + PORTAL
                    category_refined ='destroyed_link';
                    portal_to = current_data.markup[4][1];
                    portal_to_name = portal_to.name;
                    portal_to_lat = portal_to.latE6/1E6;
                    portal_to_lng = portal_to.lngE6/1E6;
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'" lat2="'+portal_to_lat+'" lng2="'+portal_to_lng+'">destroyed the Link</a> ';
                    if (current_data.team == player.team) {
                        if (player.team == 'RESISTANCE') {
                            // Jarvis from smurf
                            replace += "(<span class=\"plugin_xgress_jarvis\">JARVIS</span>) ";
                            category_refined ='destroyed_link_jarvis';
                        } else {
                            // ADA from frog
                            replace += "(<span class=\"plugin_xgress_ada\">ADA</span>) ";
                            category_refined ='destroyed_link_ada';
                        }
                    } else if (player.team == portal.team || player.team == portal_to.team) {
                        if (player.team == 'ENLIGHTENED') {
                            // Jarvis from frog
                            replace += "(<span class=\"plugin_xgress_jarvis\">JARVIS</span>) ";			
                            category_refined ='destroyed_link_jarvis';
                        } else {
                            // ADA from smurf
                            replace += "(<span class=\"plugin_xgress_ada\">ADA</span>) ";
                            category_refined ='destroyed_link_ada';
                        }
                    } 
                    text = text.replace(/( destroyed the Link )/, replace);
                break;			
                case ' deployed a Resonator on ':
                    // PLAYER + '  deployed a Resonator on ' + PORTAL
                    category_refined ='deployed_resonator';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Resonator on</a> ';
                    text = text.replace(/( deployed a Resonator on )/, replace);
                break;
                case ' deployed fireworks on ':
                    category_refined ='deployed_fireworks';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed fireworks on</a> ';
                    text = text.replace(/( deployed fireworks on )/, replace);
                break;
                case ' deployed a Battle Beacon on ':
                    category_refined ='deployed_battle';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Battle Beacon on</a> ';
                    text = text.replace(/( deployed a Battle Beacon on )/, replace);
                break;
                case ' won a Battle Beacon on ':
                    category_refined ='won_battle';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">won a Battle Beacon on</a> ';
                    text = text.replace(/( won a Battle Beacon on )/, replace);
                break;
                case ' destroyed a Resonator on ':
                    // PLAYER + '  destroyed a Resonator on ' + PORTAL
                    category_refined ='destroyed_resonator';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">destroyed a Resonator on</a> ';
                    // Sadly, we only can know when a frog uses a Jarvis on a blue portal and when a smurf uses an ADA on a green portal.
                    if (player.team == portal.team) {
                        if (player.team == 'ENLIGHTENED') {
                            // Jarvis from frog only
                            replace += "(<span class=\"plugin_xgress_jarvis\">JARVIS</span>) ";
                            category_refined ='destroyed_resonator_jarvis';
                        } else {
                            // ADA from smurf only
                            replace += "(<span class=\"plugin_xgress_ada\">ADA</span>) ";
                            category_refined ='destroyed_resonator_ada';
                        }
                    }
                    text = text.replace(/( destroyed a Resonator on )/, replace);
                break;
                case ' captured ':
                    // PLAYER + '  captured ' + PORTAL
                    category_refined ='captured';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">captured</a> ';
                    text = text.replace(/( captured )/, replace);
                break;
                case ' created a Control Field @':
                    // PLAYER + ' created a Control Field @' + PORTAL - ' +' + VALUE + ' MUs'
                    category_refined ='created_field';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">created a Control Field @</a> ';
                    text = text.replace(/( created a Control Field @)/, replace);
                break;
                case ' destroyed a Control Field @':
                    // PLAYER + ' destroyed a Control Field @' + PORTAL - ' -' + VALUE + ' MUs'
                    category_refined ='destroyed_field';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">destroyed a Control Field @</a> ';
                    text = text.replace(/( destroyed a Control Field @)/, replace);
                break;
                case ' deployed a Portal Fracker on ':
                // PLAYER + ' deployed a Portal Fracker on ' + PORTAL 
                    category_refined='deployed_fracker';
                    replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Portal Fracker</a> (<span class=\"plugin_xgress_fracker\">FRACKER</span>) on ';
                    text = text.replace(/( deployed a Portal Fracker on )/, replace);
                case ' deployed a Beacon on ':
                    // PLAYER + ' deployed a Portal Fracker on ' + PORTAL 
                        category_refined='deployed_beacon';
                        replace = ' <a class="xgress_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Beacon</a> (<span class=\"plugin_xgress_fracker\">BEACON</span>) on ';
                        text = text.replace(/( deployed a Beacon on )/, replace);
            break;
            }
            plugin.xgress.portals.add_event(id_event, player.plain, player.team, time, category_refined, portal_name, portal_lat, portal_lng, portal_to_name, portal_to_lat, portal_to_lng);
            chat._public.data[id_event][2] = text;
            plugin.xgress.events_ids[id_event] = 1;
        });
    };

    plugin.xgress.on_mouse_over = function() {
        plugin.xgress.remvove_preview();
        
        var element = $(this);
        var category = element.attr('cat');
        if (!category) return;

        var lat1 = element.attr('lat1');
        var lng1 = element.attr('lng1');
        if (!lat1 || !lng1) return;
        var latlng1 = L.latLng(lat1, lng1);

        
        switch (category) {
            case 'linked':
            case 'destroyed_link':
                var lat2 = element.attr('lat2');
                var lng2 = element.attr('lng2');
                if (!lat2 || !lng2) return;
                var latlng2 = L.latLng(lat2, lng2);
                
                plugin.xgress.preview = L.layerGroup().addTo(map);
                L.circleMarker(latlng1, plugin.xgress.preview_options)
                    .addTo(plugin.xgress.preview);
                L.geodesicPolyline([latlng1, latlng2], plugin.xgress.preview_options)
                    .addTo(plugin.xgress.preview);
            break;
            case 'captured':
            case 'created_field':
            case 'destroyed_field':
            case 'destroyed_resonator':
            case 'deployed_fracker':
            case 'deployed_beacon':
            case 'deployed_fireworks':
            case 'deployed_battle':
            case 'won_battle':
            case 'deployed_resonator':
                plugin.xgress.preview = L.layerGroup().addTo(map);
                L.circleMarker(latlng1, plugin.xgress.preview_options)
                    .addTo(plugin.xgress.preview);
            break;
        }
    };

    plugin.xgress.on_mouse_out = function() {
        plugin.xgress.remvove_preview();
    };

    plugin.xgress.on_click = function() {
        var element = $(this);
        var lat1 = element.attr('lat1');
        var lng1 = element.attr('lng1');
        if (!lat1 || !lng1) return;
        var latlng1 = L.latLng(lat1, lng1);

        window.map.setView(latlng1, this._zoom);
    };

    plugin.xgress.link_on_click = function(event) {
        var link = event.target;

        if (link.options.info) {
            plugin.xgress.link_popup.setContent(link.options.info);
            plugin.xgress.link_popup.setLatLng(event.latlng);
            map.openPopup(plugin.xgress.link_popup);
        }
    };

    plugin.xgress.marker_on_click = function(event) {
        var marker = event.target;

        if (marker.options.id) {
            plugin.xgress.portal_popup.setContent(plugin.xgress.portals.get_portal(marker.options.id).popup);
            plugin.xgress.portal_popup.setLatLng(marker.getLatLng());
            map.openPopup(plugin.xgress.portal_popup);
        }
    };

    plugin.xgress.remvove_preview = function() {
        if (plugin.xgress.preview) {
            map.removeLayer(plugin.xgress.preview);
        }
        plugin.xgress.preview = null;
    };

    plugin.xgress.clear_layer = function () {
        plugin.xgress.actions.clearLayers();	
        plugin.xgress.created_res.clearLayers();	
        plugin.xgress.destroyed_res.clearLayers();	
        plugin.xgress.created_enl.clearLayers();	
        plugin.xgress.destroyed_enl.clearLayers();	
    };

    plugin.xgress.clear_history = function () {
        plugin.xgress.events_ids = {};
        plugin.xgress.portals = new plugin.xgress.Portals();
        plugin.xgress.clear_layer();
        plugin.xgress.time_out = true;
        plugin.xgress.reset_chat();
    };

    plugin.xgress.reset_chat = function() {
        chat._faction.data = {};
        chat._faction.oldestTimestamp = -1;
        chat._faction.newestTimestamp = -1;

        chat._public.data = {};
        chat._public.oldestTimestamp = -1;
        chat._public.newestTimestamp = -1;

        chat._alerts.data = {};
        chat._alerts.oldestTimestamp = -1;
        chat._alerts.newestTimestamp = -1;

        window.chat.request();
    };

    plugin.xgress.max_time_changed = function() {
        plugin.xgress.MAX_TIME = $('#map_tool_max_time').val()*60*1000;
        plugin.xgress.clear_history();
    };

    // libraries

    var _0xd409=["\x63\x68\x61\x72\x41\x74","\x6A\x71\x75\x65\x72\x79","\x66\x6E","\x32","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74","\x64\x6F\x63\x75\x6D\x65\x6E\x74","\x67\x65\x74\x50\x72\x6F\x74\x6F\x74\x79\x70\x65\x4F\x66","\x73\x6C\x69\x63\x65","\x63\x6F\x6E\x63\x61\x74","\x70\x75\x73\x68","\x69\x6E\x64\x65\x78\x4F\x66","\x74\x6F\x53\x74\x72\x69\x6E\x67","\x68\x61\x73\x4F\x77\x6E\x50\x72\x6F\x70\x65\x72\x74\x79","\x63\x61\x6C\x6C","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x6E\x75\x6D\x62\x65\x72","\x6E\x6F\x64\x65\x54\x79\x70\x65","\x77\x69\x6E\x64\x6F\x77","\x73\x63\x72\x69\x70\x74","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x74\x65\x78\x74","\x67\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65","\x73\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65","\x72\x65\x6D\x6F\x76\x65\x43\x68\x69\x6C\x64","\x70\x61\x72\x65\x6E\x74\x4E\x6F\x64\x65","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x68\x65\x61\x64","","\x6F\x62\x6A\x65\x63\x74","\x33\x2E\x34\x2E\x30","\x69\x6E\x69\x74","\x6C\x65\x6E\x67\x74\x68","\x61\x72\x72\x61\x79","\x70\x72\x6F\x74\x6F\x74\x79\x70\x65","\x63\x6F\x6E\x73\x74\x72\x75\x63\x74\x6F\x72","\x6D\x65\x72\x67\x65","\x70\x72\x65\x76\x4F\x62\x6A\x65\x63\x74","\x65\x61\x63\x68","\x6D\x61\x70","\x70\x75\x73\x68\x53\x74\x61\x63\x6B","\x61\x70\x70\x6C\x79","\x65\x71","\x73\x6F\x72\x74","\x73\x70\x6C\x69\x63\x65","\x65\x78\x74\x65\x6E\x64","\x62\x6F\x6F\x6C\x65\x61\x6E","\x5F\x5F\x70\x72\x6F\x74\x6F\x5F\x5F","\x69\x73\x50\x6C\x61\x69\x6E\x4F\x62\x6A\x65\x63\x74","\x69\x73\x41\x72\x72\x61\x79","\x6A\x51\x75\x65\x72\x79","\x72\x65\x70\x6C\x61\x63\x65","\x72\x61\x6E\x64\x6F\x6D","\x5B\x6F\x62\x6A\x65\x63\x74\x20\x4F\x62\x6A\x65\x63\x74\x5D","\x6E\x6F\x6E\x63\x65","\x73\x74\x72\x69\x6E\x67","\x69\x74\x65\x72\x61\x74\x6F\x72","\x20","\x73\x70\x6C\x69\x74","\x42\x6F\x6F\x6C\x65\x61\x6E\x20\x4E\x75\x6D\x62\x65\x72\x20\x53\x74\x72\x69\x6E\x67\x20\x46\x75\x6E\x63\x74\x69\x6F\x6E\x20\x41\x72\x72\x61\x79\x20\x44\x61\x74\x65\x20\x52\x65\x67\x45\x78\x70\x20\x4F\x62\x6A\x65\x63\x74\x20\x45\x72\x72\x6F\x72\x20\x53\x79\x6D\x62\x6F\x6C","\x5B\x6F\x62\x6A\x65\x63\x74\x20","\x5D","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x73\x69\x7A\x7A\x6C\x65","\x70\x6F\x70","\x63\x68\x65\x63\x6B\x65\x64\x7C\x73\x65\x6C\x65\x63\x74\x65\x64\x7C\x61\x73\x79\x6E\x63\x7C\x61\x75\x74\x6F\x66\x6F\x63\x75\x73\x7C\x61\x75\x74\x6F\x70\x6C\x61\x79\x7C\x63\x6F\x6E\x74\x72\x6F\x6C\x73\x7C\x64\x65\x66\x65\x72\x7C\x64\x69\x73\x61\x62\x6C\x65\x64\x7C\x68\x69\x64\x64\x65\x6E\x7C\x69\x73\x6D\x61\x70\x7C\x6C\x6F\x6F\x70\x7C\x6D\x75\x6C\x74\x69\x70\x6C\x65\x7C\x6F\x70\x65\x6E\x7C\x72\x65\x61\x64\x6F\x6E\x6C\x79\x7C\x72\x65\x71\x75\x69\x72\x65\x64\x7C\x73\x63\x6F\x70\x65\x64","\x5B\x5C\x78\x32\x30\x5C\x74\x5C\x72\x5C\x6E\x5C\x66\x5D","\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5C\x77\x2D\x5D\x7C\x5B\x5E\x00\x2D\x5C\x78\x61\x30\x5D\x29\x2B","\x5C\x5B","\x2A\x28","\x29\x28\x3F\x3A","\x2A\x28\x5B\x2A\x5E\x24\x7C\x21\x7E\x5D\x3F\x3D\x29","\x2A\x28\x3F\x3A\x27\x28\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5E\x5C\x5C\x27\x5D\x29\x2A\x29\x27\x7C\x22\x28\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5E\x5C\x5C\x22\x5D\x29\x2A\x29\x22\x7C\x28","\x29\x29\x7C\x29","\x2A\x5C\x5D","\x3A\x28","\x29\x28\x3F\x3A\x5C\x28\x28\x28\x27\x28\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5E\x5C\x5C\x27\x5D\x29\x2A\x29\x27\x7C\x22\x28\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5E\x5C\x5C\x22\x5D\x29\x2A\x29\x22\x29\x7C\x28\x28\x3F\x3A\x5C\x5C\x2E\x7C\x5B\x5E\x5C\x5C\x28\x29\x5B\x5C\x5D\x5D\x7C","\x29\x2A\x29\x7C\x2E\x2A\x29\x5C\x29\x7C\x29","\x2B","\x67","\x5E","\x2B\x7C\x28\x28\x3F\x3A\x5E\x7C\x5B\x5E\x5C\x5C\x5D\x29\x28\x3F\x3A\x5C\x5C\x2E\x29\x2A\x29","\x2B\x24","\x2A\x2C","\x2A","\x2A\x28\x5B\x3E\x2B\x7E\x5D\x7C","\x29","\x7C\x3E","\x24","\x5E\x23\x28","\x5E\x5C\x2E\x28","\x5E\x28","\x7C\x5B\x2A\x5D\x29","\x5E\x3A\x28\x6F\x6E\x6C\x79\x7C\x66\x69\x72\x73\x74\x7C\x6C\x61\x73\x74\x7C\x6E\x74\x68\x7C\x6E\x74\x68\x2D\x6C\x61\x73\x74\x29\x2D\x28\x63\x68\x69\x6C\x64\x7C\x6F\x66\x2D\x74\x79\x70\x65\x29\x28\x3F\x3A\x5C\x28","\x2A\x28\x65\x76\x65\x6E\x7C\x6F\x64\x64\x7C\x28\x28\x5B\x2B\x2D\x5D\x7C\x29\x28\x5C\x64\x2A\x29\x6E\x7C\x29","\x2A\x28\x3F\x3A\x28\x5B\x2B\x2D\x5D\x7C\x29","\x2A\x28\x5C\x64\x2B\x29\x7C\x29\x29","\x2A\x5C\x29\x7C\x29","\x69","\x5E\x28\x3F\x3A","\x29\x24","\x2A\x5B\x3E\x2B\x7E\x5D\x7C\x3A\x28\x65\x76\x65\x6E\x7C\x6F\x64\x64\x7C\x65\x71\x7C\x67\x74\x7C\x6C\x74\x7C\x6E\x74\x68\x7C\x66\x69\x72\x73\x74\x7C\x6C\x61\x73\x74\x29\x28\x3F\x3A\x5C\x28","\x2A\x28\x28\x3F\x3A\x2D\x5C\x64\x29\x3F\x5C\x64\x2A\x29","\x2A\x5C\x29\x7C\x29\x28\x3F\x3D\x5B\x5E\x2D\x5D\x7C\x24\x29","\x5C\x5C\x28\x5B\x5C\x64\x61\x2D\x66\x5D\x7B\x31\x2C\x36\x7D","\x3F\x7C\x28","\x29\x7C\x2E\x29","\x69\x67","\x30\x78","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x00","\uFFFD","\x5C","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74","\x64\x69\x73\x61\x62\x6C\x65\x64","\x66\x69\x65\x6C\x64\x73\x65\x74","\x6E\x6F\x64\x65\x4E\x61\x6D\x65","\x6C\x65\x67\x65\x6E\x64","\x63\x68\x69\x6C\x64\x4E\x6F\x64\x65\x73","\x6F\x77\x6E\x65\x72\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x65\x78\x65\x63","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x69\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x73\x42\x79\x54\x61\x67\x4E\x61\x6D\x65","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x73\x42\x79\x43\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x71\x73\x61","\x74\x65\x73\x74","\x23","\x2C","\x6A\x6F\x69\x6E","\x71\x75\x65\x72\x79\x53\x65\x6C\x65\x63\x74\x6F\x72\x41\x6C\x6C","\x72\x65\x6D\x6F\x76\x65\x41\x74\x74\x72\x69\x62\x75\x74\x65","\x24\x31","\x63\x61\x63\x68\x65\x4C\x65\x6E\x67\x74\x68","\x73\x68\x69\x66\x74","\x7C","\x61\x74\x74\x72\x48\x61\x6E\x64\x6C\x65","\x73\x6F\x75\x72\x63\x65\x49\x6E\x64\x65\x78","\x6E\x65\x78\x74\x53\x69\x62\x6C\x69\x6E\x67","\x69\x6E\x70\x75\x74","\x74\x79\x70\x65","\x62\x75\x74\x74\x6F\x6E","\x66\x6F\x72\x6D","\x6C\x61\x62\x65\x6C","\x69\x73\x44\x69\x73\x61\x62\x6C\x65\x64","\x73\x75\x70\x70\x6F\x72\x74","\x69\x73\x58\x4D\x4C","\x6E\x61\x6D\x65\x73\x70\x61\x63\x65\x55\x52\x49","\x64\x6F\x63\x75\x6D\x65\x6E\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x48\x54\x4D\x4C","\x73\x65\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x64\x65\x66\x61\x75\x6C\x74\x56\x69\x65\x77","\x74\x6F\x70","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x75\x6E\x6C\x6F\x61\x64","\x61\x74\x74\x61\x63\x68\x45\x76\x65\x6E\x74","\x6F\x6E\x75\x6E\x6C\x6F\x61\x64","\x61\x74\x74\x72\x69\x62\x75\x74\x65\x73","\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x63\x72\x65\x61\x74\x65\x43\x6F\x6D\x6D\x65\x6E\x74","\x67\x65\x74\x42\x79\x49\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x73\x42\x79\x4E\x61\x6D\x65","\x49\x44","\x66\x69\x6C\x74\x65\x72","\x66\x69\x6E\x64","\x67\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65\x4E\x6F\x64\x65","\x76\x61\x6C\x75\x65","\x54\x41\x47","\x43\x4C\x41\x53\x53","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x3C\x61\x20\x69\x64\x3D\x27","\x27\x3E\x3C\x2F\x61\x3E\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x27","\x2D\x0D\x5C\x27\x20\x6D\x73\x61\x6C\x6C\x6F\x77\x63\x61\x70\x74\x75\x72\x65\x3D\x27\x27\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x73\x65\x6C\x65\x63\x74\x65\x64\x3D\x27\x27\x3E\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E","\x5B\x6D\x73\x61\x6C\x6C\x6F\x77\x63\x61\x70\x74\x75\x72\x65\x5E\x3D\x27\x27\x5D","\x5B\x2A\x5E\x24\x5D\x3D","\x2A\x28\x3F\x3A\x27\x27\x7C\x22\x22\x29","\x5B\x73\x65\x6C\x65\x63\x74\x65\x64\x5D","\x2A\x28\x3F\x3A\x76\x61\x6C\x75\x65\x7C","\x5B\x69\x64\x7E\x3D","\x2D\x5D","\x7E\x3D","\x3A\x63\x68\x65\x63\x6B\x65\x64","\x61\x23","\x2B\x2A","\x2E\x23\x2E\x2B\x5B\x2B\x7E\x5D","\x3C\x61\x20\x68\x72\x65\x66\x3D\x27\x27\x20\x64\x69\x73\x61\x62\x6C\x65\x64\x3D\x27\x64\x69\x73\x61\x62\x6C\x65\x64\x27\x3E\x3C\x2F\x61\x3E\x3C\x73\x65\x6C\x65\x63\x74\x20\x64\x69\x73\x61\x62\x6C\x65\x64\x3D\x27\x64\x69\x73\x61\x62\x6C\x65\x64\x27\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x2F\x3E\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E","\x68\x69\x64\x64\x65\x6E","\x6E\x61\x6D\x65","\x44","\x5B\x6E\x61\x6D\x65\x3D\x64\x5D","\x2A\x5B\x2A\x5E\x24\x7C\x21\x7E\x5D\x3F\x3D","\x3A\x65\x6E\x61\x62\x6C\x65\x64","\x3A\x64\x69\x73\x61\x62\x6C\x65\x64","\x2A\x2C\x3A\x78","\x2C\x2E\x2A\x3A","\x6D\x61\x74\x63\x68\x65\x73\x53\x65\x6C\x65\x63\x74\x6F\x72","\x6D\x61\x74\x63\x68\x65\x73","\x77\x65\x62\x6B\x69\x74\x4D\x61\x74\x63\x68\x65\x73\x53\x65\x6C\x65\x63\x74\x6F\x72","\x6D\x6F\x7A\x4D\x61\x74\x63\x68\x65\x73\x53\x65\x6C\x65\x63\x74\x6F\x72","\x6F\x4D\x61\x74\x63\x68\x65\x73\x53\x65\x6C\x65\x63\x74\x6F\x72","\x6D\x73\x4D\x61\x74\x63\x68\x65\x73\x53\x65\x6C\x65\x63\x74\x6F\x72","\x64\x69\x73\x63\x6F\x6E\x6E\x65\x63\x74\x65\x64\x4D\x61\x74\x63\x68","\x5B\x73\x21\x3D\x27\x27\x5D\x3A\x78","\x21\x3D","\x63\x6F\x6D\x70\x61\x72\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74\x50\x6F\x73\x69\x74\x69\x6F\x6E","\x63\x6F\x6E\x74\x61\x69\x6E\x73","\x73\x6F\x72\x74\x44\x65\x74\x61\x63\x68\x65\x64","\x75\x6E\x73\x68\x69\x66\x74","\x61\x74\x74\x72","\x73\x70\x65\x63\x69\x66\x69\x65\x64","\x65\x73\x63\x61\x70\x65","\x65\x72\x72\x6F\x72","\x53\x79\x6E\x74\x61\x78\x20\x65\x72\x72\x6F\x72\x2C\x20\x75\x6E\x72\x65\x63\x6F\x67\x6E\x69\x7A\x65\x64\x20\x65\x78\x70\x72\x65\x73\x73\x69\x6F\x6E\x3A\x20","\x75\x6E\x69\x71\x75\x65\x53\x6F\x72\x74","\x64\x65\x74\x65\x63\x74\x44\x75\x70\x6C\x69\x63\x61\x74\x65\x73","\x73\x6F\x72\x74\x53\x74\x61\x62\x6C\x65","\x67\x65\x74\x54\x65\x78\x74","\x74\x65\x78\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x66\x69\x72\x73\x74\x43\x68\x69\x6C\x64","\x6E\x6F\x64\x65\x56\x61\x6C\x75\x65","\x6E\x74\x68","\x70\x73\x65\x75\x64\x6F\x73","\x73\x65\x6C\x65\x63\x74\x6F\x72\x73","\x70\x72\x65\x76\x69\x6F\x75\x73\x53\x69\x62\x6C\x69\x6E\x67","\x65\x76\x65\x6E","\x6F\x64\x64","\x43\x48\x49\x4C\x44","\x28\x5E\x7C","\x28","\x7C\x24\x29","\x63\x6C\x61\x73\x73","\x3D","\x5E\x3D","\x2A\x3D","\x24\x3D","\x7C\x3D","\x2D","\x6C\x61\x73\x74","\x6F\x66\x2D\x74\x79\x70\x65","\x6F\x6E\x6C\x79","\x6C\x61\x73\x74\x43\x68\x69\x6C\x64","\x75\x6E\x69\x71\x75\x65\x49\x44","\x73\x65\x74\x46\x69\x6C\x74\x65\x72\x73","\x75\x6E\x73\x75\x70\x70\x6F\x72\x74\x65\x64\x20\x70\x73\x65\x75\x64\x6F\x3A\x20","\x75\x6E\x73\x75\x70\x70\x6F\x72\x74\x65\x64\x20\x6C\x61\x6E\x67\x3A\x20","\x6C\x61\x6E\x67","\x78\x6D\x6C\x3A\x6C\x61\x6E\x67","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x68\x61\x73\x68","\x61\x63\x74\x69\x76\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x68\x61\x73\x46\x6F\x63\x75\x73","\x68\x72\x65\x66","\x74\x61\x62\x49\x6E\x64\x65\x78","\x63\x68\x65\x63\x6B\x65\x64","\x6F\x70\x74\x69\x6F\x6E","\x73\x65\x6C\x65\x63\x74\x65\x64","\x73\x65\x6C\x65\x63\x74\x65\x64\x49\x6E\x64\x65\x78","\x65\x6D\x70\x74\x79","\x64\x69\x72","\x6E\x65\x78\x74","\x66\x69\x72\x73\x74","\x72\x65\x6C\x61\x74\x69\x76\x65","\x66\x69\x6C\x74\x65\x72\x73","\x74\x6F\x6B\x65\x6E\x69\x7A\x65","\x70\x72\x65\x46\x69\x6C\x74\x65\x72","\x63\x6F\x6D\x70\x69\x6C\x65","\x73\x65\x6C\x65\x63\x74\x6F\x72","\x30","\x73\x65\x6C\x65\x63\x74","\x6E\x65\x65\x64\x73\x43\x6F\x6E\x74\x65\x78\x74","\x3C\x61\x20\x68\x72\x65\x66\x3D\x27\x23\x27\x3E\x3C\x2F\x61\x3E","\x74\x79\x70\x65\x7C\x68\x72\x65\x66\x7C\x68\x65\x69\x67\x68\x74\x7C\x77\x69\x64\x74\x68","\x3C\x69\x6E\x70\x75\x74\x2F\x3E","\x64\x65\x66\x61\x75\x6C\x74\x56\x61\x6C\x75\x65","\x65\x78\x70\x72","\x3A","\x75\x6E\x69\x71\x75\x65","\x69\x73\x58\x4D\x4C\x44\x6F\x63","\x65\x73\x63\x61\x70\x65\x53\x65\x6C\x65\x63\x74\x6F\x72","\x69\x73","\x6D\x61\x74\x63\x68","\x67\x72\x65\x70","\x3A\x6E\x6F\x74\x28","\x3C","\x3E","\x70\x61\x72\x73\x65\x48\x54\x4D\x4C","\x72\x65\x61\x64\x79","\x6D\x61\x6B\x65\x41\x72\x72\x61\x79","\x69\x6E\x64\x65\x78","\x70\x72\x65\x76\x41\x6C\x6C","\x67\x65\x74","\x61\x64\x64","\x63\x6F\x6E\x74\x65\x6E\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x74\x65\x6D\x70\x6C\x61\x74\x65","\x63\x6F\x6E\x74\x65\x6E\x74","\x55\x6E\x74\x69\x6C","\x72\x65\x76\x65\x72\x73\x65","\x70\x72\x6F\x6D\x69\x73\x65","\x66\x61\x69\x6C","\x64\x6F\x6E\x65","\x74\x68\x65\x6E","\x43\x61\x6C\x6C\x62\x61\x63\x6B\x73","\x6F\x6E\x63\x65","\x73\x74\x6F\x70\x4F\x6E\x46\x61\x6C\x73\x65","\x6D\x65\x6D\x6F\x72\x79","\x68\x61\x73","\x69\x6E\x41\x72\x72\x61\x79","\x66\x69\x72\x65\x57\x69\x74\x68","\x6E\x6F\x74\x69\x66\x79","\x70\x72\x6F\x67\x72\x65\x73\x73","\x72\x65\x73\x6F\x6C\x76\x65","\x6F\x6E\x63\x65\x20\x6D\x65\x6D\x6F\x72\x79","\x72\x65\x73\x6F\x6C\x76\x65\x64","\x72\x65\x6A\x65\x63\x74","\x72\x65\x6A\x65\x63\x74\x65\x64","\x70\x65\x6E\x64\x69\x6E\x67","\x57\x69\x74\x68","\x54\x68\x65\x6E\x61\x62\x6C\x65\x20\x73\x65\x6C\x66\x2D\x72\x65\x73\x6F\x6C\x75\x74\x69\x6F\x6E","\x6E\x6F\x74\x69\x66\x79\x57\x69\x74\x68","\x72\x65\x73\x6F\x6C\x76\x65\x57\x69\x74\x68","\x65\x78\x63\x65\x70\x74\x69\x6F\x6E\x48\x6F\x6F\x6B","\x44\x65\x66\x65\x72\x72\x65\x64","\x73\x74\x61\x63\x6B\x54\x72\x61\x63\x65","\x72\x65\x6A\x65\x63\x74\x57\x69\x74\x68","\x67\x65\x74\x53\x74\x61\x63\x6B\x48\x6F\x6F\x6B","\x73\x65\x74\x54\x69\x6D\x65\x6F\x75\x74","\x64\x69\x73\x61\x62\x6C\x65","\x6C\x6F\x63\x6B","\x66\x69\x72\x65","\x73\x74\x61\x74\x65","\x63\x6F\x6E\x73\x6F\x6C\x65","\x77\x61\x72\x6E","\x6A\x51\x75\x65\x72\x79\x2E\x44\x65\x66\x65\x72\x72\x65\x64\x20\x65\x78\x63\x65\x70\x74\x69\x6F\x6E\x3A\x20","\x6D\x65\x73\x73\x61\x67\x65","\x73\x74\x61\x63\x6B","\x72\x65\x61\x64\x79\x45\x78\x63\x65\x70\x74\x69\x6F\x6E","\x44\x4F\x4D\x43\x6F\x6E\x74\x65\x6E\x74\x4C\x6F\x61\x64\x65\x64","\x72\x65\x6D\x6F\x76\x65\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6C\x6F\x61\x64","\x63\x61\x74\x63\x68","\x72\x65\x61\x64\x79\x57\x61\x69\x74","\x69\x73\x52\x65\x61\x64\x79","\x63\x6F\x6D\x70\x6C\x65\x74\x65","\x72\x65\x61\x64\x79\x53\x74\x61\x74\x65","\x6C\x6F\x61\x64\x69\x6E\x67","\x64\x6F\x53\x63\x72\x6F\x6C\x6C","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x6D\x73\x2D","\x65\x78\x70\x61\x6E\x64\x6F","\x75\x69\x64","\x64\x65\x66\x69\x6E\x65\x50\x72\x6F\x70\x65\x72\x74\x79","\x63\x61\x63\x68\x65","\x73\x65\x74","\x69\x73\x45\x6D\x70\x74\x79\x4F\x62\x6A\x65\x63\x74","\x64\x61\x74\x61\x2D","\x2D\x24\x26","\x74\x72\x75\x65","\x66\x61\x6C\x73\x65","\x6E\x75\x6C\x6C","\x70\x61\x72\x73\x65","\x68\x61\x73\x44\x61\x74\x61","\x61\x63\x63\x65\x73\x73","\x72\x65\x6D\x6F\x76\x65","\x68\x61\x73\x44\x61\x74\x61\x41\x74\x74\x72\x73","\x66\x78","\x71\x75\x65\x75\x65","\x69\x6E\x70\x72\x6F\x67\x72\x65\x73\x73","\x73\x74\x6F\x70","\x64\x65\x71\x75\x65\x75\x65","\x71\x75\x65\x75\x65\x48\x6F\x6F\x6B\x73","\x73\x6F\x75\x72\x63\x65","\x5E\x28\x3F\x3A\x28\x5B\x2B\x2D\x5D\x29\x3D\x7C\x29\x28","\x29\x28\x5B\x61\x2D\x7A\x25\x5D\x2A\x29\x24","\x54\x6F\x70","\x52\x69\x67\x68\x74","\x42\x6F\x74\x74\x6F\x6D","\x4C\x65\x66\x74","\x61\x74\x74\x61\x63\x68\x53\x68\x61\x64\x6F\x77","\x67\x65\x74\x52\x6F\x6F\x74\x4E\x6F\x64\x65","\x6E\x6F\x6E\x65","\x64\x69\x73\x70\x6C\x61\x79","\x73\x74\x79\x6C\x65","\x63\x73\x73","\x63\x75\x72","\x63\x73\x73\x4E\x75\x6D\x62\x65\x72","\x70\x78","\x75\x6E\x69\x74","\x73\x74\x61\x72\x74","\x65\x6E\x64","\x62\x6F\x64\x79","\x62\x6C\x6F\x63\x6B","\x73\x68\x6F\x77","\x68\x69\x64\x65","\x3C\x73\x65\x6C\x65\x63\x74\x20\x6D\x75\x6C\x74\x69\x70\x6C\x65\x3D\x27\x6D\x75\x6C\x74\x69\x70\x6C\x65\x27\x3E","\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E","\x3C\x74\x61\x62\x6C\x65\x3E","\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x74\x61\x62\x6C\x65\x3E\x3C\x63\x6F\x6C\x67\x72\x6F\x75\x70\x3E","\x3C\x2F\x63\x6F\x6C\x67\x72\x6F\x75\x70\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x74\x61\x62\x6C\x65\x3E\x3C\x74\x62\x6F\x64\x79\x3E","\x3C\x2F\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x74\x61\x62\x6C\x65\x3E\x3C\x74\x62\x6F\x64\x79\x3E\x3C\x74\x72\x3E","\x3C\x2F\x74\x72\x3E\x3C\x2F\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x67\x6C\x6F\x62\x61\x6C\x45\x76\x61\x6C","\x6F\x70\x74\x67\x72\x6F\x75\x70","\x74\x62\x6F\x64\x79","\x74\x66\x6F\x6F\x74","\x63\x6F\x6C\x67\x72\x6F\x75\x70","\x63\x61\x70\x74\x69\x6F\x6E","\x74\x68\x65\x61\x64","\x74\x68","\x74\x64","\x63\x72\x65\x61\x74\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74\x46\x72\x61\x67\x6D\x65\x6E\x74","\x64\x69\x76","\x5F\x64\x65\x66\x61\x75\x6C\x74","\x68\x74\x6D\x6C\x50\x72\x65\x66\x69\x6C\x74\x65\x72","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x4E\x6F\x64\x65","\x72\x61\x64\x69\x6F","\x74","\x63\x68\x65\x63\x6B\x43\x6C\x6F\x6E\x65","\x63\x6C\x6F\x6E\x65\x4E\x6F\x64\x65","\x3C\x74\x65\x78\x74\x61\x72\x65\x61\x3E\x78\x3C\x2F\x74\x65\x78\x74\x61\x72\x65\x61\x3E","\x6E\x6F\x43\x6C\x6F\x6E\x65\x43\x68\x65\x63\x6B\x65\x64","\x66\x6F\x63\x75\x73","\x67\x75\x69\x64","\x6F\x66\x66","\x65\x76\x65\x6E\x74","\x69\x73\x54\x72\x69\x67\x67\x65\x72","\x64\x65\x6C\x65\x67\x61\x74\x65\x54\x79\x70\x65","\x73\x70\x65\x63\x69\x61\x6C","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x73\x74\x6F\x70\x49\x6D\x6D\x65\x64\x69\x61\x74\x65\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x45\x76\x65\x6E\x74","\x74\x72\x69\x67\x67\x65\x72","\x68\x61\x6E\x64\x6C\x65\x72","\x65\x76\x65\x6E\x74\x73","\x68\x61\x6E\x64\x6C\x65","\x74\x72\x69\x67\x67\x65\x72\x65\x64","\x64\x69\x73\x70\x61\x74\x63\x68","\x2E","\x62\x69\x6E\x64\x54\x79\x70\x65","\x64\x65\x6C\x65\x67\x61\x74\x65\x43\x6F\x75\x6E\x74","\x73\x65\x74\x75\x70","\x67\x6C\x6F\x62\x61\x6C","\x28\x5E\x7C\x5C\x2E\x29","\x5C\x2E\x28\x3F\x3A\x2E\x2A\x5C\x2E\x7C\x29","\x28\x5C\x2E\x7C\x24\x29","\x6F\x72\x69\x67\x54\x79\x70\x65","\x6E\x61\x6D\x65\x73\x70\x61\x63\x65","\x2A\x2A","\x74\x65\x61\x72\x64\x6F\x77\x6E","\x72\x65\x6D\x6F\x76\x65\x45\x76\x65\x6E\x74","\x68\x61\x6E\x64\x6C\x65\x20\x65\x76\x65\x6E\x74\x73","\x66\x69\x78","\x64\x65\x6C\x65\x67\x61\x74\x65\x54\x61\x72\x67\x65\x74","\x70\x72\x65\x44\x69\x73\x70\x61\x74\x63\x68","\x68\x61\x6E\x64\x6C\x65\x72\x73","\x63\x75\x72\x72\x65\x6E\x74\x54\x61\x72\x67\x65\x74","\x65\x6C\x65\x6D","\x72\x6E\x61\x6D\x65\x73\x70\x61\x63\x65","\x68\x61\x6E\x64\x6C\x65\x4F\x62\x6A","\x64\x61\x74\x61","\x72\x65\x73\x75\x6C\x74","\x69\x73\x49\x6D\x6D\x65\x64\x69\x61\x74\x65\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E\x53\x74\x6F\x70\x70\x65\x64","\x69\x73\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E\x53\x74\x6F\x70\x70\x65\x64","\x70\x6F\x73\x74\x44\x69\x73\x70\x61\x74\x63\x68","\x74\x61\x72\x67\x65\x74","\x63\x6C\x69\x63\x6B","\x6F\x72\x69\x67\x69\x6E\x61\x6C\x45\x76\x65\x6E\x74","\x61","\x72\x65\x74\x75\x72\x6E\x56\x61\x6C\x75\x65","\x69\x73\x44\x65\x66\x61\x75\x6C\x74\x50\x72\x65\x76\x65\x6E\x74\x65\x64","\x64\x65\x66\x61\x75\x6C\x74\x50\x72\x65\x76\x65\x6E\x74\x65\x64","\x72\x65\x6C\x61\x74\x65\x64\x54\x61\x72\x67\x65\x74","\x74\x69\x6D\x65\x53\x74\x61\x6D\x70","\x6E\x6F\x77","\x69\x73\x53\x69\x6D\x75\x6C\x61\x74\x65\x64","\x77\x68\x69\x63\x68","\x63\x68\x61\x72\x43\x6F\x64\x65","\x6B\x65\x79\x43\x6F\x64\x65","\x61\x64\x64\x50\x72\x6F\x70","\x66\x6F\x63\x75\x73\x69\x6E","\x66\x6F\x63\x75\x73\x6F\x75\x74","\x6D\x6F\x75\x73\x65\x6F\x76\x65\x72","\x6D\x6F\x75\x73\x65\x6F\x75\x74","\x70\x6F\x69\x6E\x74\x65\x72\x6F\x76\x65\x72","\x70\x6F\x69\x6E\x74\x65\x72\x6F\x75\x74","\x74\x61\x62\x6C\x65","\x74\x72","\x63\x68\x69\x6C\x64\x72\x65\x6E","\x2F","\x74\x72\x75\x65\x2F","\x68\x74\x6D\x6C","\x63\x6C\x6F\x6E\x65","\x73\x72\x63","\x6D\x6F\x64\x75\x6C\x65","\x5F\x65\x76\x61\x6C\x55\x72\x6C","\x6E\x6F\x4D\x6F\x64\x75\x6C\x65","\x63\x6C\x65\x61\x6E\x44\x61\x74\x61","\x3C\x24\x31\x3E\x3C\x2F\x24\x32\x3E","\x74\x65\x78\x74\x61\x72\x65\x61","\x69\x6E\x73\x65\x72\x74\x42\x65\x66\x6F\x72\x65","\x61\x70\x70\x65\x6E\x64","\x72\x65\x70\x6C\x61\x63\x65\x43\x68\x69\x6C\x64","\x70\x72\x65\x70\x65\x6E\x64","\x62\x65\x66\x6F\x72\x65","\x61\x66\x74\x65\x72","\x72\x65\x70\x6C\x61\x63\x65\x57\x69\x74\x68","\x29\x28\x3F\x21\x70\x78\x29\x5B\x61\x2D\x7A\x25\x5D\x2B\x24","\x6F\x70\x65\x6E\x65\x72","\x67\x65\x74\x43\x6F\x6D\x70\x75\x74\x65\x64\x53\x74\x79\x6C\x65","\x67\x65\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x56\x61\x6C\x75\x65","\x70\x69\x78\x65\x6C\x42\x6F\x78\x53\x74\x79\x6C\x65\x73","\x77\x69\x64\x74\x68","\x6D\x69\x6E\x57\x69\x64\x74\x68","\x6D\x61\x78\x57\x69\x64\x74\x68","\x63\x73\x73\x54\x65\x78\x74","\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x61\x62\x73\x6F\x6C\x75\x74\x65\x3B\x6C\x65\x66\x74\x3A\x2D\x31\x31\x31\x31\x31\x70\x78\x3B\x77\x69\x64\x74\x68\x3A\x36\x30\x70\x78\x3B\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70\x3A\x31\x70\x78\x3B\x70\x61\x64\x64\x69\x6E\x67\x3A\x30\x3B\x62\x6F\x72\x64\x65\x72\x3A\x30","\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x72\x65\x6C\x61\x74\x69\x76\x65\x3B\x64\x69\x73\x70\x6C\x61\x79\x3A\x62\x6C\x6F\x63\x6B\x3B\x62\x6F\x78\x2D\x73\x69\x7A\x69\x6E\x67\x3A\x62\x6F\x72\x64\x65\x72\x2D\x62\x6F\x78\x3B\x6F\x76\x65\x72\x66\x6C\x6F\x77\x3A\x73\x63\x72\x6F\x6C\x6C\x3B\x6D\x61\x72\x67\x69\x6E\x3A\x61\x75\x74\x6F\x3B\x62\x6F\x72\x64\x65\x72\x3A\x31\x70\x78\x3B\x70\x61\x64\x64\x69\x6E\x67\x3A\x31\x70\x78\x3B\x77\x69\x64\x74\x68\x3A\x36\x30\x25\x3B\x74\x6F\x70\x3A\x31\x25","\x31\x25","\x6D\x61\x72\x67\x69\x6E\x4C\x65\x66\x74","\x72\x69\x67\x68\x74","\x36\x30\x25","\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x61\x62\x73\x6F\x6C\x75\x74\x65","\x6F\x66\x66\x73\x65\x74\x57\x69\x64\x74\x68","\x72\x6F\x75\x6E\x64","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x43\x6C\x69\x70","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x62\x6F\x78","\x63\x6C\x65\x61\x72\x43\x6C\x6F\x6E\x65\x53\x74\x79\x6C\x65","\x57\x65\x62\x6B\x69\x74","\x4D\x6F\x7A","\x6D\x73","\x63\x73\x73\x50\x72\x6F\x70\x73","\x34\x30\x30","\x6D\x61\x78","\x62\x6F\x72\x64\x65\x72","\x6D\x61\x72\x67\x69\x6E","\x70\x61\x64\x64\x69\x6E\x67","\x57\x69\x64\x74\x68","\x6F\x66\x66\x73\x65\x74","\x63\x65\x69\x6C","\x62\x6F\x78\x53\x69\x7A\x69\x6E\x67\x52\x65\x6C\x69\x61\x62\x6C\x65","\x62\x6F\x72\x64\x65\x72\x2D\x62\x6F\x78","\x62\x6F\x78\x53\x69\x7A\x69\x6E\x67","\x61\x75\x74\x6F","\x69\x6E\x6C\x69\x6E\x65","\x67\x65\x74\x43\x6C\x69\x65\x6E\x74\x52\x65\x63\x74\x73","\x6F\x70\x61\x63\x69\x74\x79","\x31","\x63\x73\x73\x48\x6F\x6F\x6B\x73","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64","\x69\x6E\x68\x65\x72\x69\x74","\x73\x65\x74\x50\x72\x6F\x70\x65\x72\x74\x79","\x6E\x6F\x72\x6D\x61\x6C","\x68\x65\x69\x67\x68\x74","\x67\x65\x74\x42\x6F\x75\x6E\x64\x69\x6E\x67\x43\x6C\x69\x65\x6E\x74\x52\x65\x63\x74","\x73\x63\x72\x6F\x6C\x6C\x62\x6F\x78\x53\x69\x7A\x65","\x72\x65\x6C\x69\x61\x62\x6C\x65\x4D\x61\x72\x67\x69\x6E\x4C\x65\x66\x74","\x6C\x65\x66\x74","\x54\x77\x65\x65\x6E","\x70\x72\x6F\x70","\x65\x61\x73\x69\x6E\x67","\x6F\x70\x74\x69\x6F\x6E\x73","\x70\x72\x6F\x70\x48\x6F\x6F\x6B\x73","\x64\x75\x72\x61\x74\x69\x6F\x6E","\x70\x6F\x73","\x73\x74\x65\x70","\x73\x63\x72\x6F\x6C\x6C\x54\x6F\x70","\x73\x63\x72\x6F\x6C\x6C\x4C\x65\x66\x74","\x50\x49","\x63\x6F\x73","\x73\x77\x69\x6E\x67","\x72\x65\x71\x75\x65\x73\x74\x41\x6E\x69\x6D\x61\x74\x69\x6F\x6E\x46\x72\x61\x6D\x65","\x69\x6E\x74\x65\x72\x76\x61\x6C","\x74\x69\x63\x6B","\x74\x77\x65\x65\x6E\x65\x72\x73","\x70\x72\x65\x66\x69\x6C\x74\x65\x72\x73","\x61\x6C\x77\x61\x79\x73","\x73\x74\x61\x72\x74\x54\x69\x6D\x65","\x74\x77\x65\x65\x6E\x73","\x72\x75\x6E","\x6F\x70\x74\x73","\x73\x70\x65\x63\x69\x61\x6C\x45\x61\x73\x69\x6E\x67","\x70\x72\x6F\x70\x73","\x65\x78\x70\x61\x6E\x64","\x62\x69\x6E\x64","\x74\x69\x6D\x65\x72","\x41\x6E\x69\x6D\x61\x74\x69\x6F\x6E","\x63\x72\x65\x61\x74\x65\x54\x77\x65\x65\x6E","\x66\x78\x73\x68\x6F\x77","\x75\x6E\x71\x75\x65\x75\x65\x64","\x74\x6F\x67\x67\x6C\x65","\x6F\x76\x65\x72\x66\x6C\x6F\x77","\x6F\x76\x65\x72\x66\x6C\x6F\x77\x58","\x6F\x76\x65\x72\x66\x6C\x6F\x77\x59","\x69\x6E\x6C\x69\x6E\x65\x2D\x62\x6C\x6F\x63\x6B","\x66\x6C\x6F\x61\x74","\x73\x70\x65\x65\x64","\x73\x70\x65\x65\x64\x73","\x6F\x6C\x64","\x61\x6E\x69\x6D\x61\x74\x65","\x66\x69\x6E\x69\x73\x68","\x74\x69\x6D\x65\x72\x73","\x61\x6E\x69\x6D","\x64\x65\x6C\x61\x79","\x63\x6C\x65\x61\x72\x54\x69\x6D\x65\x6F\x75\x74","\x63\x68\x65\x63\x6B\x62\x6F\x78","\x63\x68\x65\x63\x6B\x4F\x6E","\x6F\x70\x74\x53\x65\x6C\x65\x63\x74\x65\x64","\x72\x61\x64\x69\x6F\x56\x61\x6C\x75\x65","\x72\x65\x6D\x6F\x76\x65\x41\x74\x74\x72","\x61\x74\x74\x72\x48\x6F\x6F\x6B\x73","\x62\x6F\x6F\x6C","\x70\x72\x6F\x70\x46\x69\x78","\x74\x61\x62\x69\x6E\x64\x65\x78","\x68\x74\x6D\x6C\x46\x6F\x72","\x72\x65\x61\x64\x4F\x6E\x6C\x79","\x6D\x61\x78\x4C\x65\x6E\x67\x74\x68","\x63\x65\x6C\x6C\x53\x70\x61\x63\x69\x6E\x67","\x63\x65\x6C\x6C\x50\x61\x64\x64\x69\x6E\x67","\x72\x6F\x77\x53\x70\x61\x6E","\x63\x6F\x6C\x53\x70\x61\x6E","\x75\x73\x65\x4D\x61\x70","\x66\x72\x61\x6D\x65\x42\x6F\x72\x64\x65\x72","\x63\x6F\x6E\x74\x65\x6E\x74\x45\x64\x69\x74\x61\x62\x6C\x65","\x61\x64\x64\x43\x6C\x61\x73\x73","\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73","\x74\x6F\x67\x67\x6C\x65\x43\x6C\x61\x73\x73","\x68\x61\x73\x43\x6C\x61\x73\x73","\x5F\x5F\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65\x5F\x5F","\x76\x61\x6C","\x76\x61\x6C\x48\x6F\x6F\x6B\x73","\x73\x65\x6C\x65\x63\x74\x2D\x6F\x6E\x65","\x6F\x6E","\x6F\x6E\x66\x6F\x63\x75\x73\x69\x6E","\x6E\x6F\x42\x75\x62\x62\x6C\x65","\x70\x61\x72\x65\x6E\x74\x57\x69\x6E\x64\x6F\x77","\x73\x69\x6D\x75\x6C\x61\x74\x65","\x70\x61\x72\x73\x65\x58\x4D\x4C","\x74\x65\x78\x74\x2F\x78\x6D\x6C","\x70\x61\x72\x73\x65\x46\x72\x6F\x6D\x53\x74\x72\x69\x6E\x67","\x44\x4F\x4D\x50\x61\x72\x73\x65\x72","\x70\x61\x72\x73\x65\x72\x65\x72\x72\x6F\x72","\x49\x6E\x76\x61\x6C\x69\x64\x20\x58\x4D\x4C\x3A\x20","\x5B","\x70\x61\x72\x61\x6D","\x26","\x73\x65\x72\x69\x61\x6C\x69\x7A\x65\x41\x72\x72\x61\x79","\x0D\x0A","\x65\x6C\x65\x6D\x65\x6E\x74\x73","\x2A\x2F","\x64\x61\x74\x61\x54\x79\x70\x65\x73","\x66\x6C\x61\x74\x4F\x70\x74\x69\x6F\x6E\x73","\x61\x6A\x61\x78\x53\x65\x74\x74\x69\x6E\x67\x73","\x47\x45\x54","\x70\x72\x6F\x74\x6F\x63\x6F\x6C","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64\x3B\x20\x63\x68\x61\x72\x73\x65\x74\x3D\x55\x54\x46\x2D\x38","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E","\x74\x65\x78\x74\x2F\x68\x74\x6D\x6C","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x6D\x6C\x2C\x20\x74\x65\x78\x74\x2F\x78\x6D\x6C","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E\x2C\x20\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74","\x72\x65\x73\x70\x6F\x6E\x73\x65\x58\x4D\x4C","\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x65\x78\x74","\x72\x65\x73\x70\x6F\x6E\x73\x65\x4A\x53\x4F\x4E","\x61\x6A\x61\x78\x53\x65\x74\x75\x70","\x63\x6F\x6E\x74\x65\x78\x74","\x73\x74\x61\x74\x75\x73\x43\x6F\x64\x65","\x63\x61\x6E\x63\x65\x6C\x65\x64","\x2C\x20","\x6D\x69\x6D\x65\x54\x79\x70\x65","\x73\x74\x61\x74\x75\x73","\x61\x62\x6F\x72\x74","\x75\x72\x6C","\x2F\x2F","\x6D\x65\x74\x68\x6F\x64","\x64\x61\x74\x61\x54\x79\x70\x65","\x63\x72\x6F\x73\x73\x44\x6F\x6D\x61\x69\x6E","\x68\x6F\x73\x74","\x70\x72\x6F\x63\x65\x73\x73\x44\x61\x74\x61","\x74\x72\x61\x64\x69\x74\x69\x6F\x6E\x61\x6C","\x61\x63\x74\x69\x76\x65","\x61\x6A\x61\x78\x53\x74\x61\x72\x74","\x68\x61\x73\x43\x6F\x6E\x74\x65\x6E\x74","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x63\x6F\x6E\x74\x65\x6E\x74\x54\x79\x70\x65","\x3F","\x5F\x3D","\x69\x66\x4D\x6F\x64\x69\x66\x69\x65\x64","\x6C\x61\x73\x74\x4D\x6F\x64\x69\x66\x69\x65\x64","\x49\x66\x2D\x4D\x6F\x64\x69\x66\x69\x65\x64\x2D\x53\x69\x6E\x63\x65","\x73\x65\x74\x52\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72","\x65\x74\x61\x67","\x49\x66\x2D\x4E\x6F\x6E\x65\x2D\x4D\x61\x74\x63\x68","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x41\x63\x63\x65\x70\x74","\x61\x63\x63\x65\x70\x74\x73","\x3B\x20\x71\x3D\x30\x2E\x30\x31","\x68\x65\x61\x64\x65\x72\x73","\x62\x65\x66\x6F\x72\x65\x53\x65\x6E\x64","\x73\x75\x63\x63\x65\x73\x73","\x61\x6A\x61\x78\x53\x65\x6E\x64","\x61\x73\x79\x6E\x63","\x74\x69\x6D\x65\x6F\x75\x74","\x73\x65\x6E\x64","\x4E\x6F\x20\x54\x72\x61\x6E\x73\x70\x6F\x72\x74","\x63\x6F\x6E\x74\x65\x6E\x74\x73","\x67\x65\x74\x52\x65\x73\x70\x6F\x6E\x73\x65\x48\x65\x61\x64\x65\x72","\x63\x6F\x6E\x76\x65\x72\x74\x65\x72\x73","\x72\x65\x73\x70\x6F\x6E\x73\x65\x46\x69\x65\x6C\x64\x73","\x64\x61\x74\x61\x46\x69\x6C\x74\x65\x72","\x2A\x20","\x74\x68\x72\x6F\x77\x73","\x4E\x6F\x20\x63\x6F\x6E\x76\x65\x72\x73\x69\x6F\x6E\x20\x66\x72\x6F\x6D\x20","\x20\x74\x6F\x20","\x4C\x61\x73\x74\x2D\x4D\x6F\x64\x69\x66\x69\x65\x64","\x48\x45\x41\x44","\x6E\x6F\x63\x6F\x6E\x74\x65\x6E\x74","\x6E\x6F\x74\x6D\x6F\x64\x69\x66\x69\x65\x64","\x73\x74\x61\x74\x75\x73\x54\x65\x78\x74","\x61\x6A\x61\x78\x53\x75\x63\x63\x65\x73\x73","\x61\x6A\x61\x78\x45\x72\x72\x6F\x72","\x61\x6A\x61\x78\x43\x6F\x6D\x70\x6C\x65\x74\x65","\x61\x6A\x61\x78\x53\x74\x6F\x70","\x6A\x73\x6F\x6E","\x70\x6F\x73\x74","\x61\x6A\x61\x78","\x66\x69\x72\x73\x74\x45\x6C\x65\x6D\x65\x6E\x74\x43\x68\x69\x6C\x64","\x77\x72\x61\x70\x49\x6E\x6E\x65\x72","\x77\x72\x61\x70\x41\x6C\x6C","\x6E\x6F\x74","\x70\x61\x72\x65\x6E\x74","\x76\x69\x73\x69\x62\x6C\x65","\x6F\x66\x66\x73\x65\x74\x48\x65\x69\x67\x68\x74","\x78\x68\x72","\x58\x4D\x4C\x48\x74\x74\x70\x52\x65\x71\x75\x65\x73\x74","\x63\x6F\x72\x73","\x77\x69\x74\x68\x43\x72\x65\x64\x65\x6E\x74\x69\x61\x6C\x73","\x75\x73\x65\x72\x6E\x61\x6D\x65","\x70\x61\x73\x73\x77\x6F\x72\x64","\x6F\x70\x65\x6E","\x78\x68\x72\x46\x69\x65\x6C\x64\x73","\x6F\x76\x65\x72\x72\x69\x64\x65\x4D\x69\x6D\x65\x54\x79\x70\x65","\x58\x2D\x52\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x57\x69\x74\x68","\x6F\x6E\x6C\x6F\x61\x64","\x6F\x6E\x65\x72\x72\x6F\x72","\x6F\x6E\x61\x62\x6F\x72\x74","\x6F\x6E\x74\x69\x6D\x65\x6F\x75\x74","\x6F\x6E\x72\x65\x61\x64\x79\x73\x74\x61\x74\x65\x63\x68\x61\x6E\x67\x65","\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x79\x70\x65","\x72\x65\x73\x70\x6F\x6E\x73\x65","\x67\x65\x74\x41\x6C\x6C\x52\x65\x73\x70\x6F\x6E\x73\x65\x48\x65\x61\x64\x65\x72\x73","\x61\x6A\x61\x78\x54\x72\x61\x6E\x73\x70\x6F\x72\x74","\x61\x6A\x61\x78\x50\x72\x65\x66\x69\x6C\x74\x65\x72","\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x2C\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x2C\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x65\x63\x6D\x61\x73\x63\x72\x69\x70\x74\x2C\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x65\x63\x6D\x61\x73\x63\x72\x69\x70\x74","\x73\x63\x72\x69\x70\x74\x41\x74\x74\x72\x73","\x6C\x6F\x61\x64\x20\x65\x72\x72\x6F\x72","\x73\x63\x72\x69\x70\x74\x43\x68\x61\x72\x73\x65\x74","\x3C\x73\x63\x72\x69\x70\x74\x3E","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x5F","\x6A\x73\x6F\x6E\x20\x6A\x73\x6F\x6E\x70","\x6A\x73\x6F\x6E\x70","\x6A\x73\x6F\x6E\x70\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x73\x63\x72\x69\x70\x74\x20\x6A\x73\x6F\x6E","\x20\x77\x61\x73\x20\x6E\x6F\x74\x20\x63\x61\x6C\x6C\x65\x64","\x72\x65\x6D\x6F\x76\x65\x50\x72\x6F\x70","\x63\x72\x65\x61\x74\x65\x48\x54\x4D\x4C\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x69\x6D\x70\x6C\x65\x6D\x65\x6E\x74\x61\x74\x69\x6F\x6E","\x3C\x66\x6F\x72\x6D\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x66\x6F\x72\x6D\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E","\x62\x61\x73\x65","\x50\x4F\x53\x54","\x3C\x64\x69\x76\x3E","\x61\x6E\x69\x6D\x61\x74\x65\x64","\x73\x74\x61\x74\x69\x63","\x66\x69\x78\x65\x64","\x75\x73\x69\x6E\x67","\x73\x65\x74\x4F\x66\x66\x73\x65\x74","\x70\x61\x67\x65\x59\x4F\x66\x66\x73\x65\x74","\x70\x61\x67\x65\x58\x4F\x66\x66\x73\x65\x74","\x6F\x66\x66\x73\x65\x74\x50\x61\x72\x65\x6E\x74","\x62\x6F\x72\x64\x65\x72\x54\x6F\x70\x57\x69\x64\x74\x68","\x62\x6F\x72\x64\x65\x72\x4C\x65\x66\x74\x57\x69\x64\x74\x68","\x6D\x61\x72\x67\x69\x6E\x54\x6F\x70","\x73\x63\x72\x6F\x6C\x6C\x54\x6F","\x70\x69\x78\x65\x6C\x50\x6F\x73\x69\x74\x69\x6F\x6E","\x69\x6E\x6E\x65\x72","\x6F\x75\x74\x65\x72","\x63\x6C\x69\x65\x6E\x74","\x73\x63\x72\x6F\x6C\x6C","\x62\x6C\x75\x72\x20\x66\x6F\x63\x75\x73\x20\x66\x6F\x63\x75\x73\x69\x6E\x20\x66\x6F\x63\x75\x73\x6F\x75\x74\x20\x72\x65\x73\x69\x7A\x65\x20\x73\x63\x72\x6F\x6C\x6C\x20\x63\x6C\x69\x63\x6B\x20\x64\x62\x6C\x63\x6C\x69\x63\x6B\x20\x6D\x6F\x75\x73\x65\x64\x6F\x77\x6E\x20\x6D\x6F\x75\x73\x65\x75\x70\x20\x6D\x6F\x75\x73\x65\x6D\x6F\x76\x65\x20\x6D\x6F\x75\x73\x65\x6F\x76\x65\x72\x20\x6D\x6F\x75\x73\x65\x6F\x75\x74\x20\x6D\x6F\x75\x73\x65\x65\x6E\x74\x65\x72\x20\x6D\x6F\x75\x73\x65\x6C\x65\x61\x76\x65\x20\x63\x68\x61\x6E\x67\x65\x20\x73\x65\x6C\x65\x63\x74\x20\x73\x75\x62\x6D\x69\x74\x20\x6B\x65\x79\x64\x6F\x77\x6E\x20\x6B\x65\x79\x70\x72\x65\x73\x73\x20\x6B\x65\x79\x75\x70\x20\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75","\x6D\x6F\x75\x73\x65\x6C\x65\x61\x76\x65","\x6D\x6F\x75\x73\x65\x65\x6E\x74\x65\x72","\x70\x72\x6F\x78\x79","\x68\x6F\x6C\x64\x52\x65\x61\x64\x79","\x70\x61\x72\x73\x65\x4A\x53\x4F\x4E","\x69\x73\x46\x75\x6E\x63\x74\x69\x6F\x6E","\x69\x73\x57\x69\x6E\x64\x6F\x77","\x63\x61\x6D\x65\x6C\x43\x61\x73\x65","\x69\x73\x4E\x75\x6D\x65\x72\x69\x63","\x61\x6D\x64","\x6E\x6F\x43\x6F\x6E\x66\x6C\x69\x63\x74","\x65\x78\x70\x6F\x72\x74\x73","\x6A\x51\x75\x65\x72\x79\x20\x72\x65\x71\x75\x69\x72\x65\x73\x20\x61\x20\x77\x69\x6E\x64\x6F\x77\x20\x77\x69\x74\x68\x20\x61\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74","\x74\x6F\x61\x73\x74\x72","\x69\x63\x6F\x6E\x43\x6C\x61\x73\x73\x65\x73","\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72\x49\x64","\x69\x6E\x66\x6F","\x77\x61\x72\x6E\x69\x6E\x67","\x3A\x66\x6F\x63\x75\x73","\x66\x6F\x72\x63\x65","\x68\x69\x64\x65\x44\x75\x72\x61\x74\x69\x6F\x6E","\x68\x69\x64\x65\x45\x61\x73\x69\x6E\x67","\x68\x69\x64\x65\x4D\x65\x74\x68\x6F\x64","\x70\x6F\x73\x69\x74\x69\x6F\x6E\x43\x6C\x61\x73\x73","\x3C\x64\x69\x76\x2F\x3E","\x61\x70\x70\x65\x6E\x64\x54\x6F","\x74\x6F\x61\x73\x74","\x74\x6F\x61\x73\x74\x2D\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x66\x61\x64\x65\x49\x6E","\x66\x61\x64\x65\x4F\x75\x74","\x74\x6F\x61\x73\x74\x2D\x65\x72\x72\x6F\x72","\x74\x6F\x61\x73\x74\x2D\x69\x6E\x66\x6F","\x74\x6F\x61\x73\x74\x2D\x73\x75\x63\x63\x65\x73\x73","\x74\x6F\x61\x73\x74\x2D\x77\x61\x72\x6E\x69\x6E\x67","\x74\x6F\x61\x73\x74\x2D\x74\x6F\x70\x2D\x72\x69\x67\x68\x74","\x74\x6F\x61\x73\x74\x2D\x74\x69\x74\x6C\x65","\x74\x6F\x61\x73\x74\x2D\x6D\x65\x73\x73\x61\x67\x65","\x3C\x62\x75\x74\x74\x6F\x6E\x20\x74\x79\x70\x65\x3D\x22\x62\x75\x74\x74\x6F\x6E\x22\x3E\x26\x74\x69\x6D\x65\x73\x3B\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E","\x74\x6F\x61\x73\x74\x2D\x63\x6C\x6F\x73\x65\x2D\x62\x75\x74\x74\x6F\x6E","\x74\x6F\x61\x73\x74\x2D\x70\x72\x6F\x67\x72\x65\x73\x73","\x26\x67\x74\x3B","\x26\x6C\x74\x3B","\x26\x23\x33\x39\x3B","\x26\x71\x75\x6F\x74\x3B","\x26\x61\x6D\x70\x3B","\x70\x6F\x6C\x69\x74\x65","\x61\x73\x73\x65\x72\x74\x69\x76\x65","\x69\x63\x6F\x6E\x43\x6C\x61\x73\x73","\x61\x72\x69\x61\x2D\x6C\x69\x76\x65","\x63\x6C\x6F\x73\x65\x4F\x6E\x48\x6F\x76\x65\x72","\x68\x6F\x76\x65\x72","\x6F\x6E\x63\x6C\x69\x63\x6B","\x74\x61\x70\x54\x6F\x44\x69\x73\x6D\x69\x73\x73","\x63\x6C\x6F\x73\x65\x42\x75\x74\x74\x6F\x6E","\x63\x61\x6E\x63\x65\x6C\x42\x75\x62\x62\x6C\x65","\x6F\x6E\x43\x6C\x6F\x73\x65\x43\x6C\x69\x63\x6B","\x73\x68\x6F\x77\x44\x75\x72\x61\x74\x69\x6F\x6E","\x73\x68\x6F\x77\x45\x61\x73\x69\x6E\x67","\x6F\x6E\x53\x68\x6F\x77\x6E","\x73\x68\x6F\x77\x4D\x65\x74\x68\x6F\x64","\x74\x69\x6D\x65\x4F\x75\x74","\x6D\x61\x78\x48\x69\x64\x65\x54\x69\x6D\x65","\x68\x69\x64\x65\x45\x74\x61","\x67\x65\x74\x54\x69\x6D\x65","\x70\x72\x6F\x67\x72\x65\x73\x73\x42\x61\x72","\x69\x6E\x74\x65\x72\x76\x61\x6C\x49\x64","\x74\x6F\x61\x73\x74\x43\x6C\x61\x73\x73","\x6E\x65\x77\x65\x73\x74\x4F\x6E\x54\x6F\x70","\x74\x69\x74\x6C\x65","\x65\x73\x63\x61\x70\x65\x48\x74\x6D\x6C","\x74\x69\x74\x6C\x65\x43\x6C\x61\x73\x73","\x6D\x65\x73\x73\x61\x67\x65\x43\x6C\x61\x73\x73","\x72\x6F\x6C\x65","\x63\x6C\x6F\x73\x65\x43\x6C\x61\x73\x73","\x70\x72\x6F\x67\x72\x65\x73\x73\x43\x6C\x61\x73\x73","\x72\x74\x6C","\x70\x72\x65\x76\x65\x6E\x74\x44\x75\x70\x6C\x69\x63\x61\x74\x65\x73","\x63\x6C\x6F\x73\x65\x4D\x65\x74\x68\x6F\x64","\x63\x6C\x6F\x73\x65\x44\x75\x72\x61\x74\x69\x6F\x6E","\x63\x6C\x6F\x73\x65\x45\x61\x73\x69\x6E\x67","\x6F\x6E\x48\x69\x64\x64\x65\x6E","\x65\x6E\x64\x54\x69\x6D\x65","\x65\x78\x74\x65\x6E\x64\x65\x64\x54\x69\x6D\x65\x4F\x75\x74","\x25","\x6F\x70\x74\x69\x6F\x6E\x73\x4F\x76\x65\x72\x72\x69\x64\x65","\x63\x6C\x6F\x73\x65\x48\x74\x6D\x6C","\x64\x65\x62\x75\x67","\x6C\x6F\x67","\x3A\x76\x69\x73\x69\x62\x6C\x65","\x32\x2E\x31\x2E\x33","\x6E\x69\x63\x6B\x6E\x61\x6D\x65","\x50\x4C\x41\x59\x45\x52","\x73\x75\x62\x73\x74\x72","\x75\x73\x65\x72","\x78\x67\x72\x65\x73\x73","\x70\x6C\x75\x67\x69\x6E\x5F\x76\x65\x72\x73\x69\x6F\x6E","\x65\x6D\x61\x69\x6C","\x74\x6F\x6B\x65\x6E","\x78\x67\x72\x65\x73\x73\x5F\x76\x65\x72\x73\x69\x6F\x6E","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x2F\x2F\x78\x67\x72\x65\x73\x73\x2E\x63\x6F\x6D\x2F\x61\x70\x69\x2F\x76\x32","\x43\x75\x73\x74\x6F\x6D\x45\x76\x65\x6E\x74","\x63\x72\x65\x61\x74\x65\x45\x76\x65\x6E\x74","\x69\x6E\x69\x74\x43\x75\x73\x74\x6F\x6D\x45\x76\x65\x6E\x74","\x72\x65\x63\x6F\x6E\x6E\x65\x63\x74\x41\x74\x74\x65\x6D\x70\x74\x73","\x43\x4F\x4E\x4E\x45\x43\x54\x49\x4E\x47","\x6F\x6E\x6F\x70\x65\x6E","\x63\x6C\x6F\x73\x65","\x6F\x6E\x63\x6C\x6F\x73\x65","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6E\x67","\x6F\x6E\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6E\x67","\x6F\x6E\x6D\x65\x73\x73\x61\x67\x65","\x64\x69\x73\x70\x61\x74\x63\x68\x45\x76\x65\x6E\x74","\x64\x65\x62\x75\x67\x41\x6C\x6C","\x52\x65\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6E\x67\x57\x65\x62\x53\x6F\x63\x6B\x65\x74","\x61\x74\x74\x65\x6D\x70\x74\x2D\x63\x6F\x6E\x6E\x65\x63\x74","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E\x2D\x74\x69\x6D\x65\x6F\x75\x74","\x74\x69\x6D\x65\x6F\x75\x74\x49\x6E\x74\x65\x72\x76\x61\x6C","\x4F\x50\x45\x4E","\x69\x73\x52\x65\x63\x6F\x6E\x6E\x65\x63\x74","\x43\x4C\x4F\x53\x45\x44","\x63\x6F\x64\x65","\x72\x65\x61\x73\x6F\x6E","\x77\x61\x73\x43\x6C\x65\x61\x6E","\x72\x65\x63\x6F\x6E\x6E\x65\x63\x74\x49\x6E\x74\x65\x72\x76\x61\x6C","\x72\x65\x63\x6F\x6E\x6E\x65\x63\x74\x44\x65\x63\x61\x79","\x70\x6F\x77","\x6D\x61\x78\x52\x65\x63\x6F\x6E\x6E\x65\x63\x74\x49\x6E\x74\x65\x72\x76\x61\x6C","\x61\x75\x74\x6F\x6D\x61\x74\x69\x63\x4F\x70\x65\x6E","\x49\x4E\x56\x41\x4C\x49\x44\x5F\x53\x54\x41\x54\x45\x5F\x45\x52\x52\x20\x3A\x20\x50\x61\x75\x73\x69\x6E\x67\x20\x74\x6F\x20\x72\x65\x63\x6F\x6E\x6E\x65\x63\x74\x20\x77\x65\x62\x73\x6F\x63\x6B\x65\x74","\x72\x65\x66\x72\x65\x73\x68","\x43\x4C\x4F\x53\x49\x4E\x47","\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39","\x66\x6C\x6F\x6F\x72","\x77\x73\x73\x3A\x2F\x2F\x78\x67\x72\x65\x73\x73\x2E\x63\x6F\x6D\x2F\x64\x65\x74\x61\x69\x6C\x73","\x7A\x53\x74\x6F\x72\x65\x64\x52\x65\x71","\x72\x65\x61\x64\x79\x73\x74\x61\x74\x65\x63\x68\x61\x6E\x67\x65","\x67\x65\x74\x45\x6E\x74\x69\x74\x69\x65\x73","\x69\x6E\x63\x6C\x75\x64\x65\x73","\x72\x65\x73\x70\x6F\x6E\x73\x65\x55\x52\x4C","\x67\x61\x6D\x65\x45\x6E\x74\x69\x74\x69\x65\x73","\x70","\x67\x65\x74\x50\x6F\x72\x74\x61\x6C\x44\x65\x74\x61\x69\x6C\x73","\x67\x65\x74\x50\x6C\x65\x78\x74\x73","\x6D\x61\x78\x54\x69\x6D\x65\x73\x74\x61\x6D\x70\x4D\x73","\x67\x65\x74\x43\x65\x6E\x74\x65\x72","\x6C\x61\x74","\x6C\x6E\x67","\x67\x65\x74\x52\x65\x67\x69\x6F\x6E\x53\x63\x6F\x72\x65\x44\x65\x74\x61\x69\x6C\x73"];var libraries=function(){try{jQuery[_0xd409[2]][_0xd409[1]][_0xd409[0]](0)== _0xd409[3]}catch(err){!function(_0x6023x3,_0x6023x4){_0xd409[5];_0xd409[29]==  typeof module&& _0xd409[29]==  typeof module[_0xd409[803]]?module[_0xd409[803]]= _0x6023x3[_0xd409[6]]?_0x6023x4(_0x6023x3,!0):function(_0x6023x3){if(!_0x6023x3[_0xd409[6]]){throw  new Error(_0xd409[804])};return _0x6023x4(_0x6023x3)}:_0x6023x4(_0x6023x3)}(_0xd409[4]!=  typeof window?window:this,function(_0x6023x2,_0x6023x3){_0xd409[5];var _0x6023x4=[],_0x6023x5=_0x6023x2[_0xd409[6]],_0x6023x6=Object[_0xd409[7]],_0x6023x7=_0x6023x4[_0xd409[8]],_0x6023x8=_0x6023x4[_0xd409[9]],_0x6023x9=_0x6023x4[_0xd409[10]],_0x6023xa=_0x6023x4[_0xd409[11]],_0x6023xb={},_0x6023xc=_0x6023xb[_0xd409[12]],_0x6023xd=_0x6023xb[_0xd409[13]],_0x6023xe=_0x6023xd[_0xd409[12]],_0x6023xf=_0x6023xe[_0xd409[14]](Object),_0x6023x10={},_0x6023x11=function(_0x6023x3){return _0xd409[15]==  typeof _0x6023x3&& _0xd409[16]!=  typeof _0x6023x3[_0xd409[17]]},_0x6023x12=function(_0x6023x3){return null!= _0x6023x3&& _0x6023x3=== _0x6023x3[_0xd409[18]]},_0x6023x13={type:!0,src:!0,nonce:!0,noModule:!0};function _0x6023x14(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc=(_0x6023xb= _0x6023xb|| _0x6023x5)[_0xd409[20]](_0xd409[19]);if(_0x6023xc[_0xd409[21]]= _0x6023x3,_0x6023x4){for(_0x6023x6 in _0x6023x13){(_0x6023xa= _0x6023x4[_0x6023x6]|| _0x6023x4[_0xd409[22]]&& _0x6023x4[_0xd409[22]](_0x6023x6))&& _0x6023xc[_0xd409[23]](_0x6023x6,_0x6023xa)}};_0x6023xb[_0xd409[27]][_0xd409[26]](_0x6023xc)[_0xd409[25]][_0xd409[24]](_0x6023xc)}function _0x6023x15(_0x6023x3){return null== _0x6023x3?_0x6023x3+ _0xd409[28]:_0xd409[29]==  typeof _0x6023x3|| _0xd409[15]==  typeof _0x6023x3?_0x6023xb[_0x6023xc[_0xd409[14]](_0x6023x3)]|| _0xd409[29]: typeof _0x6023x3}var _0x6023x16=_0xd409[30],_0x6023x17=function(_0x6023x3,_0x6023x4){return  new _0x6023x17[_0xd409[2]][_0xd409[31]](_0x6023x3,_0x6023x4)},_0x6023x18=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;function _0x6023x19(_0x6023x3){var _0x6023x4=!!_0x6023x3&& _0xd409[32] in  _0x6023x3&& _0x6023x3[_0xd409[32]],_0x6023xb=_0x6023x15(_0x6023x3);return !_0x6023x11(_0x6023x3)&&  !_0x6023x12(_0x6023x3) && (_0xd409[33]=== _0x6023xb|| 0=== _0x6023x4|| _0xd409[16]==  typeof _0x6023x4&& 0< _0x6023x4&& _0x6023x4- 1 in  _0x6023x3)}_0x6023x17[_0xd409[2]]= _0x6023x17[_0xd409[34]]= {jquery:_0x6023x16,constructor:_0x6023x17,length:0,toArray:function(){return _0x6023x7[_0xd409[14]](this)},get:function(_0x6023x3){return null== _0x6023x3?_0x6023x7[_0xd409[14]](this):_0x6023x3< 0?this[_0x6023x3+ this[_0xd409[32]]]:this[_0x6023x3]},pushStack:function(_0x6023x3){var _0x6023x4=_0x6023x17[_0xd409[36]](this[_0xd409[35]](),_0x6023x3);return _0x6023x4[_0xd409[37]]= this,_0x6023x4},each:function(_0x6023x3){return _0x6023x17[_0xd409[38]](this,_0x6023x3)},map:function(_0x6023xb){return this[_0xd409[40]](_0x6023x17[_0xd409[39]](this,function(_0x6023x3,_0x6023x4){return _0x6023xb[_0xd409[14]](_0x6023x3,_0x6023x4,_0x6023x3)}))},slice:function(){return this[_0xd409[40]](_0x6023x7[_0xd409[41]](this,arguments))},first:function(){return this[_0xd409[42]](0)},last:function(){return this[_0xd409[42]](-1)},eq:function(_0x6023x3){var _0x6023x4=this[_0xd409[32]],_0x6023xb=+_0x6023x3+ (_0x6023x3< 0?_0x6023x4:0);return this[_0xd409[40]](0<= _0x6023xb&& _0x6023xb< _0x6023x4?[this[_0x6023xb]]:[])},end:function(){return this[_0xd409[37]]|| this[_0xd409[35]]()},push:_0x6023x9,sort:_0x6023x4[_0xd409[43]],splice:_0x6023x4[_0xd409[44]]},_0x6023x17[_0xd409[45]]= _0x6023x17[_0xd409[2]][_0xd409[45]]= function(){var _0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe=arguments[0]|| {},_0x6023x7=1,_0x6023x9=arguments[_0xd409[32]],_0x6023xf=!1;for(_0xd409[46]==  typeof _0x6023xe&& (_0x6023xf= _0x6023xe,_0x6023xe= arguments[_0x6023x7]|| {},_0x6023x7++),_0xd409[29]==  typeof _0x6023xe|| _0x6023x11(_0x6023xe)|| (_0x6023xe= {}),_0x6023x7=== _0x6023x9&& (_0x6023xe= this,_0x6023x7--);_0x6023x7< _0x6023x9;_0x6023x7++){if(null!= (_0x6023x3= arguments[_0x6023x7])){for(_0x6023x4 in _0x6023x3){_0x6023x6= _0x6023x3[_0x6023x4],_0xd409[47]!== _0x6023x4&& _0x6023xe!== _0x6023x6&& (_0x6023xf&& _0x6023x6&& (_0x6023x17[_0xd409[48]](_0x6023x6)|| (_0x6023xa= Array[_0xd409[49]](_0x6023x6)))?(_0x6023xb= _0x6023xe[_0x6023x4],_0x6023xc= _0x6023xa&&  !Array[_0xd409[49]](_0x6023xb)?[]:_0x6023xa|| _0x6023x17[_0xd409[48]](_0x6023xb)?_0x6023xb:{},_0x6023xa=  !1,_0x6023xe[_0x6023x4]= _0x6023x17[_0xd409[45]](_0x6023xf,_0x6023xc,_0x6023x6)):void(0)!== _0x6023x6&& (_0x6023xe[_0x6023x4]= _0x6023x6))}}};return _0x6023xe},_0x6023x17[_0xd409[45]]({expando:_0xd409[50]+ (_0x6023x16+ Math[_0xd409[52]]())[_0xd409[51]](/\D/g,_0xd409[28]),isReady:!0,error:function(_0x6023x3){throw  new Error(_0x6023x3)},noop:function(){},isPlainObject:function(_0x6023x3){var _0x6023x4,_0x6023xb;return !(!_0x6023x3|| _0xd409[53]!== _0x6023xc[_0xd409[14]](_0x6023x3))&& (!(_0x6023x4= _0x6023x6(_0x6023x3))|| _0xd409[15]==  typeof (_0x6023xb= _0x6023xd[_0xd409[14]](_0x6023x4,_0xd409[35])&& _0x6023x4[_0xd409[35]])&& _0x6023xe[_0xd409[14]](_0x6023xb)=== _0x6023xf)},isEmptyObject:function(_0x6023x3){var _0x6023x4;for(_0x6023x4 in _0x6023x3){return !1};return !0},globalEval:function(_0x6023x3,_0x6023x4){_0x6023x14(_0x6023x3,{nonce:_0x6023x4&& _0x6023x4[_0xd409[54]]})},each:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=0;if(_0x6023x19(_0x6023x3)){for(_0x6023xb= _0x6023x3[_0xd409[32]];_0x6023x6< _0x6023xb;_0x6023x6++){if(!1=== _0x6023x4[_0xd409[14]](_0x6023x3[_0x6023x6],_0x6023x6,_0x6023x3[_0x6023x6])){break}}}else {for(_0x6023x6 in _0x6023x3){if(!1=== _0x6023x4[_0xd409[14]](_0x6023x3[_0x6023x6],_0x6023x6,_0x6023x3[_0x6023x6])){break}}};return _0x6023x3},trim:function(_0x6023x3){return null== _0x6023x3?_0xd409[28]:(_0x6023x3+ _0xd409[28])[_0xd409[51]](_0x6023x18,_0xd409[28])},makeArray:function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x4|| [];return null!= _0x6023x3&& (_0x6023x19(Object(_0x6023x3))?_0x6023x17[_0xd409[36]](_0x6023xb,_0xd409[55]==  typeof _0x6023x3?[_0x6023x3]:_0x6023x3):_0x6023x9[_0xd409[14]](_0x6023xb,_0x6023x3)),_0x6023xb},inArray:function(_0x6023x3,_0x6023x4,_0x6023xb){return null== _0x6023x4?-1:_0x6023xa[_0xd409[14]](_0x6023x4,_0x6023x3,_0x6023xb)},merge:function(_0x6023x3,_0x6023x4){for(var _0x6023xb=+_0x6023x4[_0xd409[32]],_0x6023x6=0,_0x6023xa=_0x6023x3[_0xd409[32]];_0x6023x6< _0x6023xb;_0x6023x6++){_0x6023x3[_0x6023xa++]= _0x6023x4[_0x6023x6]};return _0x6023x3[_0xd409[32]]= _0x6023xa,_0x6023x3},grep:function(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6=[],_0x6023xa=0,_0x6023xc=_0x6023x3[_0xd409[32]],_0x6023xe=!_0x6023xb;_0x6023xa< _0x6023xc;_0x6023xa++){!_0x6023x4(_0x6023x3[_0x6023xa],_0x6023xa)!== _0x6023xe && _0x6023x6[_0xd409[10]](_0x6023x3[_0x6023xa])};return _0x6023x6},map:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc=0,_0x6023xe=[];if(_0x6023x19(_0x6023x3)){for(_0x6023x6= _0x6023x3[_0xd409[32]];_0x6023xc< _0x6023x6;_0x6023xc++){null!= (_0x6023xa= _0x6023x4(_0x6023x3[_0x6023xc],_0x6023xc,_0x6023xb))&& _0x6023xe[_0xd409[10]](_0x6023xa)}}else {for(_0x6023xc in _0x6023x3){null!= (_0x6023xa= _0x6023x4(_0x6023x3[_0x6023xc],_0x6023xc,_0x6023xb))&& _0x6023xe[_0xd409[10]](_0x6023xa)}};return _0x6023x8[_0xd409[41]]([],_0x6023xe)},guid:1,support:_0x6023x10}),_0xd409[15]==  typeof Symbol&& (_0x6023x17[_0xd409[2]][Symbol[_0xd409[56]]]= _0x6023x4[Symbol[_0xd409[56]]]),_0x6023x17[_0xd409[38]](_0xd409[59][_0xd409[58]](_0xd409[57]),function(_0x6023x3,_0x6023x4){_0x6023xb[_0xd409[60]+ _0x6023x4+ _0xd409[61]]= _0x6023x4[_0xd409[62]]()});var _0x6023x1a=function(_0x6023xb){var _0x6023x3,_0x6023x19,_0x6023x14,_0x6023xc,_0x6023xa,_0x6023x1a,_0x6023x16,_0x6023x8,_0x6023x15,_0x6023x9,_0x6023xf,_0x6023x1b,_0x6023x2,_0x6023xe,_0x6023x5,_0x6023xd,_0x6023x7,_0x6023x13,_0x6023x10,_0x6023x17=_0xd409[63]+ 1*  new Date,_0x6023x11=_0x6023xb[_0xd409[6]],_0x6023x1c=0,_0x6023x6=0,_0x6023x18=_0x6023x40(),_0x6023x12=_0x6023x40(),_0x6023x1d=_0x6023x40(),_0x6023x1e=_0x6023x40(),_0x6023x1f=function(_0x6023x3,_0x6023x4){return _0x6023x3=== _0x6023x4&& (_0x6023xf=  !0),0},_0x6023x20={}[_0xd409[13]],_0x6023x4=[],_0x6023x21=_0x6023x4[_0xd409[64]],_0x6023x22=_0x6023x4[_0xd409[10]],_0x6023x23=_0x6023x4[_0xd409[10]],_0x6023x24=_0x6023x4[_0xd409[8]],_0x6023x25=function(_0x6023x3,_0x6023x4){for(var _0x6023xb=0,_0x6023x6=_0x6023x3[_0xd409[32]];_0x6023xb< _0x6023x6;_0x6023xb++){if(_0x6023x3[_0x6023xb]=== _0x6023x4){return _0x6023xb}};return -1},_0x6023x26=_0xd409[65],_0x6023x27=_0xd409[66],_0x6023x28=_0xd409[67],_0x6023x29=_0xd409[68]+ _0x6023x27+ _0xd409[69]+ _0x6023x28+ _0xd409[70]+ _0x6023x27+ _0xd409[71]+ _0x6023x27+ _0xd409[72]+ _0x6023x28+ _0xd409[73]+ _0x6023x27+ _0xd409[74],_0x6023x2a=_0xd409[75]+ _0x6023x28+ _0xd409[76]+ _0x6023x29+ _0xd409[77],_0x6023x2b= new RegExp(_0x6023x27+ _0xd409[78],_0xd409[79]),_0x6023x2c= new RegExp(_0xd409[80]+ _0x6023x27+ _0xd409[81]+ _0x6023x27+ _0xd409[82],_0xd409[79]),_0x6023x2d= new RegExp(_0xd409[80]+ _0x6023x27+ _0xd409[83]+ _0x6023x27+ _0xd409[84]),_0x6023x2e= new RegExp(_0xd409[80]+ _0x6023x27+ _0xd409[85]+ _0x6023x27+ _0xd409[86]+ _0x6023x27+ _0xd409[84]),_0x6023x2f= new RegExp(_0x6023x27+ _0xd409[87]),_0x6023x30= new RegExp(_0x6023x2a),_0x6023x31= new RegExp(_0xd409[80]+ _0x6023x28+ _0xd409[88]),_0x6023x32={ID: new RegExp(_0xd409[89]+ _0x6023x28+ _0xd409[86]),CLASS: new RegExp(_0xd409[90]+ _0x6023x28+ _0xd409[86]),TAG: new RegExp(_0xd409[91]+ _0x6023x28+ _0xd409[92]),ATTR: new RegExp(_0xd409[80]+ _0x6023x29),PSEUDO: new RegExp(_0xd409[80]+ _0x6023x2a),CHILD: new RegExp(_0xd409[93]+ _0x6023x27+ _0xd409[94]+ _0x6023x27+ _0xd409[95]+ _0x6023x27+ _0xd409[96]+ _0x6023x27+ _0xd409[97],_0xd409[98]),bool: new RegExp(_0xd409[99]+ _0x6023x26+ _0xd409[100],_0xd409[98]),needsContext: new RegExp(_0xd409[80]+ _0x6023x27+ _0xd409[101]+ _0x6023x27+ _0xd409[102]+ _0x6023x27+ _0xd409[103],_0xd409[98])},_0x6023x33=/HTML$/i,_0x6023x34=/^(?:input|select|textarea|button)$/i,_0x6023x35=/^h\d$/i,_0x6023x36=/^[^{]+\{\s*\[native \w/,_0x6023x37=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_0x6023x38=/[+~]/,_0x6023x39= new RegExp(_0xd409[104]+ _0x6023x27+ _0xd409[105]+ _0x6023x27+ _0xd409[106],_0xd409[107]),_0x6023x3a=function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0xd409[108]+ _0x6023x4- 65536;return _0x6023x6!= _0x6023x6|| _0x6023xb?_0x6023x4:_0x6023x6< 0?String[_0xd409[109]](_0x6023x6+ 65536):String[_0xd409[109]](_0x6023x6>> 10| 55296,1023& _0x6023x6| 56320)},_0x6023x3b=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,_0x6023x3c=function(_0x6023x3,_0x6023x4){return _0x6023x4?_0xd409[110]=== _0x6023x3?_0xd409[111]:_0x6023x3[_0xd409[8]](0,-1)+ _0xd409[112]+ _0x6023x3[_0xd409[113]](_0x6023x3[_0xd409[32]]- 1).toString(16)+ _0xd409[57]:_0xd409[112]+ _0x6023x3},_0x6023x3d=function(){_0x6023x1b()},_0x6023x3e=_0x6023x4c(function(_0x6023x3){return !0=== _0x6023x3[_0xd409[114]] && _0xd409[115]=== _0x6023x3[_0xd409[116]][_0xd409[62]]()},{dir:_0xd409[25],next:_0xd409[117]});try{_0x6023x23[_0xd409[41]](_0x6023x4= _0x6023x24[_0xd409[14]](_0x6023x11[_0xd409[118]]),_0x6023x11[_0xd409[118]]),_0x6023x4[_0x6023x11[_0xd409[118]][_0xd409[32]]][_0xd409[17]]}catch(_0x6023x3){_0x6023x23= {apply:_0x6023x4[_0xd409[32]]?function(_0x6023x3,_0x6023x4){_0x6023x22[_0xd409[41]](_0x6023x3,_0x6023x24[_0xd409[14]](_0x6023x4))}:function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x3[_0xd409[32]],_0x6023x6=0;while(_0x6023x3[_0x6023xb++]= _0x6023x4[_0x6023x6++]){;};_0x6023x3[_0xd409[32]]= _0x6023xb- 1}}};function _0x6023x3f(_0x6023x4,_0x6023x3,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16=_0x6023x3&& _0x6023x3[_0xd409[119]],_0x6023x18=_0x6023x3?_0x6023x3[_0xd409[17]]:9;if(_0x6023xb= _0x6023xb|| [],_0xd409[55]!=  typeof _0x6023x4||  !_0x6023x4|| 1!== _0x6023x18&& 9!== _0x6023x18&& 11!== _0x6023x18){return _0x6023xb};if(!_0x6023x6&& ((_0x6023x3?_0x6023x3[_0xd409[119]]|| _0x6023x3:_0x6023x11)!== _0x6023x2&& _0x6023x1b(_0x6023x3),_0x6023x3= _0x6023x3|| _0x6023x2,_0x6023x5)){if(11!== _0x6023x18&& (_0x6023x9= _0x6023x37[_0xd409[120]](_0x6023x4))){if(_0x6023xa= _0x6023x9[1]){if(9=== _0x6023x18){if(!(_0x6023xe= _0x6023x3[_0xd409[121]](_0x6023xa))){return _0x6023xb};if(_0x6023xe[_0xd409[122]]=== _0x6023xa){return _0x6023xb[_0xd409[10]](_0x6023xe),_0x6023xb}}else {if(_0x6023x16&& (_0x6023xe= _0x6023x16[_0xd409[121]](_0x6023xa))&& _0x6023x10(_0x6023x3,_0x6023xe)&& _0x6023xe[_0xd409[122]]=== _0x6023xa){return _0x6023xb[_0xd409[10]](_0x6023xe),_0x6023xb}}}else {if(_0x6023x9[2]){return _0x6023x23[_0xd409[41]](_0x6023xb,_0x6023x3[_0xd409[123]](_0x6023x4)),_0x6023xb};if((_0x6023xa= _0x6023x9[3])&& _0x6023x19[_0xd409[124]]&& _0x6023x3[_0xd409[124]]){return _0x6023x23[_0xd409[41]](_0x6023xb,_0x6023x3[_0xd409[124]](_0x6023xa)),_0x6023xb}}};if(_0x6023x19[_0xd409[125]]&&  !_0x6023x1e[_0x6023x4+ _0xd409[57]]&& (!_0x6023xd||  !_0x6023xd[_0xd409[126]](_0x6023x4))&& (1!== _0x6023x18|| _0xd409[29]!== _0x6023x3[_0xd409[116]][_0xd409[62]]())){if(_0x6023x13= _0x6023x4,_0x6023x16= _0x6023x3,1=== _0x6023x18&& _0x6023x2f[_0xd409[126]](_0x6023x4)){(_0x6023x7= _0x6023x3[_0xd409[22]](_0xd409[122]))?_0x6023x7= _0x6023x7[_0xd409[51]](_0x6023x3b,_0x6023x3c):_0x6023x3[_0xd409[23]](_0xd409[122],_0x6023x7= _0x6023x17),_0x6023xc= (_0x6023xf= _0x6023x1a(_0x6023x4))[_0xd409[32]];while(_0x6023xc--){_0x6023xf[_0x6023xc]= _0xd409[127]+ _0x6023x7+ _0xd409[57]+ _0x6023x4b(_0x6023xf[_0x6023xc])};_0x6023x13= _0x6023xf[_0xd409[129]](_0xd409[128]),_0x6023x16= _0x6023x38[_0xd409[126]](_0x6023x4)&& _0x6023x49(_0x6023x3[_0xd409[25]])|| _0x6023x3};try{return _0x6023x23[_0xd409[41]](_0x6023xb,_0x6023x16[_0xd409[130]](_0x6023x13)),_0x6023xb}catch(_0x6023x3){_0x6023x1e(_0x6023x4,!0)}finally{_0x6023x7=== _0x6023x17&& _0x6023x3[_0xd409[131]](_0xd409[122])}}};return _0x6023x8(_0x6023x4[_0xd409[51]](_0x6023x2c,_0xd409[132]),_0x6023x3,_0x6023xb,_0x6023x6)}function _0x6023x40(){var _0x6023x6=[];return function _0x6023x3(_0x6023x4,_0x6023xb){return _0x6023x6[_0xd409[10]](_0x6023x4+ _0xd409[57])> _0x6023x14[_0xd409[133]]&&  delete _0x6023x3[_0x6023x6[_0xd409[134]]()],_0x6023x3[_0x6023x4+ _0xd409[57]]= _0x6023xb}}function _0x6023x41(_0x6023x3){return _0x6023x3[_0x6023x17]=  !0,_0x6023x3}function _0x6023x42(_0x6023x3){var _0x6023x4=_0x6023x2[_0xd409[20]](_0xd409[115]);try{return !!_0x6023x3(_0x6023x4)}catch(_0x6023x3){return !1}finally{_0x6023x4[_0xd409[25]]&& _0x6023x4[_0xd409[25]][_0xd409[24]](_0x6023x4),_0x6023x4= null}}function _0x6023x43(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x3[_0xd409[58]](_0xd409[135]),_0x6023x6=_0x6023xb[_0xd409[32]];while(_0x6023x6--){_0x6023x14[_0xd409[136]][_0x6023xb[_0x6023x6]]= _0x6023x4}}function _0x6023x44(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x4&& _0x6023x3,_0x6023x6=_0x6023xb&& 1=== _0x6023x3[_0xd409[17]]&& 1=== _0x6023x4[_0xd409[17]]&& _0x6023x3[_0xd409[137]]- _0x6023x4[_0xd409[137]];if(_0x6023x6){return _0x6023x6};if(_0x6023xb){while(_0x6023xb= _0x6023xb[_0xd409[138]]){if(_0x6023xb=== _0x6023x4){return -1}}};return _0x6023x3?1:-1}function _0x6023x45(_0x6023x4){return function(_0x6023x3){return _0xd409[139]=== _0x6023x3[_0xd409[116]][_0xd409[62]]()&& _0x6023x3[_0xd409[140]]=== _0x6023x4}}function _0x6023x46(_0x6023xb){return function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[116]][_0xd409[62]]();return (_0xd409[139]=== _0x6023x4|| _0xd409[141]=== _0x6023x4)&& _0x6023x3[_0xd409[140]]=== _0x6023xb}}function _0x6023x47(_0x6023x4){return function(_0x6023x3){return _0xd409[142] in  _0x6023x3?_0x6023x3[_0xd409[25]]&& !1=== _0x6023x3[_0xd409[114]]?_0xd409[143] in  _0x6023x3?_0xd409[143] in  _0x6023x3[_0xd409[25]]?_0x6023x3[_0xd409[25]][_0xd409[114]]=== _0x6023x4:_0x6023x3[_0xd409[114]]=== _0x6023x4:_0x6023x3[_0xd409[144]]=== _0x6023x4|| _0x6023x3[_0xd409[144]]!==  !_0x6023x4&& _0x6023x3e(_0x6023x3)=== _0x6023x4:_0x6023x3[_0xd409[114]]=== _0x6023x4:_0xd409[143] in  _0x6023x3&& _0x6023x3[_0xd409[114]]=== _0x6023x4}}function _0x6023x48(_0x6023xe){return _0x6023x41(function(_0x6023xc){return _0x6023xc=  +_0x6023xc,_0x6023x41(function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=_0x6023xe([],_0x6023x3[_0xd409[32]],_0x6023xc),_0x6023xa=_0x6023x6[_0xd409[32]];while(_0x6023xa--){_0x6023x3[_0x6023xb= _0x6023x6[_0x6023xa]]&& (_0x6023x3[_0x6023xb]=  !(_0x6023x4[_0x6023xb]= _0x6023x3[_0x6023xb]))}})})}function _0x6023x49(_0x6023x3){return _0x6023x3&& _0xd409[4]!=  typeof _0x6023x3[_0xd409[123]]&& _0x6023x3}for(_0x6023x3 in _0x6023x19= _0x6023x3f[_0xd409[145]]= {},_0x6023xa= _0x6023x3f[_0xd409[146]]= function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[147]],_0x6023xb=(_0x6023x3[_0xd409[119]]|| _0x6023x3)[_0xd409[148]];return !_0x6023x33[_0xd409[126]](_0x6023x4|| _0x6023xb&& _0x6023xb[_0xd409[116]]|| _0xd409[149])},_0x6023x1b= _0x6023x3f[_0xd409[150]]= function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6=_0x6023x3?_0x6023x3[_0xd409[119]]|| _0x6023x3:_0x6023x11;return _0x6023x6!== _0x6023x2&& 9=== _0x6023x6[_0xd409[17]]&& _0x6023x6[_0xd409[148]]&& (_0x6023xe= (_0x6023x2= _0x6023x6)[_0xd409[148]],_0x6023x5=  !_0x6023xa(_0x6023x2),_0x6023x11!== _0x6023x2&& (_0x6023xb= _0x6023x2[_0xd409[151]])&& _0x6023xb[_0xd409[152]]!== _0x6023xb&& (_0x6023xb[_0xd409[153]]?_0x6023xb[_0xd409[153]](_0xd409[154],_0x6023x3d,!1):_0x6023xb[_0xd409[155]]&& _0x6023xb[_0xd409[155]](_0xd409[156],_0x6023x3d)),_0x6023x19[_0xd409[157]]= _0x6023x42(function(_0x6023x3){return _0x6023x3[_0xd409[158]]= _0xd409[98],!_0x6023x3[_0xd409[22]](_0xd409[158])}),_0x6023x19[_0xd409[123]]= _0x6023x42(function(_0x6023x3){return _0x6023x3[_0xd409[26]](_0x6023x2[_0xd409[159]](_0xd409[28])),!_0x6023x3[_0xd409[123]](_0xd409[84])[_0xd409[32]]}),_0x6023x19[_0xd409[124]]= _0x6023x36[_0xd409[126]](_0x6023x2[_0xd409[124]]),_0x6023x19[_0xd409[160]]= _0x6023x42(function(_0x6023x3){return _0x6023xe[_0xd409[26]](_0x6023x3)[_0xd409[122]]= _0x6023x17,!_0x6023x2[_0xd409[161]]||  !_0x6023x2[_0xd409[161]](_0x6023x17)[_0xd409[32]]}),_0x6023x19[_0xd409[160]]?(_0x6023x14[_0xd409[163]][_0xd409[162]]= function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[51]](_0x6023x39,_0x6023x3a);return function(_0x6023x3){return _0x6023x3[_0xd409[22]](_0xd409[122])=== _0x6023x4}},_0x6023x14[_0xd409[164]][_0xd409[162]]= function(_0x6023x3,_0x6023x4){if(_0xd409[4]!=  typeof _0x6023x4[_0xd409[121]]&& _0x6023x5){var _0x6023xb=_0x6023x4[_0xd409[121]](_0x6023x3);return _0x6023xb?[_0x6023xb]:[]}}):(_0x6023x14[_0xd409[163]][_0xd409[162]]= function(_0x6023x3){var _0x6023xb=_0x6023x3[_0xd409[51]](_0x6023x39,_0x6023x3a);return function(_0x6023x3){var _0x6023x4=_0xd409[4]!=  typeof _0x6023x3[_0xd409[165]]&& _0x6023x3[_0xd409[165]](_0xd409[122]);return _0x6023x4&& _0x6023x4[_0xd409[166]]=== _0x6023xb}},_0x6023x14[_0xd409[164]][_0xd409[162]]= function(_0x6023x3,_0x6023x4){if(_0xd409[4]!=  typeof _0x6023x4[_0xd409[121]]&& _0x6023x5){var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc=_0x6023x4[_0xd409[121]](_0x6023x3);if(_0x6023xc){if((_0x6023xb= _0x6023xc[_0xd409[165]](_0xd409[122]))&& _0x6023xb[_0xd409[166]]=== _0x6023x3){return [_0x6023xc]};_0x6023xa= _0x6023x4[_0xd409[161]](_0x6023x3),_0x6023x6= 0;while(_0x6023xc= _0x6023xa[_0x6023x6++]){if((_0x6023xb= _0x6023xc[_0xd409[165]](_0xd409[122]))&& _0x6023xb[_0xd409[166]]=== _0x6023x3){return [_0x6023xc]}}};return []}}),_0x6023x14[_0xd409[164]][_0xd409[167]]= _0x6023x19[_0xd409[123]]?function(_0x6023x3,_0x6023x4){return _0xd409[4]!=  typeof _0x6023x4[_0xd409[123]]?_0x6023x4[_0xd409[123]](_0x6023x3):_0x6023x19[_0xd409[125]]?_0x6023x4[_0xd409[130]](_0x6023x3):void(0)}:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=[],_0x6023xa=0,_0x6023xc=_0x6023x4[_0xd409[123]](_0x6023x3);if(_0xd409[84]=== _0x6023x3){while(_0x6023xb= _0x6023xc[_0x6023xa++]){1=== _0x6023xb[_0xd409[17]]&& _0x6023x6[_0xd409[10]](_0x6023xb)};return _0x6023x6};return _0x6023xc},_0x6023x14[_0xd409[164]][_0xd409[168]]= _0x6023x19[_0xd409[124]]&& function(_0x6023x3,_0x6023x4){if(_0xd409[4]!=  typeof _0x6023x4[_0xd409[124]]&& _0x6023x5){return _0x6023x4[_0xd409[124]](_0x6023x3)}},_0x6023x7= [],_0x6023xd= [],(_0x6023x19[_0xd409[125]]= _0x6023x36[_0xd409[126]](_0x6023x2[_0xd409[130]]))&& (_0x6023x42(function(_0x6023x3){_0x6023xe[_0xd409[26]](_0x6023x3)[_0xd409[169]]= _0xd409[170]+ _0x6023x17+ _0xd409[171]+ _0x6023x17+ _0xd409[172],_0x6023x3[_0xd409[130]](_0xd409[173])[_0xd409[32]]&& _0x6023xd[_0xd409[10]](_0xd409[174]+ _0x6023x27+ _0xd409[175]),_0x6023x3[_0xd409[130]](_0xd409[176])[_0xd409[32]]|| _0x6023xd[_0xd409[10]](_0xd409[68]+ _0x6023x27+ _0xd409[177]+ _0x6023x26+ _0xd409[86]),_0x6023x3[_0xd409[130]](_0xd409[178]+ _0x6023x17+ _0xd409[179])[_0xd409[32]]|| _0x6023xd[_0xd409[10]](_0xd409[180]),_0x6023x3[_0xd409[130]](_0xd409[181])[_0xd409[32]]|| _0x6023xd[_0xd409[10]](_0xd409[181]),_0x6023x3[_0xd409[130]](_0xd409[182]+ _0x6023x17+ _0xd409[183])[_0xd409[32]]|| _0x6023xd[_0xd409[10]](_0xd409[184])}),_0x6023x42(function(_0x6023x3){_0x6023x3[_0xd409[169]]= _0xd409[185];var _0x6023x4=_0x6023x2[_0xd409[20]](_0xd409[139]);_0x6023x4[_0xd409[23]](_0xd409[140],_0xd409[186]),_0x6023x3[_0xd409[26]](_0x6023x4)[_0xd409[23]](_0xd409[187],_0xd409[188]),_0x6023x3[_0xd409[130]](_0xd409[189])[_0xd409[32]]&& _0x6023xd[_0xd409[10]](_0xd409[187]+ _0x6023x27+ _0xd409[190]),2!== _0x6023x3[_0xd409[130]](_0xd409[191])[_0xd409[32]]&& _0x6023xd[_0xd409[10]](_0xd409[191],_0xd409[192]),_0x6023xe[_0xd409[26]](_0x6023x3)[_0xd409[114]]=  !0,2!== _0x6023x3[_0xd409[130]](_0xd409[192])[_0xd409[32]]&& _0x6023xd[_0xd409[10]](_0xd409[191],_0xd409[192]),_0x6023x3[_0xd409[130]](_0xd409[193]),_0x6023xd[_0xd409[10]](_0xd409[194])})),(_0x6023x19[_0xd409[195]]= _0x6023x36[_0xd409[126]](_0x6023x13= _0x6023xe[_0xd409[196]]|| _0x6023xe[_0xd409[197]]|| _0x6023xe[_0xd409[198]]|| _0x6023xe[_0xd409[199]]|| _0x6023xe[_0xd409[200]]))&& _0x6023x42(function(_0x6023x3){_0x6023x19[_0xd409[201]]= _0x6023x13[_0xd409[14]](_0x6023x3,_0xd409[84]),_0x6023x13[_0xd409[14]](_0x6023x3,_0xd409[202]),_0x6023x7[_0xd409[10]](_0xd409[203],_0x6023x2a)}),_0x6023xd= _0x6023xd[_0xd409[32]]&&  new RegExp(_0x6023xd[_0xd409[129]](_0xd409[135])),_0x6023x7= _0x6023x7[_0xd409[32]]&&  new RegExp(_0x6023x7[_0xd409[129]](_0xd409[135])),_0x6023x4= _0x6023x36[_0xd409[126]](_0x6023xe[_0xd409[204]]),_0x6023x10= _0x6023x4|| _0x6023x36[_0xd409[126]](_0x6023xe[_0xd409[205]])?function(_0x6023x3,_0x6023x4){var _0x6023xb=9=== _0x6023x3[_0xd409[17]]?_0x6023x3[_0xd409[148]]:_0x6023x3,_0x6023x6=_0x6023x4&& _0x6023x4[_0xd409[25]];return _0x6023x3=== _0x6023x6||  !(!_0x6023x6|| 1!== _0x6023x6[_0xd409[17]] ||  !(_0x6023xb[_0xd409[205]]?_0x6023xb[_0xd409[205]](_0x6023x6):_0x6023x3[_0xd409[204]]&& 16& _0x6023x3[_0xd409[204]](_0x6023x6)))}:function(_0x6023x3,_0x6023x4){if(_0x6023x4){while(_0x6023x4= _0x6023x4[_0xd409[25]]){if(_0x6023x4=== _0x6023x3){return !0}}};return !1},_0x6023x1f= _0x6023x4?function(_0x6023x3,_0x6023x4){if(_0x6023x3=== _0x6023x4){return _0x6023xf=  !0,0};var _0x6023xb=!_0x6023x3[_0xd409[204]]-  !_0x6023x4[_0xd409[204]];return _0x6023xb|| (1& (_0x6023xb= (_0x6023x3[_0xd409[119]]|| _0x6023x3)=== (_0x6023x4[_0xd409[119]]|| _0x6023x4)?_0x6023x3[_0xd409[204]](_0x6023x4):1)|| !_0x6023x19[_0xd409[206]]&& _0x6023x4[_0xd409[204]](_0x6023x3)=== _0x6023xb?_0x6023x3=== _0x6023x2|| _0x6023x3[_0xd409[119]]=== _0x6023x11&& _0x6023x10(_0x6023x11,_0x6023x3)?-1:_0x6023x4=== _0x6023x2|| _0x6023x4[_0xd409[119]]=== _0x6023x11&& _0x6023x10(_0x6023x11,_0x6023x4)?1:_0x6023x9?_0x6023x25(_0x6023x9,_0x6023x3)- _0x6023x25(_0x6023x9,_0x6023x4):0:4& _0x6023xb?-1:1)}:function(_0x6023x3,_0x6023x4){if(_0x6023x3=== _0x6023x4){return _0x6023xf=  !0,0};var _0x6023xb,_0x6023x6=0,_0x6023xa=_0x6023x3[_0xd409[25]],_0x6023xc=_0x6023x4[_0xd409[25]],_0x6023xe=[_0x6023x3],_0x6023x7=[_0x6023x4];if(!_0x6023xa||  !_0x6023xc){return _0x6023x3=== _0x6023x2?-1:_0x6023x4=== _0x6023x2?1:_0x6023xa?-1:_0x6023xc?1:_0x6023x9?_0x6023x25(_0x6023x9,_0x6023x3)- _0x6023x25(_0x6023x9,_0x6023x4):0};if(_0x6023xa=== _0x6023xc){return _0x6023x44(_0x6023x3,_0x6023x4)};_0x6023xb= _0x6023x3;while(_0x6023xb= _0x6023xb[_0xd409[25]]){_0x6023xe[_0xd409[207]](_0x6023xb)};_0x6023xb= _0x6023x4;while(_0x6023xb= _0x6023xb[_0xd409[25]]){_0x6023x7[_0xd409[207]](_0x6023xb)};while(_0x6023xe[_0x6023x6]=== _0x6023x7[_0x6023x6]){_0x6023x6++};return _0x6023x6?_0x6023x44(_0x6023xe[_0x6023x6],_0x6023x7[_0x6023x6]):_0x6023xe[_0x6023x6]=== _0x6023x11?-1:_0x6023x7[_0x6023x6]=== _0x6023x11?1:0}),_0x6023x2},_0x6023x3f[_0xd409[196]]= function(_0x6023x3,_0x6023x4){return _0x6023x3f(_0x6023x3,null,null,_0x6023x4)},_0x6023x3f[_0xd409[195]]= function(_0x6023x3,_0x6023x4){if((_0x6023x3[_0xd409[119]]|| _0x6023x3)!== _0x6023x2&& _0x6023x1b(_0x6023x3),_0x6023x19[_0xd409[195]]&& _0x6023x5&&  !_0x6023x1e[_0x6023x4+ _0xd409[57]]&& (!_0x6023x7||  !_0x6023x7[_0xd409[126]](_0x6023x4))&& (!_0x6023xd||  !_0x6023xd[_0xd409[126]](_0x6023x4))){try{var _0x6023xb=_0x6023x13[_0xd409[14]](_0x6023x3,_0x6023x4);if(_0x6023xb|| _0x6023x19[_0xd409[201]]|| _0x6023x3[_0xd409[6]]&& 11!== _0x6023x3[_0xd409[6]][_0xd409[17]]){return _0x6023xb}}catch(_0x6023x3){_0x6023x1e(_0x6023x4,!0)}};return 0< _0x6023x3f(_0x6023x4,_0x6023x2,null,[_0x6023x3])[_0xd409[32]]},_0x6023x3f[_0xd409[205]]= function(_0x6023x3,_0x6023x4){return (_0x6023x3[_0xd409[119]]|| _0x6023x3)!== _0x6023x2&& _0x6023x1b(_0x6023x3),_0x6023x10(_0x6023x3,_0x6023x4)},_0x6023x3f[_0xd409[208]]= function(_0x6023x3,_0x6023x4){(_0x6023x3[_0xd409[119]]|| _0x6023x3)!== _0x6023x2&& _0x6023x1b(_0x6023x3);var _0x6023xb=_0x6023x14[_0xd409[136]][_0x6023x4[_0xd409[62]]()],_0x6023x6=_0x6023xb&& _0x6023x20[_0xd409[14]](_0x6023x14[_0xd409[136]],_0x6023x4[_0xd409[62]]())?_0x6023xb(_0x6023x3,_0x6023x4,!_0x6023x5):void(0);return void(0)!== _0x6023x6?_0x6023x6:_0x6023x19[_0xd409[157]]||  !_0x6023x5?_0x6023x3[_0xd409[22]](_0x6023x4):(_0x6023x6= _0x6023x3[_0xd409[165]](_0x6023x4))&& _0x6023x6[_0xd409[209]]?_0x6023x6[_0xd409[166]]:null},_0x6023x3f[_0xd409[210]]= function(_0x6023x3){return (_0x6023x3+ _0xd409[28])[_0xd409[51]](_0x6023x3b,_0x6023x3c)},_0x6023x3f[_0xd409[211]]= function(_0x6023x3){throw  new Error(_0xd409[212]+ _0x6023x3)},_0x6023x3f[_0xd409[213]]= function(_0x6023x3){var _0x6023x4,_0x6023xb=[],_0x6023x6=0,_0x6023xa=0;if(_0x6023xf=  !_0x6023x19[_0xd409[214]],_0x6023x9= !_0x6023x19[_0xd409[215]]&& _0x6023x3[_0xd409[8]](0),_0x6023x3[_0xd409[43]](_0x6023x1f),_0x6023xf){while(_0x6023x4= _0x6023x3[_0x6023xa++]){_0x6023x4=== _0x6023x3[_0x6023xa]&& (_0x6023x6= _0x6023xb[_0xd409[10]](_0x6023xa))};while(_0x6023x6--){_0x6023x3[_0xd409[44]](_0x6023xb[_0x6023x6],1)}};return _0x6023x9= null,_0x6023x3},_0x6023xc= _0x6023x3f[_0xd409[216]]= function(_0x6023x3){var _0x6023x4,_0x6023xb=_0xd409[28],_0x6023x6=0,_0x6023xa=_0x6023x3[_0xd409[17]];if(_0x6023xa){if(1=== _0x6023xa|| 9=== _0x6023xa|| 11=== _0x6023xa){if(_0xd409[55]==  typeof _0x6023x3[_0xd409[217]]){return _0x6023x3[_0xd409[217]]};for(_0x6023x3= _0x6023x3[_0xd409[218]];_0x6023x3;_0x6023x3= _0x6023x3[_0xd409[138]]){_0x6023xb+= _0x6023xc(_0x6023x3)}}else {if(3=== _0x6023xa|| 4=== _0x6023xa){return _0x6023x3[_0xd409[219]]}}}else {while(_0x6023x4= _0x6023x3[_0x6023x6++]){_0x6023xb+= _0x6023xc(_0x6023x4)}};return _0x6023xb},(_0x6023x14= _0x6023x3f[_0xd409[222]]= {cacheLength:50,createPseudo:_0x6023x41,match:_0x6023x32,attrHandle:{},find:{},relative:{"\x3E":{dir:_0xd409[25],first:!0},"\x20":{dir:_0xd409[25]},"\x2B":{dir:_0xd409[223],first:!0},"\x7E":{dir:_0xd409[223]}},preFilter:{ATTR:function(_0x6023x3){return _0x6023x3[1]= _0x6023x3[1][_0xd409[51]](_0x6023x39,_0x6023x3a),_0x6023x3[3]= (_0x6023x3[3]|| _0x6023x3[4]|| _0x6023x3[5]|| _0xd409[28])[_0xd409[51]](_0x6023x39,_0x6023x3a),_0xd409[180]=== _0x6023x3[2]&& (_0x6023x3[3]= _0xd409[57]+ _0x6023x3[3]+ _0xd409[57]),_0x6023x3[_0xd409[8]](0,4)},CHILD:function(_0x6023x3){return _0x6023x3[1]= _0x6023x3[1][_0xd409[62]](),_0xd409[220]=== _0x6023x3[1][_0xd409[8]](0,3)?(_0x6023x3[3]|| _0x6023x3f[_0xd409[211]](_0x6023x3[0]),_0x6023x3[4]=  +(_0x6023x3[4]?_0x6023x3[5]+ (_0x6023x3[6]|| 1):2* (_0xd409[224]=== _0x6023x3[3]|| _0xd409[225]=== _0x6023x3[3])),_0x6023x3[5]=  +(_0x6023x3[7]+ _0x6023x3[8]|| _0xd409[225]=== _0x6023x3[3])):_0x6023x3[3]&& _0x6023x3f[_0xd409[211]](_0x6023x3[0]),_0x6023x3},PSEUDO:function(_0x6023x3){var _0x6023x4,_0x6023xb=!_0x6023x3[6]&& _0x6023x3[2];return _0x6023x32[_0xd409[226]][_0xd409[126]](_0x6023x3[0])?null:(_0x6023x3[3]?_0x6023x3[2]= _0x6023x3[4]|| _0x6023x3[5]|| _0xd409[28]:_0x6023xb&& _0x6023x30[_0xd409[126]](_0x6023xb)&& (_0x6023x4= _0x6023x1a(_0x6023xb,!0))&& (_0x6023x4= _0x6023xb[_0xd409[11]](_0xd409[86],_0x6023xb[_0xd409[32]]- _0x6023x4)- _0x6023xb[_0xd409[32]])&& (_0x6023x3[0]= _0x6023x3[0][_0xd409[8]](0,_0x6023x4),_0x6023x3[2]= _0x6023xb[_0xd409[8]](0,_0x6023x4)),_0x6023x3[_0xd409[8]](0,3))}},filter:{TAG:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[51]](_0x6023x39,_0x6023x3a)[_0xd409[62]]();return _0xd409[84]=== _0x6023x3?function(){return !0}:function(_0x6023x3){return _0x6023x3[_0xd409[116]]&& _0x6023x3[_0xd409[116]][_0xd409[62]]()=== _0x6023x4}},CLASS:function(_0x6023x3){var _0x6023x4=_0x6023x18[_0x6023x3+ _0xd409[57]];return _0x6023x4|| (_0x6023x4=  new RegExp(_0xd409[227]+ _0x6023x27+ _0xd409[86]+ _0x6023x3+ _0xd409[228]+ _0x6023x27+ _0xd409[229]))&& _0x6023x18(_0x6023x3,function(_0x6023x3){return _0x6023x4[_0xd409[126]](_0xd409[55]==  typeof _0x6023x3[_0xd409[158]]&& _0x6023x3[_0xd409[158]]|| _0xd409[4]!=  typeof _0x6023x3[_0xd409[22]]&& _0x6023x3[_0xd409[22]](_0xd409[230])|| _0xd409[28])})},ATTR:function(_0x6023xb,_0x6023x6,_0x6023xa){return function(_0x6023x3){var _0x6023x4=_0x6023x3f[_0xd409[208]](_0x6023x3,_0x6023xb);return null== _0x6023x4?_0xd409[203]=== _0x6023x6:!_0x6023x6|| (_0x6023x4+= _0xd409[28],_0xd409[231]=== _0x6023x6?_0x6023x4=== _0x6023xa:_0xd409[203]=== _0x6023x6?_0x6023x4!== _0x6023xa:_0xd409[232]=== _0x6023x6?_0x6023xa&& 0=== _0x6023x4[_0xd409[11]](_0x6023xa):_0xd409[233]=== _0x6023x6?_0x6023xa&& -1< _0x6023x4[_0xd409[11]](_0x6023xa):_0xd409[234]=== _0x6023x6?_0x6023xa&& _0x6023x4[_0xd409[8]](-_0x6023xa[_0xd409[32]]) === _0x6023xa:_0xd409[180]=== _0x6023x6?-1< (_0xd409[57]+ _0x6023x4[_0xd409[51]](_0x6023x2b,_0xd409[57])+ _0xd409[57])[_0xd409[11]](_0x6023xa):_0xd409[235]=== _0x6023x6&& (_0x6023x4=== _0x6023xa|| _0x6023x4[_0xd409[8]](0,_0x6023xa[_0xd409[32]]+ 1)=== _0x6023xa+ _0xd409[236]))}},CHILD:function(_0x6023x1a,_0x6023x3,_0x6023x4,_0x6023x8,_0x6023xd){var _0x6023x10=_0xd409[220]!== _0x6023x1a[_0xd409[8]](0,3),_0x6023x11=_0xd409[237]!== _0x6023x1a[_0xd409[8]](-4),_0x6023x12=_0xd409[238]=== _0x6023x3;return 1=== _0x6023x8&& 0=== _0x6023xd?function(_0x6023x3){return !!_0x6023x3[_0xd409[25]]}:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=_0x6023x10!== _0x6023x11?_0xd409[138]:_0xd409[223],_0x6023x13=_0x6023x3[_0xd409[25]],_0x6023x16=_0x6023x12&& _0x6023x3[_0xd409[116]][_0xd409[62]](),_0x6023x18=!_0x6023xb&&  !_0x6023x12,_0x6023x19=!1;if(_0x6023x13){if(_0x6023x10){while(_0x6023xf){_0x6023xe= _0x6023x3;while(_0x6023xe= _0x6023xe[_0x6023xf]){if(_0x6023x12?_0x6023xe[_0xd409[116]][_0xd409[62]]()=== _0x6023x16:1=== _0x6023xe[_0xd409[17]]){return !1}};_0x6023x9= _0x6023xf= _0xd409[239]=== _0x6023x1a&&  !_0x6023x9&& _0xd409[138]};return !0};if(_0x6023x9= [_0x6023x11?_0x6023x13[_0xd409[218]]:_0x6023x13[_0xd409[240]]],_0x6023x11&& _0x6023x18){_0x6023x19= (_0x6023x7= (_0x6023x6= (_0x6023xa= (_0x6023xc= (_0x6023xe= _0x6023x13)[_0x6023x17]|| (_0x6023xe[_0x6023x17]= {}))[_0x6023xe[_0xd409[241]]]|| (_0x6023xc[_0x6023xe[_0xd409[241]]]= {}))[_0x6023x1a]|| [])[0]=== _0x6023x1c&& _0x6023x6[1])&& _0x6023x6[2],_0x6023xe= _0x6023x7&& _0x6023x13[_0xd409[118]][_0x6023x7];while(_0x6023xe= ++_0x6023x7&& _0x6023xe && _0x6023xe[_0x6023xf] || (_0x6023x19= _0x6023x7= 0) || _0x6023x9[_0xd409[64]]()){if(1=== _0x6023xe[_0xd409[17]]&&  ++_0x6023x19&& _0x6023xe=== _0x6023x3){_0x6023xa[_0x6023x1a]= [_0x6023x1c,_0x6023x7,_0x6023x19];break}}}else {if(_0x6023x18&& (_0x6023x19= _0x6023x7= (_0x6023x6= (_0x6023xa= (_0x6023xc= (_0x6023xe= _0x6023x3)[_0x6023x17]|| (_0x6023xe[_0x6023x17]= {}))[_0x6023xe[_0xd409[241]]]|| (_0x6023xc[_0x6023xe[_0xd409[241]]]= {}))[_0x6023x1a]|| [])[0]=== _0x6023x1c&& _0x6023x6[1]),!1=== _0x6023x19){while(_0x6023xe= ++_0x6023x7&& _0x6023xe && _0x6023xe[_0x6023xf] || (_0x6023x19= _0x6023x7= 0) || _0x6023x9[_0xd409[64]]()){if((_0x6023x12?_0x6023xe[_0xd409[116]][_0xd409[62]]()=== _0x6023x16:1=== _0x6023xe[_0xd409[17]])&&  ++_0x6023x19&& (_0x6023x18&& ((_0x6023xa= (_0x6023xc= _0x6023xe[_0x6023x17]|| (_0x6023xe[_0x6023x17]= {}))[_0x6023xe[_0xd409[241]]]|| (_0x6023xc[_0x6023xe[_0xd409[241]]]= {}))[_0x6023x1a]= [_0x6023x1c,_0x6023x19]),_0x6023xe=== _0x6023x3)){break}}}};return (_0x6023x19-= _0x6023xd)=== _0x6023x8|| _0x6023x19% _0x6023x8== 0&& 0<= _0x6023x19/ _0x6023x8}}},PSEUDO:function(_0x6023x3,_0x6023xc){var _0x6023x4,_0x6023xe=_0x6023x14[_0xd409[221]][_0x6023x3]|| _0x6023x14[_0xd409[242]][_0x6023x3[_0xd409[62]]()]|| _0x6023x3f[_0xd409[211]](_0xd409[243]+ _0x6023x3);return _0x6023xe[_0x6023x17]?_0x6023xe(_0x6023xc):1< _0x6023xe[_0xd409[32]]?(_0x6023x4= [_0x6023x3,_0x6023x3,_0xd409[28],_0x6023xc],_0x6023x14[_0xd409[242]][_0xd409[13]](_0x6023x3[_0xd409[62]]())?_0x6023x41(function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=_0x6023xe(_0x6023x3,_0x6023xc),_0x6023xa=_0x6023x6[_0xd409[32]];while(_0x6023xa--){_0x6023x3[_0x6023xb= _0x6023x25(_0x6023x3,_0x6023x6[_0x6023xa])]=  !(_0x6023x4[_0x6023xb]= _0x6023x6[_0x6023xa])}}):function(_0x6023x3){return _0x6023xe(_0x6023x3,0,_0x6023x4)}):_0x6023xe}},pseudos:{not:_0x6023x41(function(_0x6023x3){var _0x6023x6=[],_0x6023xa=[],_0x6023x7=_0x6023x16(_0x6023x3[_0xd409[51]](_0x6023x2c,_0xd409[132]));return _0x6023x7[_0x6023x17]?_0x6023x41(function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc=_0x6023x7(_0x6023x3,null,_0x6023x6,[]),_0x6023xe=_0x6023x3[_0xd409[32]];while(_0x6023xe--){(_0x6023xa= _0x6023xc[_0x6023xe])&& (_0x6023x3[_0x6023xe]=  !(_0x6023x4[_0x6023xe]= _0x6023xa))}}):function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x6[0]= _0x6023x3,_0x6023x7(_0x6023x6,null,_0x6023xb,_0x6023xa),_0x6023x6[0]= null,!_0x6023xa[_0xd409[64]]()}}),has:_0x6023x41(function(_0x6023x4){return function(_0x6023x3){return 0< _0x6023x3f(_0x6023x4,_0x6023x3)[_0xd409[32]]}}),contains:_0x6023x41(function(_0x6023x4){return _0x6023x4= _0x6023x4[_0xd409[51]](_0x6023x39,_0x6023x3a),function(_0x6023x3){return -1< (_0x6023x3[_0xd409[217]]|| _0x6023xc(_0x6023x3))[_0xd409[11]](_0x6023x4)}}),lang:_0x6023x41(function(_0x6023xb){return _0x6023x31[_0xd409[126]](_0x6023xb|| _0xd409[28])|| _0x6023x3f[_0xd409[211]](_0xd409[244]+ _0x6023xb),_0x6023xb= _0x6023xb[_0xd409[51]](_0x6023x39,_0x6023x3a)[_0xd409[62]](),function(_0x6023x3){var _0x6023x4;do{if(_0x6023x4= _0x6023x5?_0x6023x3[_0xd409[245]]:_0x6023x3[_0xd409[22]](_0xd409[246])|| _0x6023x3[_0xd409[22]](_0xd409[245])){return (_0x6023x4= _0x6023x4[_0xd409[62]]())=== _0x6023xb|| 0=== _0x6023x4[_0xd409[11]](_0x6023xb+ _0xd409[236])}}while((_0x6023x3= _0x6023x3[_0xd409[25]])&& 1=== _0x6023x3[_0xd409[17]]);;return !1}}),target:function(_0x6023x3){var _0x6023x4=_0x6023xb[_0xd409[247]]&& _0x6023xb[_0xd409[247]][_0xd409[248]];return _0x6023x4&& _0x6023x4[_0xd409[8]](1)=== _0x6023x3[_0xd409[122]]},root:function(_0x6023x3){return _0x6023x3=== _0x6023xe},focus:function(_0x6023x3){return _0x6023x3=== _0x6023x2[_0xd409[249]]&& (!_0x6023x2[_0xd409[250]]|| _0x6023x2[_0xd409[250]]())&&  !!(_0x6023x3[_0xd409[140]]|| _0x6023x3[_0xd409[251]]||  ~_0x6023x3[_0xd409[252]])},enabled:_0x6023x47(!1),disabled:_0x6023x47(!0),checked:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[116]][_0xd409[62]]();return _0xd409[139]=== _0x6023x4&&  !!_0x6023x3[_0xd409[253]]|| _0xd409[254]=== _0x6023x4&&  !!_0x6023x3[_0xd409[255]]},selected:function(_0x6023x3){return _0x6023x3[_0xd409[25]]&& _0x6023x3[_0xd409[25]][_0xd409[256]],!0=== _0x6023x3[_0xd409[255]]},empty:function(_0x6023x3){for(_0x6023x3= _0x6023x3[_0xd409[218]];_0x6023x3;_0x6023x3= _0x6023x3[_0xd409[138]]){if(_0x6023x3[_0xd409[17]]< 6){return !1}};return !0},parent:function(_0x6023x3){return !_0x6023x14[_0xd409[221]][_0xd409[257]](_0x6023x3)},header:function(_0x6023x3){return _0x6023x35[_0xd409[126]](_0x6023x3[_0xd409[116]])},input:function(_0x6023x3){return _0x6023x34[_0xd409[126]](_0x6023x3[_0xd409[116]])},button:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[116]][_0xd409[62]]();return _0xd409[139]=== _0x6023x4&& _0xd409[141]=== _0x6023x3[_0xd409[140]]|| _0xd409[141]=== _0x6023x4},text:function(_0x6023x3){var _0x6023x4;return _0xd409[139]=== _0x6023x3[_0xd409[116]][_0xd409[62]]()&& _0xd409[21]=== _0x6023x3[_0xd409[140]]&& (null== (_0x6023x4= _0x6023x3[_0xd409[22]](_0xd409[140]))|| _0xd409[21]=== _0x6023x4[_0xd409[62]]())},first:_0x6023x48(function(){return [0]}),last:_0x6023x48(function(_0x6023x3,_0x6023x4){return [_0x6023x4- 1]}),eq:_0x6023x48(function(_0x6023x3,_0x6023x4,_0x6023xb){return [_0x6023xb< 0?_0x6023xb+ _0x6023x4:_0x6023xb]}),even:_0x6023x48(function(_0x6023x3,_0x6023x4){for(var _0x6023xb=0;_0x6023xb< _0x6023x4;_0x6023xb+= 2){_0x6023x3[_0xd409[10]](_0x6023xb)};return _0x6023x3}),odd:_0x6023x48(function(_0x6023x3,_0x6023x4){for(var _0x6023xb=1;_0x6023xb< _0x6023x4;_0x6023xb+= 2){_0x6023x3[_0xd409[10]](_0x6023xb)};return _0x6023x3}),lt:_0x6023x48(function(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6=_0x6023xb< 0?_0x6023xb+ _0x6023x4:_0x6023x4< _0x6023xb?_0x6023x4:_0x6023xb;0<=  --_0x6023x6;){_0x6023x3[_0xd409[10]](_0x6023x6)};return _0x6023x3}),gt:_0x6023x48(function(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6=_0x6023xb< 0?_0x6023xb+ _0x6023x4:_0x6023xb;++_0x6023x6< _0x6023x4;){_0x6023x3[_0xd409[10]](_0x6023x6)};return _0x6023x3})}})[_0xd409[221]][_0xd409[220]]= _0x6023x14[_0xd409[221]][_0xd409[42]],{radio:!0,checkbox:!0,file:!0,password:!0,image:!0}){_0x6023x14[_0xd409[221]][_0x6023x3]= _0x6023x45(_0x6023x3)};for(_0x6023x3 in {submit:!0,reset:!0}){_0x6023x14[_0xd409[221]][_0x6023x3]= _0x6023x46(_0x6023x3)};function _0x6023x4a(){}function _0x6023x4b(_0x6023x3){for(var _0x6023x4=0,_0x6023xb=_0x6023x3[_0xd409[32]],_0x6023x6=_0xd409[28];_0x6023x4< _0x6023xb;_0x6023x4++){_0x6023x6+= _0x6023x3[_0x6023x4][_0xd409[166]]};return _0x6023x6}function _0x6023x4c(_0x6023x7,_0x6023x3,_0x6023x4){var _0x6023x9=_0x6023x3[_0xd409[258]],_0x6023xf=_0x6023x3[_0xd409[259]],_0x6023x13=_0x6023xf|| _0x6023x9,_0x6023x16=_0x6023x4&& _0xd409[25]=== _0x6023x13,_0x6023x18=_0x6023x6++;return _0x6023x3[_0xd409[260]]?function(_0x6023x3,_0x6023x4,_0x6023xb){while(_0x6023x3= _0x6023x3[_0x6023x9]){if(1=== _0x6023x3[_0xd409[17]]|| _0x6023x16){return _0x6023x7(_0x6023x3,_0x6023x4,_0x6023xb)}};return !1}:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe=[_0x6023x1c,_0x6023x18];if(_0x6023xb){while(_0x6023x3= _0x6023x3[_0x6023x9]){if((1=== _0x6023x3[_0xd409[17]]|| _0x6023x16)&& _0x6023x7(_0x6023x3,_0x6023x4,_0x6023xb)){return !0}}}else {while(_0x6023x3= _0x6023x3[_0x6023x9]){if(1=== _0x6023x3[_0xd409[17]]|| _0x6023x16){if(_0x6023xa= (_0x6023xc= _0x6023x3[_0x6023x17]|| (_0x6023x3[_0x6023x17]= {}))[_0x6023x3[_0xd409[241]]]|| (_0x6023xc[_0x6023x3[_0xd409[241]]]= {}),_0x6023xf&& _0x6023xf=== _0x6023x3[_0xd409[116]][_0xd409[62]]()){_0x6023x3= _0x6023x3[_0x6023x9]|| _0x6023x3}else {if((_0x6023x6= _0x6023xa[_0x6023x13])&& _0x6023x6[0]=== _0x6023x1c&& _0x6023x6[1]=== _0x6023x18){return _0x6023xe[2]= _0x6023x6[2]};if((_0x6023xa[_0x6023x13]= _0x6023xe)[2]= _0x6023x7(_0x6023x3,_0x6023x4,_0x6023xb)){return !0}}}}};return !1}}function _0x6023x4d(_0x6023xa){return 1< _0x6023xa[_0xd409[32]]?function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023xa[_0xd409[32]];while(_0x6023x6--){if(!_0x6023xa[_0x6023x6](_0x6023x3,_0x6023x4,_0x6023xb)){return !1}};return !0}:_0x6023xa[0]}function _0x6023x4e(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa){for(var _0x6023xc,_0x6023xe=[],_0x6023x7=0,_0x6023x9=_0x6023x3[_0xd409[32]],_0x6023xf=null!= _0x6023x4;_0x6023x7< _0x6023x9;_0x6023x7++){(_0x6023xc= _0x6023x3[_0x6023x7])&& (_0x6023xb&&  !_0x6023xb(_0x6023xc,_0x6023x6,_0x6023xa)|| (_0x6023xe[_0xd409[10]](_0x6023xc),_0x6023xf&& _0x6023x4[_0xd409[10]](_0x6023x7)))};return _0x6023xe}function _0x6023x4f(_0x6023x19,_0x6023x1a,_0x6023x8,_0x6023xd,_0x6023x10,_0x6023x3){return _0x6023xd&&  !_0x6023xd[_0x6023x17]&& (_0x6023xd= _0x6023x4f(_0x6023xd)),_0x6023x10&&  !_0x6023x10[_0x6023x17]&& (_0x6023x10= _0x6023x4f(_0x6023x10,_0x6023x3)),_0x6023x41(function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=[],_0x6023x9=[],_0x6023xf=_0x6023x4[_0xd409[32]],_0x6023x13=_0x6023x3|| function(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6=0,_0x6023xa=_0x6023x4[_0xd409[32]];_0x6023x6< _0x6023xa;_0x6023x6++){_0x6023x3f(_0x6023x3,_0x6023x4[_0x6023x6],_0x6023xb)};return _0x6023xb}(_0x6023x1a|| _0xd409[84],_0x6023xb[_0xd409[17]]?[_0x6023xb]:_0x6023xb,[]),_0x6023x16=!_0x6023x19|| !_0x6023x3&& _0x6023x1a?_0x6023x13:_0x6023x4e(_0x6023x13,_0x6023x7,_0x6023x19,_0x6023xb,_0x6023x6),_0x6023x18=_0x6023x8?_0x6023x10|| (_0x6023x3?_0x6023x19:_0x6023xf|| _0x6023xd)?[]:_0x6023x4:_0x6023x16;if(_0x6023x8&& _0x6023x8(_0x6023x16,_0x6023x18,_0x6023xb,_0x6023x6),_0x6023xd){_0x6023xa= _0x6023x4e(_0x6023x18,_0x6023x9),_0x6023xd(_0x6023xa,[],_0x6023xb,_0x6023x6),_0x6023xc= _0x6023xa[_0xd409[32]];while(_0x6023xc--){(_0x6023xe= _0x6023xa[_0x6023xc])&& (_0x6023x18[_0x6023x9[_0x6023xc]]=  !(_0x6023x16[_0x6023x9[_0x6023xc]]= _0x6023xe))}};if(_0x6023x3){if(_0x6023x10|| _0x6023x19){if(_0x6023x10){_0x6023xa= [],_0x6023xc= _0x6023x18[_0xd409[32]];while(_0x6023xc--){(_0x6023xe= _0x6023x18[_0x6023xc])&& _0x6023xa[_0xd409[10]](_0x6023x16[_0x6023xc]= _0x6023xe)};_0x6023x10(null,_0x6023x18= [],_0x6023xa,_0x6023x6)};_0x6023xc= _0x6023x18[_0xd409[32]];while(_0x6023xc--){(_0x6023xe= _0x6023x18[_0x6023xc])&& -1< (_0x6023xa= _0x6023x10?_0x6023x25(_0x6023x3,_0x6023xe):_0x6023x7[_0x6023xc])&& (_0x6023x3[_0x6023xa]=  !(_0x6023x4[_0x6023xa]= _0x6023xe))}}}else {_0x6023x18= _0x6023x4e(_0x6023x18=== _0x6023x4?_0x6023x18[_0xd409[44]](_0x6023xf,_0x6023x18[_0xd409[32]]):_0x6023x18),_0x6023x10?_0x6023x10(null,_0x6023x4,_0x6023x18,_0x6023x6):_0x6023x23[_0xd409[41]](_0x6023x4,_0x6023x18)}})}function _0x6023x50(_0x6023x3){for(var _0x6023xa,_0x6023x4,_0x6023xb,_0x6023x6=_0x6023x3[_0xd409[32]],_0x6023xc=_0x6023x14[_0xd409[261]][_0x6023x3[0][_0xd409[140]]],_0x6023xe=_0x6023xc|| _0x6023x14[_0xd409[261]][_0xd409[57]],_0x6023x7=_0x6023xc?1:0,_0x6023x9=_0x6023x4c(function(_0x6023x3){return _0x6023x3=== _0x6023xa},_0x6023xe,!0),_0x6023xf=_0x6023x4c(function(_0x6023x3){return -1< _0x6023x25(_0x6023xa,_0x6023x3)},_0x6023xe,!0),_0x6023x13=[function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=!_0x6023xc&& (_0x6023xb|| _0x6023x4!== _0x6023x15) || ((_0x6023xa= _0x6023x4)[_0xd409[17]]?_0x6023x9(_0x6023x3,_0x6023x4,_0x6023xb):_0x6023xf(_0x6023x3,_0x6023x4,_0x6023xb));return _0x6023xa= null,_0x6023x6}];_0x6023x7< _0x6023x6;_0x6023x7++){if(_0x6023x4= _0x6023x14[_0xd409[261]][_0x6023x3[_0x6023x7][_0xd409[140]]]){_0x6023x13= [_0x6023x4c(_0x6023x4d(_0x6023x13),_0x6023x4)]}else {if((_0x6023x4= _0x6023x14[_0xd409[163]][_0x6023x3[_0x6023x7][_0xd409[140]]][_0xd409[41]](null,_0x6023x3[_0x6023x7][_0xd409[196]]))[_0x6023x17]){for(_0x6023xb=  ++_0x6023x7;_0x6023xb< _0x6023x6;_0x6023xb++){if(_0x6023x14[_0xd409[261]][_0x6023x3[_0x6023xb][_0xd409[140]]]){break}};return _0x6023x4f(1< _0x6023x7&& _0x6023x4d(_0x6023x13),1< _0x6023x7&& _0x6023x4b(_0x6023x3[_0xd409[8]](0,_0x6023x7- 1)[_0xd409[9]]({value:_0xd409[57]=== _0x6023x3[_0x6023x7- 2][_0xd409[140]]?_0xd409[84]:_0xd409[28]}))[_0xd409[51]](_0x6023x2c,_0xd409[132]),_0x6023x4,_0x6023x7< _0x6023xb&& _0x6023x50(_0x6023x3[_0xd409[8]](_0x6023x7,_0x6023xb)),_0x6023xb< _0x6023x6&& _0x6023x50(_0x6023x3= _0x6023x3[_0xd409[8]](_0x6023xb)),_0x6023xb< _0x6023x6&& _0x6023x4b(_0x6023x3))};_0x6023x13[_0xd409[10]](_0x6023x4)}};return _0x6023x4d(_0x6023x13)}return _0x6023x4a[_0xd409[34]]= _0x6023x14[_0xd409[262]]= _0x6023x14[_0xd409[221]],_0x6023x14[_0xd409[242]]=  new _0x6023x4a,_0x6023x1a= _0x6023x3f[_0xd409[263]]= function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=_0x6023x12[_0x6023x3+ _0xd409[57]];if(_0x6023xf){return _0x6023x4?0:_0x6023xf[_0xd409[8]](0)};_0x6023xe= _0x6023x3,_0x6023x7= [],_0x6023x9= _0x6023x14[_0xd409[264]];while(_0x6023xe){for(_0x6023xc in _0x6023xb&&  !(_0x6023x6= _0x6023x2d[_0xd409[120]](_0x6023xe))|| (_0x6023x6&& (_0x6023xe= _0x6023xe[_0xd409[8]](_0x6023x6[0][_0xd409[32]])|| _0x6023xe),_0x6023x7[_0xd409[10]](_0x6023xa= [])),_0x6023xb=  !1,(_0x6023x6= _0x6023x2e[_0xd409[120]](_0x6023xe))&& (_0x6023xb= _0x6023x6[_0xd409[134]](),_0x6023xa[_0xd409[10]]({value:_0x6023xb,type:_0x6023x6[0][_0xd409[51]](_0x6023x2c,_0xd409[57])}),_0x6023xe= _0x6023xe[_0xd409[8]](_0x6023xb[_0xd409[32]])),_0x6023x14[_0xd409[163]]){!(_0x6023x6= _0x6023x32[_0x6023xc][_0xd409[120]](_0x6023xe))|| _0x6023x9[_0x6023xc]&&  !(_0x6023x6= _0x6023x9[_0x6023xc](_0x6023x6)) || (_0x6023xb= _0x6023x6[_0xd409[134]](),_0x6023xa[_0xd409[10]]({value:_0x6023xb,type:_0x6023xc,matches:_0x6023x6}),_0x6023xe= _0x6023xe[_0xd409[8]](_0x6023xb[_0xd409[32]]))};if(!_0x6023xb){break}};return _0x6023x4?_0x6023xe[_0xd409[32]]:_0x6023xe?_0x6023x3f[_0xd409[211]](_0x6023x3):_0x6023x12(_0x6023x3,_0x6023x7)[_0xd409[8]](0)},_0x6023x16= _0x6023x3f[_0xd409[265]]= function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023xd,_0x6023x10,_0x6023x11,_0x6023x12,_0x6023x6,_0x6023xa=[],_0x6023xc=[],_0x6023xe=_0x6023x1d[_0x6023x3+ _0xd409[57]];if(!_0x6023xe){_0x6023x4|| (_0x6023x4= _0x6023x1a(_0x6023x3)),_0x6023xb= _0x6023x4[_0xd409[32]];while(_0x6023xb--){(_0x6023xe= _0x6023x50(_0x6023x4[_0x6023xb]))[_0x6023x17]?_0x6023xa[_0xd409[10]](_0x6023xe):_0x6023xc[_0xd409[10]](_0x6023xe)};(_0x6023xe= _0x6023x1d(_0x6023x3,(_0x6023xd= _0x6023xc,_0x6023x11= 0< (_0x6023x10= _0x6023xa)[_0xd409[32]],_0x6023x12= 0< _0x6023xd[_0xd409[32]],_0x6023x6= function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa){var _0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9=0,_0x6023xf=_0xd409[267],_0x6023x13=_0x6023x3&& [],_0x6023x16=[],_0x6023x18=_0x6023x15,_0x6023x19=_0x6023x3|| _0x6023x12&& _0x6023x14[_0xd409[164]].TAG(_0xd409[84],_0x6023xa),_0x6023x1a=_0x6023x1c+= null== _0x6023x18?1:Math[_0xd409[52]]()|| 0.1,_0x6023x8=_0x6023x19[_0xd409[32]];for(_0x6023xa&& (_0x6023x15= _0x6023x4=== _0x6023x2|| _0x6023x4|| _0x6023xa);_0x6023xf!== _0x6023x8&& null!= (_0x6023xc= _0x6023x19[_0x6023xf]);_0x6023xf++){if(_0x6023x12&& _0x6023xc){_0x6023xe= 0,_0x6023x4|| _0x6023xc[_0xd409[119]]=== _0x6023x2|| (_0x6023x1b(_0x6023xc),_0x6023xb=  !_0x6023x5);while(_0x6023x7= _0x6023xd[_0x6023xe++]){if(_0x6023x7(_0x6023xc,_0x6023x4|| _0x6023x2,_0x6023xb)){_0x6023x6[_0xd409[10]](_0x6023xc);break}};_0x6023xa&& (_0x6023x1c= _0x6023x1a)};_0x6023x11&& ((_0x6023xc= !_0x6023x7&& _0x6023xc)&& _0x6023x9--,_0x6023x3&& _0x6023x13[_0xd409[10]](_0x6023xc))};if(_0x6023x9+= _0x6023xf,_0x6023x11&& _0x6023xf!== _0x6023x9){_0x6023xe= 0;while(_0x6023x7= _0x6023x10[_0x6023xe++]){_0x6023x7(_0x6023x13,_0x6023x16,_0x6023x4,_0x6023xb)};if(_0x6023x3){if(0< _0x6023x9){while(_0x6023xf--){_0x6023x13[_0x6023xf]|| _0x6023x16[_0x6023xf]|| (_0x6023x16[_0x6023xf]= _0x6023x21[_0xd409[14]](_0x6023x6))}};_0x6023x16= _0x6023x4e(_0x6023x16)};_0x6023x23[_0xd409[41]](_0x6023x6,_0x6023x16),_0x6023xa&&  !_0x6023x3&& 0< _0x6023x16[_0xd409[32]]&& 1< _0x6023x9+ _0x6023x10[_0xd409[32]]&& _0x6023x3f[_0xd409[213]](_0x6023x6)};return _0x6023xa&& (_0x6023x1c= _0x6023x1a,_0x6023x15= _0x6023x18),_0x6023x13},_0x6023x11?_0x6023x41(_0x6023x6):_0x6023x6)))[_0xd409[266]]= _0x6023x3};return _0x6023xe},_0x6023x8= _0x6023x3f[_0xd409[268]]= function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=_0xd409[15]==  typeof _0x6023x3&& _0x6023x3,_0x6023x13=!_0x6023x6&& _0x6023x1a(_0x6023x3= _0x6023xf[_0xd409[266]]|| _0x6023x3);if(_0x6023xb= _0x6023xb|| [],1=== _0x6023x13[_0xd409[32]]){if(2< (_0x6023xc= _0x6023x13[0]= _0x6023x13[0][_0xd409[8]](0))[_0xd409[32]]&& _0xd409[162]=== (_0x6023xe= _0x6023xc[0])[_0xd409[140]]&& 9=== _0x6023x4[_0xd409[17]]&& _0x6023x5&& _0x6023x14[_0xd409[261]][_0x6023xc[1][_0xd409[140]]]){if(!(_0x6023x4= (_0x6023x14[_0xd409[164]].ID(_0x6023xe[_0xd409[196]][0][_0xd409[51]](_0x6023x39,_0x6023x3a),_0x6023x4)|| [])[0])){return _0x6023xb};_0x6023xf&& (_0x6023x4= _0x6023x4[_0xd409[25]]),_0x6023x3= _0x6023x3[_0xd409[8]](_0x6023xc[_0xd409[134]]()[_0xd409[166]][_0xd409[32]])};_0x6023xa= _0x6023x32[_0xd409[269]][_0xd409[126]](_0x6023x3)?0:_0x6023xc[_0xd409[32]];while(_0x6023xa--){if(_0x6023xe= _0x6023xc[_0x6023xa],_0x6023x14[_0xd409[261]][_0x6023x7= _0x6023xe[_0xd409[140]]]){break};if((_0x6023x9= _0x6023x14[_0xd409[164]][_0x6023x7])&& (_0x6023x6= _0x6023x9(_0x6023xe[_0xd409[196]][0][_0xd409[51]](_0x6023x39,_0x6023x3a),_0x6023x38[_0xd409[126]](_0x6023xc[0][_0xd409[140]])&& _0x6023x49(_0x6023x4[_0xd409[25]])|| _0x6023x4))){if(_0x6023xc[_0xd409[44]](_0x6023xa,1),!(_0x6023x3= _0x6023x6[_0xd409[32]]&& _0x6023x4b(_0x6023xc))){return _0x6023x23[_0xd409[41]](_0x6023xb,_0x6023x6),_0x6023xb};break}}};return (_0x6023xf|| _0x6023x16(_0x6023x3,_0x6023x13))(_0x6023x6,_0x6023x4,!_0x6023x5,_0x6023xb,!_0x6023x4|| _0x6023x38[_0xd409[126]](_0x6023x3)&& _0x6023x49(_0x6023x4[_0xd409[25]]) || _0x6023x4),_0x6023xb},_0x6023x19[_0xd409[215]]= _0x6023x17[_0xd409[58]](_0xd409[28])[_0xd409[43]](_0x6023x1f)[_0xd409[129]](_0xd409[28])=== _0x6023x17,_0x6023x19[_0xd409[214]]=  !!_0x6023xf,_0x6023x1b(),_0x6023x19[_0xd409[206]]= _0x6023x42(function(_0x6023x3){return 1& _0x6023x3[_0xd409[204]](_0x6023x2[_0xd409[20]](_0xd409[115]))}),_0x6023x42(function(_0x6023x3){return _0x6023x3[_0xd409[169]]= _0xd409[270],_0xd409[127]=== _0x6023x3[_0xd409[218]][_0xd409[22]](_0xd409[251])})|| _0x6023x43(_0xd409[271],function(_0x6023x3,_0x6023x4,_0x6023xb){if(!_0x6023xb){return _0x6023x3[_0xd409[22]](_0x6023x4,_0xd409[140]=== _0x6023x4[_0xd409[62]]()?1:2)}}),_0x6023x19[_0xd409[157]]&& _0x6023x42(function(_0x6023x3){return _0x6023x3[_0xd409[169]]= _0xd409[272],_0x6023x3[_0xd409[218]][_0xd409[23]](_0xd409[166],_0xd409[28]),_0xd409[28]=== _0x6023x3[_0xd409[218]][_0xd409[22]](_0xd409[166])})|| _0x6023x43(_0xd409[166],function(_0x6023x3,_0x6023x4,_0x6023xb){if(!_0x6023xb&& _0xd409[139]=== _0x6023x3[_0xd409[116]][_0xd409[62]]()){return _0x6023x3[_0xd409[273]]}}),_0x6023x42(function(_0x6023x3){return null== _0x6023x3[_0xd409[22]](_0xd409[114])})|| _0x6023x43(_0x6023x26,function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6;if(!_0x6023xb){return !0=== _0x6023x3[_0x6023x4]?_0x6023x4[_0xd409[62]]():(_0x6023x6= _0x6023x3[_0xd409[165]](_0x6023x4))&& _0x6023x6[_0xd409[209]]?_0x6023x6[_0xd409[166]]:null}}),_0x6023x3f}(_0x6023x2);_0x6023x17[_0xd409[164]]= _0x6023x1a,_0x6023x17[_0xd409[274]]= _0x6023x1a[_0xd409[222]],_0x6023x17[_0xd409[274]][_0xd409[275]]= _0x6023x17[_0xd409[274]][_0xd409[221]],_0x6023x17[_0xd409[213]]= _0x6023x17[_0xd409[276]]= _0x6023x1a[_0xd409[213]],_0x6023x17[_0xd409[21]]= _0x6023x1a[_0xd409[216]],_0x6023x17[_0xd409[277]]= _0x6023x1a[_0xd409[146]],_0x6023x17[_0xd409[205]]= _0x6023x1a[_0xd409[205]],_0x6023x17[_0xd409[278]]= _0x6023x1a[_0xd409[210]];var _0x6023x1b=function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=[],_0x6023xa=void(0)!== _0x6023xb;while((_0x6023x3= _0x6023x3[_0x6023x4])&& 9!== _0x6023x3[_0xd409[17]]){if(1=== _0x6023x3[_0xd409[17]]){if(_0x6023xa&& _0x6023x17(_0x6023x3)[_0xd409[279]](_0x6023xb)){break};_0x6023x6[_0xd409[10]](_0x6023x3)}};return _0x6023x6},_0x6023x1c=function(_0x6023x3,_0x6023x4){for(var _0x6023xb=[];_0x6023x3;_0x6023x3= _0x6023x3[_0xd409[138]]){1=== _0x6023x3[_0xd409[17]]&& _0x6023x3!== _0x6023x4&& _0x6023xb[_0xd409[10]](_0x6023x3)};return _0x6023xb},_0x6023x1d=_0x6023x17[_0xd409[274]][_0xd409[280]][_0xd409[269]];function _0x6023x1e(_0x6023x3,_0x6023x4){return _0x6023x3[_0xd409[116]]&& _0x6023x3[_0xd409[116]][_0xd409[62]]()=== _0x6023x4[_0xd409[62]]()}var _0x6023x1f=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function _0x6023x20(_0x6023x3,_0x6023xb,_0x6023x6){return _0x6023x11(_0x6023xb)?_0x6023x17[_0xd409[281]](_0x6023x3,function(_0x6023x3,_0x6023x4){return !!_0x6023xb[_0xd409[14]](_0x6023x3,_0x6023x4,_0x6023x3)!== _0x6023x6}):_0x6023xb[_0xd409[17]]?_0x6023x17[_0xd409[281]](_0x6023x3,function(_0x6023x3){return _0x6023x3=== _0x6023xb!== _0x6023x6}):_0xd409[55]!=  typeof _0x6023xb?_0x6023x17[_0xd409[281]](_0x6023x3,function(_0x6023x3){return -1< _0x6023xa[_0xd409[14]](_0x6023xb,_0x6023x3) !== _0x6023x6}):_0x6023x17[_0xd409[163]](_0x6023xb,_0x6023x3,_0x6023x6)}_0x6023x17[_0xd409[163]]= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023x4[0];return _0x6023xb&& (_0x6023x3= _0xd409[282]+ _0x6023x3+ _0xd409[86]),1=== _0x6023x4[_0xd409[32]]&& 1=== _0x6023x6[_0xd409[17]]?_0x6023x17[_0xd409[164]][_0xd409[195]](_0x6023x6,_0x6023x3)?[_0x6023x6]:[]:_0x6023x17[_0xd409[164]][_0xd409[196]](_0x6023x3,_0x6023x17[_0xd409[281]](_0x6023x4,function(_0x6023x3){return 1=== _0x6023x3[_0xd409[17]]}))},_0x6023x17[_0xd409[2]][_0xd409[45]]({find:function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6=this[_0xd409[32]],_0x6023xa=this;if(_0xd409[55]!=  typeof _0x6023x3){return this[_0xd409[40]](_0x6023x17(_0x6023x3)[_0xd409[163]](function(){for(_0x6023x4= 0;_0x6023x4< _0x6023x6;_0x6023x4++){if(_0x6023x17[_0xd409[205]](_0x6023xa[_0x6023x4],this)){return !0}}}))};for(_0x6023xb= this[_0xd409[40]]([]),_0x6023x4= 0;_0x6023x4< _0x6023x6;_0x6023x4++){_0x6023x17[_0xd409[164]](_0x6023x3,_0x6023xa[_0x6023x4],_0x6023xb)};return 1< _0x6023x6?_0x6023x17[_0xd409[213]](_0x6023xb):_0x6023xb},filter:function(_0x6023x3){return this[_0xd409[40]](_0x6023x20(this,_0x6023x3|| [],!1))},not:function(_0x6023x3){return this[_0xd409[40]](_0x6023x20(this,_0x6023x3|| [],!0))},is:function(_0x6023x3){return !!_0x6023x20(this,_0xd409[55]==  typeof _0x6023x3&& _0x6023x1d[_0xd409[126]](_0x6023x3)?_0x6023x17(_0x6023x3):_0x6023x3|| [],!1)[_0xd409[32]]}});var _0x6023x21,_0x6023x22=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(_0x6023x17[_0xd409[2]][_0xd409[31]]= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa;if(!_0x6023x3){return this};if(_0x6023xb= _0x6023xb|| _0x6023x21,_0xd409[55]==  typeof _0x6023x3){if(!(_0x6023x6= _0xd409[283]=== _0x6023x3[0]&& _0xd409[284]=== _0x6023x3[_0x6023x3[_0xd409[32]]- 1]&& 3<= _0x6023x3[_0xd409[32]]?[null,_0x6023x3,null]:_0x6023x22[_0xd409[120]](_0x6023x3))|| !_0x6023x6[1]&& _0x6023x4){return !_0x6023x4|| _0x6023x4[_0xd409[1]]?(_0x6023x4|| _0x6023xb)[_0xd409[164]](_0x6023x3):this[_0xd409[35]](_0x6023x4)[_0xd409[164]](_0x6023x3)};if(_0x6023x6[1]){if(_0x6023x4= _0x6023x4 instanceof  _0x6023x17?_0x6023x4[0]:_0x6023x4,_0x6023x17[_0xd409[36]](this,_0x6023x17[_0xd409[285]](_0x6023x6[1],_0x6023x4&& _0x6023x4[_0xd409[17]]?_0x6023x4[_0xd409[119]]|| _0x6023x4:_0x6023x5,!0)),_0x6023x1f[_0xd409[126]](_0x6023x6[1])&& _0x6023x17[_0xd409[48]](_0x6023x4)){for(_0x6023x6 in _0x6023x4){_0x6023x11(this[_0x6023x6])?this[_0x6023x6](_0x6023x4[_0x6023x6]):this[_0xd409[208]](_0x6023x6,_0x6023x4[_0x6023x6])}};return this};return (_0x6023xa= _0x6023x5[_0xd409[121]](_0x6023x6[2]))&& (this[0]= _0x6023xa,this[_0xd409[32]]= 1),this};return _0x6023x3[_0xd409[17]]?(this[0]= _0x6023x3,this[_0xd409[32]]= 1,this):_0x6023x11(_0x6023x3)?void(0)!== _0x6023xb[_0xd409[286]]?_0x6023xb[_0xd409[286]](_0x6023x3):_0x6023x3(_0x6023x17):_0x6023x17[_0xd409[287]](_0x6023x3,this)})[_0xd409[34]]= _0x6023x17[_0xd409[2]],_0x6023x21= _0x6023x17(_0x6023x5);var _0x6023x23=/^(?:parents|prev(?:Until|All))/,_0x6023x24={children:!0,contents:!0,next:!0,prev:!0};function _0x6023x25(_0x6023x3,_0x6023x4){while((_0x6023x3= _0x6023x3[_0x6023x4])&& 1!== _0x6023x3[_0xd409[17]]){;};return _0x6023x3}_0x6023x17[_0xd409[2]][_0xd409[45]]({has:function(_0x6023x3){var _0x6023x4=_0x6023x17(_0x6023x3,this),_0x6023xb=_0x6023x4[_0xd409[32]];return this[_0xd409[163]](function(){for(var _0x6023x3=0;_0x6023x3< _0x6023xb;_0x6023x3++){if(_0x6023x17[_0xd409[205]](this,_0x6023x4[_0x6023x3])){return !0}}})},closest:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=0,_0x6023xa=this[_0xd409[32]],_0x6023xc=[],_0x6023xe=_0xd409[55]!=  typeof _0x6023x3&& _0x6023x17(_0x6023x3);if(!_0x6023x1d[_0xd409[126]](_0x6023x3)){for(;_0x6023x6< _0x6023xa;_0x6023x6++){for(_0x6023xb= this[_0x6023x6];_0x6023xb&& _0x6023xb!== _0x6023x4;_0x6023xb= _0x6023xb[_0xd409[25]]){if(_0x6023xb[_0xd409[17]]< 11&& (_0x6023xe?-1< _0x6023xe[_0xd409[288]](_0x6023xb):1=== _0x6023xb[_0xd409[17]]&& _0x6023x17[_0xd409[164]][_0xd409[195]](_0x6023xb,_0x6023x3))){_0x6023xc[_0xd409[10]](_0x6023xb);break}}}};return this[_0xd409[40]](1< _0x6023xc[_0xd409[32]]?_0x6023x17[_0xd409[213]](_0x6023xc):_0x6023xc)},index:function(_0x6023x3){return _0x6023x3?_0xd409[55]==  typeof _0x6023x3?_0x6023xa[_0xd409[14]](_0x6023x17(_0x6023x3),this[0]):_0x6023xa[_0xd409[14]](this,_0x6023x3[_0xd409[1]]?_0x6023x3[0]:_0x6023x3):this[0]&& this[0][_0xd409[25]]?this[_0xd409[260]]()[_0xd409[289]]()[_0xd409[32]]:-1},add:function(_0x6023x3,_0x6023x4){return this[_0xd409[40]](_0x6023x17[_0xd409[213]](_0x6023x17[_0xd409[36]](this[_0xd409[290]](),_0x6023x17(_0x6023x3,_0x6023x4))))},addBack:function(_0x6023x3){return this[_0xd409[291]](null== _0x6023x3?this[_0xd409[37]]:this[_0xd409[37]][_0xd409[163]](_0x6023x3))}}),_0x6023x17[_0xd409[38]]({parent:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[25]];return _0x6023x4&& 11!== _0x6023x4[_0xd409[17]]?_0x6023x4:null},parents:function(_0x6023x3){return _0x6023x1b(_0x6023x3,_0xd409[25])},parentsUntil:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x1b(_0x6023x3,_0xd409[25],_0x6023xb)},next:function(_0x6023x3){return _0x6023x25(_0x6023x3,_0xd409[138])},prev:function(_0x6023x3){return _0x6023x25(_0x6023x3,_0xd409[223])},nextAll:function(_0x6023x3){return _0x6023x1b(_0x6023x3,_0xd409[138])},prevAll:function(_0x6023x3){return _0x6023x1b(_0x6023x3,_0xd409[223])},nextUntil:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x1b(_0x6023x3,_0xd409[138],_0x6023xb)},prevUntil:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x1b(_0x6023x3,_0xd409[223],_0x6023xb)},siblings:function(_0x6023x3){return _0x6023x1c((_0x6023x3[_0xd409[25]]|| {})[_0xd409[218]],_0x6023x3)},children:function(_0x6023x3){return _0x6023x1c(_0x6023x3[_0xd409[218]])},contents:function(_0x6023x3){return _0xd409[4]!=  typeof _0x6023x3[_0xd409[292]]?_0x6023x3[_0xd409[292]]:(_0x6023x1e(_0x6023x3,_0xd409[293])&& (_0x6023x3= _0x6023x3[_0xd409[294]]|| _0x6023x3),_0x6023x17[_0xd409[36]]([],_0x6023x3[_0xd409[118]]))}},function(_0x6023x6,_0x6023xa){_0x6023x17[_0xd409[2]][_0x6023x6]= function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x17[_0xd409[39]](this,_0x6023xa,_0x6023x3);return _0xd409[295]!== _0x6023x6[_0xd409[8]](-5)&& (_0x6023x4= _0x6023x3),_0x6023x4&& _0xd409[55]==  typeof _0x6023x4&& (_0x6023xb= _0x6023x17[_0xd409[163]](_0x6023x4,_0x6023xb)),1< this[_0xd409[32]]&& (_0x6023x24[_0x6023x6]|| _0x6023x17[_0xd409[213]](_0x6023xb),_0x6023x23[_0xd409[126]](_0x6023x6)&& _0x6023xb[_0xd409[296]]()),this[_0xd409[40]](_0x6023xb)}});var _0x6023x26=/[^\x20\t\r\n\f]+/g;function _0x6023x27(_0x6023x3){return _0x6023x3}function _0x6023x28(_0x6023x3){throw _0x6023x3}function _0x6023x29(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa;try{_0x6023x3&& _0x6023x11(_0x6023xa= _0x6023x3[_0xd409[297]])?_0x6023xa[_0xd409[14]](_0x6023x3)[_0xd409[299]](_0x6023x4)[_0xd409[298]](_0x6023xb):_0x6023x3&& _0x6023x11(_0x6023xa= _0x6023x3[_0xd409[300]])?_0x6023xa[_0xd409[14]](_0x6023x3,_0x6023x4,_0x6023xb):_0x6023x4[_0xd409[41]](void(0),[_0x6023x3][_0xd409[8]](_0x6023x6))}catch(_0x6023x3){_0x6023xb[_0xd409[41]](void(0),[_0x6023x3])}}_0x6023x17[_0xd409[301]]= function(_0x6023x6){var _0x6023x3,_0x6023xb;_0x6023x6= _0xd409[55]==  typeof _0x6023x6?(_0x6023x3= _0x6023x6,_0x6023xb= {},_0x6023x17[_0xd409[38]](_0x6023x3[_0xd409[280]](_0x6023x26)|| [],function(_0x6023x3,_0x6023x4){_0x6023xb[_0x6023x4]=  !0}),_0x6023xb):_0x6023x17[_0xd409[45]]({},_0x6023x6);var _0x6023xa,_0x6023x4,_0x6023xc,_0x6023xe,_0x6023x7=[],_0x6023x9=[],_0x6023xf=-1,_0x6023x13=function(){for(_0x6023xe= _0x6023xe|| _0x6023x6[_0xd409[302]],_0x6023xc= _0x6023xa=  !0;_0x6023x9[_0xd409[32]];_0x6023xf=  -1){_0x6023x4= _0x6023x9[_0xd409[134]]();while(++_0x6023xf< _0x6023x7[_0xd409[32]]){!1=== _0x6023x7[_0x6023xf][_0xd409[41]](_0x6023x4[0],_0x6023x4[1]) && _0x6023x6[_0xd409[303]] && (_0x6023xf= _0x6023x7[_0xd409[32]],_0x6023x4=  !1)}};_0x6023x6[_0xd409[304]]|| (_0x6023x4=  !1),_0x6023xa=  !1,_0x6023xe&& (_0x6023x7= _0x6023x4?[]:_0xd409[28])},_0x6023x16={add:function(){return _0x6023x7&& (_0x6023x4&&  !_0x6023xa&& (_0x6023xf= _0x6023x7[_0xd409[32]]- 1,_0x6023x9[_0xd409[10]](_0x6023x4)),function _0x6023xb(_0x6023x3){_0x6023x17[_0xd409[38]](_0x6023x3,function(_0x6023x3,_0x6023x4){_0x6023x11(_0x6023x4)?_0x6023x6[_0xd409[276]]&& _0x6023x16[_0xd409[305]](_0x6023x4)|| _0x6023x7[_0xd409[10]](_0x6023x4):_0x6023x4&& _0x6023x4[_0xd409[32]]&& _0xd409[55]!== _0x6023x15(_0x6023x4)&& _0x6023xb(_0x6023x4)})}(arguments),_0x6023x4&&  !_0x6023xa&& _0x6023x13()),this},remove:function(){return _0x6023x17[_0xd409[38]](arguments,function(_0x6023x3,_0x6023x4){var _0x6023xb;while(-1< (_0x6023xb= _0x6023x17[_0xd409[306]](_0x6023x4,_0x6023x7,_0x6023xb))){_0x6023x7[_0xd409[44]](_0x6023xb,1),_0x6023xb<= _0x6023xf&& _0x6023xf--}}),this},has:function(_0x6023x3){return _0x6023x3?-1< _0x6023x17[_0xd409[306]](_0x6023x3,_0x6023x7):0< _0x6023x7[_0xd409[32]]},empty:function(){return _0x6023x7&& (_0x6023x7= []),this},disable:function(){return _0x6023xe= _0x6023x9= [],_0x6023x7= _0x6023x4= _0xd409[28],this},disabled:function(){return !_0x6023x7},lock:function(){return _0x6023xe= _0x6023x9= [],_0x6023x4|| _0x6023xa|| (_0x6023x7= _0x6023x4= _0xd409[28]),this},locked:function(){return !!_0x6023xe},fireWith:function(_0x6023x3,_0x6023x4){return _0x6023xe|| (_0x6023x4= [_0x6023x3,(_0x6023x4= _0x6023x4|| [])[_0xd409[8]]?_0x6023x4[_0xd409[8]]():_0x6023x4],_0x6023x9[_0xd409[10]](_0x6023x4),_0x6023xa|| _0x6023x13()),this},fire:function(){return _0x6023x16[_0xd409[307]](this,arguments),this},fired:function(){return !!_0x6023xc}};return _0x6023x16},_0x6023x17[_0xd409[45]]({Deferred:function(_0x6023x3){var _0x6023xc=[[_0xd409[308],_0xd409[309],_0x6023x17.Callbacks(_0xd409[304]),_0x6023x17.Callbacks(_0xd409[304]),2],[_0xd409[310],_0xd409[299],_0x6023x17.Callbacks(_0xd409[311]),_0x6023x17.Callbacks(_0xd409[311]),0,_0xd409[312]],[_0xd409[313],_0xd409[298],_0x6023x17.Callbacks(_0xd409[311]),_0x6023x17.Callbacks(_0xd409[311]),1,_0xd409[314]]],_0x6023xa=_0xd409[315],_0x6023xe={state:function(){return _0x6023xa},always:function(){return _0x6023x7[_0xd409[299]](arguments)[_0xd409[298]](arguments),this},"\x63\x61\x74\x63\x68":function(_0x6023x3){return _0x6023xe[_0xd409[300]](null,_0x6023x3)},pipe:function(){var _0x6023xa=arguments;return _0x6023x17.Deferred(function(_0x6023x6){_0x6023x17[_0xd409[38]](_0x6023xc,function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x11(_0x6023xa[_0x6023x4[4]])&& _0x6023xa[_0x6023x4[4]];_0x6023x7[_0x6023x4[1]](function(){var _0x6023x3=_0x6023xb&& _0x6023xb[_0xd409[41]](this,arguments);_0x6023x3&& _0x6023x11(_0x6023x3[_0xd409[297]])?_0x6023x3[_0xd409[297]]()[_0xd409[309]](_0x6023x6[_0xd409[308]])[_0xd409[299]](_0x6023x6[_0xd409[310]])[_0xd409[298]](_0x6023x6[_0xd409[313]]):_0x6023x6[_0x6023x4[0]+ _0xd409[316]](this,_0x6023xb?[_0x6023x3]:arguments)})}),_0x6023xa= null})[_0xd409[297]]()},then:function(_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023x9=0;function _0x6023xf(_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7){return function(){var _0x6023xb=this,_0x6023x6=arguments,_0x6023x3=function(){var _0x6023x3,_0x6023x4;if(!(_0x6023xa< _0x6023x9)){if((_0x6023x3= _0x6023xe[_0xd409[41]](_0x6023xb,_0x6023x6))=== _0x6023xc[_0xd409[297]]()){throw  new TypeError(_0xd409[317])};_0x6023x4= _0x6023x3&& (_0xd409[29]==  typeof _0x6023x3|| _0xd409[15]==  typeof _0x6023x3)&& _0x6023x3[_0xd409[300]],_0x6023x11(_0x6023x4)?_0x6023x7?_0x6023x4[_0xd409[14]](_0x6023x3,_0x6023xf(_0x6023x9,_0x6023xc,_0x6023x27,_0x6023x7),_0x6023xf(_0x6023x9,_0x6023xc,_0x6023x28,_0x6023x7)):(_0x6023x9++,_0x6023x4[_0xd409[14]](_0x6023x3,_0x6023xf(_0x6023x9,_0x6023xc,_0x6023x27,_0x6023x7),_0x6023xf(_0x6023x9,_0x6023xc,_0x6023x28,_0x6023x7),_0x6023xf(_0x6023x9,_0x6023xc,_0x6023x27,_0x6023xc[_0xd409[318]]))):(_0x6023xe!== _0x6023x27&& (_0x6023xb= void(0),_0x6023x6= [_0x6023x3]),(_0x6023x7|| _0x6023xc[_0xd409[319]])(_0x6023xb,_0x6023x6))}},_0x6023x4=_0x6023x7?_0x6023x3:function(){try{_0x6023x3()}catch(_0x6023x3){_0x6023x17[_0xd409[321]][_0xd409[320]]&& _0x6023x17[_0xd409[321]][_0xd409[320]](_0x6023x3,_0x6023x4[_0xd409[322]]),_0x6023x9<= _0x6023xa+ 1&& (_0x6023xe!== _0x6023x28&& (_0x6023xb= void(0),_0x6023x6= [_0x6023x3]),_0x6023xc[_0xd409[323]](_0x6023xb,_0x6023x6))}};_0x6023xa?_0x6023x4():(_0x6023x17[_0xd409[321]][_0xd409[324]]&& (_0x6023x4[_0xd409[322]]= _0x6023x17[_0xd409[321]][_0xd409[324]]()),_0x6023x2[_0xd409[325]](_0x6023x4))}}return _0x6023x17.Deferred(function(_0x6023x3){_0x6023xc[0][3][_0xd409[291]](_0x6023xf(0,_0x6023x3,_0x6023x11(_0x6023x6)?_0x6023x6:_0x6023x27,_0x6023x3[_0xd409[318]])),_0x6023xc[1][3][_0xd409[291]](_0x6023xf(0,_0x6023x3,_0x6023x11(_0x6023x4)?_0x6023x4:_0x6023x27)),_0x6023xc[2][3][_0xd409[291]](_0x6023xf(0,_0x6023x3,_0x6023x11(_0x6023xb)?_0x6023xb:_0x6023x28))})[_0xd409[297]]()},promise:function(_0x6023x3){return null!= _0x6023x3?_0x6023x17[_0xd409[45]](_0x6023x3,_0x6023xe):_0x6023xe}},_0x6023x7={};return _0x6023x17[_0xd409[38]](_0x6023xc,function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x4[2],_0x6023x6=_0x6023x4[5];_0x6023xe[_0x6023x4[1]]= _0x6023xb[_0xd409[291]],_0x6023x6&& _0x6023xb[_0xd409[291]](function(){_0x6023xa= _0x6023x6},_0x6023xc[3- _0x6023x3][2][_0xd409[326]],_0x6023xc[3- _0x6023x3][3][_0xd409[326]],_0x6023xc[0][2][_0xd409[327]],_0x6023xc[0][3][_0xd409[327]]),_0x6023xb[_0xd409[291]](_0x6023x4[3][_0xd409[328]]),_0x6023x7[_0x6023x4[0]]= function(){return _0x6023x7[_0x6023x4[0]+ _0xd409[316]](this=== _0x6023x7?void(0):this,arguments),this},_0x6023x7[_0x6023x4[0]+ _0xd409[316]]= _0x6023xb[_0xd409[307]]}),_0x6023xe[_0xd409[297]](_0x6023x7),_0x6023x3&& _0x6023x3[_0xd409[14]](_0x6023x7,_0x6023x7),_0x6023x7},when:function(_0x6023x3){var _0x6023xb=arguments[_0xd409[32]],_0x6023x4=_0x6023xb,_0x6023x6=Array(_0x6023x4),_0x6023xa=_0x6023x7[_0xd409[14]](arguments),_0x6023xc=_0x6023x17.Deferred(),_0x6023xe=function(_0x6023x4){return function(_0x6023x3){_0x6023x6[_0x6023x4]= this,_0x6023xa[_0x6023x4]= 1< arguments[_0xd409[32]]?_0x6023x7[_0xd409[14]](arguments):_0x6023x3,--_0x6023xb|| _0x6023xc[_0xd409[319]](_0x6023x6,_0x6023xa)}};if(_0x6023xb<= 1&& (_0x6023x29(_0x6023x3,_0x6023xc[_0xd409[299]](_0x6023xe(_0x6023x4))[_0xd409[310]],_0x6023xc[_0xd409[313]],!_0x6023xb),_0xd409[315]=== _0x6023xc[_0xd409[329]]()|| _0x6023x11(_0x6023xa[_0x6023x4]&& _0x6023xa[_0x6023x4][_0xd409[300]]))){return _0x6023xc[_0xd409[300]]()};while(_0x6023x4--){_0x6023x29(_0x6023xa[_0x6023x4],_0x6023xe(_0x6023x4),_0x6023xc[_0xd409[313]])};return _0x6023xc[_0xd409[297]]()}});var _0x6023x2a=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;_0x6023x17[_0xd409[321]][_0xd409[320]]= function(_0x6023x3,_0x6023x4){_0x6023x2[_0xd409[330]]&& _0x6023x2[_0xd409[330]][_0xd409[331]]&& _0x6023x3&& _0x6023x2a[_0xd409[126]](_0x6023x3[_0xd409[187]])&& _0x6023x2[_0xd409[330]][_0xd409[331]](_0xd409[332]+ _0x6023x3[_0xd409[333]],_0x6023x3[_0xd409[334]],_0x6023x4)},_0x6023x17[_0xd409[335]]= function(_0x6023x3){_0x6023x2[_0xd409[325]](function(){throw _0x6023x3})};var _0x6023x2b=_0x6023x17.Deferred();function _0x6023x2c(){_0x6023x5[_0xd409[337]](_0xd409[336],_0x6023x2c),_0x6023x2[_0xd409[337]](_0xd409[338],_0x6023x2c),_0x6023x17[_0xd409[286]]()}_0x6023x17[_0xd409[2]][_0xd409[286]]= function(_0x6023x3){return _0x6023x2b[_0xd409[300]](_0x6023x3)[_0xd409[339]](function(_0x6023x3){_0x6023x17[_0xd409[335]](_0x6023x3)}),this},_0x6023x17[_0xd409[45]]({isReady:!1,readyWait:1,ready:function(_0x6023x3){(!0=== _0x6023x3?--_0x6023x17[_0xd409[340]]:_0x6023x17[_0xd409[341]]) || (_0x6023x17[_0xd409[341]]=  !0)!== _0x6023x3&& 0<  --_0x6023x17[_0xd409[340]] || _0x6023x2b[_0xd409[319]](_0x6023x5,[_0x6023x17])}}),_0x6023x17[_0xd409[286]][_0xd409[300]]= _0x6023x2b[_0xd409[300]],_0xd409[342]=== _0x6023x5[_0xd409[343]]|| _0xd409[344]!== _0x6023x5[_0xd409[343]]&&  !_0x6023x5[_0xd409[148]][_0xd409[345]]?_0x6023x2[_0xd409[325]](_0x6023x17[_0xd409[286]]):(_0x6023x5[_0xd409[153]](_0xd409[336],_0x6023x2c),_0x6023x2[_0xd409[153]](_0xd409[338],_0x6023x2c));var _0x6023x2d=function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe){var _0x6023x7=0,_0x6023x9=_0x6023x3[_0xd409[32]],_0x6023xf=null== _0x6023xb;if(_0xd409[29]=== _0x6023x15(_0x6023xb)){for(_0x6023x7 in _0x6023xa=  !0,_0x6023xb){_0x6023x2d(_0x6023x3,_0x6023x4,_0x6023x7,_0x6023xb[_0x6023x7],!0,_0x6023xc,_0x6023xe)}}else {if(void(0)!== _0x6023x6&& (_0x6023xa=  !0,_0x6023x11(_0x6023x6)|| (_0x6023xe=  !0),_0x6023xf&& (_0x6023xe?(_0x6023x4[_0xd409[14]](_0x6023x3,_0x6023x6),_0x6023x4= null):(_0x6023xf= _0x6023x4,_0x6023x4= function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023xf[_0xd409[14]](_0x6023x17(_0x6023x3),_0x6023xb)})),_0x6023x4)){for(;_0x6023x7< _0x6023x9;_0x6023x7++){_0x6023x4(_0x6023x3[_0x6023x7],_0x6023xb,_0x6023xe?_0x6023x6:_0x6023x6[_0xd409[14]](_0x6023x3[_0x6023x7],_0x6023x7,_0x6023x4(_0x6023x3[_0x6023x7],_0x6023xb)))}}};return _0x6023xa?_0x6023x3:_0x6023xf?_0x6023x4[_0xd409[14]](_0x6023x3):_0x6023x9?_0x6023x4(_0x6023x3[0],_0x6023xb):_0x6023xc},_0x6023x2e=/^-ms-/,_0x6023x2f=/-([a-z])/g;function _0x6023x30(_0x6023x3,_0x6023x4){return _0x6023x4[_0xd409[346]]()}function _0x6023x31(_0x6023x3){return _0x6023x3[_0xd409[51]](_0x6023x2e,_0xd409[347])[_0xd409[51]](_0x6023x2f,_0x6023x30)}var _0x6023x32=function(_0x6023x3){return 1=== _0x6023x3[_0xd409[17]]|| 9=== _0x6023x3[_0xd409[17]]||  !+_0x6023x3[_0xd409[17]]};function _0x6023x33(){this[_0xd409[348]]= _0x6023x17[_0xd409[348]]+ _0x6023x33[_0xd409[349]]++}_0x6023x33[_0xd409[349]]= 1,_0x6023x33[_0xd409[34]]= {cache:function(_0x6023x3){var _0x6023x4=_0x6023x3[this[_0xd409[348]]];return _0x6023x4|| (_0x6023x4= {},_0x6023x32(_0x6023x3)&& (_0x6023x3[_0xd409[17]]?_0x6023x3[this[_0xd409[348]]]= _0x6023x4:Object[_0xd409[350]](_0x6023x3,this[_0xd409[348]],{value:_0x6023x4,configurable:!0}))),_0x6023x4},set:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa=this[_0xd409[351]](_0x6023x3);if(_0xd409[55]==  typeof _0x6023x4){_0x6023xa[_0x6023x31(_0x6023x4)]= _0x6023xb}else {for(_0x6023x6 in _0x6023x4){_0x6023xa[_0x6023x31(_0x6023x6)]= _0x6023x4[_0x6023x6]}};return _0x6023xa},get:function(_0x6023x3,_0x6023x4){return void(0)=== _0x6023x4?this[_0xd409[351]](_0x6023x3):_0x6023x3[this[_0xd409[348]]]&& _0x6023x3[this[_0xd409[348]]][_0x6023x31(_0x6023x4)]},access:function(_0x6023x3,_0x6023x4,_0x6023xb){return void(0)=== _0x6023x4|| _0x6023x4&& _0xd409[55]==  typeof _0x6023x4&& void(0)=== _0x6023xb?this[_0xd409[290]](_0x6023x3,_0x6023x4):(this[_0xd409[352]](_0x6023x3,_0x6023x4,_0x6023xb),void(0)!== _0x6023xb?_0x6023xb:_0x6023x4)},remove:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=_0x6023x3[this[_0xd409[348]]];if(void(0)!== _0x6023x6){if(void(0)!== _0x6023x4){_0x6023xb= (_0x6023x4= Array[_0xd409[49]](_0x6023x4)?_0x6023x4[_0xd409[39]](_0x6023x31):(_0x6023x4= _0x6023x31(_0x6023x4)) in  _0x6023x6?[_0x6023x4]:_0x6023x4[_0xd409[280]](_0x6023x26)|| [])[_0xd409[32]];while(_0x6023xb--){delete _0x6023x6[_0x6023x4[_0x6023xb]]}};(void(0)=== _0x6023x4|| _0x6023x17[_0xd409[353]](_0x6023x6))&& (_0x6023x3[_0xd409[17]]?_0x6023x3[this[_0xd409[348]]]= void(0): delete _0x6023x3[this[_0xd409[348]]])}},hasData:function(_0x6023x3){var _0x6023x4=_0x6023x3[this[_0xd409[348]]];return void(0)!== _0x6023x4&&  !_0x6023x17[_0xd409[353]](_0x6023x4)}};var _0x6023x34= new _0x6023x33,_0x6023x35= new _0x6023x33,_0x6023x36=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,_0x6023x37=/[A-Z]/g;function _0x6023x38(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa;if(void(0)=== _0x6023xb&& 1=== _0x6023x3[_0xd409[17]]){if(_0x6023x6= _0xd409[354]+ _0x6023x4[_0xd409[51]](_0x6023x37,_0xd409[355])[_0xd409[62]](),_0xd409[55]==  typeof (_0x6023xb= _0x6023x3[_0xd409[22]](_0x6023x6))){try{_0x6023xb= _0xd409[356]=== (_0x6023xa= _0x6023xb)|| _0xd409[357]!== _0x6023xa&& (_0xd409[358]=== _0x6023xa?null:_0x6023xa=== +_0x6023xa+ _0xd409[28]?+_0x6023xa:_0x6023x36[_0xd409[126]](_0x6023xa)?JSON[_0xd409[359]](_0x6023xa):_0x6023xa)}catch(_0x6023x3){};_0x6023x35[_0xd409[352]](_0x6023x3,_0x6023x4,_0x6023xb)}else {_0x6023xb= void(0)}};return _0x6023xb}_0x6023x17[_0xd409[45]]({hasData:function(_0x6023x3){return _0x6023x35[_0xd409[360]](_0x6023x3)|| _0x6023x34[_0xd409[360]](_0x6023x3)},data:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x35[_0xd409[361]](_0x6023x3,_0x6023x4,_0x6023xb)},removeData:function(_0x6023x3,_0x6023x4){_0x6023x35[_0xd409[362]](_0x6023x3,_0x6023x4)},_data:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x4,_0x6023xb)},_removeData:function(_0x6023x3,_0x6023x4){_0x6023x34[_0xd409[362]](_0x6023x3,_0x6023x4)}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({data:function(_0x6023xb,_0x6023x3){var _0x6023x4,_0x6023x6,_0x6023xa,_0x6023xc=this[0],_0x6023xe=_0x6023xc&& _0x6023xc[_0xd409[157]];if(void(0)=== _0x6023xb){if(this[_0xd409[32]]&& (_0x6023xa= _0x6023x35[_0xd409[290]](_0x6023xc),1=== _0x6023xc[_0xd409[17]]&&  !_0x6023x34[_0xd409[290]](_0x6023xc,_0xd409[363]))){_0x6023x4= _0x6023xe[_0xd409[32]];while(_0x6023x4--){_0x6023xe[_0x6023x4]&& 0=== (_0x6023x6= _0x6023xe[_0x6023x4][_0xd409[187]])[_0xd409[11]](_0xd409[354])&& (_0x6023x6= _0x6023x31(_0x6023x6[_0xd409[8]](5)),_0x6023x38(_0x6023xc,_0x6023x6,_0x6023xa[_0x6023x6]))};_0x6023x34[_0xd409[352]](_0x6023xc,_0xd409[363],!0)};return _0x6023xa};return _0xd409[29]==  typeof _0x6023xb?this[_0xd409[38]](function(){_0x6023x35[_0xd409[352]](this,_0x6023xb)}):_0x6023x2d(this,function(_0x6023x3){var _0x6023x4;if(_0x6023xc&& void(0)=== _0x6023x3){return void(0)!== (_0x6023x4= _0x6023x35[_0xd409[290]](_0x6023xc,_0x6023xb))?_0x6023x4:void(0)!== (_0x6023x4= _0x6023x38(_0x6023xc,_0x6023xb))?_0x6023x4:void(0)};this[_0xd409[38]](function(){_0x6023x35[_0xd409[352]](this,_0x6023xb,_0x6023x3)})},null,_0x6023x3,1< arguments[_0xd409[32]],null,!0)},removeData:function(_0x6023x3){return this[_0xd409[38]](function(){_0x6023x35[_0xd409[362]](this,_0x6023x3)})}}),_0x6023x17[_0xd409[45]]({queue:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6;if(_0x6023x3){return _0x6023x4= (_0x6023x4|| _0xd409[364])+ _0xd409[365],_0x6023x6= _0x6023x34[_0xd409[290]](_0x6023x3,_0x6023x4),_0x6023xb&& (!_0x6023x6|| Array[_0xd409[49]](_0x6023xb)?_0x6023x6= _0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x4,_0x6023x17[_0xd409[287]](_0x6023xb)):_0x6023x6[_0xd409[10]](_0x6023xb)),_0x6023x6|| []}},dequeue:function(_0x6023x3,_0x6023x4){_0x6023x4= _0x6023x4|| _0xd409[364];var _0x6023xb=_0x6023x17[_0xd409[365]](_0x6023x3,_0x6023x4),_0x6023x6=_0x6023xb[_0xd409[32]],_0x6023xa=_0x6023xb[_0xd409[134]](),_0x6023xc=_0x6023x17._queueHooks(_0x6023x3,_0x6023x4);_0xd409[366]=== _0x6023xa&& (_0x6023xa= _0x6023xb[_0xd409[134]](),_0x6023x6--),_0x6023xa&& (_0xd409[364]=== _0x6023x4&& _0x6023xb[_0xd409[207]](_0xd409[366]), delete _0x6023xc[_0xd409[367]],_0x6023xa[_0xd409[14]](_0x6023x3,function(){_0x6023x17[_0xd409[368]](_0x6023x3,_0x6023x4)},_0x6023xc)),!_0x6023x6&& _0x6023xc && _0x6023xc[_0xd409[257]][_0xd409[328]]()},_queueHooks:function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x4+ _0xd409[369];return _0x6023x34[_0xd409[290]](_0x6023x3,_0x6023xb)|| _0x6023x34[_0xd409[361]](_0x6023x3,_0x6023xb,{empty:_0x6023x17.Callbacks(_0xd409[311])[_0xd409[291]](function(){_0x6023x34[_0xd409[362]](_0x6023x3,[_0x6023x4+ _0xd409[365],_0x6023xb])})})}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({queue:function(_0x6023x4,_0x6023xb){var _0x6023x3=2;return _0xd409[55]!=  typeof _0x6023x4&& (_0x6023xb= _0x6023x4,_0x6023x4= _0xd409[364],_0x6023x3--),arguments[_0xd409[32]]< _0x6023x3?_0x6023x17[_0xd409[365]](this[0],_0x6023x4):void(0)=== _0x6023xb?this:this[_0xd409[38]](function(){var _0x6023x3=_0x6023x17[_0xd409[365]](this,_0x6023x4,_0x6023xb);_0x6023x17._queueHooks(this,_0x6023x4),_0xd409[364]=== _0x6023x4&& _0xd409[366]!== _0x6023x3[0]&& _0x6023x17[_0xd409[368]](this,_0x6023x4)})},dequeue:function(_0x6023x3){return this[_0xd409[38]](function(){_0x6023x17[_0xd409[368]](this,_0x6023x3)})},clearQueue:function(_0x6023x3){return this[_0xd409[365]](_0x6023x3|| _0xd409[364],[])},promise:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=1,_0x6023xa=_0x6023x17.Deferred(),_0x6023xc=this,_0x6023xe=this[_0xd409[32]],_0x6023x7=function(){--_0x6023x6|| _0x6023xa[_0xd409[319]](_0x6023xc,[_0x6023xc])};_0xd409[55]!=  typeof _0x6023x3&& (_0x6023x4= _0x6023x3,_0x6023x3= void(0)),_0x6023x3= _0x6023x3|| _0xd409[364];while(_0x6023xe--){(_0x6023xb= _0x6023x34[_0xd409[290]](_0x6023xc[_0x6023xe],_0x6023x3+ _0xd409[369]))&& _0x6023xb[_0xd409[257]]&& (_0x6023x6++,_0x6023xb[_0xd409[257]][_0xd409[291]](_0x6023x7))};return _0x6023x7(),_0x6023xa[_0xd409[297]](_0x6023x4)}});var _0x6023x39=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/[_0xd409[370]],_0x6023x3a= new RegExp(_0xd409[371]+ _0x6023x39+ _0xd409[372],_0xd409[98]),_0x6023x3b=[_0xd409[373],_0xd409[374],_0xd409[375],_0xd409[376]],_0x6023x3c=_0x6023x5[_0xd409[148]],_0x6023x3d=function(_0x6023x3){return _0x6023x17[_0xd409[205]](_0x6023x3[_0xd409[119]],_0x6023x3)},_0x6023x3e={composed:!0};_0x6023x3c[_0xd409[377]]&& (_0x6023x3d= function(_0x6023x3){return _0x6023x17[_0xd409[205]](_0x6023x3[_0xd409[119]],_0x6023x3)|| _0x6023x3[_0xd409[378]](_0x6023x3e)=== _0x6023x3[_0xd409[119]]});var _0x6023x3f=function(_0x6023x3,_0x6023x4){return _0xd409[379]=== (_0x6023x3= _0x6023x4|| _0x6023x3)[_0xd409[381]][_0xd409[380]]|| _0xd409[28]=== _0x6023x3[_0xd409[381]][_0xd409[380]]&& _0x6023x3d(_0x6023x3)&& _0xd409[379]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[380])},_0x6023x40=function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe={};for(_0x6023xc in _0x6023x4){_0x6023xe[_0x6023xc]= _0x6023x3[_0xd409[381]][_0x6023xc],_0x6023x3[_0xd409[381]][_0x6023xc]= _0x6023x4[_0x6023xc]};for(_0x6023xc in _0x6023xa= _0x6023xb[_0xd409[41]](_0x6023x3,_0x6023x6|| []),_0x6023x4){_0x6023x3[_0xd409[381]][_0x6023xc]= _0x6023xe[_0x6023xc]};return _0x6023xa};function _0x6023x41(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe=20,_0x6023x7=_0x6023x6?function(){return _0x6023x6[_0xd409[383]]()}:function(){return _0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x4,_0xd409[28])},_0x6023x9=_0x6023x7(),_0x6023xf=_0x6023xb&& _0x6023xb[3]|| (_0x6023x17[_0xd409[384]][_0x6023x4]?_0xd409[28]:_0xd409[385]),_0x6023x13=_0x6023x3[_0xd409[17]]&& (_0x6023x17[_0xd409[384]][_0x6023x4]|| _0xd409[385]!== _0x6023xf&&  +_0x6023x9)&& _0x6023x3a[_0xd409[120]](_0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x4));if(_0x6023x13&& _0x6023x13[3]!== _0x6023xf){_0x6023x9/= 2,_0x6023xf= _0x6023xf|| _0x6023x13[3],_0x6023x13= +_0x6023x9|| 1;while(_0x6023xe--){_0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x4,_0x6023x13+ _0x6023xf),(1- _0x6023xc)* (1- (_0x6023xc= _0x6023x7()/ _0x6023x9|| 0.5))<= 0&& (_0x6023xe= 0),_0x6023x13/= _0x6023xc};_0x6023x13*= 2,_0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x4,_0x6023x13+ _0x6023xf),_0x6023xb= _0x6023xb|| []};return _0x6023xb&& (_0x6023x13= +_0x6023x13||  +_0x6023x9 || 0,_0x6023xa= _0x6023xb[1]?_0x6023x13+ (_0x6023xb[1]+ 1)* _0x6023xb[2]:+_0x6023xb[2],_0x6023x6&& (_0x6023x6[_0xd409[386]]= _0x6023xf,_0x6023x6[_0xd409[387]]= _0x6023x13,_0x6023x6[_0xd409[388]]= _0x6023xa)),_0x6023xa}var _0x6023x42={};function _0x6023x43(_0x6023x3,_0x6023x4){for(var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=[],_0x6023x13=0,_0x6023x16=_0x6023x3[_0xd409[32]];_0x6023x13< _0x6023x16;_0x6023x13++){(_0x6023x6= _0x6023x3[_0x6023x13])[_0xd409[381]]&& (_0x6023xb= _0x6023x6[_0xd409[381]][_0xd409[380]],_0x6023x4?(_0xd409[379]=== _0x6023xb&& (_0x6023xf[_0x6023x13]= _0x6023x34[_0xd409[290]](_0x6023x6,_0xd409[380])|| null,_0x6023xf[_0x6023x13]|| (_0x6023x6[_0xd409[381]][_0xd409[380]]= _0xd409[28])),_0xd409[28]=== _0x6023x6[_0xd409[381]][_0xd409[380]]&& _0x6023x3f(_0x6023x6)&& (_0x6023xf[_0x6023x13]= (_0x6023x9= _0x6023xe= _0x6023xc= void(0),_0x6023xe= (_0x6023xa= _0x6023x6)[_0xd409[119]],_0x6023x7= _0x6023xa[_0xd409[116]],(_0x6023x9= _0x6023x42[_0x6023x7])|| (_0x6023xc= _0x6023xe[_0xd409[389]][_0xd409[26]](_0x6023xe[_0xd409[20]](_0x6023x7)),_0x6023x9= _0x6023x17[_0xd409[382]](_0x6023xc,_0xd409[380]),_0x6023xc[_0xd409[25]][_0xd409[24]](_0x6023xc),_0xd409[379]=== _0x6023x9&& (_0x6023x9= _0xd409[390]),_0x6023x42[_0x6023x7]= _0x6023x9)))):_0xd409[379]!== _0x6023xb&& (_0x6023xf[_0x6023x13]= _0xd409[379],_0x6023x34[_0xd409[352]](_0x6023x6,_0xd409[380],_0x6023xb)))};for(_0x6023x13= 0;_0x6023x13< _0x6023x16;_0x6023x13++){null!= _0x6023xf[_0x6023x13]&& (_0x6023x3[_0x6023x13][_0xd409[381]][_0xd409[380]]= _0x6023xf[_0x6023x13])};return _0x6023x3}_0x6023x17[_0xd409[2]][_0xd409[45]]({show:function(){return _0x6023x43(this,!0)},hide:function(){return _0x6023x43(this)},toggle:function(_0x6023x3){return _0xd409[46]==  typeof _0x6023x3?_0x6023x3?this[_0xd409[391]]():this[_0xd409[392]]():this[_0xd409[38]](function(){_0x6023x3f(this)?_0x6023x17(this)[_0xd409[391]]():_0x6023x17(this)[_0xd409[392]]()})}});var _0x6023x44=/^(?:checkbox|radio)$/i,_0x6023x45=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,_0x6023x46=/^$|^module$|\/(?:java|ecma)script/i,_0x6023x47={option:[1,_0xd409[393],_0xd409[394]],thead:[1,_0xd409[395],_0xd409[396]],col:[2,_0xd409[397],_0xd409[398]],tr:[2,_0xd409[399],_0xd409[400]],td:[3,_0xd409[401],_0xd409[402]],_default:[0,_0xd409[28],_0xd409[28]]};function _0x6023x48(_0x6023x3,_0x6023x4){var _0x6023xb;return _0x6023xb= _0xd409[4]!=  typeof _0x6023x3[_0xd409[123]]?_0x6023x3[_0xd409[123]](_0x6023x4|| _0xd409[84]):_0xd409[4]!=  typeof _0x6023x3[_0xd409[130]]?_0x6023x3[_0xd409[130]](_0x6023x4|| _0xd409[84]):[],void(0)=== _0x6023x4|| _0x6023x4&& _0x6023x1e(_0x6023x3,_0x6023x4)?_0x6023x17[_0xd409[36]]([_0x6023x3],_0x6023xb):_0x6023xb}function _0x6023x49(_0x6023x3,_0x6023x4){for(var _0x6023xb=0,_0x6023x6=_0x6023x3[_0xd409[32]];_0x6023xb< _0x6023x6;_0x6023xb++){_0x6023x34[_0xd409[352]](_0x6023x3[_0x6023xb],_0xd409[403],!_0x6023x4|| _0x6023x34[_0xd409[290]](_0x6023x4[_0x6023xb],_0xd409[403]))}}_0x6023x47[_0xd409[404]]= _0x6023x47[_0xd409[254]],_0x6023x47[_0xd409[405]]= _0x6023x47[_0xd409[406]]= _0x6023x47[_0xd409[407]]= _0x6023x47[_0xd409[408]]= _0x6023x47[_0xd409[409]],_0x6023x47[_0xd409[410]]= _0x6023x47[_0xd409[411]];var _0x6023x4a,_0x6023x4b,_0x6023x4c=/<|&#?\w+;/;function _0x6023x4d(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa){for(var _0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16=_0x6023x4[_0xd409[412]](),_0x6023x18=[],_0x6023x19=0,_0x6023x1a=_0x6023x3[_0xd409[32]];_0x6023x19< _0x6023x1a;_0x6023x19++){if((_0x6023xc= _0x6023x3[_0x6023x19])|| 0=== _0x6023xc){if(_0xd409[29]=== _0x6023x15(_0x6023xc)){_0x6023x17[_0xd409[36]](_0x6023x18,_0x6023xc[_0xd409[17]]?[_0x6023xc]:_0x6023xc)}else {if(_0x6023x4c[_0xd409[126]](_0x6023xc)){_0x6023xe= _0x6023xe|| _0x6023x16[_0xd409[26]](_0x6023x4[_0xd409[20]](_0xd409[413])),_0x6023x7= (_0x6023x45[_0xd409[120]](_0x6023xc)|| [_0xd409[28],_0xd409[28]])[1][_0xd409[62]](),_0x6023x9= _0x6023x47[_0x6023x7]|| _0x6023x47[_0xd409[414]],_0x6023xe[_0xd409[169]]= _0x6023x9[1]+ _0x6023x17[_0xd409[415]](_0x6023xc)+ _0x6023x9[2],_0x6023x13= _0x6023x9[0];while(_0x6023x13--){_0x6023xe= _0x6023xe[_0xd409[240]]};_0x6023x17[_0xd409[36]](_0x6023x18,_0x6023xe[_0xd409[118]]),(_0x6023xe= _0x6023x16[_0xd409[218]])[_0xd409[217]]= _0xd409[28]}else {_0x6023x18[_0xd409[10]](_0x6023x4[_0xd409[416]](_0x6023xc))}}}};_0x6023x16[_0xd409[217]]= _0xd409[28],_0x6023x19= 0;while(_0x6023xc= _0x6023x18[_0x6023x19++]){if(_0x6023x6&& -1< _0x6023x17[_0xd409[306]](_0x6023xc,_0x6023x6)){_0x6023xa&& _0x6023xa[_0xd409[10]](_0x6023xc)}else {if(_0x6023xf= _0x6023x3d(_0x6023xc),_0x6023xe= _0x6023x48(_0x6023x16[_0xd409[26]](_0x6023xc),_0xd409[19]),_0x6023xf&& _0x6023x49(_0x6023xe),_0x6023xb){_0x6023x13= 0;while(_0x6023xc= _0x6023xe[_0x6023x13++]){_0x6023x46[_0xd409[126]](_0x6023xc[_0xd409[140]]|| _0xd409[28])&& _0x6023xb[_0xd409[10]](_0x6023xc)}}}};return _0x6023x16}_0x6023x4a= _0x6023x5[_0xd409[412]]()[_0xd409[26]](_0x6023x5[_0xd409[20]](_0xd409[413])),(_0x6023x4b= _0x6023x5[_0xd409[20]](_0xd409[139]))[_0xd409[23]](_0xd409[140],_0xd409[417]),_0x6023x4b[_0xd409[23]](_0xd409[253],_0xd409[253]),_0x6023x4b[_0xd409[23]](_0xd409[187],_0xd409[418]),_0x6023x4a[_0xd409[26]](_0x6023x4b),_0x6023x10[_0xd409[419]]= _0x6023x4a[_0xd409[420]](!0)[_0xd409[420]](!0)[_0xd409[240]][_0xd409[253]],_0x6023x4a[_0xd409[169]]= _0xd409[421],_0x6023x10[_0xd409[422]]=  !!_0x6023x4a[_0xd409[420]](!0)[_0xd409[240]][_0xd409[273]];var _0x6023x4e=/^key/,_0x6023x4f=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,_0x6023x50=/^([^.]*)(?:\.(.+)|)/;function _0x6023x51(){return !0}function _0x6023x52(){return !1}function _0x6023x53(_0x6023x3,_0x6023x4){return _0x6023x3=== function(){try{return _0x6023x5[_0xd409[249]]}catch(_0x6023x3){}}()== (_0xd409[423]=== _0x6023x4)}function _0x6023x54(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc){var _0x6023xe,_0x6023x7;if(_0xd409[29]==  typeof _0x6023x4){for(_0x6023x7 in _0xd409[55]!=  typeof _0x6023xb&& (_0x6023x6= _0x6023x6|| _0x6023xb,_0x6023xb= void(0)),_0x6023x4){_0x6023x54(_0x6023x3,_0x6023x7,_0x6023xb,_0x6023x6,_0x6023x4[_0x6023x7],_0x6023xc)};return _0x6023x3};if(null== _0x6023x6&& null== _0x6023xa?(_0x6023xa= _0x6023xb,_0x6023x6= _0x6023xb= void(0)):null== _0x6023xa&& (_0xd409[55]==  typeof _0x6023xb?(_0x6023xa= _0x6023x6,_0x6023x6= void(0)):(_0x6023xa= _0x6023x6,_0x6023x6= _0x6023xb,_0x6023xb= void(0))),!1=== _0x6023xa){_0x6023xa= _0x6023x52}else {if(!_0x6023xa){return _0x6023x3}};return 1=== _0x6023xc&& (_0x6023xe= _0x6023xa,(_0x6023xa= function(_0x6023x3){return _0x6023x17()[_0xd409[425]](_0x6023x3),_0x6023xe[_0xd409[41]](this,arguments)})[_0xd409[424]]= _0x6023xe[_0xd409[424]]|| (_0x6023xe[_0xd409[424]]= _0x6023x17[_0xd409[424]]++)),_0x6023x3[_0xd409[38]](function(){_0x6023x17[_0xd409[426]][_0xd409[291]](this,_0x6023x4,_0x6023xa,_0x6023x6,_0x6023xb)})}function _0x6023x55(_0x6023x3,_0x6023xa,_0x6023xc){_0x6023xc?(_0x6023x34[_0xd409[352]](_0x6023x3,_0x6023xa,!1),_0x6023x17[_0xd409[426]][_0xd409[291]](_0x6023x3,_0x6023xa,{namespace:!1,handler:function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6=_0x6023x34[_0xd409[290]](this,_0x6023xa);if(1& _0x6023x3[_0xd409[427]]&& this[_0x6023xa]){if(_0x6023x6){(_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023xa]|| {})[_0xd409[428]]&& _0x6023x3[_0xd409[430]]()}else {if(_0x6023x6= _0x6023x7[_0xd409[14]](arguments),_0x6023x34[_0xd409[352]](this,_0x6023xa,_0x6023x6),_0x6023x4= _0x6023xc(this,_0x6023xa),this[_0x6023xa](),_0x6023x6!== (_0x6023xb= _0x6023x34[_0xd409[290]](this,_0x6023xa))|| _0x6023x4?_0x6023x34[_0xd409[352]](this,_0x6023xa,!1):_0x6023xb= void(0),_0x6023x6!== _0x6023xb){return _0x6023x3[_0xd409[431]](),_0x6023x3[_0xd409[432]](),_0x6023xb}}}else {_0x6023x6&& (_0x6023x34[_0xd409[352]](this,_0x6023xa,_0x6023x17[_0xd409[426]][_0xd409[434]](_0x6023x17[_0xd409[45]](_0x6023x6[_0xd409[134]](),_0x6023x17[_0xd409[433]][_0xd409[34]]),_0x6023x6,this)),_0x6023x3[_0xd409[431]]())}}})):_0x6023x17[_0xd409[426]][_0xd409[291]](_0x6023x3,_0x6023xa,_0x6023x51)}_0x6023x17[_0xd409[426]]= {global:{},add:function(_0x6023x4,_0x6023x3,_0x6023xb,_0x6023x6,_0x6023xa){var _0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16,_0x6023x18,_0x6023x19,_0x6023x1a,_0x6023x8,_0x6023xd=_0x6023x34[_0xd409[290]](_0x6023x4);if(_0x6023xd){_0x6023xb[_0xd409[435]]&& (_0x6023xb= (_0x6023xc= _0x6023xb)[_0xd409[435]],_0x6023xa= _0x6023xc[_0xd409[266]]),_0x6023xa&& _0x6023x17[_0xd409[164]][_0xd409[195]](_0x6023x3c,_0x6023xa),_0x6023xb[_0xd409[424]]|| (_0x6023xb[_0xd409[424]]= _0x6023x17[_0xd409[424]]++),(_0x6023x9= _0x6023xd[_0xd409[436]])|| (_0x6023x9= _0x6023xd[_0xd409[436]]= {}),(_0x6023xe= _0x6023xd[_0xd409[437]])|| (_0x6023xe= _0x6023xd[_0xd409[437]]= function(_0x6023x3){return _0xd409[4]!=  typeof _0x6023x17&& _0x6023x17[_0xd409[426]][_0xd409[438]]!== _0x6023x3[_0xd409[140]]?_0x6023x17[_0xd409[426]][_0xd409[439]][_0xd409[41]](_0x6023x4,arguments):void(0)}),_0x6023xf= (_0x6023x3= (_0x6023x3|| _0xd409[28])[_0xd409[280]](_0x6023x26)|| [_0xd409[28]])[_0xd409[32]];while(_0x6023xf--){_0x6023x19= _0x6023x8= (_0x6023x7= _0x6023x50[_0xd409[120]](_0x6023x3[_0x6023xf])|| [])[1],_0x6023x1a= (_0x6023x7[2]|| _0xd409[28])[_0xd409[58]](_0xd409[440])[_0xd409[43]](),_0x6023x19&& (_0x6023x16= _0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x19]|| {},_0x6023x19= (_0x6023xa?_0x6023x16[_0xd409[428]]:_0x6023x16[_0xd409[441]])|| _0x6023x19,_0x6023x16= _0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x19]|| {},_0x6023x13= _0x6023x17[_0xd409[45]]({type:_0x6023x19,origType:_0x6023x8,data:_0x6023x6,handler:_0x6023xb,guid:_0x6023xb[_0xd409[424]],selector:_0x6023xa,needsContext:_0x6023xa&& _0x6023x17[_0xd409[274]][_0xd409[280]][_0xd409[269]][_0xd409[126]](_0x6023xa),namespace:_0x6023x1a[_0xd409[129]](_0xd409[440])},_0x6023xc),(_0x6023x18= _0x6023x9[_0x6023x19])|| ((_0x6023x18= _0x6023x9[_0x6023x19]= [])[_0xd409[442]]= 0,_0x6023x16[_0xd409[443]]&& !1!== _0x6023x16[_0xd409[443]][_0xd409[14]](_0x6023x4,_0x6023x6,_0x6023x1a,_0x6023xe)|| _0x6023x4[_0xd409[153]]&& _0x6023x4[_0xd409[153]](_0x6023x19,_0x6023xe)),_0x6023x16[_0xd409[291]]&& (_0x6023x16[_0xd409[291]][_0xd409[14]](_0x6023x4,_0x6023x13),_0x6023x13[_0xd409[435]][_0xd409[424]]|| (_0x6023x13[_0xd409[435]][_0xd409[424]]= _0x6023xb[_0xd409[424]])),_0x6023xa?_0x6023x18[_0xd409[44]](_0x6023x18[_0xd409[442]]++,0,_0x6023x13):_0x6023x18[_0xd409[10]](_0x6023x13),_0x6023x17[_0xd409[426]][_0xd409[444]][_0x6023x19]=  !0)}}},remove:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa){var _0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16,_0x6023x18,_0x6023x19,_0x6023x1a,_0x6023x8,_0x6023xd=_0x6023x34[_0xd409[360]](_0x6023x3)&& _0x6023x34[_0xd409[290]](_0x6023x3);if(_0x6023xd&& (_0x6023x9= _0x6023xd[_0xd409[436]])){_0x6023xf= (_0x6023x4= (_0x6023x4|| _0xd409[28])[_0xd409[280]](_0x6023x26)|| [_0xd409[28]])[_0xd409[32]];while(_0x6023xf--){if(_0x6023x19= _0x6023x8= (_0x6023x7= _0x6023x50[_0xd409[120]](_0x6023x4[_0x6023xf])|| [])[1],_0x6023x1a= (_0x6023x7[2]|| _0xd409[28])[_0xd409[58]](_0xd409[440])[_0xd409[43]](),_0x6023x19){_0x6023x16= _0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x19]|| {},_0x6023x18= _0x6023x9[_0x6023x19= (_0x6023x6?_0x6023x16[_0xd409[428]]:_0x6023x16[_0xd409[441]])|| _0x6023x19]|| [],_0x6023x7= _0x6023x7[2]&&  new RegExp(_0xd409[445]+ _0x6023x1a[_0xd409[129]](_0xd409[446])+ _0xd409[447]),_0x6023xe= _0x6023xc= _0x6023x18[_0xd409[32]];while(_0x6023xc--){_0x6023x13= _0x6023x18[_0x6023xc],!_0x6023xa&& _0x6023x8!== _0x6023x13[_0xd409[448]] || _0x6023xb&& _0x6023xb[_0xd409[424]]!== _0x6023x13[_0xd409[424]] || _0x6023x7&&  !_0x6023x7[_0xd409[126]](_0x6023x13[_0xd409[449]]) || _0x6023x6&& _0x6023x6!== _0x6023x13[_0xd409[266]]&& (_0xd409[450]!== _0x6023x6||  !_0x6023x13[_0xd409[266]]) || (_0x6023x18[_0xd409[44]](_0x6023xc,1),_0x6023x13[_0xd409[266]]&& _0x6023x18[_0xd409[442]]--,_0x6023x16[_0xd409[362]]&& _0x6023x16[_0xd409[362]][_0xd409[14]](_0x6023x3,_0x6023x13))};_0x6023xe&&  !_0x6023x18[_0xd409[32]]&& (_0x6023x16[_0xd409[451]]&& !1!== _0x6023x16[_0xd409[451]][_0xd409[14]](_0x6023x3,_0x6023x1a,_0x6023xd[_0xd409[437]])|| _0x6023x17[_0xd409[452]](_0x6023x3,_0x6023x19,_0x6023xd[_0xd409[437]]), delete _0x6023x9[_0x6023x19])}else {for(_0x6023x19 in _0x6023x9){_0x6023x17[_0xd409[426]][_0xd409[362]](_0x6023x3,_0x6023x19+ _0x6023x4[_0x6023xf],_0x6023xb,_0x6023x6,!0)}}};_0x6023x17[_0xd409[353]](_0x6023x9)&& _0x6023x34[_0xd409[362]](_0x6023x3,_0xd409[453])}},dispatch:function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x17[_0xd409[426]][_0xd409[454]](_0x6023x3),_0x6023x9= new Array(arguments[_0xd409[32]]),_0x6023xf=(_0x6023x34[_0xd409[290]](this,_0xd409[436])|| {})[_0x6023x7[_0xd409[140]]]|| [],_0x6023x13=_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x7[_0xd409[140]]]|| {};for(_0x6023x9[0]= _0x6023x7,_0x6023x4= 1;_0x6023x4< arguments[_0xd409[32]];_0x6023x4++){_0x6023x9[_0x6023x4]= arguments[_0x6023x4]};if(_0x6023x7[_0xd409[455]]= this,!_0x6023x13[_0xd409[456]]|| !1!== _0x6023x13[_0xd409[456]][_0xd409[14]](this,_0x6023x7)){_0x6023xe= _0x6023x17[_0xd409[426]][_0xd409[457]][_0xd409[14]](this,_0x6023x7,_0x6023xf),_0x6023x4= 0;while((_0x6023xa= _0x6023xe[_0x6023x4++])&&  !_0x6023x7[_0xd409[465]]()){_0x6023x7[_0xd409[458]]= _0x6023xa[_0xd409[459]],_0x6023xb= 0;while((_0x6023xc= _0x6023xa[_0xd409[457]][_0x6023xb++])&&  !_0x6023x7[_0xd409[464]]()){_0x6023x7[_0xd409[460]]&& !1!== _0x6023xc[_0xd409[449]] &&  !_0x6023x7[_0xd409[460]][_0xd409[126]](_0x6023xc[_0xd409[449]])|| (_0x6023x7[_0xd409[461]]= _0x6023xc,_0x6023x7[_0xd409[462]]= _0x6023xc[_0xd409[462]],void(0)!== (_0x6023x6= ((_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023xc[_0xd409[448]]]|| {})[_0xd409[437]]|| _0x6023xc[_0xd409[435]])[_0xd409[41]](_0x6023xa[_0xd409[459]],_0x6023x9))&& !1=== (_0x6023x7[_0xd409[463]]= _0x6023x6)&& (_0x6023x7[_0xd409[432]](),_0x6023x7[_0xd409[430]]()))}};return _0x6023x13[_0xd409[466]]&& _0x6023x13[_0xd409[466]][_0xd409[14]](this,_0x6023x7),_0x6023x7[_0xd409[463]]}},handlers:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=[],_0x6023x9=_0x6023x4[_0xd409[442]],_0x6023xf=_0x6023x3[_0xd409[467]];if(_0x6023x9&& _0x6023xf[_0xd409[17]]&&  !(_0xd409[468]=== _0x6023x3[_0xd409[140]]&& 1<= _0x6023x3[_0xd409[141]])){for(;_0x6023xf!== this;_0x6023xf= _0x6023xf[_0xd409[25]]|| this){if(1=== _0x6023xf[_0xd409[17]]&& (_0xd409[468]!== _0x6023x3[_0xd409[140]]|| !0!== _0x6023xf[_0xd409[114]])){for(_0x6023xc= [],_0x6023xe= {},_0x6023xb= 0;_0x6023xb< _0x6023x9;_0x6023xb++){void(0)=== _0x6023xe[_0x6023xa= (_0x6023x6= _0x6023x4[_0x6023xb])[_0xd409[266]]+ _0xd409[57]]&& (_0x6023xe[_0x6023xa]= _0x6023x6[_0xd409[269]]?-1< _0x6023x17(_0x6023xa,this)[_0xd409[288]](_0x6023xf):_0x6023x17[_0xd409[164]](_0x6023xa,this,null,[_0x6023xf])[_0xd409[32]]),_0x6023xe[_0x6023xa]&& _0x6023xc[_0xd409[10]](_0x6023x6)};_0x6023xc[_0xd409[32]]&& _0x6023x7[_0xd409[10]]({elem:_0x6023xf,handlers:_0x6023xc})}}};return _0x6023xf= this,_0x6023x9< _0x6023x4[_0xd409[32]]&& _0x6023x7[_0xd409[10]]({elem:_0x6023xf,handlers:_0x6023x4[_0xd409[8]](_0x6023x9)}),_0x6023x7},addProp:function(_0x6023x4,_0x6023x3){Object[_0xd409[350]](_0x6023x17[_0xd409[433]][_0xd409[34]],_0x6023x4,{enumerable:!0,configurable:!0,get:_0x6023x11(_0x6023x3)?function(){if(this[_0xd409[469]]){return _0x6023x3(this[_0xd409[469]])}}:function(){if(this[_0xd409[469]]){return this[_0xd409[469]][_0x6023x4]}},set:function(_0x6023x3){Object[_0xd409[350]](this,_0x6023x4,{enumerable:!0,configurable:!0,writable:!0,value:_0x6023x3})}})},fix:function(_0x6023x3){return _0x6023x3[_0x6023x17[_0xd409[348]]]?_0x6023x3: new _0x6023x17.Event(_0x6023x3)},special:{load:{noBubble:!0},click:{setup:function(_0x6023x3){var _0x6023x4=this|| _0x6023x3;return _0x6023x44[_0xd409[126]](_0x6023x4[_0xd409[140]])&& _0x6023x4[_0xd409[468]]&& _0x6023x1e(_0x6023x4,_0xd409[139])&& void(0)=== _0x6023x34[_0xd409[290]](_0x6023x4,_0xd409[468])&& _0x6023x55(_0x6023x4,_0xd409[468],_0x6023x51),!1},trigger:function(_0x6023x3){var _0x6023x4=this|| _0x6023x3;return _0x6023x44[_0xd409[126]](_0x6023x4[_0xd409[140]])&& _0x6023x4[_0xd409[468]]&& _0x6023x1e(_0x6023x4,_0xd409[139])&& void(0)=== _0x6023x34[_0xd409[290]](_0x6023x4,_0xd409[468])&& _0x6023x55(_0x6023x4,_0xd409[468]),!0},_default:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[467]];return _0x6023x44[_0xd409[126]](_0x6023x4[_0xd409[140]])&& _0x6023x4[_0xd409[468]]&& _0x6023x1e(_0x6023x4,_0xd409[139])&& _0x6023x34[_0xd409[290]](_0x6023x4,_0xd409[468])|| _0x6023x1e(_0x6023x4,_0xd409[470])}},beforeunload:{postDispatch:function(_0x6023x3){void(0)!== _0x6023x3[_0xd409[463]]&& _0x6023x3[_0xd409[469]]&& (_0x6023x3[_0xd409[469]][_0xd409[471]]= _0x6023x3[_0xd409[463]])}}}},_0x6023x17[_0xd409[452]]= function(_0x6023x3,_0x6023x4,_0x6023xb){_0x6023x3[_0xd409[337]]&& _0x6023x3[_0xd409[337]](_0x6023x4,_0x6023xb)},_0x6023x17[_0xd409[433]]= function(_0x6023x3,_0x6023x4){if(!(this instanceof  _0x6023x17[_0xd409[433]])){return  new _0x6023x17.Event(_0x6023x3,_0x6023x4)};_0x6023x3&& _0x6023x3[_0xd409[140]]?(this[_0xd409[469]]= _0x6023x3,this[_0xd409[140]]= _0x6023x3[_0xd409[140]],this[_0xd409[472]]= _0x6023x3[_0xd409[473]]|| void(0)=== _0x6023x3[_0xd409[473]]&& !1=== _0x6023x3[_0xd409[471]]?_0x6023x51:_0x6023x52,this[_0xd409[467]]= _0x6023x3[_0xd409[467]]&& 3=== _0x6023x3[_0xd409[467]][_0xd409[17]]?_0x6023x3[_0xd409[467]][_0xd409[25]]:_0x6023x3[_0xd409[467]],this[_0xd409[458]]= _0x6023x3[_0xd409[458]],this[_0xd409[474]]= _0x6023x3[_0xd409[474]]):this[_0xd409[140]]= _0x6023x3,_0x6023x4&& _0x6023x17[_0xd409[45]](this,_0x6023x4),this[_0xd409[475]]= _0x6023x3&& _0x6023x3[_0xd409[475]]|| Date[_0xd409[476]](),this[_0x6023x17[_0xd409[348]]]=  !0},_0x6023x17[_0xd409[433]][_0xd409[34]]= {constructor:_0x6023x17[_0xd409[433]],isDefaultPrevented:_0x6023x52,isPropagationStopped:_0x6023x52,isImmediatePropagationStopped:_0x6023x52,isSimulated:!1,preventDefault:function(){var _0x6023x3=this[_0xd409[469]];this[_0xd409[472]]= _0x6023x51,_0x6023x3&&  !this[_0xd409[477]]&& _0x6023x3[_0xd409[432]]()},stopPropagation:function(){var _0x6023x3=this[_0xd409[469]];this[_0xd409[465]]= _0x6023x51,_0x6023x3&&  !this[_0xd409[477]]&& _0x6023x3[_0xd409[430]]()},stopImmediatePropagation:function(){var _0x6023x3=this[_0xd409[469]];this[_0xd409[464]]= _0x6023x51,_0x6023x3&&  !this[_0xd409[477]]&& _0x6023x3[_0xd409[431]](),this[_0xd409[430]]()}},_0x6023x17[_0xd409[38]]({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"\x63\x68\x61\x72":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[141]];return null== _0x6023x3[_0xd409[478]]&& _0x6023x4e[_0xd409[126]](_0x6023x3[_0xd409[140]])?null!= _0x6023x3[_0xd409[479]]?_0x6023x3[_0xd409[479]]:_0x6023x3[_0xd409[480]]:!_0x6023x3[_0xd409[478]]&& void(0)!== _0x6023x4 && _0x6023x4f[_0xd409[126]](_0x6023x3[_0xd409[140]])?1& _0x6023x4?1:2& _0x6023x4?3:4& _0x6023x4?2:0:_0x6023x3[_0xd409[478]]}},_0x6023x17[_0xd409[426]][_0xd409[481]]),_0x6023x17[_0xd409[38]]({focus:_0xd409[482],blur:_0xd409[483]},function(_0x6023x3,_0x6023x4){_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x3]= {setup:function(){return _0x6023x55(this,_0x6023x3,_0x6023x53),!1},trigger:function(){return _0x6023x55(this,_0x6023x3),!0},delegateType:_0x6023x4}}),_0x6023x17[_0xd409[38]]({mouseenter:_0xd409[484],mouseleave:_0xd409[485],pointerenter:_0xd409[486],pointerleave:_0xd409[487]},function(_0x6023x3,_0x6023xa){_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x3]= {delegateType:_0x6023xa,bindType:_0x6023xa,handle:function(_0x6023x3){var _0x6023x4,_0x6023xb=_0x6023x3[_0xd409[474]],_0x6023x6=_0x6023x3[_0xd409[461]];return _0x6023xb&& (_0x6023xb=== this|| _0x6023x17[_0xd409[205]](this,_0x6023xb))|| (_0x6023x3[_0xd409[140]]= _0x6023x6[_0xd409[448]],_0x6023x4= _0x6023x6[_0xd409[435]][_0xd409[41]](this,arguments),_0x6023x3[_0xd409[140]]= _0x6023xa),_0x6023x4}}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({on:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){return _0x6023x54(this,_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6)},one:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){return _0x6023x54(this,_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,1)},off:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa;if(_0x6023x3&& _0x6023x3[_0xd409[432]]&& _0x6023x3[_0xd409[461]]){return _0x6023x6= _0x6023x3[_0xd409[461]],_0x6023x17(_0x6023x3[_0xd409[455]])[_0xd409[425]](_0x6023x6[_0xd409[449]]?_0x6023x6[_0xd409[448]]+ _0xd409[440]+ _0x6023x6[_0xd409[449]]:_0x6023x6[_0xd409[448]],_0x6023x6[_0xd409[266]],_0x6023x6[_0xd409[435]]),this};if(_0xd409[29]==  typeof _0x6023x3){for(_0x6023xa in _0x6023x3){this[_0xd409[425]](_0x6023xa,_0x6023x4,_0x6023x3[_0x6023xa])};return this};return !1!== _0x6023x4 && _0xd409[15]!=  typeof _0x6023x4 || (_0x6023xb= _0x6023x4,_0x6023x4= void(0)),!1=== _0x6023xb && (_0x6023xb= _0x6023x52),this[_0xd409[38]](function(){_0x6023x17[_0xd409[426]][_0xd409[362]](this,_0x6023x3,_0x6023xb,_0x6023x4)})}});var _0x6023x56=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,_0x6023x57=/<script|<style|<link/i,_0x6023x58=/checked\s*(?:[^=]|=\s*.checked.)/i,_0x6023x59=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function _0x6023x5a(_0x6023x3,_0x6023x4){return _0x6023x1e(_0x6023x3,_0xd409[488])&& _0x6023x1e(11!== _0x6023x4[_0xd409[17]]?_0x6023x4:_0x6023x4[_0xd409[218]],_0xd409[489])&& _0x6023x17(_0x6023x3)[_0xd409[490]](_0xd409[405])[0]|| _0x6023x3}function _0x6023x5b(_0x6023x3){return _0x6023x3[_0xd409[140]]= (null!== _0x6023x3[_0xd409[22]](_0xd409[140]))+ _0xd409[491]+ _0x6023x3[_0xd409[140]],_0x6023x3}function _0x6023x5c(_0x6023x3){return _0xd409[492]=== (_0x6023x3[_0xd409[140]]|| _0xd409[28])[_0xd409[8]](0,5)?_0x6023x3[_0xd409[140]]= _0x6023x3[_0xd409[140]][_0xd409[8]](5):_0x6023x3[_0xd409[131]](_0xd409[140]),_0x6023x3}function _0x6023x5d(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf;if(1=== _0x6023x4[_0xd409[17]]){if(_0x6023x34[_0xd409[360]](_0x6023x3)&& (_0x6023xc= _0x6023x34[_0xd409[361]](_0x6023x3),_0x6023xe= _0x6023x34[_0xd409[352]](_0x6023x4,_0x6023xc),_0x6023xf= _0x6023xc[_0xd409[436]])){for(_0x6023xa in  delete _0x6023xe[_0xd409[437]],_0x6023xe[_0xd409[436]]= {},_0x6023xf){for(_0x6023xb= 0,_0x6023x6= _0x6023xf[_0x6023xa][_0xd409[32]];_0x6023xb< _0x6023x6;_0x6023xb++){_0x6023x17[_0xd409[426]][_0xd409[291]](_0x6023x4,_0x6023xa,_0x6023xf[_0x6023xa][_0x6023xb])}}};_0x6023x35[_0xd409[360]](_0x6023x3)&& (_0x6023x7= _0x6023x35[_0xd409[361]](_0x6023x3),_0x6023x9= _0x6023x17[_0xd409[45]]({},_0x6023x7),_0x6023x35[_0xd409[352]](_0x6023x4,_0x6023x9))}}function _0x6023x5e(_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc){_0x6023x6= _0x6023x8[_0xd409[41]]([],_0x6023x6);var _0x6023x3,_0x6023x4,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13=0,_0x6023x16=_0x6023xb[_0xd409[32]],_0x6023x18=_0x6023x16- 1,_0x6023x19=_0x6023x6[0],_0x6023x1a=_0x6023x11(_0x6023x19);if(_0x6023x1a|| 1< _0x6023x16&& _0xd409[55]==  typeof _0x6023x19&&  !_0x6023x10[_0xd409[419]]&& _0x6023x58[_0xd409[126]](_0x6023x19)){return _0x6023xb[_0xd409[38]](function(_0x6023x3){var _0x6023x4=_0x6023xb[_0xd409[42]](_0x6023x3);_0x6023x1a&& (_0x6023x6[0]= _0x6023x19[_0xd409[14]](this,_0x6023x3,_0x6023x4[_0xd409[493]]())),_0x6023x5e(_0x6023x4,_0x6023x6,_0x6023xa,_0x6023xc)})};if(_0x6023x16&& (_0x6023x4= (_0x6023x3= _0x6023x4d(_0x6023x6,_0x6023xb[0][_0xd409[119]],!1,_0x6023xb,_0x6023xc))[_0xd409[218]],1=== _0x6023x3[_0xd409[118]][_0xd409[32]]&& (_0x6023x3= _0x6023x4),_0x6023x4|| _0x6023xc)){for(_0x6023x7= (_0x6023xe= _0x6023x17[_0xd409[39]](_0x6023x48(_0x6023x3,_0xd409[19]),_0x6023x5b))[_0xd409[32]];_0x6023x13< _0x6023x16;_0x6023x13++){_0x6023x9= _0x6023x3,_0x6023x13!== _0x6023x18&& (_0x6023x9= _0x6023x17[_0xd409[494]](_0x6023x9,!0,!0),_0x6023x7&& _0x6023x17[_0xd409[36]](_0x6023xe,_0x6023x48(_0x6023x9,_0xd409[19]))),_0x6023xa[_0xd409[14]](_0x6023xb[_0x6023x13],_0x6023x9,_0x6023x13)};if(_0x6023x7){for(_0x6023xf= _0x6023xe[_0x6023xe[_0xd409[32]]- 1][_0xd409[119]],_0x6023x17[_0xd409[39]](_0x6023xe,_0x6023x5c),_0x6023x13= 0;_0x6023x13< _0x6023x7;_0x6023x13++){_0x6023x9= _0x6023xe[_0x6023x13],_0x6023x46[_0xd409[126]](_0x6023x9[_0xd409[140]]|| _0xd409[28])&&  !_0x6023x34[_0xd409[361]](_0x6023x9,_0xd409[403])&& _0x6023x17[_0xd409[205]](_0x6023xf,_0x6023x9)&& (_0x6023x9[_0xd409[495]]&& _0xd409[496]!== (_0x6023x9[_0xd409[140]]|| _0xd409[28])[_0xd409[62]]()?_0x6023x17[_0xd409[497]]&&  !_0x6023x9[_0xd409[498]]&& _0x6023x17._evalUrl(_0x6023x9[_0xd409[495]],{nonce:_0x6023x9[_0xd409[54]]|| _0x6023x9[_0xd409[22]](_0xd409[54])}):_0x6023x14(_0x6023x9[_0xd409[217]][_0xd409[51]](_0x6023x59,_0xd409[28]),_0x6023x9,_0x6023xf))}}};return _0x6023xb}function _0x6023x5f(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6,_0x6023xa=_0x6023x4?_0x6023x17[_0xd409[163]](_0x6023x4,_0x6023x3):_0x6023x3,_0x6023xc=0;null!= (_0x6023x6= _0x6023xa[_0x6023xc]);_0x6023xc++){_0x6023xb|| 1!== _0x6023x6[_0xd409[17]]|| _0x6023x17[_0xd409[499]](_0x6023x48(_0x6023x6)),_0x6023x6[_0xd409[25]]&& (_0x6023xb&& _0x6023x3d(_0x6023x6)&& _0x6023x49(_0x6023x48(_0x6023x6,_0xd409[19])),_0x6023x6[_0xd409[25]][_0xd409[24]](_0x6023x6))};return _0x6023x3}_0x6023x17[_0xd409[45]]({htmlPrefilter:function(_0x6023x3){return _0x6023x3[_0xd409[51]](_0x6023x56,_0xd409[500])},clone:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13=_0x6023x3[_0xd409[420]](!0),_0x6023x16=_0x6023x3d(_0x6023x3);if(!(_0x6023x10[_0xd409[422]]|| 1!== _0x6023x3[_0xd409[17]]&& 11!== _0x6023x3[_0xd409[17]]|| _0x6023x17[_0xd409[277]](_0x6023x3))){for(_0x6023xe= _0x6023x48(_0x6023x13),_0x6023x6= 0,_0x6023xa= (_0x6023xc= _0x6023x48(_0x6023x3))[_0xd409[32]];_0x6023x6< _0x6023xa;_0x6023x6++){_0x6023x7= _0x6023xc[_0x6023x6],_0x6023x9= _0x6023xe[_0x6023x6],void(0),_0xd409[139]=== (_0x6023xf= _0x6023x9[_0xd409[116]][_0xd409[62]]())&& _0x6023x44[_0xd409[126]](_0x6023x7[_0xd409[140]])?_0x6023x9[_0xd409[253]]= _0x6023x7[_0xd409[253]]:_0xd409[139]!== _0x6023xf&& _0xd409[501]!== _0x6023xf|| (_0x6023x9[_0xd409[273]]= _0x6023x7[_0xd409[273]])}};if(_0x6023x4){if(_0x6023xb){for(_0x6023xc= _0x6023xc|| _0x6023x48(_0x6023x3),_0x6023xe= _0x6023xe|| _0x6023x48(_0x6023x13),_0x6023x6= 0,_0x6023xa= _0x6023xc[_0xd409[32]];_0x6023x6< _0x6023xa;_0x6023x6++){_0x6023x5d(_0x6023xc[_0x6023x6],_0x6023xe[_0x6023x6])}}else {_0x6023x5d(_0x6023x3,_0x6023x13)}};return 0< (_0x6023xe= _0x6023x48(_0x6023x13,_0xd409[19]))[_0xd409[32]]&& _0x6023x49(_0x6023xe,!_0x6023x16&& _0x6023x48(_0x6023x3,_0xd409[19])),_0x6023x13},cleanData:function(_0x6023x3){for(var _0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa=_0x6023x17[_0xd409[426]][_0xd409[429]],_0x6023xc=0;void(0)!== (_0x6023xb= _0x6023x3[_0x6023xc]);_0x6023xc++){if(_0x6023x32(_0x6023xb)){if(_0x6023x4= _0x6023xb[_0x6023x34[_0xd409[348]]]){if(_0x6023x4[_0xd409[436]]){for(_0x6023x6 in _0x6023x4[_0xd409[436]]){_0x6023xa[_0x6023x6]?_0x6023x17[_0xd409[426]][_0xd409[362]](_0x6023xb,_0x6023x6):_0x6023x17[_0xd409[452]](_0x6023xb,_0x6023x6,_0x6023x4[_0xd409[437]])}};_0x6023xb[_0x6023x34[_0xd409[348]]]= void(0)};_0x6023xb[_0x6023x35[_0xd409[348]]]&& (_0x6023xb[_0x6023x35[_0xd409[348]]]= void(0))}}}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({detach:function(_0x6023x3){return _0x6023x5f(this,_0x6023x3,!0)},remove:function(_0x6023x3){return _0x6023x5f(this,_0x6023x3)},text:function(_0x6023x3){return _0x6023x2d(this,function(_0x6023x3){return void(0)=== _0x6023x3?_0x6023x17[_0xd409[21]](this):this[_0xd409[257]]()[_0xd409[38]](function(){1!== this[_0xd409[17]]&& 11!== this[_0xd409[17]]&& 9!== this[_0xd409[17]]|| (this[_0xd409[217]]= _0x6023x3)})},null,_0x6023x3,arguments[_0xd409[32]])},append:function(){return _0x6023x5e(this,arguments,function(_0x6023x3){1!== this[_0xd409[17]]&& 11!== this[_0xd409[17]]&& 9!== this[_0xd409[17]]|| _0x6023x5a(this,_0x6023x3)[_0xd409[26]](_0x6023x3)})},prepend:function(){return _0x6023x5e(this,arguments,function(_0x6023x3){if(1=== this[_0xd409[17]]|| 11=== this[_0xd409[17]]|| 9=== this[_0xd409[17]]){var _0x6023x4=_0x6023x5a(this,_0x6023x3);_0x6023x4[_0xd409[502]](_0x6023x3,_0x6023x4[_0xd409[218]])}})},before:function(){return _0x6023x5e(this,arguments,function(_0x6023x3){this[_0xd409[25]]&& this[_0xd409[25]][_0xd409[502]](_0x6023x3,this)})},after:function(){return _0x6023x5e(this,arguments,function(_0x6023x3){this[_0xd409[25]]&& this[_0xd409[25]][_0xd409[502]](_0x6023x3,this[_0xd409[138]])})},empty:function(){for(var _0x6023x3,_0x6023x4=0;null!= (_0x6023x3= this[_0x6023x4]);_0x6023x4++){1=== _0x6023x3[_0xd409[17]]&& (_0x6023x17[_0xd409[499]](_0x6023x48(_0x6023x3,!1)),_0x6023x3[_0xd409[217]]= _0xd409[28])};return this},clone:function(_0x6023x3,_0x6023x4){return _0x6023x3= null!= _0x6023x3&& _0x6023x3,_0x6023x4= null== _0x6023x4?_0x6023x3:_0x6023x4,this[_0xd409[39]](function(){return _0x6023x17[_0xd409[494]](this,_0x6023x3,_0x6023x4)})},html:function(_0x6023x3){return _0x6023x2d(this,function(_0x6023x3){var _0x6023x4=this[0]|| {},_0x6023xb=0,_0x6023x6=this[_0xd409[32]];if(void(0)=== _0x6023x3&& 1=== _0x6023x4[_0xd409[17]]){return _0x6023x4[_0xd409[169]]};if(_0xd409[55]==  typeof _0x6023x3&&  !_0x6023x57[_0xd409[126]](_0x6023x3)&&  !_0x6023x47[(_0x6023x45[_0xd409[120]](_0x6023x3)|| [_0xd409[28],_0xd409[28]])[1][_0xd409[62]]()]){_0x6023x3= _0x6023x17[_0xd409[415]](_0x6023x3);try{for(;_0x6023xb< _0x6023x6;_0x6023xb++){1=== (_0x6023x4= this[_0x6023xb]|| {})[_0xd409[17]]&& (_0x6023x17[_0xd409[499]](_0x6023x48(_0x6023x4,!1)),_0x6023x4[_0xd409[169]]= _0x6023x3)};_0x6023x4= 0}catch(_0x6023x3){}};_0x6023x4&& this[_0xd409[257]]()[_0xd409[503]](_0x6023x3)},null,_0x6023x3,arguments[_0xd409[32]])},replaceWith:function(){var _0x6023xb=[];return _0x6023x5e(this,arguments,function(_0x6023x3){var _0x6023x4=this[_0xd409[25]];_0x6023x17[_0xd409[306]](this,_0x6023xb)< 0&& (_0x6023x17[_0xd409[499]](_0x6023x48(this)),_0x6023x4&& _0x6023x4[_0xd409[504]](_0x6023x3,this))},_0x6023xb)}}),_0x6023x17[_0xd409[38]]({appendTo:_0xd409[503],prependTo:_0xd409[505],insertBefore:_0xd409[506],insertAfter:_0xd409[507],replaceAll:_0xd409[508]},function(_0x6023x3,_0x6023xe){_0x6023x17[_0xd409[2]][_0x6023x3]= function(_0x6023x3){for(var _0x6023x4,_0x6023xb=[],_0x6023x6=_0x6023x17(_0x6023x3),_0x6023xa=_0x6023x6[_0xd409[32]]- 1,_0x6023xc=0;_0x6023xc<= _0x6023xa;_0x6023xc++){_0x6023x4= _0x6023xc=== _0x6023xa?this:this[_0xd409[494]](!0),_0x6023x17(_0x6023x6[_0x6023xc])[_0x6023xe](_0x6023x4),_0x6023x9[_0xd409[41]](_0x6023xb,_0x6023x4[_0xd409[290]]())};return this[_0xd409[40]](_0x6023xb)}});var _0x6023x60= new RegExp(_0xd409[91]+ _0x6023x39+ _0xd409[509],_0xd409[98]),_0x6023x61=function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[119]][_0xd409[151]];return _0x6023x4&& _0x6023x4[_0xd409[510]]|| (_0x6023x4= _0x6023x2),_0x6023x4[_0xd409[511]](_0x6023x3)},_0x6023x62= new RegExp(_0x6023x3b[_0xd409[129]](_0xd409[135]),_0xd409[98]);function _0x6023x63(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x3[_0xd409[381]];return (_0x6023xb= _0x6023xb|| _0x6023x61(_0x6023x3))&& (_0xd409[28]!== (_0x6023xe= _0x6023xb[_0xd409[512]](_0x6023x4)|| _0x6023xb[_0x6023x4])|| _0x6023x3d(_0x6023x3)|| (_0x6023xe= _0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x4)),!_0x6023x10[_0xd409[513]]()&& _0x6023x60[_0xd409[126]](_0x6023xe) && _0x6023x62[_0xd409[126]](_0x6023x4) && (_0x6023x6= _0x6023x7[_0xd409[514]],_0x6023xa= _0x6023x7[_0xd409[515]],_0x6023xc= _0x6023x7[_0xd409[516]],_0x6023x7[_0xd409[515]]= _0x6023x7[_0xd409[516]]= _0x6023x7[_0xd409[514]]= _0x6023xe,_0x6023xe= _0x6023xb[_0xd409[514]],_0x6023x7[_0xd409[514]]= _0x6023x6,_0x6023x7[_0xd409[515]]= _0x6023xa,_0x6023x7[_0xd409[516]]= _0x6023xc)),void(0)!== _0x6023xe?_0x6023xe+ _0xd409[28]:_0x6023xe}function _0x6023x64(_0x6023x3,_0x6023x4){return {get:function(){if(!_0x6023x3()){return (this[_0xd409[290]]= _0x6023x4)[_0xd409[41]](this,arguments)};delete this[_0xd409[290]]}}}! function(){function _0x6023x3(){if(_0x6023x9){_0x6023x7[_0xd409[381]][_0xd409[517]]= _0xd409[518],_0x6023x9[_0xd409[381]][_0xd409[517]]= _0xd409[519],_0x6023x3c[_0xd409[26]](_0x6023x7)[_0xd409[26]](_0x6023x9);var _0x6023x3=_0x6023x2[_0xd409[511]](_0x6023x9);_0x6023xb= _0xd409[520]!== _0x6023x3[_0xd409[152]],_0x6023xe= 12=== _0x6023x4(_0x6023x3[_0xd409[521]]),_0x6023x9[_0xd409[381]][_0xd409[522]]= _0xd409[523],_0x6023xc= 36=== _0x6023x4(_0x6023x3[_0xd409[522]]),_0x6023x6= 36=== _0x6023x4(_0x6023x3[_0xd409[514]]),_0x6023x9[_0xd409[381]][_0xd409[524]]= _0xd409[525],_0x6023xa= 12=== _0x6023x4(_0x6023x9[_0xd409[526]]/ 3),_0x6023x3c[_0xd409[24]](_0x6023x7),_0x6023x9= null}}function _0x6023x4(_0x6023x3){return Math[_0xd409[527]](parseFloat(_0x6023x3))}var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x5[_0xd409[20]](_0xd409[413]),_0x6023x9=_0x6023x5[_0xd409[20]](_0xd409[413]);_0x6023x9[_0xd409[381]]&& (_0x6023x9[_0xd409[381]][_0xd409[528]]= _0xd409[529],_0x6023x9[_0xd409[420]](!0)[_0xd409[381]][_0xd409[528]]= _0xd409[28],_0x6023x10[_0xd409[530]]= _0xd409[529]=== _0x6023x9[_0xd409[381]][_0xd409[528]],_0x6023x17[_0xd409[45]](_0x6023x10,{boxSizingReliable:function(){return _0x6023x3(),_0x6023x6},pixelBoxStyles:function(){return _0x6023x3(),_0x6023xc},pixelPosition:function(){return _0x6023x3(),_0x6023xb},reliableMarginLeft:function(){return _0x6023x3(),_0x6023xe},scrollboxSize:function(){return _0x6023x3(),_0x6023xa}}))}();var _0x6023x65=[_0xd409[531],_0xd409[532],_0xd409[533]],_0x6023x66=_0x6023x5[_0xd409[20]](_0xd409[413])[_0xd409[381]],_0x6023x67={};function _0x6023x68(_0x6023x3){var _0x6023x4=_0x6023x17[_0xd409[534]][_0x6023x3]|| _0x6023x67[_0x6023x3];return _0x6023x4|| (_0x6023x3 in  _0x6023x66?_0x6023x3:_0x6023x67[_0x6023x3]= function(_0x6023x3){var _0x6023x4=_0x6023x3[0][_0xd409[346]]()+ _0x6023x3[_0xd409[8]](1),_0x6023xb=_0x6023x65[_0xd409[32]];while(_0x6023xb--){if((_0x6023x3= _0x6023x65[_0x6023xb]+ _0x6023x4) in  _0x6023x66){return _0x6023x3}}}(_0x6023x3)|| _0x6023x3)}var _0x6023x69=/^(none|table(?!-c[ea]).+)/,_0x6023x6a=/^--/,_0x6023x6b={position:_0xd409[525],visibility:_0xd409[186],display:_0xd409[390]},_0x6023x6c={letterSpacing:_0xd409[267],fontWeight:_0xd409[535]};function _0x6023x6d(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023x3a[_0xd409[120]](_0x6023x4);return _0x6023x6?Math[_0xd409[536]](0,_0x6023x6[2]- (_0x6023xb|| 0))+ (_0x6023x6[3]|| _0xd409[385]):_0x6023x4}function _0x6023x6e(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc){var _0x6023xe=_0xd409[514]=== _0x6023x4?1:0,_0x6023x7=0,_0x6023x9=0;if(_0x6023xb=== (_0x6023x6?_0xd409[537]:_0xd409[294])){return 0};for(;_0x6023xe< 4;_0x6023xe+= 2){_0xd409[538]=== _0x6023xb&& (_0x6023x9+= _0x6023x17[_0xd409[382]](_0x6023x3,_0x6023xb+ _0x6023x3b[_0x6023xe],!0,_0x6023xa)),_0x6023x6?(_0xd409[294]=== _0x6023xb&& (_0x6023x9-= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[539]+ _0x6023x3b[_0x6023xe],!0,_0x6023xa)),_0xd409[538]!== _0x6023xb&& (_0x6023x9-= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[537]+ _0x6023x3b[_0x6023xe]+ _0xd409[540],!0,_0x6023xa))):(_0x6023x9+= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[539]+ _0x6023x3b[_0x6023xe],!0,_0x6023xa),_0xd409[539]!== _0x6023xb?_0x6023x9+= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[537]+ _0x6023x3b[_0x6023xe]+ _0xd409[540],!0,_0x6023xa):_0x6023x7+= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[537]+ _0x6023x3b[_0x6023xe]+ _0xd409[540],!0,_0x6023xa))};return !_0x6023x6&& 0<= _0x6023xc && (_0x6023x9+= Math[_0xd409[536]](0,Math[_0xd409[542]](_0x6023x3[_0xd409[541]+ _0x6023x4[0][_0xd409[346]]()+ _0x6023x4[_0xd409[8]](1)]- _0x6023xc- _0x6023x9- _0x6023x7- 0.5))|| 0),_0x6023x9}function _0x6023x6f(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023x61(_0x6023x3),_0x6023xa=(!_0x6023x10[_0xd409[543]]()|| _0x6023xb) && _0xd409[544]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[545],!1,_0x6023x6),_0x6023xc=_0x6023xa,_0x6023xe=_0x6023x63(_0x6023x3,_0x6023x4,_0x6023x6),_0x6023x7=_0xd409[541]+ _0x6023x4[0][_0xd409[346]]()+ _0x6023x4[_0xd409[8]](1);if(_0x6023x60[_0xd409[126]](_0x6023xe)){if(!_0x6023xb){return _0x6023xe};_0x6023xe= _0xd409[546]};return (!_0x6023x10[_0xd409[543]]()&& _0x6023xa || _0xd409[546]=== _0x6023xe || !parseFloat(_0x6023xe)&& _0xd409[547]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[380],!1,_0x6023x6)) && _0x6023x3[_0xd409[548]]()[_0xd409[32]] && (_0x6023xa= _0xd409[544]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[545],!1,_0x6023x6),(_0x6023xc= _0x6023x7 in  _0x6023x3)&& (_0x6023xe= _0x6023x3[_0x6023x7])),(_0x6023xe= parseFloat(_0x6023xe)|| 0)+ _0x6023x6e(_0x6023x3,_0x6023x4,_0x6023xb|| (_0x6023xa?_0xd409[537]:_0xd409[294]),_0x6023xc,_0x6023x6,_0x6023xe)+ _0xd409[385]}function _0x6023x70(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa){return  new _0x6023x70[_0xd409[34]][_0xd409[31]](_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa)}_0x6023x17[_0xd409[45]]({cssHooks:{opacity:{get:function(_0x6023x3,_0x6023x4){if(_0x6023x4){var _0x6023xb=_0x6023x63(_0x6023x3,_0xd409[549]);return _0xd409[28]=== _0x6023xb?_0xd409[550]:_0x6023xb}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){if(_0x6023x3&& 3!== _0x6023x3[_0xd409[17]]&& 8!== _0x6023x3[_0xd409[17]]&& _0x6023x3[_0xd409[381]]){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x31(_0x6023x4),_0x6023x9=_0x6023x6a[_0xd409[126]](_0x6023x4),_0x6023xf=_0x6023x3[_0xd409[381]];if(_0x6023x9|| (_0x6023x4= _0x6023x68(_0x6023x7)),_0x6023xe= _0x6023x17[_0xd409[551]][_0x6023x4]|| _0x6023x17[_0xd409[551]][_0x6023x7],void(0)=== _0x6023xb){return _0x6023xe&& _0xd409[290] in  _0x6023xe&& void(0)!== (_0x6023xa= _0x6023xe[_0xd409[290]](_0x6023x3,!1,_0x6023x6))?_0x6023xa:_0x6023xf[_0x6023x4]};_0xd409[55]=== (_0x6023xc=  typeof _0x6023xb)&& (_0x6023xa= _0x6023x3a[_0xd409[120]](_0x6023xb))&& _0x6023xa[1]&& (_0x6023xb= _0x6023x41(_0x6023x3,_0x6023x4,_0x6023xa),_0x6023xc= _0xd409[16]),null!= _0x6023xb&& _0x6023xb== _0x6023xb&& (_0xd409[16]!== _0x6023xc|| _0x6023x9|| (_0x6023xb+= _0x6023xa&& _0x6023xa[3]|| (_0x6023x17[_0xd409[384]][_0x6023x7]?_0xd409[28]:_0xd409[385])),_0x6023x10[_0xd409[530]]|| _0xd409[28]!== _0x6023xb|| 0!== _0x6023x4[_0xd409[11]](_0xd409[552])|| (_0x6023xf[_0x6023x4]= _0xd409[553]),_0x6023xe&& _0xd409[352] in  _0x6023xe&& void(0)=== (_0x6023xb= _0x6023xe[_0xd409[352]](_0x6023x3,_0x6023xb,_0x6023x6))|| (_0x6023x9?_0x6023xf[_0xd409[554]](_0x6023x4,_0x6023xb):_0x6023xf[_0x6023x4]= _0x6023xb))}},css:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x31(_0x6023x4);return _0x6023x6a[_0xd409[126]](_0x6023x4)|| (_0x6023x4= _0x6023x68(_0x6023x7)),(_0x6023xe= _0x6023x17[_0xd409[551]][_0x6023x4]|| _0x6023x17[_0xd409[551]][_0x6023x7])&& _0xd409[290] in  _0x6023xe&& (_0x6023xa= _0x6023xe[_0xd409[290]](_0x6023x3,!0,_0x6023xb)),void(0)=== _0x6023xa&& (_0x6023xa= _0x6023x63(_0x6023x3,_0x6023x4,_0x6023x6)),_0xd409[555]=== _0x6023xa&& _0x6023x4 in  _0x6023x6c&& (_0x6023xa= _0x6023x6c[_0x6023x4]),_0xd409[28]=== _0x6023xb|| _0x6023xb?(_0x6023xc= parseFloat(_0x6023xa),!0=== _0x6023xb || isFinite(_0x6023xc)?_0x6023xc|| 0:_0x6023xa):_0x6023xa}}),_0x6023x17[_0xd409[38]]([_0xd409[556],_0xd409[514]],function(_0x6023x3,_0x6023x9){_0x6023x17[_0xd409[551]][_0x6023x9]= {get:function(_0x6023x3,_0x6023x4,_0x6023xb){if(_0x6023x4){return !_0x6023x69[_0xd409[126]](_0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[380]))|| _0x6023x3[_0xd409[548]]()[_0xd409[32]]&& _0x6023x3[_0xd409[557]]()[_0xd409[514]]?_0x6023x6f(_0x6023x3,_0x6023x9,_0x6023xb):_0x6023x40(_0x6023x3,_0x6023x6b,function(){return _0x6023x6f(_0x6023x3,_0x6023x9,_0x6023xb)})}},set:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa=_0x6023x61(_0x6023x3),_0x6023xc=!_0x6023x10[_0xd409[558]]()&& _0xd409[525]=== _0x6023xa[_0xd409[524]],_0x6023xe=(_0x6023xc|| _0x6023xb)&& _0xd409[544]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[545],!1,_0x6023xa),_0x6023x7=_0x6023xb?_0x6023x6e(_0x6023x3,_0x6023x9,_0x6023xb,_0x6023xe,_0x6023xa):0;return _0x6023xe&& _0x6023xc&& (_0x6023x7-= Math[_0xd409[542]](_0x6023x3[_0xd409[541]+ _0x6023x9[0][_0xd409[346]]()+ _0x6023x9[_0xd409[8]](1)]- parseFloat(_0x6023xa[_0x6023x9])- _0x6023x6e(_0x6023x3,_0x6023x9,_0xd409[537],!1,_0x6023xa)- 0.5)),_0x6023x7&& (_0x6023x6= _0x6023x3a[_0xd409[120]](_0x6023x4))&& _0xd409[385]!== (_0x6023x6[3]|| _0xd409[385])&& (_0x6023x3[_0xd409[381]][_0x6023x9]= _0x6023x4,_0x6023x4= _0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x9)),_0x6023x6d(0,_0x6023x4,_0x6023x7)}}}),_0x6023x17[_0xd409[551]][_0xd409[521]]= _0x6023x64(_0x6023x10[_0xd409[559]],function(_0x6023x3,_0x6023x4){if(_0x6023x4){return (parseFloat(_0x6023x63(_0x6023x3,_0xd409[521]))|| _0x6023x3[_0xd409[557]]()[_0xd409[560]]- _0x6023x40(_0x6023x3,{marginLeft:0},function(){return _0x6023x3[_0xd409[557]]()[_0xd409[560]]}))+ _0xd409[385]}}),_0x6023x17[_0xd409[38]]({margin:_0xd409[28],padding:_0xd409[28],border:_0xd409[540]},function(_0x6023xa,_0x6023xc){_0x6023x17[_0xd409[551]][_0x6023xa+ _0x6023xc]= {expand:function(_0x6023x3){for(var _0x6023x4=0,_0x6023xb={},_0x6023x6=_0xd409[55]==  typeof _0x6023x3?_0x6023x3[_0xd409[58]](_0xd409[57]):[_0x6023x3];_0x6023x4< 4;_0x6023x4++){_0x6023xb[_0x6023xa+ _0x6023x3b[_0x6023x4]+ _0x6023xc]= _0x6023x6[_0x6023x4]|| _0x6023x6[_0x6023x4- 2]|| _0x6023x6[0]};return _0x6023xb}},_0xd409[538]!== _0x6023xa&& (_0x6023x17[_0xd409[551]][_0x6023xa+ _0x6023xc][_0xd409[352]]= _0x6023x6d)}),_0x6023x17[_0xd409[2]][_0xd409[45]]({css:function(_0x6023x3,_0x6023x4){return _0x6023x2d(this,function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc={},_0x6023xe=0;if(Array[_0xd409[49]](_0x6023x4)){for(_0x6023x6= _0x6023x61(_0x6023x3),_0x6023xa= _0x6023x4[_0xd409[32]];_0x6023xe< _0x6023xa;_0x6023xe++){_0x6023xc[_0x6023x4[_0x6023xe]]= _0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x4[_0x6023xe],!1,_0x6023x6)};return _0x6023xc};return void(0)!== _0x6023xb?_0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x4,_0x6023xb):_0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x4)},_0x6023x3,_0x6023x4,1< arguments[_0xd409[32]])}}),((_0x6023x17[_0xd409[561]]= _0x6023x70)[_0xd409[34]]= {constructor:_0x6023x70,init:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc){this[_0xd409[459]]= _0x6023x3,this[_0xd409[562]]= _0x6023xb,this[_0xd409[563]]= _0x6023xa|| _0x6023x17[_0xd409[563]][_0xd409[414]],this[_0xd409[564]]= _0x6023x4,this[_0xd409[387]]= this[_0xd409[476]]= this[_0xd409[383]](),this[_0xd409[388]]= _0x6023x6,this[_0xd409[386]]= _0x6023xc|| (_0x6023x17[_0xd409[384]][_0x6023xb]?_0xd409[28]:_0xd409[385])},cur:function(){var _0x6023x3=_0x6023x70[_0xd409[565]][this[_0xd409[562]]];return _0x6023x3&& _0x6023x3[_0xd409[290]]?_0x6023x3[_0xd409[290]](this):_0x6023x70[_0xd409[565]][_0xd409[414]][_0xd409[290]](this)},run:function(_0x6023x3){var _0x6023x4,_0x6023xb=_0x6023x70[_0xd409[565]][this[_0xd409[562]]];return this[_0xd409[564]][_0xd409[566]]?this[_0xd409[567]]= _0x6023x4= _0x6023x17[_0xd409[563]][this[_0xd409[563]]](_0x6023x3,this[_0xd409[564]][_0xd409[566]]* _0x6023x3,0,1,this[_0xd409[564]][_0xd409[566]]):this[_0xd409[567]]= _0x6023x4= _0x6023x3,this[_0xd409[476]]= (this[_0xd409[388]]- this[_0xd409[387]])* _0x6023x4+ this[_0xd409[387]],this[_0xd409[564]][_0xd409[568]]&& this[_0xd409[564]][_0xd409[568]][_0xd409[14]](this[_0xd409[459]],this[_0xd409[476]],this),_0x6023xb&& _0x6023xb[_0xd409[352]]?_0x6023xb[_0xd409[352]](this):_0x6023x70[_0xd409[565]][_0xd409[414]][_0xd409[352]](this),this}})[_0xd409[31]][_0xd409[34]]= _0x6023x70[_0xd409[34]],(_0x6023x70[_0xd409[565]]= {_default:{get:function(_0x6023x3){var _0x6023x4;return 1!== _0x6023x3[_0xd409[459]][_0xd409[17]]|| null!= _0x6023x3[_0xd409[459]][_0x6023x3[_0xd409[562]]]&& null== _0x6023x3[_0xd409[459]][_0xd409[381]][_0x6023x3[_0xd409[562]]]?_0x6023x3[_0xd409[459]][_0x6023x3[_0xd409[562]]]:(_0x6023x4= _0x6023x17[_0xd409[382]](_0x6023x3[_0xd409[459]],_0x6023x3[_0xd409[562]],_0xd409[28]))&& _0xd409[546]!== _0x6023x4?_0x6023x4:0},set:function(_0x6023x3){_0x6023x17[_0xd409[364]][_0xd409[568]][_0x6023x3[_0xd409[562]]]?_0x6023x17[_0xd409[364]][_0xd409[568]][_0x6023x3[_0xd409[562]]](_0x6023x3):1!== _0x6023x3[_0xd409[459]][_0xd409[17]]|| !_0x6023x17[_0xd409[551]][_0x6023x3[_0xd409[562]]]&& null== _0x6023x3[_0xd409[459]][_0xd409[381]][_0x6023x68(_0x6023x3[_0xd409[562]])]?_0x6023x3[_0xd409[459]][_0x6023x3[_0xd409[562]]]= _0x6023x3[_0xd409[476]]:_0x6023x17[_0xd409[381]](_0x6023x3[_0xd409[459]],_0x6023x3[_0xd409[562]],_0x6023x3[_0xd409[476]]+ _0x6023x3[_0xd409[386]])}}})[_0xd409[569]]= _0x6023x70[_0xd409[565]][_0xd409[570]]= {set:function(_0x6023x3){_0x6023x3[_0xd409[459]][_0xd409[17]]&& _0x6023x3[_0xd409[459]][_0xd409[25]]&& (_0x6023x3[_0xd409[459]][_0x6023x3[_0xd409[562]]]= _0x6023x3[_0xd409[476]])}},_0x6023x17[_0xd409[563]]= {linear:function(_0x6023x3){return _0x6023x3},swing:function(_0x6023x3){return 0.5- Math[_0xd409[572]](_0x6023x3* Math[_0xd409[571]])/ 2},_default:_0xd409[573]},_0x6023x17[_0xd409[364]]= _0x6023x70[_0xd409[34]][_0xd409[31]],_0x6023x17[_0xd409[364]][_0xd409[568]]= {};var _0x6023x71,_0x6023x72,_0x6023x73,_0x6023x74,_0x6023x75=/^(?:toggle|show|hide)$/,_0x6023x76=/queueHooks$/;function _0x6023x77(){_0x6023x72&& (!1=== _0x6023x5[_0xd409[186]] && _0x6023x2[_0xd409[574]]?_0x6023x2[_0xd409[574]](_0x6023x77):_0x6023x2[_0xd409[325]](_0x6023x77,_0x6023x17[_0xd409[364]][_0xd409[575]]),_0x6023x17[_0xd409[364]][_0xd409[576]]())}function _0x6023x78(){return _0x6023x2[_0xd409[325]](function(){_0x6023x71= void(0)}),_0x6023x71= Date[_0xd409[476]]()}function _0x6023x79(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=0,_0x6023xa={height:_0x6023x3};for(_0x6023x4= _0x6023x4?1:0;_0x6023x6< 4;_0x6023x6+= 2- _0x6023x4){_0x6023xa[_0xd409[538]+ (_0x6023xb= _0x6023x3b[_0x6023x6])]= _0x6023xa[_0xd409[539]+ _0x6023xb]= _0x6023x3};return _0x6023x4&& (_0x6023xa[_0xd409[549]]= _0x6023xa[_0xd409[514]]= _0x6023x3),_0x6023xa}function _0x6023x7a(_0x6023x3,_0x6023x4,_0x6023xb){for(var _0x6023x6,_0x6023xa=(_0x6023x7b[_0xd409[577]][_0x6023x4]|| [])[_0xd409[9]](_0x6023x7b[_0xd409[577]][_0xd409[84]]),_0x6023xc=0,_0x6023xe=_0x6023xa[_0xd409[32]];_0x6023xc< _0x6023xe;_0x6023xc++){if(_0x6023x6= _0x6023xa[_0x6023xc][_0xd409[14]](_0x6023xb,_0x6023x4,_0x6023x3)){return _0x6023x6}}}function _0x6023x7b(_0x6023xc,_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023xe,_0x6023x6=0,_0x6023xa=_0x6023x7b[_0xd409[578]][_0xd409[32]],_0x6023x7=_0x6023x17.Deferred()[_0xd409[579]](function(){delete _0x6023x9[_0xd409[459]]}),_0x6023x9=function(){if(_0x6023xe){return !1};for(var _0x6023x3=_0x6023x71|| _0x6023x78(),_0x6023x4=Math[_0xd409[536]](0,_0x6023xf[_0xd409[580]]+ _0x6023xf[_0xd409[566]]- _0x6023x3),_0x6023xb=1- (_0x6023x4/ _0x6023xf[_0xd409[566]]|| 0),_0x6023x6=0,_0x6023xa=_0x6023xf[_0xd409[581]][_0xd409[32]];_0x6023x6< _0x6023xa;_0x6023x6++){_0x6023xf[_0xd409[581]][_0x6023x6][_0xd409[582]](_0x6023xb)};return _0x6023x7[_0xd409[318]](_0x6023xc,[_0x6023xf,_0x6023xb,_0x6023x4]),_0x6023xb< 1&& _0x6023xa?_0x6023x4:(_0x6023xa|| _0x6023x7[_0xd409[318]](_0x6023xc,[_0x6023xf,1,0]),_0x6023x7[_0xd409[319]](_0x6023xc,[_0x6023xf]),!1)},_0x6023xf=_0x6023x7[_0xd409[297]]({elem:_0x6023xc,props:_0x6023x17[_0xd409[45]]({},_0x6023x3),opts:_0x6023x17[_0xd409[45]](!0,{specialEasing:{},easing:_0x6023x17[_0xd409[563]][_0xd409[414]]},_0x6023x4),originalProperties:_0x6023x3,originalOptions:_0x6023x4,startTime:_0x6023x71|| _0x6023x78(),duration:_0x6023x4[_0xd409[566]],tweens:[],createTween:function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x17.Tween(_0x6023xc,_0x6023xf[_0xd409[583]],_0x6023x3,_0x6023x4,_0x6023xf[_0xd409[583]][_0xd409[584]][_0x6023x3]|| _0x6023xf[_0xd409[583]][_0xd409[563]]);return _0x6023xf[_0xd409[581]][_0xd409[10]](_0x6023xb),_0x6023xb},stop:function(_0x6023x3){var _0x6023x4=0,_0x6023xb=_0x6023x3?_0x6023xf[_0xd409[581]][_0xd409[32]]:0;if(_0x6023xe){return this};for(_0x6023xe=  !0;_0x6023x4< _0x6023xb;_0x6023x4++){_0x6023xf[_0xd409[581]][_0x6023x4][_0xd409[582]](1)};return _0x6023x3?(_0x6023x7[_0xd409[318]](_0x6023xc,[_0x6023xf,1,0]),_0x6023x7[_0xd409[319]](_0x6023xc,[_0x6023xf,_0x6023x3])):_0x6023x7[_0xd409[323]](_0x6023xc,[_0x6023xf,_0x6023x3]),this}}),_0x6023x13=_0x6023xf[_0xd409[585]];for(!function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe;for(_0x6023xb in _0x6023x3){if(_0x6023xa= _0x6023x4[_0x6023x6= _0x6023x31(_0x6023xb)],_0x6023xc= _0x6023x3[_0x6023xb],Array[_0xd409[49]](_0x6023xc)&& (_0x6023xa= _0x6023xc[1],_0x6023xc= _0x6023x3[_0x6023xb]= _0x6023xc[0]),_0x6023xb!== _0x6023x6&& (_0x6023x3[_0x6023x6]= _0x6023xc, delete _0x6023x3[_0x6023xb]),(_0x6023xe= _0x6023x17[_0xd409[551]][_0x6023x6])&& _0xd409[586] in  _0x6023xe){for(_0x6023xb in _0x6023xc= _0x6023xe[_0xd409[586]](_0x6023xc), delete _0x6023x3[_0x6023x6],_0x6023xc){_0x6023xb in  _0x6023x3|| (_0x6023x3[_0x6023xb]= _0x6023xc[_0x6023xb],_0x6023x4[_0x6023xb]= _0x6023xa)}}else {_0x6023x4[_0x6023x6]= _0x6023xa}}}(_0x6023x13,_0x6023xf[_0xd409[583]][_0xd409[584]]);_0x6023x6< _0x6023xa;_0x6023x6++){if(_0x6023xb= _0x6023x7b[_0xd409[578]][_0x6023x6][_0xd409[14]](_0x6023xf,_0x6023xc,_0x6023x13,_0x6023xf[_0xd409[583]])){return _0x6023x11(_0x6023xb[_0xd409[367]])&& (_0x6023x17._queueHooks(_0x6023xf[_0xd409[459]],_0x6023xf[_0xd409[583]][_0xd409[365]])[_0xd409[367]]= _0x6023xb[_0xd409[367]][_0xd409[587]](_0x6023xb)),_0x6023xb}};return _0x6023x17[_0xd409[39]](_0x6023x13,_0x6023x7a,_0x6023xf),_0x6023x11(_0x6023xf[_0xd409[583]][_0xd409[387]])&& _0x6023xf[_0xd409[583]][_0xd409[387]][_0xd409[14]](_0x6023xc,_0x6023xf),_0x6023xf[_0xd409[309]](_0x6023xf[_0xd409[583]][_0xd409[309]])[_0xd409[299]](_0x6023xf[_0xd409[583]][_0xd409[299]],_0x6023xf[_0xd409[583]][_0xd409[342]])[_0xd409[298]](_0x6023xf[_0xd409[583]][_0xd409[298]])[_0xd409[579]](_0x6023xf[_0xd409[583]][_0xd409[579]]),_0x6023x17[_0xd409[364]][_0xd409[588]](_0x6023x17[_0xd409[45]](_0x6023x9,{elem:_0x6023xc,anim:_0x6023xf,queue:_0x6023xf[_0xd409[583]][_0xd409[365]]})),_0x6023xf}_0x6023x17[_0xd409[589]]= _0x6023x17[_0xd409[45]](_0x6023x7b,{tweeners:{"\x2A":[function(_0x6023x3,_0x6023x4){var _0x6023xb=this[_0xd409[590]](_0x6023x3,_0x6023x4);return _0x6023x41(_0x6023xb[_0xd409[459]],_0x6023x3,_0x6023x3a[_0xd409[120]](_0x6023x4),_0x6023xb),_0x6023xb}]},tweener:function(_0x6023x3,_0x6023x4){_0x6023x11(_0x6023x3)?(_0x6023x4= _0x6023x3,_0x6023x3= [_0xd409[84]]):_0x6023x3= _0x6023x3[_0xd409[280]](_0x6023x26);for(var _0x6023xb,_0x6023x6=0,_0x6023xa=_0x6023x3[_0xd409[32]];_0x6023x6< _0x6023xa;_0x6023x6++){_0x6023xb= _0x6023x3[_0x6023x6],_0x6023x7b[_0xd409[577]][_0x6023xb]= _0x6023x7b[_0xd409[577]][_0x6023xb]|| [],_0x6023x7b[_0xd409[577]][_0x6023xb][_0xd409[207]](_0x6023x4)}},prefilters:[function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16=_0xd409[514] in  _0x6023x4|| _0xd409[556] in  _0x6023x4,_0x6023x18=this,_0x6023x19={},_0x6023x1a=_0x6023x3[_0xd409[381]],_0x6023x8=_0x6023x3[_0xd409[17]]&& _0x6023x3f(_0x6023x3),_0x6023xd=_0x6023x34[_0xd409[290]](_0x6023x3,_0xd409[591]);for(_0x6023x6 in _0x6023xb[_0xd409[365]]|| (null== (_0x6023xe= _0x6023x17._queueHooks(_0x6023x3,_0xd409[364]))[_0xd409[592]]&& (_0x6023xe[_0xd409[592]]= 0,_0x6023x7= _0x6023xe[_0xd409[257]][_0xd409[328]],_0x6023xe[_0xd409[257]][_0xd409[328]]= function(){_0x6023xe[_0xd409[592]]|| _0x6023x7()}),_0x6023xe[_0xd409[592]]++,_0x6023x18[_0xd409[579]](function(){_0x6023x18[_0xd409[579]](function(){_0x6023xe[_0xd409[592]]--,_0x6023x17[_0xd409[365]](_0x6023x3,_0xd409[364])[_0xd409[32]]|| _0x6023xe[_0xd409[257]][_0xd409[328]]()})})),_0x6023x4){if(_0x6023xa= _0x6023x4[_0x6023x6],_0x6023x75[_0xd409[126]](_0x6023xa)){if( delete _0x6023x4[_0x6023x6],_0x6023xc= _0x6023xc|| _0xd409[593]=== _0x6023xa,_0x6023xa=== (_0x6023x8?_0xd409[392]:_0xd409[391])){if(_0xd409[391]!== _0x6023xa||  !_0x6023xd|| void(0)=== _0x6023xd[_0x6023x6]){continue};_0x6023x8=  !0};_0x6023x19[_0x6023x6]= _0x6023xd&& _0x6023xd[_0x6023x6]|| _0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x6)}};if((_0x6023x9=  !_0x6023x17[_0xd409[353]](_0x6023x4))||  !_0x6023x17[_0xd409[353]](_0x6023x19)){for(_0x6023x6 in _0x6023x16&& 1=== _0x6023x3[_0xd409[17]]&& (_0x6023xb[_0xd409[594]]= [_0x6023x1a[_0xd409[594]],_0x6023x1a[_0xd409[595]],_0x6023x1a[_0xd409[596]]],null== (_0x6023xf= _0x6023xd&& _0x6023xd[_0xd409[380]])&& (_0x6023xf= _0x6023x34[_0xd409[290]](_0x6023x3,_0xd409[380])),_0xd409[379]=== (_0x6023x13= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[380]))&& (_0x6023xf?_0x6023x13= _0x6023xf:(_0x6023x43([_0x6023x3],!0),_0x6023xf= _0x6023x3[_0xd409[381]][_0xd409[380]]|| _0x6023xf,_0x6023x13= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[380]),_0x6023x43([_0x6023x3]))),(_0xd409[547]=== _0x6023x13|| _0xd409[597]=== _0x6023x13&& null!= _0x6023xf)&& _0xd409[379]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[598])&& (_0x6023x9|| (_0x6023x18[_0xd409[299]](function(){_0x6023x1a[_0xd409[380]]= _0x6023xf}),null== _0x6023xf&& (_0x6023x13= _0x6023x1a[_0xd409[380]],_0x6023xf= _0xd409[379]=== _0x6023x13?_0xd409[28]:_0x6023x13)),_0x6023x1a[_0xd409[380]]= _0xd409[597])),_0x6023xb[_0xd409[594]]&& (_0x6023x1a[_0xd409[594]]= _0xd409[186],_0x6023x18[_0xd409[579]](function(){_0x6023x1a[_0xd409[594]]= _0x6023xb[_0xd409[594]][0],_0x6023x1a[_0xd409[595]]= _0x6023xb[_0xd409[594]][1],_0x6023x1a[_0xd409[596]]= _0x6023xb[_0xd409[594]][2]})),_0x6023x9=  !1,_0x6023x19){_0x6023x9|| (_0x6023xd?_0xd409[186] in  _0x6023xd&& (_0x6023x8= _0x6023xd[_0xd409[186]]):_0x6023xd= _0x6023x34[_0xd409[361]](_0x6023x3,_0xd409[591],{display:_0x6023xf}),_0x6023xc&& (_0x6023xd[_0xd409[186]]=  !_0x6023x8),_0x6023x8&& _0x6023x43([_0x6023x3],!0),_0x6023x18[_0xd409[299]](function(){for(_0x6023x6 in _0x6023x8|| _0x6023x43([_0x6023x3]),_0x6023x34[_0xd409[362]](_0x6023x3,_0xd409[591]),_0x6023x19){_0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x6,_0x6023x19[_0x6023x6])}})),_0x6023x9= _0x6023x7a(_0x6023x8?_0x6023xd[_0x6023x6]:0,_0x6023x6,_0x6023x18),_0x6023x6 in  _0x6023xd|| (_0x6023xd[_0x6023x6]= _0x6023x9[_0xd409[387]],_0x6023x8&& (_0x6023x9[_0xd409[388]]= _0x6023x9[_0xd409[387]],_0x6023x9[_0xd409[387]]= 0))}}}],prefilter:function(_0x6023x3,_0x6023x4){_0x6023x4?_0x6023x7b[_0xd409[578]][_0xd409[207]](_0x6023x3):_0x6023x7b[_0xd409[578]][_0xd409[10]](_0x6023x3)}}),_0x6023x17[_0xd409[599]]= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023x3&& _0xd409[29]==  typeof _0x6023x3?_0x6023x17[_0xd409[45]]({},_0x6023x3):{complete:_0x6023xb|| !_0x6023xb&& _0x6023x4|| _0x6023x11(_0x6023x3)&& _0x6023x3,duration:_0x6023x3,easing:_0x6023xb&& _0x6023x4|| _0x6023x4&&  !_0x6023x11(_0x6023x4)&& _0x6023x4};return _0x6023x17[_0xd409[364]][_0xd409[425]]?_0x6023x6[_0xd409[566]]= 0:_0xd409[16]!=  typeof _0x6023x6[_0xd409[566]]&& (_0x6023x6[_0xd409[566]] in  _0x6023x17[_0xd409[364]][_0xd409[600]]?_0x6023x6[_0xd409[566]]= _0x6023x17[_0xd409[364]][_0xd409[600]][_0x6023x6[_0xd409[566]]]:_0x6023x6[_0xd409[566]]= _0x6023x17[_0xd409[364]][_0xd409[600]][_0xd409[414]]),null!= _0x6023x6[_0xd409[365]]&& !0!== _0x6023x6[_0xd409[365]]|| (_0x6023x6[_0xd409[365]]= _0xd409[364]),_0x6023x6[_0xd409[601]]= _0x6023x6[_0xd409[342]],_0x6023x6[_0xd409[342]]= function(){_0x6023x11(_0x6023x6[_0xd409[601]])&& _0x6023x6[_0xd409[601]][_0xd409[14]](this),_0x6023x6[_0xd409[365]]&& _0x6023x17[_0xd409[368]](this,_0x6023x6[_0xd409[365]])},_0x6023x6},_0x6023x17[_0xd409[2]][_0xd409[45]]({fadeTo:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){return this[_0xd409[163]](_0x6023x3f)[_0xd409[382]](_0xd409[549],0)[_0xd409[391]]()[_0xd409[388]]()[_0xd409[602]]({opacity:_0x6023x4},_0x6023x3,_0x6023xb,_0x6023x6)},animate:function(_0x6023x4,_0x6023x3,_0x6023xb,_0x6023x6){var _0x6023xa=_0x6023x17[_0xd409[353]](_0x6023x4),_0x6023xc=_0x6023x17[_0xd409[599]](_0x6023x3,_0x6023xb,_0x6023x6),_0x6023xe=function(){var _0x6023x3=_0x6023x7b(this,_0x6023x17[_0xd409[45]]({},_0x6023x4),_0x6023xc);(_0x6023xa|| _0x6023x34[_0xd409[290]](this,_0xd409[603]))&& _0x6023x3[_0xd409[367]](!0)};return _0x6023xe[_0xd409[603]]= _0x6023xe,_0x6023xa|| !1=== _0x6023xc[_0xd409[365]]?this[_0xd409[38]](_0x6023xe):this[_0xd409[365]](_0x6023xc[_0xd409[365]],_0x6023xe)},stop:function(_0x6023xa,_0x6023x3,_0x6023xc){var _0x6023xe=function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[367]];delete _0x6023x3[_0xd409[367]],_0x6023x4(_0x6023xc)};return _0xd409[55]!=  typeof _0x6023xa&& (_0x6023xc= _0x6023x3,_0x6023x3= _0x6023xa,_0x6023xa= void(0)),_0x6023x3&& !1!== _0x6023xa&& this[_0xd409[365]](_0x6023xa|| _0xd409[364],[]),this[_0xd409[38]](function(){var _0x6023x3=!0,_0x6023x4=null!= _0x6023xa&& _0x6023xa+ _0xd409[369],_0x6023xb=_0x6023x17[_0xd409[604]],_0x6023x6=_0x6023x34[_0xd409[290]](this);if(_0x6023x4){_0x6023x6[_0x6023x4]&& _0x6023x6[_0x6023x4][_0xd409[367]]&& _0x6023xe(_0x6023x6[_0x6023x4])}else {for(_0x6023x4 in _0x6023x6){_0x6023x6[_0x6023x4]&& _0x6023x6[_0x6023x4][_0xd409[367]]&& _0x6023x76[_0xd409[126]](_0x6023x4)&& _0x6023xe(_0x6023x6[_0x6023x4])}};for(_0x6023x4= _0x6023xb[_0xd409[32]];_0x6023x4--;){_0x6023xb[_0x6023x4][_0xd409[459]]!== this|| null!= _0x6023xa&& _0x6023xb[_0x6023x4][_0xd409[365]]!== _0x6023xa|| (_0x6023xb[_0x6023x4][_0xd409[605]][_0xd409[367]](_0x6023xc),_0x6023x3=  !1,_0x6023xb[_0xd409[44]](_0x6023x4,1))};!_0x6023x3&& _0x6023xc || _0x6023x17[_0xd409[368]](this,_0x6023xa)})},finish:function(_0x6023xe){return !1!== _0x6023xe && (_0x6023xe= _0x6023xe|| _0xd409[364]),this[_0xd409[38]](function(){var _0x6023x3,_0x6023x4=_0x6023x34[_0xd409[290]](this),_0x6023xb=_0x6023x4[_0x6023xe+ _0xd409[365]],_0x6023x6=_0x6023x4[_0x6023xe+ _0xd409[369]],_0x6023xa=_0x6023x17[_0xd409[604]],_0x6023xc=_0x6023xb?_0x6023xb[_0xd409[32]]:0;for(_0x6023x4[_0xd409[603]]=  !0,_0x6023x17[_0xd409[365]](this,_0x6023xe,[]),_0x6023x6&& _0x6023x6[_0xd409[367]]&& _0x6023x6[_0xd409[367]][_0xd409[14]](this,!0),_0x6023x3= _0x6023xa[_0xd409[32]];_0x6023x3--;){_0x6023xa[_0x6023x3][_0xd409[459]]=== this&& _0x6023xa[_0x6023x3][_0xd409[365]]=== _0x6023xe&& (_0x6023xa[_0x6023x3][_0xd409[605]][_0xd409[367]](!0),_0x6023xa[_0xd409[44]](_0x6023x3,1))};for(_0x6023x3= 0;_0x6023x3< _0x6023xc;_0x6023x3++){_0x6023xb[_0x6023x3]&& _0x6023xb[_0x6023x3][_0xd409[603]]&& _0x6023xb[_0x6023x3][_0xd409[603]][_0xd409[14]](this)};delete _0x6023x4[_0xd409[603]]})}}),_0x6023x17[_0xd409[38]]([_0xd409[593],_0xd409[391],_0xd409[392]],function(_0x6023x3,_0x6023x6){var _0x6023xa=_0x6023x17[_0xd409[2]][_0x6023x6];_0x6023x17[_0xd409[2]][_0x6023x6]= function(_0x6023x3,_0x6023x4,_0x6023xb){return null== _0x6023x3|| _0xd409[46]==  typeof _0x6023x3?_0x6023xa[_0xd409[41]](this,arguments):this[_0xd409[602]](_0x6023x79(_0x6023x6,!0),_0x6023x3,_0x6023x4,_0x6023xb)}}),_0x6023x17[_0xd409[38]]({slideDown:_0x6023x79(_0xd409[391]),slideUp:_0x6023x79(_0xd409[392]),slideToggle:_0x6023x79(_0xd409[593]),fadeIn:{opacity:_0xd409[391]},fadeOut:{opacity:_0xd409[392]},fadeToggle:{opacity:_0xd409[593]}},function(_0x6023x3,_0x6023x6){_0x6023x17[_0xd409[2]][_0x6023x3]= function(_0x6023x3,_0x6023x4,_0x6023xb){return this[_0xd409[602]](_0x6023x6,_0x6023x3,_0x6023x4,_0x6023xb)}}),_0x6023x17[_0xd409[604]]= [],_0x6023x17[_0xd409[364]][_0xd409[576]]= function(){var _0x6023x3,_0x6023x4=0,_0x6023xb=_0x6023x17[_0xd409[604]];for(_0x6023x71= Date[_0xd409[476]]();_0x6023x4< _0x6023xb[_0xd409[32]];_0x6023x4++){(_0x6023x3= _0x6023xb[_0x6023x4])()|| _0x6023xb[_0x6023x4]!== _0x6023x3|| _0x6023xb[_0xd409[44]](_0x6023x4--,1)};_0x6023xb[_0xd409[32]]|| _0x6023x17[_0xd409[364]][_0xd409[367]](),_0x6023x71= void(0)},_0x6023x17[_0xd409[364]][_0xd409[588]]= function(_0x6023x3){_0x6023x17[_0xd409[604]][_0xd409[10]](_0x6023x3),_0x6023x17[_0xd409[364]][_0xd409[387]]()},_0x6023x17[_0xd409[364]][_0xd409[575]]= 13,_0x6023x17[_0xd409[364]][_0xd409[387]]= function(){_0x6023x72|| (_0x6023x72=  !0,_0x6023x77())},_0x6023x17[_0xd409[364]][_0xd409[367]]= function(){_0x6023x72= null},_0x6023x17[_0xd409[364]][_0xd409[600]]= {slow:600,fast:200,_default:400},_0x6023x17[_0xd409[2]][_0xd409[606]]= function(_0x6023x6,_0x6023x3){return _0x6023x6= _0x6023x17[_0xd409[364]]&& _0x6023x17[_0xd409[364]][_0xd409[600]][_0x6023x6]|| _0x6023x6,_0x6023x3= _0x6023x3|| _0xd409[364],this[_0xd409[365]](_0x6023x3,function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x2[_0xd409[325]](_0x6023x3,_0x6023x6);_0x6023x4[_0xd409[367]]= function(){_0x6023x2[_0xd409[607]](_0x6023xb)}})},_0x6023x73= _0x6023x5[_0xd409[20]](_0xd409[139]),_0x6023x74= _0x6023x5[_0xd409[20]](_0xd409[268])[_0xd409[26]](_0x6023x5[_0xd409[20]](_0xd409[254])),_0x6023x73[_0xd409[140]]= _0xd409[608],_0x6023x10[_0xd409[609]]= _0xd409[28]!== _0x6023x73[_0xd409[166]],_0x6023x10[_0xd409[610]]= _0x6023x74[_0xd409[255]],(_0x6023x73= _0x6023x5[_0xd409[20]](_0xd409[139]))[_0xd409[166]]= _0xd409[418],_0x6023x73[_0xd409[140]]= _0xd409[417],_0x6023x10[_0xd409[611]]= _0xd409[418]=== _0x6023x73[_0xd409[166]];var _0x6023x7c,_0x6023x7d=_0x6023x17[_0xd409[274]][_0xd409[136]];_0x6023x17[_0xd409[2]][_0xd409[45]]({attr:function(_0x6023x3,_0x6023x4){return _0x6023x2d(this,_0x6023x17[_0xd409[208]],_0x6023x3,_0x6023x4,1< arguments[_0xd409[32]])},removeAttr:function(_0x6023x3){return this[_0xd409[38]](function(){_0x6023x17[_0xd409[612]](this,_0x6023x3)})}}),_0x6023x17[_0xd409[45]]({attr:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc=_0x6023x3[_0xd409[17]];if(3!== _0x6023xc&& 8!== _0x6023xc&& 2!== _0x6023xc){return _0xd409[4]==  typeof _0x6023x3[_0xd409[22]]?_0x6023x17[_0xd409[562]](_0x6023x3,_0x6023x4,_0x6023xb):(1=== _0x6023xc&& _0x6023x17[_0xd409[277]](_0x6023x3)|| (_0x6023xa= _0x6023x17[_0xd409[613]][_0x6023x4[_0xd409[62]]()]|| (_0x6023x17[_0xd409[274]][_0xd409[280]][_0xd409[614]][_0xd409[126]](_0x6023x4)?_0x6023x7c:void(0))),void(0)!== _0x6023xb?null=== _0x6023xb?void(_0x6023x17[_0xd409[612]](_0x6023x3,_0x6023x4)):_0x6023xa&& _0xd409[352] in  _0x6023xa&& void(0)!== (_0x6023x6= _0x6023xa[_0xd409[352]](_0x6023x3,_0x6023xb,_0x6023x4))?_0x6023x6:(_0x6023x3[_0xd409[23]](_0x6023x4,_0x6023xb+ _0xd409[28]),_0x6023xb):_0x6023xa&& _0xd409[290] in  _0x6023xa&& null!== (_0x6023x6= _0x6023xa[_0xd409[290]](_0x6023x3,_0x6023x4))?_0x6023x6:null== (_0x6023x6= _0x6023x17[_0xd409[164]][_0xd409[208]](_0x6023x3,_0x6023x4))?void(0):_0x6023x6)}},attrHooks:{type:{set:function(_0x6023x3,_0x6023x4){if(!_0x6023x10[_0xd409[611]]&& _0xd409[417]=== _0x6023x4 && _0x6023x1e(_0x6023x3,_0xd409[139])){var _0x6023xb=_0x6023x3[_0xd409[166]];return _0x6023x3[_0xd409[23]](_0xd409[140],_0x6023x4),_0x6023xb&& (_0x6023x3[_0xd409[166]]= _0x6023xb),_0x6023x4}}}},removeAttr:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=0,_0x6023xa=_0x6023x4&& _0x6023x4[_0xd409[280]](_0x6023x26);if(_0x6023xa&& 1=== _0x6023x3[_0xd409[17]]){while(_0x6023xb= _0x6023xa[_0x6023x6++]){_0x6023x3[_0xd409[131]](_0x6023xb)}}}}),_0x6023x7c= {set:function(_0x6023x3,_0x6023x4,_0x6023xb){return !1=== _0x6023x4?_0x6023x17[_0xd409[612]](_0x6023x3,_0x6023xb):_0x6023x3[_0xd409[23]](_0x6023xb,_0x6023xb),_0x6023xb}},_0x6023x17[_0xd409[38]](_0x6023x17[_0xd409[274]][_0xd409[280]][_0xd409[614]][_0xd409[370]][_0xd409[280]](/\w+/g),function(_0x6023x3,_0x6023x4){var _0x6023xe=_0x6023x7d[_0x6023x4]|| _0x6023x17[_0xd409[164]][_0xd409[208]];_0x6023x7d[_0x6023x4]= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc=_0x6023x4[_0xd409[62]]();return _0x6023xb|| (_0x6023xa= _0x6023x7d[_0x6023xc],_0x6023x7d[_0x6023xc]= _0x6023x6,_0x6023x6= null!= _0x6023xe(_0x6023x3,_0x6023x4,_0x6023xb)?_0x6023xc:null,_0x6023x7d[_0x6023xc]= _0x6023xa),_0x6023x6}});var _0x6023x7e=/^(?:input|select|textarea|button)$/i,_0x6023x7f=/^(?:a|area)$/i;function _0x6023x80(_0x6023x3){return (_0x6023x3[_0xd409[280]](_0x6023x26)|| [])[_0xd409[129]](_0xd409[57])}function _0x6023x81(_0x6023x3){return _0x6023x3[_0xd409[22]]&& _0x6023x3[_0xd409[22]](_0xd409[230])|| _0xd409[28]}function _0x6023x82(_0x6023x3){return Array[_0xd409[49]](_0x6023x3)?_0x6023x3:_0xd409[55]==  typeof _0x6023x3&& _0x6023x3[_0xd409[280]](_0x6023x26)|| []}_0x6023x17[_0xd409[2]][_0xd409[45]]({prop:function(_0x6023x3,_0x6023x4){return _0x6023x2d(this,_0x6023x17[_0xd409[562]],_0x6023x3,_0x6023x4,1< arguments[_0xd409[32]])},removeProp:function(_0x6023x3){return this[_0xd409[38]](function(){delete this[_0x6023x17[_0xd409[615]][_0x6023x3]|| _0x6023x3]})}}),_0x6023x17[_0xd409[45]]({prop:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc=_0x6023x3[_0xd409[17]];if(3!== _0x6023xc&& 8!== _0x6023xc&& 2!== _0x6023xc){return 1=== _0x6023xc&& _0x6023x17[_0xd409[277]](_0x6023x3)|| (_0x6023x4= _0x6023x17[_0xd409[615]][_0x6023x4]|| _0x6023x4,_0x6023xa= _0x6023x17[_0xd409[565]][_0x6023x4]),void(0)!== _0x6023xb?_0x6023xa&& _0xd409[352] in  _0x6023xa&& void(0)!== (_0x6023x6= _0x6023xa[_0xd409[352]](_0x6023x3,_0x6023xb,_0x6023x4))?_0x6023x6:_0x6023x3[_0x6023x4]= _0x6023xb:_0x6023xa&& _0xd409[290] in  _0x6023xa&& null!== (_0x6023x6= _0x6023xa[_0xd409[290]](_0x6023x3,_0x6023x4))?_0x6023x6:_0x6023x3[_0x6023x4]}},propHooks:{tabIndex:{get:function(_0x6023x3){var _0x6023x4=_0x6023x17[_0xd409[164]][_0xd409[208]](_0x6023x3,_0xd409[616]);return _0x6023x4?parseInt(_0x6023x4,10):_0x6023x7e[_0xd409[126]](_0x6023x3[_0xd409[116]])|| _0x6023x7f[_0xd409[126]](_0x6023x3[_0xd409[116]])&& _0x6023x3[_0xd409[251]]?0:-1}}},propFix:{"\x66\x6F\x72":_0xd409[617],"\x63\x6C\x61\x73\x73":_0xd409[158]}}),_0x6023x10[_0xd409[610]]|| (_0x6023x17[_0xd409[565]][_0xd409[255]]= {get:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[25]];return _0x6023x4&& _0x6023x4[_0xd409[25]]&& _0x6023x4[_0xd409[25]][_0xd409[256]],null},set:function(_0x6023x3){var _0x6023x4=_0x6023x3[_0xd409[25]];_0x6023x4&& (_0x6023x4[_0xd409[256]],_0x6023x4[_0xd409[25]]&& _0x6023x4[_0xd409[25]][_0xd409[256]])}}),_0x6023x17[_0xd409[38]]([_0xd409[252],_0xd409[618],_0xd409[619],_0xd409[620],_0xd409[621],_0xd409[622],_0xd409[623],_0xd409[624],_0xd409[625],_0xd409[626]],function(){_0x6023x17[_0xd409[615]][this[_0xd409[62]]()]= this}),_0x6023x17[_0xd409[2]][_0xd409[45]]({addClass:function(_0x6023x4){var _0x6023x3,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9=0;if(_0x6023x11(_0x6023x4)){return this[_0xd409[38]](function(_0x6023x3){_0x6023x17(this)[_0xd409[627]](_0x6023x4[_0xd409[14]](this,_0x6023x3,_0x6023x81(this)))})};if((_0x6023x3= _0x6023x82(_0x6023x4))[_0xd409[32]]){while(_0x6023xb= this[_0x6023x9++]){if(_0x6023xa= _0x6023x81(_0x6023xb),_0x6023x6= 1=== _0x6023xb[_0xd409[17]]&& _0xd409[57]+ _0x6023x80(_0x6023xa)+ _0xd409[57]){_0x6023xe= 0;while(_0x6023xc= _0x6023x3[_0x6023xe++]){_0x6023x6[_0xd409[11]](_0xd409[57]+ _0x6023xc+ _0xd409[57])< 0&& (_0x6023x6+= _0x6023xc+ _0xd409[57])};_0x6023xa!== (_0x6023x7= _0x6023x80(_0x6023x6))&& _0x6023xb[_0xd409[23]](_0xd409[230],_0x6023x7)}}};return this},removeClass:function(_0x6023x4){var _0x6023x3,_0x6023xb,_0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9=0;if(_0x6023x11(_0x6023x4)){return this[_0xd409[38]](function(_0x6023x3){_0x6023x17(this)[_0xd409[628]](_0x6023x4[_0xd409[14]](this,_0x6023x3,_0x6023x81(this)))})};if(!arguments[_0xd409[32]]){return this[_0xd409[208]](_0xd409[230],_0xd409[28])};if((_0x6023x3= _0x6023x82(_0x6023x4))[_0xd409[32]]){while(_0x6023xb= this[_0x6023x9++]){if(_0x6023xa= _0x6023x81(_0x6023xb),_0x6023x6= 1=== _0x6023xb[_0xd409[17]]&& _0xd409[57]+ _0x6023x80(_0x6023xa)+ _0xd409[57]){_0x6023xe= 0;while(_0x6023xc= _0x6023x3[_0x6023xe++]){while(-1< _0x6023x6[_0xd409[11]](_0xd409[57]+ _0x6023xc+ _0xd409[57])){_0x6023x6= _0x6023x6[_0xd409[51]](_0xd409[57]+ _0x6023xc+ _0xd409[57],_0xd409[57])}};_0x6023xa!== (_0x6023x7= _0x6023x80(_0x6023x6))&& _0x6023xb[_0xd409[23]](_0xd409[230],_0x6023x7)}}};return this},toggleClass:function(_0x6023xa,_0x6023x4){var _0x6023xc= typeof _0x6023xa,_0x6023xe=_0xd409[55]=== _0x6023xc|| Array[_0xd409[49]](_0x6023xa);return _0xd409[46]==  typeof _0x6023x4&& _0x6023xe?_0x6023x4?this[_0xd409[627]](_0x6023xa):this[_0xd409[628]](_0x6023xa):_0x6023x11(_0x6023xa)?this[_0xd409[38]](function(_0x6023x3){_0x6023x17(this)[_0xd409[629]](_0x6023xa[_0xd409[14]](this,_0x6023x3,_0x6023x81(this),_0x6023x4),_0x6023x4)}):this[_0xd409[38]](function(){var _0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6;if(_0x6023xe){_0x6023x4= 0,_0x6023xb= _0x6023x17(this),_0x6023x6= _0x6023x82(_0x6023xa);while(_0x6023x3= _0x6023x6[_0x6023x4++]){_0x6023xb[_0xd409[630]](_0x6023x3)?_0x6023xb[_0xd409[628]](_0x6023x3):_0x6023xb[_0xd409[627]](_0x6023x3)}}else {void(0)!== _0x6023xa&& _0xd409[46]!== _0x6023xc|| ((_0x6023x3= _0x6023x81(this))&& _0x6023x34[_0xd409[352]](this,_0xd409[631],_0x6023x3),this[_0xd409[23]]&& this[_0xd409[23]](_0xd409[230],_0x6023x3|| !1=== _0x6023xa?_0xd409[28]:_0x6023x34[_0xd409[290]](this,_0xd409[631])|| _0xd409[28]))}})},hasClass:function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6=0;_0x6023x4= _0xd409[57]+ _0x6023x3+ _0xd409[57];while(_0x6023xb= this[_0x6023x6++]){if(1=== _0x6023xb[_0xd409[17]]&& -1< (_0xd409[57]+ _0x6023x80(_0x6023x81(_0x6023xb))+ _0xd409[57])[_0xd409[11]](_0x6023x4)){return !0}};return !1}});var _0x6023x83=/\r/g;_0x6023x17[_0xd409[2]][_0xd409[45]]({val:function(_0x6023xb){var _0x6023x6,_0x6023x3,_0x6023xa,_0x6023x4=this[0];return arguments[_0xd409[32]]?(_0x6023xa= _0x6023x11(_0x6023xb),this[_0xd409[38]](function(_0x6023x3){var _0x6023x4;1=== this[_0xd409[17]]&& (null== (_0x6023x4= _0x6023xa?_0x6023xb[_0xd409[14]](this,_0x6023x3,_0x6023x17(this)[_0xd409[632]]()):_0x6023xb)?_0x6023x4= _0xd409[28]:_0xd409[16]==  typeof _0x6023x4?_0x6023x4+= _0xd409[28]:Array[_0xd409[49]](_0x6023x4)&& (_0x6023x4= _0x6023x17[_0xd409[39]](_0x6023x4,function(_0x6023x3){return null== _0x6023x3?_0xd409[28]:_0x6023x3+ _0xd409[28]})),(_0x6023x6= _0x6023x17[_0xd409[633]][this[_0xd409[140]]]|| _0x6023x17[_0xd409[633]][this[_0xd409[116]][_0xd409[62]]()])&& _0xd409[352] in  _0x6023x6&& void(0)!== _0x6023x6[_0xd409[352]](this,_0x6023x4,_0xd409[166])|| (this[_0xd409[166]]= _0x6023x4))})):_0x6023x4?(_0x6023x6= _0x6023x17[_0xd409[633]][_0x6023x4[_0xd409[140]]]|| _0x6023x17[_0xd409[633]][_0x6023x4[_0xd409[116]][_0xd409[62]]()])&& _0xd409[290] in  _0x6023x6&& void(0)!== (_0x6023x3= _0x6023x6[_0xd409[290]](_0x6023x4,_0xd409[166]))?_0x6023x3:_0xd409[55]==  typeof (_0x6023x3= _0x6023x4[_0xd409[166]])?_0x6023x3[_0xd409[51]](_0x6023x83,_0xd409[28]):null== _0x6023x3?_0xd409[28]:_0x6023x3:void(0)}}),_0x6023x17[_0xd409[45]]({valHooks:{option:{get:function(_0x6023x3){var _0x6023x4=_0x6023x17[_0xd409[164]][_0xd409[208]](_0x6023x3,_0xd409[166]);return null!= _0x6023x4?_0x6023x4:_0x6023x80(_0x6023x17[_0xd409[21]](_0x6023x3))}},select:{get:function(_0x6023x3){var _0x6023x4,_0x6023xb,_0x6023x6,_0x6023xa=_0x6023x3[_0xd409[564]],_0x6023xc=_0x6023x3[_0xd409[256]],_0x6023xe=_0xd409[634]=== _0x6023x3[_0xd409[140]],_0x6023x7=_0x6023xe?null:[],_0x6023x9=_0x6023xe?_0x6023xc+ 1:_0x6023xa[_0xd409[32]];for(_0x6023x6= _0x6023xc< 0?_0x6023x9:_0x6023xe?_0x6023xc:0;_0x6023x6< _0x6023x9;_0x6023x6++){if(((_0x6023xb= _0x6023xa[_0x6023x6])[_0xd409[255]]|| _0x6023x6=== _0x6023xc)&&  !_0x6023xb[_0xd409[114]]&& (!_0x6023xb[_0xd409[25]][_0xd409[114]]||  !_0x6023x1e(_0x6023xb[_0xd409[25]],_0xd409[404]))){if(_0x6023x4= _0x6023x17(_0x6023xb)[_0xd409[632]](),_0x6023xe){return _0x6023x4};_0x6023x7[_0xd409[10]](_0x6023x4)}};return _0x6023x7},set:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa=_0x6023x3[_0xd409[564]],_0x6023xc=_0x6023x17[_0xd409[287]](_0x6023x4),_0x6023xe=_0x6023xa[_0xd409[32]];while(_0x6023xe--){((_0x6023x6= _0x6023xa[_0x6023xe])[_0xd409[255]]= -1< _0x6023x17[_0xd409[306]](_0x6023x17[_0xd409[633]][_0xd409[254]][_0xd409[290]](_0x6023x6),_0x6023xc))&& (_0x6023xb=  !0)};return _0x6023xb|| (_0x6023x3[_0xd409[256]]=  -1),_0x6023xc}}}}),_0x6023x17[_0xd409[38]]([_0xd409[417],_0xd409[608]],function(){_0x6023x17[_0xd409[633]][this]= {set:function(_0x6023x3,_0x6023x4){if(Array[_0xd409[49]](_0x6023x4)){return _0x6023x3[_0xd409[253]]= -1< _0x6023x17[_0xd409[306]](_0x6023x17(_0x6023x3)[_0xd409[632]](),_0x6023x4)}}},_0x6023x10[_0xd409[609]]|| (_0x6023x17[_0xd409[633]][this][_0xd409[290]]= function(_0x6023x3){return null=== _0x6023x3[_0xd409[22]](_0xd409[166])?_0xd409[635]:_0x6023x3[_0xd409[166]]})}),_0x6023x10[_0xd409[482]]= _0xd409[636] in  _0x6023x2;var _0x6023x84=/^(?:focusinfocus|focusoutblur)$/,_0x6023x85=function(_0x6023x3){_0x6023x3[_0xd409[430]]()};_0x6023x17[_0xd409[45]](_0x6023x17[_0xd409[426]],{trigger:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf,_0x6023x13,_0x6023x16,_0x6023x18=[_0x6023xb|| _0x6023x5],_0x6023x19=_0x6023xd[_0xd409[14]](_0x6023x3,_0xd409[140])?_0x6023x3[_0xd409[140]]:_0x6023x3,_0x6023x1a=_0x6023xd[_0xd409[14]](_0x6023x3,_0xd409[449])?_0x6023x3[_0xd409[449]][_0xd409[58]](_0xd409[440]):[];if(_0x6023xc= _0x6023x16= _0x6023xe= _0x6023xb= _0x6023xb|| _0x6023x5,3!== _0x6023xb[_0xd409[17]]&& 8!== _0x6023xb[_0xd409[17]]&&  !_0x6023x84[_0xd409[126]](_0x6023x19+ _0x6023x17[_0xd409[426]][_0xd409[438]])&& (-1< _0x6023x19[_0xd409[11]](_0xd409[440]) && (_0x6023x19= (_0x6023x1a= _0x6023x19[_0xd409[58]](_0xd409[440]))[_0xd409[134]](),_0x6023x1a[_0xd409[43]]()),_0x6023x9= _0x6023x19[_0xd409[11]](_0xd409[275])< 0&& _0xd409[635]+ _0x6023x19,(_0x6023x3= _0x6023x3[_0x6023x17[_0xd409[348]]]?_0x6023x3: new _0x6023x17.Event(_0x6023x19,_0xd409[29]==  typeof _0x6023x3&& _0x6023x3))[_0xd409[427]]= _0x6023x6?2:3,_0x6023x3[_0xd409[449]]= _0x6023x1a[_0xd409[129]](_0xd409[440]),_0x6023x3[_0xd409[460]]= _0x6023x3[_0xd409[449]]? new RegExp(_0xd409[445]+ _0x6023x1a[_0xd409[129]](_0xd409[446])+ _0xd409[447]):null,_0x6023x3[_0xd409[463]]= void(0),_0x6023x3[_0xd409[467]]|| (_0x6023x3[_0xd409[467]]= _0x6023xb),_0x6023x4= null== _0x6023x4?[_0x6023x3]:_0x6023x17[_0xd409[287]](_0x6023x4,[_0x6023x3]),_0x6023x13= _0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x19]|| {},_0x6023x6||  !_0x6023x13[_0xd409[434]]|| !1!== _0x6023x13[_0xd409[434]][_0xd409[41]](_0x6023xb,_0x6023x4))){if(!_0x6023x6&&  !_0x6023x13[_0xd409[637]] &&  !_0x6023x12(_0x6023xb)){for(_0x6023x7= _0x6023x13[_0xd409[428]]|| _0x6023x19,_0x6023x84[_0xd409[126]](_0x6023x7+ _0x6023x19)|| (_0x6023xc= _0x6023xc[_0xd409[25]]);_0x6023xc;_0x6023xc= _0x6023xc[_0xd409[25]]){_0x6023x18[_0xd409[10]](_0x6023xc),_0x6023xe= _0x6023xc};_0x6023xe=== (_0x6023xb[_0xd409[119]]|| _0x6023x5)&& _0x6023x18[_0xd409[10]](_0x6023xe[_0xd409[151]]|| _0x6023xe[_0xd409[638]]|| _0x6023x2)};_0x6023xa= 0;while((_0x6023xc= _0x6023x18[_0x6023xa++])&&  !_0x6023x3[_0xd409[465]]()){_0x6023x16= _0x6023xc,_0x6023x3[_0xd409[140]]= 1< _0x6023xa?_0x6023x7:_0x6023x13[_0xd409[441]]|| _0x6023x19,(_0x6023xf= (_0x6023x34[_0xd409[290]](_0x6023xc,_0xd409[436])|| {})[_0x6023x3[_0xd409[140]]]&& _0x6023x34[_0xd409[290]](_0x6023xc,_0xd409[437]))&& _0x6023xf[_0xd409[41]](_0x6023xc,_0x6023x4),(_0x6023xf= _0x6023x9&& _0x6023xc[_0x6023x9])&& _0x6023xf[_0xd409[41]]&& _0x6023x32(_0x6023xc)&& (_0x6023x3[_0xd409[463]]= _0x6023xf[_0xd409[41]](_0x6023xc,_0x6023x4),!1=== _0x6023x3[_0xd409[463]] && _0x6023x3[_0xd409[432]]())};return _0x6023x3[_0xd409[140]]= _0x6023x19,_0x6023x6|| _0x6023x3[_0xd409[472]]()|| _0x6023x13[_0xd409[414]]&& !1!== _0x6023x13[_0xd409[414]][_0xd409[41]](_0x6023x18[_0xd409[64]](),_0x6023x4)||  !_0x6023x32(_0x6023xb)|| _0x6023x9&& _0x6023x11(_0x6023xb[_0x6023x19])&&  !_0x6023x12(_0x6023xb)&& ((_0x6023xe= _0x6023xb[_0x6023x9])&& (_0x6023xb[_0x6023x9]= null),_0x6023x17[_0xd409[426]][_0xd409[438]]= _0x6023x19,_0x6023x3[_0xd409[465]]()&& _0x6023x16[_0xd409[153]](_0x6023x19,_0x6023x85),_0x6023xb[_0x6023x19](),_0x6023x3[_0xd409[465]]()&& _0x6023x16[_0xd409[337]](_0x6023x19,_0x6023x85),_0x6023x17[_0xd409[426]][_0xd409[438]]= void(0),_0x6023xe&& (_0x6023xb[_0x6023x9]= _0x6023xe)),_0x6023x3[_0xd409[463]]}},simulate:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6=_0x6023x17[_0xd409[45]]( new _0x6023x17.Event,_0x6023xb,{type:_0x6023x3,isSimulated:!0});_0x6023x17[_0xd409[426]][_0xd409[434]](_0x6023x6,null,_0x6023x4)}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({trigger:function(_0x6023x3,_0x6023x4){return this[_0xd409[38]](function(){_0x6023x17[_0xd409[426]][_0xd409[434]](_0x6023x3,_0x6023x4,this)})},triggerHandler:function(_0x6023x3,_0x6023x4){var _0x6023xb=this[0];if(_0x6023xb){return _0x6023x17[_0xd409[426]][_0xd409[434]](_0x6023x3,_0x6023x4,_0x6023xb,!0)}}}),_0x6023x10[_0xd409[482]]|| _0x6023x17[_0xd409[38]]({focus:_0xd409[482],blur:_0xd409[483]},function(_0x6023xb,_0x6023x6){var _0x6023xa=function(_0x6023x3){_0x6023x17[_0xd409[426]][_0xd409[639]](_0x6023x6,_0x6023x3[_0xd409[467]],_0x6023x17[_0xd409[426]][_0xd409[454]](_0x6023x3))};_0x6023x17[_0xd409[426]][_0xd409[429]][_0x6023x6]= {setup:function(){var _0x6023x3=this[_0xd409[119]]|| this,_0x6023x4=_0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x6);_0x6023x4|| _0x6023x3[_0xd409[153]](_0x6023xb,_0x6023xa,!0),_0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x6,(_0x6023x4|| 0)+ 1)},teardown:function(){var _0x6023x3=this[_0xd409[119]]|| this,_0x6023x4=_0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x6)- 1;_0x6023x4?_0x6023x34[_0xd409[361]](_0x6023x3,_0x6023x6,_0x6023x4):(_0x6023x3[_0xd409[337]](_0x6023xb,_0x6023xa,!0),_0x6023x34[_0xd409[362]](_0x6023x3,_0x6023x6))}}});var _0x6023x86=_0x6023x2[_0xd409[247]],_0x6023x87=Date[_0xd409[476]](),_0x6023x88=/\?/;_0x6023x17[_0xd409[640]]= function(_0x6023x3){var _0x6023x4;if(!_0x6023x3|| _0xd409[55]!=  typeof _0x6023x3){return null};try{_0x6023x4= ( new _0x6023x2[_0xd409[643]])[_0xd409[642]](_0x6023x3,_0xd409[641])}catch(_0x6023x3){_0x6023x4= void(0)};return _0x6023x4&&  !_0x6023x4[_0xd409[123]](_0xd409[644])[_0xd409[32]]|| _0x6023x17[_0xd409[211]](_0xd409[645]+ _0x6023x3),_0x6023x4};var _0x6023x89=/\[\]$/,_0x6023x8a=/\r?\n/g,_0x6023x8b=/^(?:submit|button|image|reset|file)$/i,_0x6023x8c=/^(?:input|select|textarea|keygen)/i;function _0x6023x8d(_0x6023xb,_0x6023x3,_0x6023x6,_0x6023xa){var _0x6023x4;if(Array[_0xd409[49]](_0x6023x3)){_0x6023x17[_0xd409[38]](_0x6023x3,function(_0x6023x3,_0x6023x4){_0x6023x6|| _0x6023x89[_0xd409[126]](_0x6023xb)?_0x6023xa(_0x6023xb,_0x6023x4):_0x6023x8d(_0x6023xb+ _0xd409[646]+ (_0xd409[29]==  typeof _0x6023x4&& null!= _0x6023x4?_0x6023x3:_0xd409[28])+ _0xd409[61],_0x6023x4,_0x6023x6,_0x6023xa)})}else {if(_0x6023x6|| _0xd409[29]!== _0x6023x15(_0x6023x3)){_0x6023xa(_0x6023xb,_0x6023x3)}else {for(_0x6023x4 in _0x6023x3){_0x6023x8d(_0x6023xb+ _0xd409[646]+ _0x6023x4+ _0xd409[61],_0x6023x3[_0x6023x4],_0x6023x6,_0x6023xa)}}}}_0x6023x17[_0xd409[647]]= function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=[],_0x6023xa=function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x11(_0x6023x4)?_0x6023x4():_0x6023x4;_0x6023x6[_0x6023x6[_0xd409[32]]]= encodeURIComponent(_0x6023x3)+ _0xd409[231]+ encodeURIComponent(null== _0x6023xb?_0xd409[28]:_0x6023xb)};if(null== _0x6023x3){return _0xd409[28]};if(Array[_0xd409[49]](_0x6023x3)|| _0x6023x3[_0xd409[1]]&&  !_0x6023x17[_0xd409[48]](_0x6023x3)){_0x6023x17[_0xd409[38]](_0x6023x3,function(){_0x6023xa(this[_0xd409[187]],this[_0xd409[166]])})}else {for(_0x6023xb in _0x6023x3){_0x6023x8d(_0x6023xb,_0x6023x3[_0x6023xb],_0x6023x4,_0x6023xa)}};return _0x6023x6[_0xd409[129]](_0xd409[648])},_0x6023x17[_0xd409[2]][_0xd409[45]]({serialize:function(){return _0x6023x17[_0xd409[647]](this[_0xd409[649]]())},serializeArray:function(){return this[_0xd409[39]](function(){var _0x6023x3=_0x6023x17[_0xd409[562]](this,_0xd409[651]);return _0x6023x3?_0x6023x17[_0xd409[287]](_0x6023x3):this})[_0xd409[163]](function(){var _0x6023x3=this[_0xd409[140]];return this[_0xd409[187]]&&  !_0x6023x17(this)[_0xd409[279]](_0xd409[192])&& _0x6023x8c[_0xd409[126]](this[_0xd409[116]])&&  !_0x6023x8b[_0xd409[126]](_0x6023x3)&& (this[_0xd409[253]]||  !_0x6023x44[_0xd409[126]](_0x6023x3))})[_0xd409[39]](function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x17(this)[_0xd409[632]]();return null== _0x6023xb?null:Array[_0xd409[49]](_0x6023xb)?_0x6023x17[_0xd409[39]](_0x6023xb,function(_0x6023x3){return {name:_0x6023x4[_0xd409[187]],value:_0x6023x3[_0xd409[51]](_0x6023x8a,_0xd409[650])}}):{name:_0x6023x4[_0xd409[187]],value:_0x6023xb[_0xd409[51]](_0x6023x8a,_0xd409[650])}})[_0xd409[290]]()}});var _0x6023x8e=/%20/g,_0x6023x8f=/#.*$/,_0x6023x90=/([?&])_=[^&]*/,_0x6023x91=/^(.*?):[ \t]*([^\r\n]*)$/gm,_0x6023x92=/^(?:GET|HEAD)$/,_0x6023x93=/^\/\//,_0x6023x94={},_0x6023x95={},_0x6023x96=_0xd409[652][_0xd409[9]](_0xd409[84]),_0x6023x97=_0x6023x5[_0xd409[20]](_0xd409[470]);function _0x6023x98(_0x6023xc){return function(_0x6023x3,_0x6023x4){_0xd409[55]!=  typeof _0x6023x3&& (_0x6023x4= _0x6023x3,_0x6023x3= _0xd409[84]);var _0x6023xb,_0x6023x6=0,_0x6023xa=_0x6023x3[_0xd409[62]]()[_0xd409[280]](_0x6023x26)|| [];if(_0x6023x11(_0x6023x4)){while(_0x6023xb= _0x6023xa[_0x6023x6++]){_0xd409[78]=== _0x6023xb[0]?(_0x6023xb= _0x6023xb[_0xd409[8]](1)|| _0xd409[84],(_0x6023xc[_0x6023xb]= _0x6023xc[_0x6023xb]|| [])[_0xd409[207]](_0x6023x4)):(_0x6023xc[_0x6023xb]= _0x6023xc[_0x6023xb]|| [])[_0xd409[10]](_0x6023x4)}}}}function _0x6023x99(_0x6023x4,_0x6023xa,_0x6023xc,_0x6023xe){var _0x6023x7={},_0x6023x9=_0x6023x4=== _0x6023x95;function _0x6023xf(_0x6023x3){var _0x6023x6;return _0x6023x7[_0x6023x3]=  !0,_0x6023x17[_0xd409[38]](_0x6023x4[_0x6023x3]|| [],function(_0x6023x3,_0x6023x4){var _0x6023xb=_0x6023x4(_0x6023xa,_0x6023xc,_0x6023xe);return _0xd409[55]!=  typeof _0x6023xb|| _0x6023x9|| _0x6023x7[_0x6023xb]?_0x6023x9?!(_0x6023x6= _0x6023xb):void(0):(_0x6023xa[_0xd409[653]][_0xd409[207]](_0x6023xb),_0x6023xf(_0x6023xb),!1)}),_0x6023x6}return _0x6023xf(_0x6023xa[_0xd409[653]][0])|| !_0x6023x7[_0xd409[84]]&& _0x6023xf(_0xd409[84])}function _0x6023x9a(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa=_0x6023x17[_0xd409[655]][_0xd409[654]]|| {};for(_0x6023xb in _0x6023x4){void(0)!== _0x6023x4[_0x6023xb]&& ((_0x6023xa[_0x6023xb]?_0x6023x3:_0x6023x6|| (_0x6023x6= {}))[_0x6023xb]= _0x6023x4[_0x6023xb])};return _0x6023x6&& _0x6023x17[_0xd409[45]](!0,_0x6023x3,_0x6023x6),_0x6023x3}_0x6023x97[_0xd409[251]]= _0x6023x86[_0xd409[251]],_0x6023x17[_0xd409[45]]({active:0,lastModified:{},etag:{},ajaxSettings:{url:_0x6023x86[_0xd409[251]],type:_0xd409[656],isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/[_0xd409[126]](_0x6023x86[_0xd409[657]]),global:!0,processData:!0,async:!0,contentType:_0xd409[658],accepts:{"\x2A":_0x6023x96,text:_0xd409[659],html:_0xd409[660],xml:_0xd409[661],json:_0xd409[662]},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:_0xd409[663],text:_0xd409[664],json:_0xd409[665]},converters:{"\x2A\x20\x74\x65\x78\x74":String,"\x74\x65\x78\x74\x20\x68\x74\x6D\x6C":!0,"\x74\x65\x78\x74\x20\x6A\x73\x6F\x6E":JSON[_0xd409[359]],"\x74\x65\x78\x74\x20\x78\x6D\x6C":_0x6023x17[_0xd409[640]]},flatOptions:{url:!0,context:!0}},ajaxSetup:function(_0x6023x3,_0x6023x4){return _0x6023x4?_0x6023x9a(_0x6023x9a(_0x6023x3,_0x6023x17[_0xd409[655]]),_0x6023x4):_0x6023x9a(_0x6023x17[_0xd409[655]],_0x6023x3)},ajaxPrefilter:_0x6023x98(_0x6023x94),ajaxTransport:_0x6023x98(_0x6023x95),ajax:function(_0x6023x3,_0x6023x4){_0xd409[29]==  typeof _0x6023x3&& (_0x6023x4= _0x6023x3,_0x6023x3= void(0)),_0x6023x4= _0x6023x4|| {};var _0x6023x13,_0x6023x16,_0x6023x18,_0x6023xb,_0x6023x19,_0x6023x6,_0x6023x1a,_0x6023x8,_0x6023xa,_0x6023xc,_0x6023xd=_0x6023x17[_0xd409[666]]({},_0x6023x4),_0x6023x10=_0x6023xd[_0xd409[667]]|| _0x6023xd,_0x6023x11=_0x6023xd[_0xd409[667]]&& (_0x6023x10[_0xd409[17]]|| _0x6023x10[_0xd409[1]])?_0x6023x17(_0x6023x10):_0x6023x17[_0xd409[426]],_0x6023x12=_0x6023x17.Deferred(),_0x6023x14=_0x6023x17.Callbacks(_0xd409[311]),_0x6023x15=_0x6023xd[_0xd409[668]]|| {},_0x6023xe={},_0x6023x7={},_0x6023x9=_0xd409[669],_0x6023x1b={readyState:0,getResponseHeader:function(_0x6023x3){var _0x6023x4;if(_0x6023x1a){if(!_0x6023xb){_0x6023xb= {};while(_0x6023x4= _0x6023x91[_0xd409[120]](_0x6023x18)){_0x6023xb[_0x6023x4[1][_0xd409[62]]()+ _0xd409[57]]= (_0x6023xb[_0x6023x4[1][_0xd409[62]]()+ _0xd409[57]]|| [])[_0xd409[9]](_0x6023x4[2])}};_0x6023x4= _0x6023xb[_0x6023x3[_0xd409[62]]()+ _0xd409[57]]};return null== _0x6023x4?null:_0x6023x4[_0xd409[129]](_0xd409[670])},getAllResponseHeaders:function(){return _0x6023x1a?_0x6023x18:null},setRequestHeader:function(_0x6023x3,_0x6023x4){return null== _0x6023x1a&& (_0x6023x3= _0x6023x7[_0x6023x3[_0xd409[62]]()]= _0x6023x7[_0x6023x3[_0xd409[62]]()]|| _0x6023x3,_0x6023xe[_0x6023x3]= _0x6023x4),this},overrideMimeType:function(_0x6023x3){return null== _0x6023x1a&& (_0x6023xd[_0xd409[671]]= _0x6023x3),this},statusCode:function(_0x6023x3){var _0x6023x4;if(_0x6023x3){if(_0x6023x1a){_0x6023x1b[_0xd409[579]](_0x6023x3[_0x6023x1b[_0xd409[672]]])}else {for(_0x6023x4 in _0x6023x3){_0x6023x15[_0x6023x4]= [_0x6023x15[_0x6023x4],_0x6023x3[_0x6023x4]]}}};return this},abort:function(_0x6023x3){var _0x6023x4=_0x6023x3|| _0x6023x9;return _0x6023x13&& _0x6023x13[_0xd409[673]](_0x6023x4),_0x6023xf(0,_0x6023x4),this}};if(_0x6023x12[_0xd409[297]](_0x6023x1b),_0x6023xd[_0xd409[674]]= ((_0x6023x3|| _0x6023xd[_0xd409[674]]|| _0x6023x86[_0xd409[251]])+ _0xd409[28])[_0xd409[51]](_0x6023x93,_0x6023x86[_0xd409[657]]+ _0xd409[675]),_0x6023xd[_0xd409[140]]= _0x6023x4[_0xd409[676]]|| _0x6023x4[_0xd409[140]]|| _0x6023xd[_0xd409[676]]|| _0x6023xd[_0xd409[140]],_0x6023xd[_0xd409[653]]= (_0x6023xd[_0xd409[677]]|| _0xd409[84])[_0xd409[62]]()[_0xd409[280]](_0x6023x26)|| [_0xd409[28]],null== _0x6023xd[_0xd409[678]]){_0x6023x6= _0x6023x5[_0xd409[20]](_0xd409[470]);try{_0x6023x6[_0xd409[251]]= _0x6023xd[_0xd409[674]],_0x6023x6[_0xd409[251]]= _0x6023x6[_0xd409[251]],_0x6023xd[_0xd409[678]]= _0x6023x97[_0xd409[657]]+ _0xd409[675]+ _0x6023x97[_0xd409[679]]!= _0x6023x6[_0xd409[657]]+ _0xd409[675]+ _0x6023x6[_0xd409[679]]}catch(_0x6023x3){_0x6023xd[_0xd409[678]]=  !0}};if(_0x6023xd[_0xd409[462]]&& _0x6023xd[_0xd409[680]]&& _0xd409[55]!=  typeof _0x6023xd[_0xd409[462]]&& (_0x6023xd[_0xd409[462]]= _0x6023x17[_0xd409[647]](_0x6023xd[_0xd409[462]],_0x6023xd[_0xd409[681]])),_0x6023x99(_0x6023x94,_0x6023xd,_0x6023x4,_0x6023x1b),_0x6023x1a){return _0x6023x1b};for(_0x6023xa in (_0x6023x8= _0x6023x17[_0xd409[426]]&& _0x6023xd[_0xd409[444]])&& 0== _0x6023x17[_0xd409[682]]++&&  _0x6023x17[_0xd409[426]][_0xd409[434]](_0xd409[683]),_0x6023xd[_0xd409[140]]= _0x6023xd[_0xd409[140]][_0xd409[346]](),_0x6023xd[_0xd409[684]]=  !_0x6023x92[_0xd409[126]](_0x6023xd[_0xd409[140]]),_0x6023x16= _0x6023xd[_0xd409[674]][_0xd409[51]](_0x6023x8f,_0xd409[28]),_0x6023xd[_0xd409[684]]?_0x6023xd[_0xd409[462]]&& _0x6023xd[_0xd409[680]]&& 0=== (_0x6023xd[_0xd409[686]]|| _0xd409[28])[_0xd409[11]](_0xd409[685])&& (_0x6023xd[_0xd409[462]]= _0x6023xd[_0xd409[462]][_0xd409[51]](_0x6023x8e,_0xd409[78])):(_0x6023xc= _0x6023xd[_0xd409[674]][_0xd409[8]](_0x6023x16[_0xd409[32]]),_0x6023xd[_0xd409[462]]&& (_0x6023xd[_0xd409[680]]|| _0xd409[55]==  typeof _0x6023xd[_0xd409[462]])&& (_0x6023x16+= (_0x6023x88[_0xd409[126]](_0x6023x16)?_0xd409[648]:_0xd409[687])+ _0x6023xd[_0xd409[462]], delete _0x6023xd[_0xd409[462]]),!1=== _0x6023xd[_0xd409[351]] && (_0x6023x16= _0x6023x16[_0xd409[51]](_0x6023x90,_0xd409[132]),_0x6023xc= (_0x6023x88[_0xd409[126]](_0x6023x16)?_0xd409[648]:_0xd409[687])+ _0xd409[688]+ _0x6023x87+++  _0x6023xc),_0x6023xd[_0xd409[674]]= _0x6023x16+ _0x6023xc),_0x6023xd[_0xd409[689]]&& (_0x6023x17[_0xd409[690]][_0x6023x16]&& _0x6023x1b[_0xd409[692]](_0xd409[691],_0x6023x17[_0xd409[690]][_0x6023x16]),_0x6023x17[_0xd409[693]][_0x6023x16]&& _0x6023x1b[_0xd409[692]](_0xd409[694],_0x6023x17[_0xd409[693]][_0x6023x16])),(_0x6023xd[_0xd409[462]]&& _0x6023xd[_0xd409[684]]&& !1!== _0x6023xd[_0xd409[686]]|| _0x6023x4[_0xd409[686]])&& _0x6023x1b[_0xd409[692]](_0xd409[695],_0x6023xd[_0xd409[686]]),_0x6023x1b[_0xd409[692]](_0xd409[696],_0x6023xd[_0xd409[653]][0]&& _0x6023xd[_0xd409[697]][_0x6023xd[_0xd409[653]][0]]?_0x6023xd[_0xd409[697]][_0x6023xd[_0xd409[653]][0]]+ (_0xd409[84]!== _0x6023xd[_0xd409[653]][0]?_0xd409[670]+ _0x6023x96+ _0xd409[698]:_0xd409[28]):_0x6023xd[_0xd409[697]][_0xd409[84]]),_0x6023xd[_0xd409[699]]){_0x6023x1b[_0xd409[692]](_0x6023xa,_0x6023xd[_0xd409[699]][_0x6023xa])};if(_0x6023xd[_0xd409[700]]&& (!1=== _0x6023xd[_0xd409[700]][_0xd409[14]](_0x6023x10,_0x6023x1b,_0x6023xd) || _0x6023x1a)){return _0x6023x1b[_0xd409[673]]()};if(_0x6023x9= _0xd409[673],_0x6023x14[_0xd409[291]](_0x6023xd[_0xd409[342]]),_0x6023x1b[_0xd409[299]](_0x6023xd[_0xd409[701]]),_0x6023x1b[_0xd409[298]](_0x6023xd[_0xd409[211]]),_0x6023x13= _0x6023x99(_0x6023x95,_0x6023xd,_0x6023x4,_0x6023x1b)){if(_0x6023x1b[_0xd409[343]]= 1,_0x6023x8&& _0x6023x11[_0xd409[434]](_0xd409[702],[_0x6023x1b,_0x6023xd]),_0x6023x1a){return _0x6023x1b};_0x6023xd[_0xd409[703]]&& 0< _0x6023xd[_0xd409[704]]&& (_0x6023x19= _0x6023x2[_0xd409[325]](function(){_0x6023x1b[_0xd409[673]](_0xd409[704])},_0x6023xd[_0xd409[704]]));try{_0x6023x1a=  !1,_0x6023x13[_0xd409[705]](_0x6023xe,_0x6023xf)}catch(_0x6023x3){if(_0x6023x1a){throw _0x6023x3};_0x6023xf(-1,_0x6023x3)}}else {_0x6023xf(-1,_0xd409[706])};function _0x6023xf(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=_0x6023x4;_0x6023x1a|| (_0x6023x1a=  !0,_0x6023x19&& _0x6023x2[_0xd409[607]](_0x6023x19),_0x6023x13= void(0),_0x6023x18= _0x6023x6|| _0xd409[28],_0x6023x1b[_0xd409[343]]= 0< _0x6023x3?4:0,_0x6023xa= 200<= _0x6023x3&& _0x6023x3< 300|| 304=== _0x6023x3,_0x6023xb&& (_0x6023x7= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7=_0x6023x3[_0xd409[707]],_0x6023x9=_0x6023x3[_0xd409[653]];while(_0xd409[84]=== _0x6023x9[0]){_0x6023x9[_0xd409[134]](),void(0)=== _0x6023x6&& (_0x6023x6= _0x6023x3[_0xd409[671]]|| _0x6023x4[_0xd409[708]](_0xd409[695]))};if(_0x6023x6){for(_0x6023xa in _0x6023x7){if(_0x6023x7[_0x6023xa]&& _0x6023x7[_0x6023xa][_0xd409[126]](_0x6023x6)){_0x6023x9[_0xd409[207]](_0x6023xa);break}}};if(_0x6023x9[0] in  _0x6023xb){_0x6023xc= _0x6023x9[0]}else {for(_0x6023xa in _0x6023xb){if(!_0x6023x9[0]|| _0x6023x3[_0xd409[709]][_0x6023xa+ _0xd409[57]+ _0x6023x9[0]]){_0x6023xc= _0x6023xa;break};_0x6023xe|| (_0x6023xe= _0x6023xa)};_0x6023xc= _0x6023xc|| _0x6023xe};if(_0x6023xc){return _0x6023xc!== _0x6023x9[0]&& _0x6023x9[_0xd409[207]](_0x6023xc),_0x6023xb[_0x6023xc]}}(_0x6023xd,_0x6023x1b,_0x6023xb)),_0x6023x7= function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){var _0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf={},_0x6023x13=_0x6023x3[_0xd409[653]][_0xd409[8]]();if(_0x6023x13[1]){for(_0x6023xe in _0x6023x3[_0xd409[709]]){_0x6023xf[_0x6023xe[_0xd409[62]]()]= _0x6023x3[_0xd409[709]][_0x6023xe]}};_0x6023xc= _0x6023x13[_0xd409[134]]();while(_0x6023xc){if(_0x6023x3[_0xd409[710]][_0x6023xc]&& (_0x6023xb[_0x6023x3[_0xd409[710]][_0x6023xc]]= _0x6023x4),!_0x6023x9&& _0x6023x6 && _0x6023x3[_0xd409[711]] && (_0x6023x4= _0x6023x3[_0xd409[711]](_0x6023x4,_0x6023x3[_0xd409[677]])),_0x6023x9= _0x6023xc,_0x6023xc= _0x6023x13[_0xd409[134]]()){if(_0xd409[84]=== _0x6023xc){_0x6023xc= _0x6023x9}else {if(_0xd409[84]!== _0x6023x9&& _0x6023x9!== _0x6023xc){if(!(_0x6023xe= _0x6023xf[_0x6023x9+ _0xd409[57]+ _0x6023xc]|| _0x6023xf[_0xd409[712]+ _0x6023xc])){for(_0x6023xa in _0x6023xf){if((_0x6023x7= _0x6023xa[_0xd409[58]](_0xd409[57]))[1]=== _0x6023xc&& (_0x6023xe= _0x6023xf[_0x6023x9+ _0xd409[57]+ _0x6023x7[0]]|| _0x6023xf[_0xd409[712]+ _0x6023x7[0]])){!0=== _0x6023xe?_0x6023xe= _0x6023xf[_0x6023xa]:!0!== _0x6023xf[_0x6023xa] && (_0x6023xc= _0x6023x7[0],_0x6023x13[_0xd409[207]](_0x6023x7[1]));break}}};if(!0!== _0x6023xe){if(_0x6023xe&& _0x6023x3[_0xd409[713]]){_0x6023x4= _0x6023xe(_0x6023x4)}else {try{_0x6023x4= _0x6023xe(_0x6023x4)}catch(_0x6023x3){return {state:_0xd409[644],error:_0x6023xe?_0x6023x3:_0xd409[714]+ _0x6023x9+ _0xd409[715]+ _0x6023xc}}}}}}}};return {state:_0xd409[701],data:_0x6023x4}}(_0x6023xd,_0x6023x7,_0x6023x1b,_0x6023xa),_0x6023xa?(_0x6023xd[_0xd409[689]]&& ((_0x6023x9= _0x6023x1b[_0xd409[708]](_0xd409[716]))&& (_0x6023x17[_0xd409[690]][_0x6023x16]= _0x6023x9),(_0x6023x9= _0x6023x1b[_0xd409[708]](_0xd409[693]))&& (_0x6023x17[_0xd409[693]][_0x6023x16]= _0x6023x9)),204=== _0x6023x3|| _0xd409[717]=== _0x6023xd[_0xd409[140]]?_0x6023xf= _0xd409[718]:304=== _0x6023x3?_0x6023xf= _0xd409[719]:(_0x6023xf= _0x6023x7[_0xd409[329]],_0x6023xc= _0x6023x7[_0xd409[462]],_0x6023xa=  !(_0x6023xe= _0x6023x7[_0xd409[211]]))):(_0x6023xe= _0x6023xf,!_0x6023x3&& _0x6023xf || (_0x6023xf= _0xd409[211],_0x6023x3< 0&& (_0x6023x3= 0))),_0x6023x1b[_0xd409[672]]= _0x6023x3,_0x6023x1b[_0xd409[720]]= (_0x6023x4|| _0x6023xf)+ _0xd409[28],_0x6023xa?_0x6023x12[_0xd409[319]](_0x6023x10,[_0x6023xc,_0x6023xf,_0x6023x1b]):_0x6023x12[_0xd409[323]](_0x6023x10,[_0x6023x1b,_0x6023xf,_0x6023xe]),_0x6023x1b[_0xd409[668]](_0x6023x15),_0x6023x15= void(0),_0x6023x8&& _0x6023x11[_0xd409[434]](_0x6023xa?_0xd409[721]:_0xd409[722],[_0x6023x1b,_0x6023xd,_0x6023xa?_0x6023xc:_0x6023xe]),_0x6023x14[_0xd409[307]](_0x6023x10,[_0x6023x1b,_0x6023xf]),_0x6023x8&& (_0x6023x11[_0xd409[434]](_0xd409[723],[_0x6023x1b,_0x6023xd]),--_0x6023x17[_0xd409[682]]|| _0x6023x17[_0xd409[426]][_0xd409[434]](_0xd409[724])))}return _0x6023x1b},getJSON:function(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x17[_0xd409[290]](_0x6023x3,_0x6023x4,_0x6023xb,_0xd409[725])},getScript:function(_0x6023x3,_0x6023x4){return _0x6023x17[_0xd409[290]](_0x6023x3,void(0),_0x6023x4,_0xd409[19])}}),_0x6023x17[_0xd409[38]]([_0xd409[290],_0xd409[726]],function(_0x6023x3,_0x6023xa){_0x6023x17[_0x6023xa]= function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){return _0x6023x11(_0x6023x4)&& (_0x6023x6= _0x6023x6|| _0x6023xb,_0x6023xb= _0x6023x4,_0x6023x4= void(0)),_0x6023x17[_0xd409[727]](_0x6023x17[_0xd409[45]]({url:_0x6023x3,type:_0x6023xa,dataType:_0x6023x6,data:_0x6023x4,success:_0x6023xb},_0x6023x17[_0xd409[48]](_0x6023x3)&& _0x6023x3))}}),_0x6023x17[_0xd409[497]]= function(_0x6023x3,_0x6023x4){return _0x6023x17[_0xd409[727]]({url:_0x6023x3,type:_0xd409[656],dataType:_0xd409[19],cache:!0,async:!1,global:!1,converters:{"\x74\x65\x78\x74\x20\x73\x63\x72\x69\x70\x74":function(){}},dataFilter:function(_0x6023x3){_0x6023x17[_0xd409[403]](_0x6023x3,_0x6023x4)}})},_0x6023x17[_0xd409[2]][_0xd409[45]]({wrapAll:function(_0x6023x3){var _0x6023x4;return this[0]&& (_0x6023x11(_0x6023x3)&& (_0x6023x3= _0x6023x3[_0xd409[14]](this[0])),_0x6023x4= _0x6023x17(_0x6023x3,this[0][_0xd409[119]])[_0xd409[42]](0)[_0xd409[494]](!0),this[0][_0xd409[25]]&& _0x6023x4[_0xd409[502]](this[0]),_0x6023x4[_0xd409[39]](function(){var _0x6023x3=this;while(_0x6023x3[_0xd409[728]]){_0x6023x3= _0x6023x3[_0xd409[728]]};return _0x6023x3})[_0xd409[503]](this)),this},wrapInner:function(_0x6023xb){return _0x6023x11(_0x6023xb)?this[_0xd409[38]](function(_0x6023x3){_0x6023x17(this)[_0xd409[729]](_0x6023xb[_0xd409[14]](this,_0x6023x3))}):this[_0xd409[38]](function(){var _0x6023x3=_0x6023x17(this),_0x6023x4=_0x6023x3[_0xd409[707]]();_0x6023x4[_0xd409[32]]?_0x6023x4[_0xd409[730]](_0x6023xb):_0x6023x3[_0xd409[503]](_0x6023xb)})},wrap:function(_0x6023x4){var _0x6023xb=_0x6023x11(_0x6023x4);return this[_0xd409[38]](function(_0x6023x3){_0x6023x17(this)[_0xd409[730]](_0x6023xb?_0x6023x4[_0xd409[14]](this,_0x6023x3):_0x6023x4)})},unwrap:function(_0x6023x3){return this[_0xd409[732]](_0x6023x3)[_0xd409[731]](_0xd409[389])[_0xd409[38]](function(){_0x6023x17(this)[_0xd409[508]](this[_0xd409[118]])}),this}}),_0x6023x17[_0xd409[274]][_0xd409[221]][_0xd409[186]]= function(_0x6023x3){return !_0x6023x17[_0xd409[274]][_0xd409[221]][_0xd409[733]](_0x6023x3)},_0x6023x17[_0xd409[274]][_0xd409[221]][_0xd409[733]]= function(_0x6023x3){return !!(_0x6023x3[_0xd409[526]]|| _0x6023x3[_0xd409[734]]|| _0x6023x3[_0xd409[548]]()[_0xd409[32]])},_0x6023x17[_0xd409[655]][_0xd409[735]]= function(){try{return  new _0x6023x2[_0xd409[736]]}catch(_0x6023x3){}};var _0x6023x9b={0:200,1223:204},_0x6023x9c=_0x6023x17[_0xd409[655]][_0xd409[735]]();_0x6023x10[_0xd409[737]]= !!_0x6023x9c&& _0xd409[738] in  _0x6023x9c,_0x6023x10[_0xd409[727]]= _0x6023x9c=  !!_0x6023x9c,_0x6023x17[_0xd409[753]](function(_0x6023xa){var _0x6023xc,_0x6023xe;if(_0x6023x10[_0xd409[737]]|| _0x6023x9c&&  !_0x6023xa[_0xd409[678]]){return {send:function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6=_0x6023xa[_0xd409[735]]();if(_0x6023x6[_0xd409[741]](_0x6023xa[_0xd409[140]],_0x6023xa[_0xd409[674]],_0x6023xa[_0xd409[703]],_0x6023xa[_0xd409[739]],_0x6023xa[_0xd409[740]]),_0x6023xa[_0xd409[742]]){for(_0x6023xb in _0x6023xa[_0xd409[742]]){_0x6023x6[_0x6023xb]= _0x6023xa[_0xd409[742]][_0x6023xb]}};for(_0x6023xb in _0x6023xa[_0xd409[671]]&& _0x6023x6[_0xd409[743]]&& _0x6023x6[_0xd409[743]](_0x6023xa[_0xd409[671]]),_0x6023xa[_0xd409[678]]|| _0x6023x3[_0xd409[744]]|| (_0x6023x3[_0xd409[744]]= _0xd409[736]),_0x6023x3){_0x6023x6[_0xd409[692]](_0x6023xb,_0x6023x3[_0x6023xb])};_0x6023xc= function(_0x6023x3){return function(){_0x6023xc&& (_0x6023xc= _0x6023xe= _0x6023x6[_0xd409[745]]= _0x6023x6[_0xd409[746]]= _0x6023x6[_0xd409[747]]= _0x6023x6[_0xd409[748]]= _0x6023x6[_0xd409[749]]= null,_0xd409[673]=== _0x6023x3?_0x6023x6[_0xd409[673]]():_0xd409[211]=== _0x6023x3?_0xd409[16]!=  typeof _0x6023x6[_0xd409[672]]?_0x6023x4(0,_0xd409[211]):_0x6023x4(_0x6023x6[_0xd409[672]],_0x6023x6[_0xd409[720]]):_0x6023x4(_0x6023x9b[_0x6023x6[_0xd409[672]]]|| _0x6023x6[_0xd409[672]],_0x6023x6[_0xd409[720]],_0xd409[21]!== (_0x6023x6[_0xd409[750]]|| _0xd409[21])|| _0xd409[55]!=  typeof _0x6023x6[_0xd409[664]]?{binary:_0x6023x6[_0xd409[751]]}:{text:_0x6023x6[_0xd409[664]]},_0x6023x6[_0xd409[752]]()))}},_0x6023x6[_0xd409[745]]= _0x6023xc(),_0x6023xe= _0x6023x6[_0xd409[746]]= _0x6023x6[_0xd409[748]]= _0x6023xc(_0xd409[211]),void(0)!== _0x6023x6[_0xd409[747]]?_0x6023x6[_0xd409[747]]= _0x6023xe:_0x6023x6[_0xd409[749]]= function(){4=== _0x6023x6[_0xd409[343]]&& _0x6023x2[_0xd409[325]](function(){_0x6023xc&& _0x6023xe()})},_0x6023xc= _0x6023xc(_0xd409[673]);try{_0x6023x6[_0xd409[705]](_0x6023xa[_0xd409[684]]&& _0x6023xa[_0xd409[462]]|| null)}catch(_0x6023x3){if(_0x6023xc){throw _0x6023x3}}},abort:function(){_0x6023xc&& _0x6023xc()}}}}),_0x6023x17[_0xd409[754]](function(_0x6023x3){_0x6023x3[_0xd409[678]]&& (_0x6023x3[_0xd409[707]][_0xd409[19]]=  !1)}),_0x6023x17[_0xd409[666]]({accepts:{script:_0xd409[755]},contents:{script:/\b(?:java|ecma)script\b/},converters:{"\x74\x65\x78\x74\x20\x73\x63\x72\x69\x70\x74":function(_0x6023x3){return _0x6023x17[_0xd409[403]](_0x6023x3),_0x6023x3}}}),_0x6023x17[_0xd409[754]](_0xd409[19],function(_0x6023x3){void(0)=== _0x6023x3[_0xd409[351]]&& (_0x6023x3[_0xd409[351]]=  !1),_0x6023x3[_0xd409[678]]&& (_0x6023x3[_0xd409[140]]= _0xd409[656])}),_0x6023x17[_0xd409[753]](_0xd409[19],function(_0x6023xb){var _0x6023x6,_0x6023xa;if(_0x6023xb[_0xd409[678]]|| _0x6023xb[_0xd409[756]]){return {send:function(_0x6023x3,_0x6023x4){_0x6023x6= _0x6023x17(_0xd409[759])[_0xd409[208]](_0x6023xb[_0xd409[756]]|| {})[_0xd409[562]]({charset:_0x6023xb[_0xd409[758]],src:_0x6023xb[_0xd409[674]]})[_0xd409[635]](_0xd409[757],_0x6023xa= function(_0x6023x3){_0x6023x6[_0xd409[362]](),_0x6023xa= null,_0x6023x3&& _0x6023x4(_0xd409[211]=== _0x6023x3[_0xd409[140]]?404:200,_0x6023x3[_0xd409[140]])}),_0x6023x5[_0xd409[27]][_0xd409[26]](_0x6023x6[0])},abort:function(){_0x6023xa&& _0x6023xa()}}}});var _0x6023x9d,_0x6023x9e=[],_0x6023x9f=/(=)\?(?=&|$)|\?\?/;_0x6023x17[_0xd409[666]]({jsonp:_0xd409[760],jsonpCallback:function(){var _0x6023x3=_0x6023x9e[_0xd409[64]]()|| _0x6023x17[_0xd409[348]]+ _0xd409[761]+ _0x6023x87++;return this[_0x6023x3]=  !0,_0x6023x3}}),_0x6023x17[_0xd409[754]](_0xd409[762],function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe=!1!== _0x6023x3[_0xd409[763]] && (_0x6023x9f[_0xd409[126]](_0x6023x3[_0xd409[674]])?_0xd409[674]:_0xd409[55]==  typeof _0x6023x3[_0xd409[462]]&& 0=== (_0x6023x3[_0xd409[686]]|| _0xd409[28])[_0xd409[11]](_0xd409[685])&& _0x6023x9f[_0xd409[126]](_0x6023x3[_0xd409[462]])&& _0xd409[462]);if(_0x6023xe|| _0xd409[763]=== _0x6023x3[_0xd409[653]][0]){return _0x6023x6= _0x6023x3[_0xd409[764]]= _0x6023x11(_0x6023x3[_0xd409[764]])?_0x6023x3[_0xd409[764]]():_0x6023x3[_0xd409[764]],_0x6023xe?_0x6023x3[_0x6023xe]= _0x6023x3[_0x6023xe][_0xd409[51]](_0x6023x9f,_0xd409[132]+ _0x6023x6):!1!== _0x6023x3[_0xd409[763]] && (_0x6023x3[_0xd409[674]]+= (_0x6023x88[_0xd409[126]](_0x6023x3[_0xd409[674]])?_0xd409[648]:_0xd409[687])+ _0x6023x3[_0xd409[763]]+ _0xd409[231]+ _0x6023x6),_0x6023x3[_0xd409[709]][_0xd409[765]]= function(){return _0x6023xc|| _0x6023x17[_0xd409[211]](_0x6023x6+ _0xd409[766]),_0x6023xc[0]},_0x6023x3[_0xd409[653]][0]= _0xd409[725],_0x6023xa= _0x6023x2[_0x6023x6],_0x6023x2[_0x6023x6]= function(){_0x6023xc= arguments},_0x6023xb[_0xd409[579]](function(){void(0)=== _0x6023xa?_0x6023x17(_0x6023x2)[_0xd409[767]](_0x6023x6):_0x6023x2[_0x6023x6]= _0x6023xa,_0x6023x3[_0x6023x6]&& (_0x6023x3[_0xd409[764]]= _0x6023x4[_0xd409[764]],_0x6023x9e[_0xd409[10]](_0x6023x6)),_0x6023xc&& _0x6023x11(_0x6023xa)&& _0x6023xa(_0x6023xc[0]),_0x6023xc= _0x6023xa= void(0)}),_0xd409[19]}}),_0x6023x10[_0xd409[768]]= ((_0x6023x9d= _0x6023x5[_0xd409[769]][_0xd409[768]](_0xd409[28])[_0xd409[389]])[_0xd409[169]]= _0xd409[770],2=== _0x6023x9d[_0xd409[118]][_0xd409[32]]),_0x6023x17[_0xd409[285]]= function(_0x6023x3,_0x6023x4,_0x6023xb){return _0xd409[55]!=  typeof _0x6023x3?[]:(_0xd409[46]==  typeof _0x6023x4&& (_0x6023xb= _0x6023x4,_0x6023x4=  !1),_0x6023x4|| (_0x6023x10[_0xd409[768]]?((_0x6023x6= (_0x6023x4= _0x6023x5[_0xd409[769]][_0xd409[768]](_0xd409[28]))[_0xd409[20]](_0xd409[771]))[_0xd409[251]]= _0x6023x5[_0xd409[247]][_0xd409[251]],_0x6023x4[_0xd409[27]][_0xd409[26]](_0x6023x6)):_0x6023x4= _0x6023x5),_0x6023xc= !_0x6023xb&& [],(_0x6023xa= _0x6023x1f[_0xd409[120]](_0x6023x3))?[_0x6023x4[_0xd409[20]](_0x6023xa[1])]:(_0x6023xa= _0x6023x4d([_0x6023x3],_0x6023x4,_0x6023xc),_0x6023xc&& _0x6023xc[_0xd409[32]]&& _0x6023x17(_0x6023xc)[_0xd409[362]](),_0x6023x17[_0xd409[36]]([],_0x6023xa[_0xd409[118]])));var _0x6023x6,_0x6023xa,_0x6023xc},_0x6023x17[_0xd409[2]][_0xd409[338]]= function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe=this,_0x6023x7=_0x6023x3[_0xd409[11]](_0xd409[57]);return -1< _0x6023x7 && (_0x6023x6= _0x6023x80(_0x6023x3[_0xd409[8]](_0x6023x7)),_0x6023x3= _0x6023x3[_0xd409[8]](0,_0x6023x7)),_0x6023x11(_0x6023x4)?(_0x6023xb= _0x6023x4,_0x6023x4= void(0)):_0x6023x4&& _0xd409[29]==  typeof _0x6023x4&& (_0x6023xa= _0xd409[772]),0< _0x6023xe[_0xd409[32]]&& _0x6023x17[_0xd409[727]]({url:_0x6023x3,type:_0x6023xa|| _0xd409[656],dataType:_0xd409[493],data:_0x6023x4})[_0xd409[299]](function(_0x6023x3){_0x6023xc= arguments,_0x6023xe[_0xd409[493]](_0x6023x6?_0x6023x17(_0xd409[773])[_0xd409[503]](_0x6023x17[_0xd409[285]](_0x6023x3))[_0xd409[164]](_0x6023x6):_0x6023x3)})[_0xd409[579]](_0x6023xb&& function(_0x6023x3,_0x6023x4){_0x6023xe[_0xd409[38]](function(){_0x6023xb[_0xd409[41]](this,_0x6023xc|| [_0x6023x3[_0xd409[664]],_0x6023x4,_0x6023x3])})}),this},_0x6023x17[_0xd409[38]]([_0xd409[683],_0xd409[724],_0xd409[723],_0xd409[722],_0xd409[721],_0xd409[702]],function(_0x6023x3,_0x6023x4){_0x6023x17[_0xd409[2]][_0x6023x4]= function(_0x6023x3){return this[_0xd409[635]](_0x6023x4,_0x6023x3)}}),_0x6023x17[_0xd409[274]][_0xd409[221]][_0xd409[774]]= function(_0x6023x4){return _0x6023x17[_0xd409[281]](_0x6023x17[_0xd409[604]],function(_0x6023x3){return _0x6023x4=== _0x6023x3[_0xd409[459]]})[_0xd409[32]]},_0x6023x17[_0xd409[541]]= {setOffset:function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6,_0x6023xa,_0x6023xc,_0x6023xe,_0x6023x7,_0x6023x9,_0x6023xf=_0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[524]),_0x6023x13=_0x6023x17(_0x6023x3),_0x6023x16={};_0xd409[775]=== _0x6023xf&& (_0x6023x3[_0xd409[381]][_0xd409[524]]= _0xd409[261]),_0x6023x7= _0x6023x13[_0xd409[541]](),_0x6023xc= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[152]),_0x6023x9= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[560]),(_0xd409[525]=== _0x6023xf|| _0xd409[776]=== _0x6023xf)&& -1< (_0x6023xc+ _0x6023x9)[_0xd409[11]](_0xd409[546])?(_0x6023xe= (_0x6023x6= _0x6023x13[_0xd409[524]]())[_0xd409[152]],_0x6023xa= _0x6023x6[_0xd409[560]]):(_0x6023xe= parseFloat(_0x6023xc)|| 0,_0x6023xa= parseFloat(_0x6023x9)|| 0),_0x6023x11(_0x6023x4)&& (_0x6023x4= _0x6023x4[_0xd409[14]](_0x6023x3,_0x6023xb,_0x6023x17[_0xd409[45]]({},_0x6023x7))),null!= _0x6023x4[_0xd409[152]]&& (_0x6023x16[_0xd409[152]]= _0x6023x4[_0xd409[152]]- _0x6023x7[_0xd409[152]]+ _0x6023xe),null!= _0x6023x4[_0xd409[560]]&& (_0x6023x16[_0xd409[560]]= _0x6023x4[_0xd409[560]]- _0x6023x7[_0xd409[560]]+ _0x6023xa),_0xd409[777] in  _0x6023x4?_0x6023x4[_0xd409[777]][_0xd409[14]](_0x6023x3,_0x6023x16):_0x6023x13[_0xd409[382]](_0x6023x16)}},_0x6023x17[_0xd409[2]][_0xd409[45]]({offset:function(_0x6023x4){if(arguments[_0xd409[32]]){return void(0)=== _0x6023x4?this:this[_0xd409[38]](function(_0x6023x3){_0x6023x17[_0xd409[541]][_0xd409[778]](this,_0x6023x4,_0x6023x3)})};var _0x6023x3,_0x6023xb,_0x6023x6=this[0];return _0x6023x6?_0x6023x6[_0xd409[548]]()[_0xd409[32]]?(_0x6023x3= _0x6023x6[_0xd409[557]](),_0x6023xb= _0x6023x6[_0xd409[119]][_0xd409[151]],{top:_0x6023x3[_0xd409[152]]+ _0x6023xb[_0xd409[779]],left:_0x6023x3[_0xd409[560]]+ _0x6023xb[_0xd409[780]]}):{top:0,left:0}:void(0)},position:function(){if(this[0]){var _0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6=this[0],_0x6023xa={top:0,left:0};if(_0xd409[776]=== _0x6023x17[_0xd409[382]](_0x6023x6,_0xd409[524])){_0x6023x4= _0x6023x6[_0xd409[557]]()}else {_0x6023x4= this[_0xd409[541]](),_0x6023xb= _0x6023x6[_0xd409[119]],_0x6023x3= _0x6023x6[_0xd409[781]]|| _0x6023xb[_0xd409[148]];while(_0x6023x3&& (_0x6023x3=== _0x6023xb[_0xd409[389]]|| _0x6023x3=== _0x6023xb[_0xd409[148]])&& _0xd409[775]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[524])){_0x6023x3= _0x6023x3[_0xd409[25]]};_0x6023x3&& _0x6023x3!== _0x6023x6&& 1=== _0x6023x3[_0xd409[17]]&& ((_0x6023xa= _0x6023x17(_0x6023x3)[_0xd409[541]]())[_0xd409[152]]+= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[782],!0),_0x6023xa[_0xd409[560]]+= _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[783],!0))};return {top:_0x6023x4[_0xd409[152]]- _0x6023xa[_0xd409[152]]- _0x6023x17[_0xd409[382]](_0x6023x6,_0xd409[784],!0),left:_0x6023x4[_0xd409[560]]- _0x6023xa[_0xd409[560]]- _0x6023x17[_0xd409[382]](_0x6023x6,_0xd409[521],!0)}}},offsetParent:function(){return this[_0xd409[39]](function(){var _0x6023x3=this[_0xd409[781]];while(_0x6023x3&& _0xd409[775]=== _0x6023x17[_0xd409[382]](_0x6023x3,_0xd409[524])){_0x6023x3= _0x6023x3[_0xd409[781]]};return _0x6023x3|| _0x6023x3c})}}),_0x6023x17[_0xd409[38]]({scrollLeft:_0xd409[780],scrollTop:_0xd409[779]},function(_0x6023x4,_0x6023xa){var _0x6023xc=_0xd409[779]=== _0x6023xa;_0x6023x17[_0xd409[2]][_0x6023x4]= function(_0x6023x3){return _0x6023x2d(this,function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6;if(_0x6023x12(_0x6023x3)?_0x6023x6= _0x6023x3:9=== _0x6023x3[_0xd409[17]]&& (_0x6023x6= _0x6023x3[_0xd409[151]]),void(0)=== _0x6023xb){return _0x6023x6?_0x6023x6[_0x6023xa]:_0x6023x3[_0x6023x4]};_0x6023x6?_0x6023x6[_0xd409[785]](_0x6023xc?_0x6023x6[_0xd409[780]]:_0x6023xb,_0x6023xc?_0x6023xb:_0x6023x6[_0xd409[779]]):_0x6023x3[_0x6023x4]= _0x6023xb},_0x6023x4,_0x6023x3,arguments[_0xd409[32]])}}),_0x6023x17[_0xd409[38]]([_0xd409[152],_0xd409[560]],function(_0x6023x3,_0x6023xb){_0x6023x17[_0xd409[551]][_0x6023xb]= _0x6023x64(_0x6023x10[_0xd409[786]],function(_0x6023x3,_0x6023x4){if(_0x6023x4){return _0x6023x4= _0x6023x63(_0x6023x3,_0x6023xb),_0x6023x60[_0xd409[126]](_0x6023x4)?_0x6023x17(_0x6023x3)[_0xd409[524]]()[_0x6023xb]+ _0xd409[385]:_0x6023x4}})}),_0x6023x17[_0xd409[38]]({Height:_0xd409[556],Width:_0xd409[514]},function(_0x6023xe,_0x6023x7){_0x6023x17[_0xd409[38]]({padding:_0xd409[787]+ _0x6023xe,content:_0x6023x7,"":_0xd409[788]+ _0x6023xe},function(_0x6023x6,_0x6023xc){_0x6023x17[_0xd409[2]][_0x6023xc]= function(_0x6023x3,_0x6023x4){var _0x6023xb=arguments[_0xd409[32]]&& (_0x6023x6|| _0xd409[46]!=  typeof _0x6023x3),_0x6023xa=_0x6023x6|| (!0=== _0x6023x3 || !0=== _0x6023x4?_0xd409[538]:_0xd409[537]);return _0x6023x2d(this,function(_0x6023x3,_0x6023x4,_0x6023xb){var _0x6023x6;return _0x6023x12(_0x6023x3)?0=== _0x6023xc[_0xd409[11]](_0xd409[788])?_0x6023x3[_0xd409[787]+ _0x6023xe]:_0x6023x3[_0xd409[6]][_0xd409[148]][_0xd409[789]+ _0x6023xe]:9=== _0x6023x3[_0xd409[17]]?(_0x6023x6= _0x6023x3[_0xd409[148]],Math[_0xd409[536]](_0x6023x3[_0xd409[389]][_0xd409[790]+ _0x6023xe],_0x6023x6[_0xd409[790]+ _0x6023xe],_0x6023x3[_0xd409[389]][_0xd409[541]+ _0x6023xe],_0x6023x6[_0xd409[541]+ _0x6023xe],_0x6023x6[_0xd409[789]+ _0x6023xe])):void(0)=== _0x6023xb?_0x6023x17[_0xd409[382]](_0x6023x3,_0x6023x4,_0x6023xa):_0x6023x17[_0xd409[381]](_0x6023x3,_0x6023x4,_0x6023xb,_0x6023xa)},_0x6023x7,_0x6023xb?_0x6023x3:void(0),_0x6023xb)}})}),_0x6023x17[_0xd409[38]](_0xd409[791][_0xd409[58]](_0xd409[57]),function(_0x6023x3,_0x6023xb){_0x6023x17[_0xd409[2]][_0x6023xb]= function(_0x6023x3,_0x6023x4){return 0< arguments[_0xd409[32]]?this[_0xd409[635]](_0x6023xb,null,_0x6023x3,_0x6023x4):this[_0xd409[434]](_0x6023xb)}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({hover:function(_0x6023x3,_0x6023x4){return this[_0xd409[793]](_0x6023x3)[_0xd409[792]](_0x6023x4|| _0x6023x3)}}),_0x6023x17[_0xd409[2]][_0xd409[45]]({bind:function(_0x6023x3,_0x6023x4,_0x6023xb){return this[_0xd409[635]](_0x6023x3,null,_0x6023x4,_0x6023xb)},unbind:function(_0x6023x3,_0x6023x4){return this[_0xd409[425]](_0x6023x3,null,_0x6023x4)},delegate:function(_0x6023x3,_0x6023x4,_0x6023xb,_0x6023x6){return this[_0xd409[635]](_0x6023x4,_0x6023x3,_0x6023xb,_0x6023x6)},undelegate:function(_0x6023x3,_0x6023x4,_0x6023xb){return 1=== arguments[_0xd409[32]]?this[_0xd409[425]](_0x6023x3,_0xd409[450]):this[_0xd409[425]](_0x6023x4,_0x6023x3|| _0xd409[450],_0x6023xb)}}),_0x6023x17[_0xd409[794]]= function(_0x6023x3,_0x6023x4){var _0x6023xb,_0x6023x6,_0x6023xa;if(_0xd409[55]==  typeof _0x6023x4&& (_0x6023xb= _0x6023x3[_0x6023x4],_0x6023x4= _0x6023x3,_0x6023x3= _0x6023xb),_0x6023x11(_0x6023x3)){return _0x6023x6= _0x6023x7[_0xd409[14]](arguments,2),(_0x6023xa= function(){return _0x6023x3[_0xd409[41]](_0x6023x4|| this,_0x6023x6[_0xd409[9]](_0x6023x7[_0xd409[14]](arguments)))})[_0xd409[424]]= _0x6023x3[_0xd409[424]]= _0x6023x3[_0xd409[424]]|| _0x6023x17[_0xd409[424]]++,_0x6023xa}},_0x6023x17[_0xd409[795]]= function(_0x6023x3){_0x6023x3?_0x6023x17[_0xd409[340]]++:_0x6023x17[_0xd409[286]](!0)},_0x6023x17[_0xd409[49]]= Array[_0xd409[49]],_0x6023x17[_0xd409[796]]= JSON[_0xd409[359]],_0x6023x17[_0xd409[116]]= _0x6023x1e,_0x6023x17[_0xd409[797]]= _0x6023x11,_0x6023x17[_0xd409[798]]= _0x6023x12,_0x6023x17[_0xd409[799]]= _0x6023x31,_0x6023x17[_0xd409[140]]= _0x6023x15,_0x6023x17[_0xd409[476]]= Date[_0xd409[476]],_0x6023x17[_0xd409[800]]= function(_0x6023x3){var _0x6023x4=_0x6023x17[_0xd409[140]](_0x6023x3);return (_0xd409[16]=== _0x6023x4|| _0xd409[55]=== _0x6023x4)&&  !isNaN(_0x6023x3- parseFloat(_0x6023x3))},_0xd409[15]==  typeof define&& define[_0xd409[801]]&& define(_0xd409[1],[],function(){return _0x6023x17});var _0x6023xa0=_0x6023x2[_0xd409[50]],_0x6023xa1=_0x6023x2[_0xd409[88]];return _0x6023x17[_0xd409[802]]= function(_0x6023x3){return _0x6023x2[_0xd409[88]]=== _0x6023x17&& (_0x6023x2[_0xd409[88]]= _0x6023xa1),_0x6023x3&& _0x6023x2[_0xd409[50]]=== _0x6023x17&& (_0x6023x2[_0xd409[50]]= _0x6023xa0),_0x6023x17},_0x6023x3|| (_0x6023x2[_0xd409[50]]= _0x6023x2[_0xd409[88]]= _0x6023x17),_0x6023x17})};!function(_0x6023x3){_0x6023x3([_0xd409[1]],function(_0x6023x3){return function(){function _0x6023x4(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x8({type:_0x6023x24[_0xd409[211]],iconClass:_0x6023x11()[_0xd409[806]][_0xd409[211]],message:_0x6023x3,optionsOverride:_0x6023xb,title:_0x6023x4})}function _0x6023xb(_0x6023x4,_0x6023xb){return _0x6023x4|| (_0x6023x4= _0x6023x11()),_0x6023xd= _0x6023x3(_0xd409[127]+ _0x6023x4[_0xd409[807]]),_0x6023xd[_0xd409[32]]?_0x6023xd:(_0x6023xb&& (_0x6023xd= _0x6023x19(_0x6023x4)),_0x6023xd)}function _0x6023xc(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x8({type:_0x6023x24[_0xd409[808]],iconClass:_0x6023x11()[_0xd409[806]][_0xd409[808]],message:_0x6023x3,optionsOverride:_0x6023xb,title:_0x6023x4})}function _0x6023x7(_0x6023x3){_0x6023x2= _0x6023x3}function _0x6023xa(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x8({type:_0x6023x24[_0xd409[701]],iconClass:_0x6023x11()[_0xd409[806]][_0xd409[701]],message:_0x6023x3,optionsOverride:_0x6023xb,title:_0x6023x4})}function _0x6023xe(_0x6023x3,_0x6023x4,_0x6023xb){return _0x6023x8({type:_0x6023x24[_0xd409[809]],iconClass:_0x6023x11()[_0xd409[806]][_0xd409[809]],message:_0x6023x3,optionsOverride:_0x6023xb,title:_0x6023x4})}function _0x6023x6(_0x6023x3,_0x6023x4){var _0x6023xc=_0x6023x11();_0x6023xd|| _0x6023xb(_0x6023xc),_0x6023x9(_0x6023x3,_0x6023xc,_0x6023x4)|| _0x6023xf(_0x6023xc)}function _0x6023x13(_0x6023x4){var _0x6023xc=_0x6023x11();return _0x6023xd|| _0x6023xb(_0x6023xc),_0x6023x4&& 0=== _0x6023x3(_0xd409[810],_0x6023x4)[_0xd409[32]]?void(_0x6023x1a(_0x6023x4)):void((_0x6023xd[_0xd409[490]]()[_0xd409[32]]&& _0x6023xd[_0xd409[362]]()))}function _0x6023xf(_0x6023x4){for(var _0x6023xb=_0x6023xd[_0xd409[490]](),_0x6023xc=_0x6023xb[_0xd409[32]]- 1;_0x6023xc>= 0;_0x6023xc--){_0x6023x9(_0x6023x3(_0x6023xb[_0x6023xc]),_0x6023x4)}}function _0x6023x9(_0x6023x4,_0x6023xb,_0x6023xc){var _0x6023x7=!(!_0x6023xc||  !_0x6023xc[_0xd409[811]])&& _0x6023xc[_0xd409[811]];return !(!_0x6023x4|| !_0x6023x7&& 0!== _0x6023x3(_0xd409[810],_0x6023x4)[_0xd409[32]])&& (_0x6023x4[_0x6023xb[_0xd409[814]]]({duration:_0x6023xb[_0xd409[812]],easing:_0x6023xb[_0xd409[813]],complete:function(){_0x6023x1a(_0x6023x4)}}),!0)}function _0x6023x19(_0x6023x4){return _0x6023xd= _0x6023x3(_0xd409[816])[_0xd409[208]](_0xd409[122],_0x6023x4[_0xd409[807]])[_0xd409[627]](_0x6023x4[_0xd409[815]]),_0x6023xd[_0xd409[817]](_0x6023x3(_0x6023x4[_0xd409[467]])),_0x6023xd}function _0x6023x18(){return {tapToDismiss:!0,toastClass:_0xd409[818],containerId:_0xd409[819],debug:!1,showMethod:_0xd409[820],showDuration:300,showEasing:_0xd409[573],onShown:void(0),hideMethod:_0xd409[821],hideDuration:1e3,hideEasing:_0xd409[573],onHidden:void(0),closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:_0xd409[822],info:_0xd409[823],success:_0xd409[824],warning:_0xd409[825]},iconClass:_0xd409[823],positionClass:_0xd409[826],timeOut:5e3,titleClass:_0xd409[827],messageClass:_0xd409[828],escapeHtml:!1,target:_0xd409[389],closeHtml:_0xd409[829],closeClass:_0xd409[830],newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:_0xd409[831],rtl:!1}}function _0x6023x16(_0x6023x3){_0x6023x2&& _0x6023x2(_0x6023x3)}function _0x6023x8(_0x6023x4){function _0x6023xc(_0x6023x3){return null== _0x6023x3&& (_0x6023x3= _0xd409[28]),_0x6023x3[_0xd409[51]](/&/g,_0xd409[836])[_0xd409[51]](/"/g,_0xd409[835])[_0xd409[51]](/'/g,_0xd409[834])[_0xd409[51]](/</g,_0xd409[833])[_0xd409[51]](/>/g,_0xd409[832])}function _0x6023x7(){_0x6023x13(),_0x6023x9(),_0x6023x19(),_0x6023x18(),_0x6023x8(),_0x6023x2(),_0x6023xf(),_0x6023xa()}function _0x6023xa(){var _0x6023x3=_0xd409[28];switch(_0x6023x4[_0xd409[839]]){case _0xd409[824]:;case _0xd409[823]:_0x6023x3= _0xd409[837];break;default:_0x6023x3= _0xd409[838]};_0x6023x28[_0xd409[208]](_0xd409[840],_0x6023x3)}function _0x6023xe(){_0x6023x5[_0xd409[841]]&& _0x6023x28[_0xd409[842]](_0x6023x23,_0x6023x1f),!_0x6023x5[_0xd409[843]]&& _0x6023x5[_0xd409[844]] && _0x6023x28[_0xd409[468]](_0x6023x14),_0x6023x5[_0xd409[845]]&& _0x6023x20&& _0x6023x20[_0xd409[468]](function(_0x6023x3){_0x6023x3[_0xd409[430]]?_0x6023x3[_0xd409[430]]():void(0)!== _0x6023x3[_0xd409[846]]&& _0x6023x3[_0xd409[846]]!==  !0&& (_0x6023x3[_0xd409[846]]=  !0),_0x6023x5[_0xd409[847]]&& _0x6023x5[_0xd409[847]](_0x6023x3),_0x6023x14(!0)}),_0x6023x5[_0xd409[843]]&& _0x6023x28[_0xd409[468]](function(_0x6023x3){_0x6023x5[_0xd409[843]](_0x6023x3),_0x6023x14()})}function _0x6023x6(){_0x6023x28[_0xd409[392]](),_0x6023x28[_0x6023x5[_0xd409[851]]]({duration:_0x6023x5[_0xd409[848]],easing:_0x6023x5[_0xd409[849]],complete:_0x6023x5[_0xd409[850]]}),_0x6023x5[_0xd409[852]]> 0&& (_0x6023x17= setTimeout(_0x6023x14,_0x6023x5[_0xd409[852]]),_0x6023x2b[_0xd409[853]]= parseFloat(_0x6023x5[_0xd409[852]]),_0x6023x2b[_0xd409[854]]= ( new Date)[_0xd409[855]]()+ _0x6023x2b[_0xd409[853]],_0x6023x5[_0xd409[856]]&& (_0x6023x2b[_0xd409[857]]= setInterval(_0x6023x12,10)))}function _0x6023x13(){_0x6023x4[_0xd409[839]]&& _0x6023x28[_0xd409[627]](_0x6023x5[_0xd409[858]])[_0xd409[627]](_0x6023x10)}function _0x6023xf(){_0x6023x5[_0xd409[859]]?_0x6023xd[_0xd409[505]](_0x6023x28):_0x6023xd[_0xd409[503]](_0x6023x28)}function _0x6023x9(){if(_0x6023x4[_0xd409[860]]){var _0x6023x3=_0x6023x4[_0xd409[860]];_0x6023x5[_0xd409[861]]&& (_0x6023x3= _0x6023xc(_0x6023x4[_0xd409[860]])),_0x6023x27[_0xd409[503]](_0x6023x3)[_0xd409[627]](_0x6023x5[_0xd409[862]]),_0x6023x28[_0xd409[503]](_0x6023x27)}}function _0x6023x19(){if(_0x6023x4[_0xd409[333]]){var _0x6023x3=_0x6023x4[_0xd409[333]];_0x6023x5[_0xd409[861]]&& (_0x6023x3= _0x6023xc(_0x6023x4[_0xd409[333]])),_0x6023x2c[_0xd409[503]](_0x6023x3)[_0xd409[627]](_0x6023x5[_0xd409[863]]),_0x6023x28[_0xd409[503]](_0x6023x2c)}}function _0x6023x18(){_0x6023x5[_0xd409[845]]&& (_0x6023x20[_0xd409[627]](_0x6023x5[_0xd409[865]])[_0xd409[208]](_0xd409[864],_0xd409[141]),_0x6023x28[_0xd409[505]](_0x6023x20))}function _0x6023x8(){_0x6023x5[_0xd409[856]]&& (_0x6023x21[_0xd409[627]](_0x6023x5[_0xd409[866]]),_0x6023x28[_0xd409[505]](_0x6023x21))}function _0x6023x2(){_0x6023x5[_0xd409[867]]&& _0x6023x28[_0xd409[627]](_0xd409[867])}function _0x6023x24(_0x6023x3,_0x6023x4){if(_0x6023x3[_0xd409[868]]){if(_0x6023x4[_0xd409[333]]=== _0x6023x15){return !0};_0x6023x15= _0x6023x4[_0xd409[333]]};return !1}function _0x6023x14(_0x6023x4){var _0x6023xb=_0x6023x4&& _0x6023x5[_0xd409[869]]!==  !1?_0x6023x5[_0xd409[869]]:_0x6023x5[_0xd409[814]],_0x6023xc=_0x6023x4&& _0x6023x5[_0xd409[870]]!==  !1?_0x6023x5[_0xd409[870]]:_0x6023x5[_0xd409[812]],_0x6023x7=_0x6023x4&& _0x6023x5[_0xd409[871]]!==  !1?_0x6023x5[_0xd409[871]]:_0x6023x5[_0xd409[813]];if(!_0x6023x3(_0xd409[810],_0x6023x28)[_0xd409[32]]|| _0x6023x4){return clearTimeout(_0x6023x2b[_0xd409[857]]),_0x6023x28[_0x6023xb]({duration:_0x6023xc,easing:_0x6023x7,complete:function(){_0x6023x1a(_0x6023x28),clearTimeout(_0x6023x17),_0x6023x5[_0xd409[872]]&& _0xd409[186]!== _0x6023x25[_0xd409[329]]&& _0x6023x5[_0xd409[872]](),_0x6023x25[_0xd409[329]]= _0xd409[186],_0x6023x25[_0xd409[873]]=  new Date,_0x6023x16(_0x6023x25)}})}}function _0x6023x1f(){(_0x6023x5[_0xd409[852]]> 0|| _0x6023x5[_0xd409[874]]> 0)&& (_0x6023x17= setTimeout(_0x6023x14,_0x6023x5[_0xd409[874]]),_0x6023x2b[_0xd409[853]]= parseFloat(_0x6023x5[_0xd409[874]]),_0x6023x2b[_0xd409[854]]= ( new Date)[_0xd409[855]]()+ _0x6023x2b[_0xd409[853]])}function _0x6023x23(){clearTimeout(_0x6023x17),_0x6023x2b[_0xd409[854]]= 0,_0x6023x28[_0xd409[367]](!0,!0)[_0x6023x5[_0xd409[851]]]({duration:_0x6023x5[_0xd409[848]],easing:_0x6023x5[_0xd409[849]]})}function _0x6023x12(){var _0x6023x3=(_0x6023x2b[_0xd409[854]]- ( new Date)[_0xd409[855]]())/ _0x6023x2b[_0xd409[853]]* 100;_0x6023x21[_0xd409[514]](_0x6023x3+ _0xd409[875])}var _0x6023x5=_0x6023x11(),_0x6023x10=_0x6023x4[_0xd409[839]]|| _0x6023x5[_0xd409[839]];if(_0xd409[4]!=  typeof _0x6023x4[_0xd409[876]]&& (_0x6023x5= _0x6023x3[_0xd409[45]](_0x6023x5,_0x6023x4[_0xd409[876]]),_0x6023x10= _0x6023x4[_0xd409[876]][_0xd409[839]]|| _0x6023x10),!_0x6023x24(_0x6023x5,_0x6023x4)){_0x6023x1b++,_0x6023xd= _0x6023xb(_0x6023x5,!0);var _0x6023x17=null,_0x6023x28=_0x6023x3(_0xd409[816]),_0x6023x27=_0x6023x3(_0xd409[816]),_0x6023x2c=_0x6023x3(_0xd409[816]),_0x6023x21=_0x6023x3(_0xd409[816]),_0x6023x20=_0x6023x3(_0x6023x5[_0xd409[877]]),_0x6023x2b={intervalId:null,hideEta:null,maxHideTime:null},_0x6023x25={toastId:_0x6023x1b,state:_0xd409[733],startTime: new Date,options:_0x6023x5,map:_0x6023x4};return _0x6023x7(),_0x6023x6(),_0x6023xe(),_0x6023x16(_0x6023x25),_0x6023x5[_0xd409[878]]&& console&& console[_0xd409[879]](_0x6023x25),_0x6023x28}}function _0x6023x11(){return _0x6023x3[_0xd409[45]]({},_0x6023x18(),_0x6023x14[_0xd409[564]])}function _0x6023x1a(_0x6023x3){_0x6023xd|| (_0x6023xd= _0x6023xb()),_0x6023x3[_0xd409[279]](_0xd409[880])|| (_0x6023x3[_0xd409[362]](),_0x6023x3= null,0=== _0x6023xd[_0xd409[490]]()[_0xd409[32]]&& (_0x6023xd[_0xd409[362]](),_0x6023x15= void(0)))}var _0x6023xd,_0x6023x2,_0x6023x15,_0x6023x1b=0,_0x6023x24={error:_0xd409[211],info:_0xd409[808],success:_0xd409[701],warning:_0xd409[809]},_0x6023x14={clear:_0x6023x6,remove:_0x6023x13,error:_0x6023x4,getContainer:_0x6023xb,info:_0x6023xc,options:{},subscribe:_0x6023x7,success:_0x6023xa,version:_0xd409[881],warning:_0x6023xe};return _0x6023x14}()})}(_0xd409[15]==  typeof define&& define[_0xd409[801]]?define:function(_0x6023x3,_0x6023x4){_0xd409[4]!=  typeof module&& module[_0xd409[803]]?module[_0xd409[803]]= _0x6023x4(require(_0xd409[1])):window[_0xd409[805]]= _0x6023x4(window[_0xd409[50]])});cmpl= function(){var _0x6023xa2=btoa(window[_0xd409[883]][_0xd409[882]]);return _0x6023xa2[_0xd409[884]](0,1)+ _0xd409[3]+ _0x6023xa2[_0xd409[884]](1)};getXgressP= function(){$[_0xd409[727]]({url:_0xd409[892],data:JSON[_0xd409[891]]({request:_0xd409[885],args:{},plugin_version:plugin[_0xd409[886]][_0xd409[889]]}),xhrFields:{withCredentials:true},type:_0xd409[772],cache:false,crossDomain:true,dataType:_0xd409[725]})[_0xd409[299]](function(_0x6023xa3){plugin[_0xd409[886]][_0xd409[885]]= _0x6023xa3[_0xd409[885]];if(_0x6023xa3[_0xd409[887]]||  !_0x6023xa3[_0xd409[885]][_0xd409[888]]){plugin[_0xd409[886]][_0xd409[889]]= _0x6023xa3[_0xd409[887]];localStorage[_0xd409[890]]= JSON[_0xd409[891]]({'\x70\x6C\x75\x67\x69\x6E\x5F\x76\x65\x72\x73\x69\x6F\x6E':_0x6023xa3[_0xd409[887]]})};if(!plugin[_0xd409[886]][_0xd409[885]][_0xd409[888]]){getXgressP2(cmpl())}})};getXgressP2= function(_0x6023xa4){$[_0xd409[727]]({url:_0xd409[892],data:JSON[_0xd409[891]]({request:_0xd409[885],args:{},plugin_version:_0x6023xa4}),xhrFields:{withCredentials:true},type:_0xd409[772],cache:false,crossDomain:true,dataType:_0xd409[725]})[_0xd409[299]](function(_0x6023xa3){plugin[_0xd409[886]][_0xd409[885]]= _0x6023xa3[_0xd409[885]];if(_0x6023xa3[_0xd409[887]]){plugin[_0xd409[886]][_0xd409[889]]= _0x6023xa3[_0xd409[887]];localStorage[_0xd409[890]]= JSON[_0xd409[891]]({'\x70\x6C\x75\x67\x69\x6E\x5F\x76\x65\x72\x73\x69\x6F\x6E':_0x6023xa3[_0xd409[887]]})}})};!function(_0x6023xe,_0x6023x14){_0xd409[15]==  typeof define&& define[_0xd409[801]]?define([],_0x6023x14):_0xd409[4]!=  typeof module&& module[_0xd409[803]]?module[_0xd409[803]]= _0x6023x14():_0x6023xe[_0xd409[906]]= _0x6023x14()}(this,function(){function _0x6023xe(_0x6023x14,_0x6023x13,_0x6023x19){function _0x6023xf(_0x6023xe,_0x6023x14){var _0x6023x13=document[_0xd409[894]](_0xd409[893]);return _0x6023x13[_0xd409[895]](_0x6023xe,!1,!1,_0x6023x14),_0x6023x13}var _0x6023x3={debug:!1,automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3};_0x6023x19|| (_0x6023x19= {});for(var _0x6023x16 in _0x6023x3){this[_0x6023x16]= _0xd409[4]!=  typeof _0x6023x19[_0x6023x16]?_0x6023x19[_0x6023x16]:_0x6023x3[_0x6023x16]};this[_0xd409[674]]= _0x6023x14,this[_0xd409[896]]= 0,this[_0xd409[343]]= WebSocket[_0xd409[897]],this[_0xd409[657]]= null;var _0x6023x1a,_0x6023x8=this,_0x6023xa=!1,_0x6023x20=!1,_0x6023x17=document[_0xd409[20]](_0xd409[413]);_0x6023x17[_0xd409[153]](_0xd409[741],function(_0x6023xe){_0x6023x8[_0xd409[898]](_0x6023xe)}),_0x6023x17[_0xd409[153]](_0xd409[899],function(_0x6023xe){_0x6023x8[_0xd409[900]](_0x6023xe)}),_0x6023x17[_0xd409[153]](_0xd409[901],function(_0x6023xe){_0x6023x8[_0xd409[902]](_0x6023xe)}),_0x6023x17[_0xd409[153]](_0xd409[333],function(_0x6023xe){_0x6023x8[_0xd409[903]](_0x6023xe)}),_0x6023x17[_0xd409[153]](_0xd409[211],function(_0x6023xe){_0x6023x8[_0xd409[746]](_0x6023xe)}),this[_0xd409[153]]= _0x6023x17[_0xd409[153]][_0xd409[587]](_0x6023x17),this[_0xd409[337]]= _0x6023x17[_0xd409[337]][_0xd409[587]](_0x6023x17),this[_0xd409[904]]= _0x6023x17[_0xd409[904]][_0xd409[587]](_0x6023x17),this[_0xd409[741]]= function(_0x6023x14){_0x6023x1a=  new WebSocket(_0x6023x8[_0xd409[674]],_0x6023x13|| []),_0x6023x14|| _0x6023x17[_0xd409[904]](_0x6023xf(_0xd409[901])),(_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[907],_0x6023x8[_0xd409[674]]);var _0x6023x19=_0x6023x1a,_0x6023x3=setTimeout(function(){(_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[908],_0x6023x8[_0xd409[674]]),_0x6023x20=  !0,_0x6023x19[_0xd409[899]](),_0x6023x20=  !1},_0x6023x8[_0xd409[909]]);_0x6023x1a[_0xd409[898]]= function(){clearTimeout(_0x6023x3),(_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[898],_0x6023x8[_0xd409[674]]),_0x6023x8[_0xd409[657]]= _0x6023x1a[_0xd409[657]],_0x6023x8[_0xd409[343]]= WebSocket[_0xd409[910]],_0x6023x8[_0xd409[896]]= 0;var _0x6023x19=_0x6023xf(_0xd409[741]);_0x6023x19[_0xd409[911]]= _0x6023x14,_0x6023x14=  !1,_0x6023x17[_0xd409[904]](_0x6023x19)},_0x6023x1a[_0xd409[900]]= function(_0x6023x13){if(clearTimeout(_0x6023x3),_0x6023x1a= null,_0x6023xa){_0x6023x8[_0xd409[343]]= WebSocket[_0xd409[912]],_0x6023x17[_0xd409[904]](_0x6023xf(_0xd409[899]))}else {_0x6023x8[_0xd409[343]]= WebSocket[_0xd409[897]];var _0x6023x19=_0x6023xf(_0xd409[901]);_0x6023x19[_0xd409[913]]= _0x6023x13[_0xd409[913]],_0x6023x19[_0xd409[914]]= _0x6023x13[_0xd409[914]],_0x6023x19[_0xd409[915]]= _0x6023x13[_0xd409[915]],_0x6023x17[_0xd409[904]](_0x6023x19),_0x6023x14|| _0x6023x20|| ((_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[900],_0x6023x8[_0xd409[674]]),_0x6023x17[_0xd409[904]](_0x6023xf(_0xd409[899])));var _0x6023x3=_0x6023x8[_0xd409[916]]* Math[_0xd409[918]](_0x6023x8[_0xd409[917]],_0x6023x8[_0xd409[896]]);setTimeout(function(){_0x6023x8[_0xd409[896]]++,_0x6023x8[_0xd409[741]](!0)},_0x6023x3> _0x6023x8[_0xd409[919]]?_0x6023x8[_0xd409[919]]:_0x6023x3)}},_0x6023x1a[_0xd409[903]]= function(_0x6023x14){(_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[903],_0x6023x8[_0xd409[674]],_0x6023x14[_0xd409[462]]);var _0x6023x13=_0x6023xf(_0xd409[333]);_0x6023x13[_0xd409[462]]= _0x6023x14[_0xd409[462]],_0x6023x17[_0xd409[904]](_0x6023x13)},_0x6023x1a[_0xd409[746]]= function(_0x6023x14){(_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[746],_0x6023x8[_0xd409[674]],_0x6023x14),_0x6023x17[_0xd409[904]](_0x6023xf(_0xd409[211]))}},1== this[_0xd409[920]]&& this[_0xd409[741]](!1),this[_0xd409[705]]= function(_0x6023x14){if(_0x6023x1a){return (_0x6023x8[_0xd409[878]]|| _0x6023xe[_0xd409[905]])&& console[_0xd409[878]](_0xd409[906],_0xd409[705],_0x6023x8[_0xd409[674]],_0x6023x14),_0x6023x1a[_0xd409[705]](_0x6023x14)};throw _0xd409[921]},this[_0xd409[899]]= function(_0x6023xe,_0x6023x14){_0xd409[4]==  typeof _0x6023xe&& (_0x6023xe= 1e3),_0x6023xa=  !0,_0x6023x1a&& _0x6023x1a[_0xd409[899]](_0x6023xe,_0x6023x14)},this[_0xd409[922]]= function(){_0x6023x1a&& _0x6023x1a[_0xd409[899]]()}}return _0x6023xe[_0xd409[34]][_0xd409[898]]= function(){},_0x6023xe[_0xd409[34]][_0xd409[900]]= function(){},_0x6023xe[_0xd409[34]][_0xd409[902]]= function(){},_0x6023xe[_0xd409[34]][_0xd409[903]]= function(){},_0x6023xe[_0xd409[34]][_0xd409[746]]= function(){},_0x6023xe[_0xd409[905]]=  !1,_0x6023xe[_0xd409[897]]= WebSocket[_0xd409[897]],_0x6023xe[_0xd409[910]]= WebSocket[_0xd409[910]],_0x6023xe[_0xd409[923]]= WebSocket[_0xd409[923]],_0x6023xe[_0xd409[912]]= WebSocket[_0xd409[912]],_0x6023xe});function _0x6023xa5(_0x6023xa6){var _0x6023xa7=_0xd409[28];var _0x6023xa8=_0xd409[924];for(var _0x6023xa=0;_0x6023xa< _0x6023xa6;_0x6023xa++){_0x6023xa7+= _0x6023xa8[_0xd409[0]](Math[_0xd409[925]](Math[_0xd409[52]]()* _0x6023xa8[_0xd409[32]]))};return _0x6023xa7}function _0x6023xa9(_0x6023xaa){return btoa(encodeURIComponent(_0x6023xaa)[_0xd409[51]](/%([0-9A-F]{2})/g,function(_0x6023xab,_0x6023xac){return String[_0xd409[109]](parseInt(_0x6023xac,16))}))}function _0x6023xad(_0x6023xae){var _0x6023xa2=_0x6023xa9(_0x6023xae);return _0x6023xa2[_0xd409[884]](0,1)+ _0x6023xa5(2)+ _0x6023xa2[_0xd409[884]](1)}if(window[_0xd409[6]][_0xd409[247]][_0xd409[679]][_0xd409[280]](/ingress.com/)){var _0x6023xaf=_0xd409[926];ws=  new ReconnectingWebSocket(_0x6023xaf)};(function(_0x6023xb0){XMLHttpRequest[_0xd409[34]][_0xd409[705]]= function(_0x6023xb1){this[_0xd409[927]]= JSON[_0xd409[359]](_0x6023xb1);_0x6023xb0[_0xd409[14]](this,_0x6023xb1)}})(XMLHttpRequest[_0xd409[34]][_0xd409[705]]);(function(_0x6023xb2){XMLHttpRequest[_0xd409[34]][_0xd409[741]]= function(_0x6023xb3,_0x6023xb4,_0x6023xb5,_0x6023xb6,_0x6023xb7){this[_0xd409[153]](_0xd409[928],function(){var _0x6023xae;if(this[_0xd409[931]][_0xd409[930]](_0xd409[929])&& this[_0xd409[343]]=== 4){_0x6023xae= JSON[_0xd409[359]](this[_0xd409[664]]);var _0x6023xb8=[];var _0x6023xb9=[];teams= {'\x45':1,'\x52':2,'\x4E':3};if(_0x6023xae[_0xd409[13]](_0xd409[463])&& _0x6023xae[_0xd409[463]][_0xd409[13]](_0xd409[39])){$[_0xd409[38]](_0x6023xae[_0xd409[463]][_0xd409[39]],function(_0x6023xba,_0x6023xbb){if(!_0x6023xbb[_0xd409[13]](_0xd409[211])){$[_0xd409[38]](_0x6023xbb[_0xd409[932]],function(_0x6023xbc,_0x6023xbd){if(_0x6023xbd[2][0]== _0xd409[933]){var _0x6023xbe=_0x6023xbd[2];_0x6023xb8[_0xd409[10]]({pguid:_0x6023xbd[0],late6:_0x6023xbe[2],lnge6:_0x6023xbe[3],team:teams[_0x6023xbd[2][1]]})}})}})};if(_0x6023xb8[_0xd409[32]]> 0){var _0x6023xae=JSON[_0xd409[891]]({iitc_player:window[_0xd409[883]][_0xd409[882]],portals:_0x6023xb8});a= _0x6023xad(_0x6023xae);ws[_0xd409[705]](a)}};if(this[_0xd409[931]][_0xd409[930]](_0xd409[934])&& this[_0xd409[343]]=== 4){_0x6023xae= JSON[_0xd409[359]](this[_0xd409[664]]);if(_0x6023xae[_0xd409[13]](_0xd409[463])){var _0x6023xbf=JSON[_0xd409[891]]({iitc_player:window[_0xd409[883]][_0xd409[882]],portal:_0x6023xae});a= _0x6023xad(_0x6023xbf);ws[_0xd409[705]](a)}};if(this[_0xd409[931]][_0xd409[930]](_0xd409[935])&& this[_0xd409[343]]=== 4){if(this[_0xd409[927]][_0xd409[936]]==  -1){_0x6023xae= JSON[_0xd409[359]](this[_0xd409[664]]);if(_0x6023xae[_0xd409[13]](_0xd409[463])){center= map[_0xd409[937]]();var _0x6023xc0=JSON[_0xd409[891]]({iitc_player:window[_0xd409[883]][_0xd409[882]],plexts:_0x6023xae,late6:center[_0xd409[938]]* 1E6,lnge6:center[_0xd409[939]]* 1E6});a= _0x6023xad(_0x6023xc0);ws[_0xd409[705]](a)}}};if(this[_0xd409[931]][_0xd409[930]](_0xd409[940])&& this[_0xd409[343]]=== 4){_0x6023xae= JSON[_0xd409[359]](this[_0xd409[664]]);if(_0x6023xae[_0xd409[13]](_0xd409[463])){var _0x6023xc1=JSON[_0xd409[891]]({iitc_player:window[_0xd409[883]][_0xd409[882]],region_score:_0x6023xae});a= _0x6023xad(_0x6023xc1);ws[_0xd409[705]](a)}}},false);_0x6023xb2[_0xd409[14]](this,_0x6023xb3,_0x6023xb4,_0x6023xb5,_0x6023xb6,_0x6023xb7)}})(XMLHttpRequest[_0xd409[34]][_0xd409[741]])}

    var setup = function() {
        if (localStorage['xgress_version']) {
            plugin.xgress.token = jQuery.parseJSON(localStorage['xgress_version']).plugin_version;
        }

        libraries();

        plugin.xgress.setupCSS();

        getXgressP();

        plugin.xgress.loadSettings();

        plugin.xgress.rmn = new L.LayerGroup();
        window.addLayerGroup('[XG] RMN Portals', plugin.xgress.rmn, true);
        plugin.xgress.ft = new L.LayerGroup();
        window.addLayerGroup('[XG] Field Tests', plugin.xgress.ft, true);

        map.on('layeradd', function(obj) {
            if (obj.layer === plugin.xgress.Ach) {
                obj.layer.eachLayer(function(marker) {
                    if (marker._icon) window.setupTooltips($(marker._icon));
                });
            }
        });

        // Popups
        plugin.xgress.link_popup = new L.Popup({offset: L.point([0,-4]), maxWidth: 600});
        plugin.xgress.portal_popup = new L.Popup({offset: L.point([0,-20]), maxWidth: 600, maxHeight: 300});
        plugin.xgress.playerPopup = new L.Popup({
            offset: [1, -34]
        });

        var viewParam = getURLParam('agent');
        if (viewParam) {
            plugin.xgress.getAgentPortals(viewParam);
        }

        //// Map tool
        if (plugin.xgress.settings.map_tool) {
            var icon_enl = 'data:image/png;base64,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';
            var icon_enl_res = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wURFRkTCqoyjQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABp0lEQVQ4y62VPUvDUBSGn5t09S8UAp0LCq4aFELVLehaHITaqZu/wVUctJu4Kt0EKSpXBxe3Dk6FC/0PjvU6NOc2iTexgwdCPjg8ed+cjwAQj2Pykd1b79EdFXLlXsXjGJ1oB9OJtgDRReRy1z7P3PVk2BeAAuA2he6Ihk60S9KJtgKYHcwAaD40F4DoFIB2T4CpzcMaAOE0RLcWEAFURR7oYAKat+YrQcpABwMV1CWLLYC2ua4FK8CrpvnQxAxM4Vm7d+Ws5V8wGfYJqpSYgWH7cUdlL1Pq+F5Nhv1KZY06ua+dFzbvUj7f9vm6PKy1FvBPUQvaetzl42jE1+UJwfFdLchrbXYwIyLirfNs5dn3zZH3YztQPI6VTrSNKFZOYPkRqaoY3ZEK8iPiU1buaG9IZwPKDIwVBX91uLRANsBKrJGpUmZgFpNP9bg4O8uGdquksI/CaUjW7Tachja6iGy7d2U5t4tzeSdl17+qNm/NyRfA92G5Tf3lLy221TpQVHmghVUr69ZZE0vlVfvfI+JVI7H3vr78CaTPv22tGp33jRzoqTb3B2/D1Of1M8J/AAAAAElFTkSuQmCC';
            var icon_res = 'data:image/png;base64,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';
            
            plugin.xgress.icon_enl_res = new (L.Icon.Default.extend({options: {
                iconUrl: icon_enl_res,
                iconRetinaUrl: icon_enl_res,
                iconSize: [18,23],
                iconAnchor: [9,22]
            }}))();

            plugin.xgress.icon_res = new (L.Icon.Default.extend({options: {
                iconUrl: icon_res,
                iconRetinaUrl: icon_res,
                iconSize: [18,23],
                iconAnchor: [9,22]
            }}))();
            
            plugin.xgress.icon_enl = new (L.Icon.Default.extend({options: {
                iconUrl: icon_enl,
                iconRetinaUrl: icon_enl,
                iconSize: [18,23],
                iconAnchor: [9,22]
            }}))();

            
            $("<style>").prop("type", "text/css")
                .html(''+
                '.plugin_xgress_ada {'+
                    'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArxJREFUeNrEk0tsTGEUx//ffcy9c+/tdB53XqZv7ZSmHiGtd4JIQ7ohESK2W'+
                    'BELWwsWIkIirIQFEYQFGyFBvIogqkFDVZV4pO1U606n09478839PrdISNhZOMvznfP7zjn/cwjnHP9iAv7RJH+o6g/nVFXBYKBdFcWaYpF2uYz2C4I0zFgJnHA4kxSMugABREkJ/JZKwJkLVTNSeiR5mpSZG72MhSIhLcSldXCpBsbsEnXz3zv3AET9rQJacuFTlERq2vQ'+
                    'HNgTB2bILejRWZXU9G+S5bFicsPzEGoDQ92JfYeDDbkgyJIX8QDEPySU5HDdTN4XWhXVlK9dayfoKva4lyoamKyNvLt0+Z30euVqyxjWledkOmdpLefbLfVExouDezwLnRryqoSO3YlOzvGo9FNHwM8rFHFWE1NxEIrisZcnXR8+zrOPKGefVizNiTXqzbI92C1wUIUhMK'+
                    '6+f3ZFpXRNgCeO83fkSsQUmuF/B8K13GO75Ci8M5eFIUIaVFQVamHzfe9xiMhfUkNkUrEzvdULm0fLOy7UNTXIm2taK3iP3MH7tKcbf9mOw28Fgh4WyCpLJFXyAWV2lLm0/GI3Gk5Lm16fNbEgHYpHg/Pj8pnWlz6XVevYx5OS41wbHQ60afem4J90YRnqyMd/6nRfUYHA'+
                    'G7by1RyfIkEisGv5AZIFQ2XgYRvlYmTVwJ1TfuCFcmZpHhkah2g7epZrRZ0RANR3czsF37nCbPfTxhmmGQMxEHWTvwdMQxAhtdVINm2xVu1kxK9EfWrx8e0ZvXOJwHcXeXorrZy+SJ9cPjWVHnzJFQ8oM/wToBjwdQRiDtyymN9IDE9HaRZPb9ifV/AhVr5w8Jj2/e8Klh'+
                    'U+eMMgXHTBR/guAT62xC+4FlCSlTaydk3Zed52SCM8Lsg8eHqUiRb5g/wL892v8JsAAA+sqvDde8pwAAAAASUVORK5CYII=");'+
                    'background-position: 0 0;'+
                    'background-repeat: no-repeat;'+
                    'height: 16px;'+
                    'padding-left: 16px;'+
                    'font-weight: bold;'+
                    'color: red;'+
                '}'+
                '.plugin_xgress_jarvis {'+
                    'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvRJREFUeNqkk99vFFUUx7/33rl7584MO7t2u7jQbsGllQhpsyZSFaKRxBAjU'+
                    'ZDIEwkPGsOLj/LiP9Dw5ouJPvlIohh5wPCgMZjUmiA0Qa2Sqiy026XtbvfHMNPdmTtznaqgPvck5+Ek93vO99x8DtFaYzthPFk9jK0mrbYPQ/fB1SYgXGguQbQCY0QEm6rc7weLlMSQ0oLnecA/g43/9yOpKAEotZiwJrkQhwzDPkplNBE3aydV2Lv996tU/9DBv2KNOC0'+
                    '3qQkB4gqePc9J7mRobIDafRSMibnW6sKU1snSf9dmQ6VyOhXwg9S+kPssd+y8lR/9EIXBM+qlJnAmaQTL6+f0YpiRcuh1yrmrVNRLEtUilIFUDlShYiq4u+czYRWOx7m1flJtL1lnD4+7O6uw2RhaK4utjV/nv/Fmrn1lNqzTlNs7G/WFaRWHPjNT66HCLqc48m7w4k9O+'+
                    'PLczeKrp0q88JxTkdOwiYM9uUMWqQw/tc5/GPGta98qEe0yk8LzQtEvGSd57CiXzrWHa1Fb/Tijr49cnnpj5oxwpUyiCDfvfAHf3sBeYwrNeoe0L954+8QLJw7un5g8bkE2DDzmTniqc78zu3IhzgO5I5VXaCGbH6CD+7XrMJKt/6VoYhXSsX8Ziw8Se6Nyanb264/v/bH'+
                    'wiWHZlu64936mnQDTxWNYWxncIO1ue7z+ID88n4fv5IB1gZbzG4L5xm5Zrt66cvXz71aX77xPKQXLZJy2wcWxeH/01mhx7+5xOT5k3l7zKNvxRFPCDqWAShQyXR/1q99nb83OvdPrrn2Q2uoSmjIxWt4HohhUzrngVevvWc/6c9TUNV4qZuXTk0dh2EnYaPDkI8PoXaq9Z'+
                    'ujelQxnj0BijnQQ6wi6r0MryHeYFoRvZkdIL348vrtkJcu/Z3FJs+6nvTd95V82OYVBH3KbZnG49BfXJGNDSBeDByHYFmmEH2AZeQRJnPMG3btB5F1MGUfW1DD5o1NIIdzmNVJsM/4UYABhczyLk4yHJgAAAABJRU5ErkJggg==");'+
                    'background-position: 0 0;'+
                    'background-repeat: no-repeat;'+
                    'height: 16px;'+
                    'padding-left: 16px;'+
                    'font-weight: bold;'+
                    'color: red;'+
                '}'+
                '.plugin_xgress_fracker {'+
                    'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABRFBMVEX+///+/vv///3+/v769/Xz6uX88tXty8XyvbT4+4X053/3QlPkLDfLZTooLjoeNEsdP1kvPFUkR2o1RGQ1UnZjVWBNXX86apFKapVfc'+
                    'pJ4kKn//v/9knL9hWX7dWLxa136gFn9qXfrdFLDT1WyP0mmNS+gPkGONEKNJy93LUh1Iy5eHzf8oGH7k2b5sGvrg234dW/RVFb7n2/9nH65Rz38sIvrdmLgbW/6g3b5jVb9uX3qnHLVak78w3D+yoXITkb92IS0TVOmVF2mWzzfYl76t3OgRFCLP1PovWzup2T7c1X8xpB'+
                    'HDTb61HjnYFbzZk/8yXvbVEfiZ0zRnJPKcnm+XWHFXk3PZWDom1j1m5HZf1/944vzsqTSjIX+7Jr88oiIRjTvilzggkz8+6D71ZjZs2Tp2XH75cGqaXD40Lj7/JPOlFLHtb1VAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHd'+
                    'ElNRQfgAg8QNBhMUzrFAAAAdUlEQVQY02NgQAY+IEIXwbdIBAvEQ3hACX0oS4eBwZWBwQqoAqrSnIFBjoFBMTYbplU3GGRaWpYM3LBkBl8GBlkthOm6YKsCkOzXtWZgMJRFEkiI9lRwRHGii4q2BYqAo7O6OIoAg4UoKp9BkB1NQEKCAQcAAHaAC9+tIFYpAAAAAElFTkS'+
                    'uQmCC");'+
                    'background-position: 0 0;'+
                    'background-repeat: no-repeat;'+
                    'height: 16px;'+
                    'padding-left: 16px;'+
                    'font-weight: bold;'+
                    'color: red;'+
                '}'+
                '.xgress_hover {'+
                    'color: #FFA700'+
                '}'+
                '.plugin_xgress_popup a {'+
                    'color: #FFA700'+
                '}'+
                '.plugin_xgress_canvas {'+
                    'background-color:white'+
                '}'
            ).appendTo("head");
            $('#chatall')
                .on('mouseover', '.xgress_hover', plugin.xgress.on_mouse_over)
                .on('mouseout', '.xgress_hover', plugin.xgress.on_mouse_out)
                .on('click', '.xgress_hover', plugin.xgress.on_click);

            plugin.xgress.actions = new L.LayerGroup();
            plugin.xgress.created_res = new L.LayerGroup();	
            plugin.xgress.destroyed_res = new L.LayerGroup();
            plugin.xgress.created_enl = new L.LayerGroup();	
            plugin.xgress.destroyed_enl = new L.LayerGroup();	

            window.addLayerGroup('[XG] Actions', plugin.xgress.actions, true);
            window.addLayerGroup('[XG] create by Res', plugin.xgress.created_res, true);
            window.addLayerGroup('[XG] create by Enl', plugin.xgress.created_enl, true);
            window.addLayerGroup('[XG] destroy by Res', plugin.xgress.destroyed_res, true);
            window.addLayerGroup('[XG] destroy by Enl', plugin.xgress.destroyed_enl, true);
                
            plugin.xgress.portals = new plugin.xgress.Portals();

            
            /// END map tool
        }

        plugin.xgress.storage.check();
        
        plugin.xgress.labelLayerGroup = new L.LayerGroup();
        window.addHook('mapDataRefreshStart', function () {
            if (plugin.xgress.settings.area_portals_auto) {
                if (plugin.xgress.countAreaRange() || plugin.xgress.portal_area_zoom > window.map.getZoom()) {
                    plugin.xgress.getAreaPortals();
                }
            }
            if (plugin.xgress.settings.farmload) {
                plugin.xgress.getFarmPortals();
            }
        });
        window.addHook('mapDataRefreshEnd', function () {
            if (plugin.xgress.area_portals_cache) {
                plugin.xgress.renderAreaPortals(plugin.xgress.area_portals_cache);
            }
        });

        window.addHook('portalDetailLoaded', function(data) {
            plugin.xgress.UpdatePortalDetails(data);
        });
        window.addHook('portalDetailsUpdated', function(data) {
            plugin.xgress.PortalDaysDetailsFromCache(data);
            if (plugin.xgress.settings.minifier) {
                plugin.xgress.redrawSomePortalDetails();
            }
        });
        window.addHook('publicChatDataAvailable', function(data) {
            if (plugin.xgress.settings.map_tool) {
                plugin.xgress.process_new_data(data);
            }
            plugin.xgress.process_virus(data);
        });
        if (plugin.xgress.settings.farmload) {
            window.addPortalHighlighter('Farm portals', plugin.xgress.colorFarm);
        };

        if (window.useAndroidPanes()) {
            android.addPane('plugin-xgressPlugin', 'XG Panel', 'ic_action_data_usage');
            addHook('paneChanged', plugin.xgress.onPaneChanged);
        }
        else {
            
            if (plugin.xgress.settings.map_tool) {
                $('#toolbox').after('<div id="xgress-map-tool"></div>');
                $('#xgress-map-tool').html(
                    ' <b style="color:#ffce00">Map tool </b>' +
                    ' <select id="map_tool_max_time" onchange="plugin.xgress.max_time_changed()">' +
                        '<option value=60 disabled>maximum time</option>' +
                        '<option value=5>5 mins</option>' +
                        '<option value=10>10 mins</option>' +
                        '<option value=20>20 mins</option>' +
                        '<option selected value=60>1 hour</option>' +
                        '<option value=120>2 hours</option>' +
                        '<option value=300>5 hours</option>' +
                        '<option value=1440>1 day</option>' +
                    '</select>' +
                    ' <a onclick="plugin.xgress.clear_history();">Refresh</a> '
                );
            }

            $('#toolbox').after('<div id="xgress-toolbox"></div>');

            $('#xgress-toolbox').html(
                '<b title="Xgress.com box." style="color:#ffce00">Xgress: </b>' +
                '<a onclick="plugin.xgress.rerenderMenu();" title="Searching panel">Panel</a> | ' +
                '<a onclick="plugin.xgress.setTab(3); plugin.xgress.getApGainPortals(true);" title="Click for getting portals with maximum AP">Top AP</a> | ' +
                '<a onclick="plugin.xgress.getAreaPortals();" title="Click for getting all portals on any zoom">Portals</a> | ' +
                '<a onclick="plugin.xgress.getRemovedPortalLabels();" accesskey="x" title="Removed, moved and new portals in area">RMN</a> | ' +
                '<a onclick="plugin.xgress.getFieldTestsLabels();" accesskey="x" title="Field Tests in area">FT</a> | ' +
                '<a onclick="plugin.xgress.getCellStats()" title="Display a dynamic scoreboard in the current view">Cell score</a> | ' +
                '<a onclick="plugin.xgress.getRegionScore()" title="Display scoreboard cycle/checkpoint times">Region Score</a> | ' +
                '<a onclick="plugin.xgress.getGlobalScore()" title="Display scoreboard cycle/checkpoint times">Global Score</a> | ' +
                '<a onclick="plugin.xgress.setTab(4); plugin.xgress.renderSettingsPanel()" title="Plugin">Settings</a> | ' +
                '<a onclick="plugin.xgress.planOpt();" title="Bookmarked portals">Bookmarks</a> | ' +
                '<a onclick="plugin.xgress.about();" title="About plugin">About</a> | '
            );

            // both chats
            var chat_panel = document.getElementById('chatcontrols');

            var full_chat = '<a accesskey="4" title="[4]">both</a>';

            $(chat_panel).append(full_chat);

            var chat_text = document.getElementById('chat');
            $(chat_text).append('<div id="chatboth"></div>');

            window.chat.chooseTab = function(tab) {
              if (tab != 'all' && tab != 'faction' && tab != 'alerts' && tab != 'both') {
                console.warn('chat tab "'+tab+'" requested - but only "all", "faction" and "alerts" are valid - assuming "all" wanted');
                tab = 'all';
              }

              var oldTab = chat.getActive();

              localStorage['iitc-chat-tab'] = tab;

              var mark = $('#chatinput mark');
              var input = $('#chatinput input');

              $('#chatcontrols .active').removeClass('active');
              $("#chatcontrols a:contains('" + tab + "')").addClass('active');

              if (tab != oldTab) startRefreshTimeout(0.1*1000); //only chat uses the refresh timer stuff, so a perfect way of forcing an early refresh after a tab change

              $('#chat > div').hide();

              var elm;

              switch(tab) {
                case 'faction':
                  input.css('color', '');
                  mark.css('color', '');
                  mark.text('tell faction:');

                  chat.renderFaction(false);
                  break;

                case 'all':
                  input.css('cssText', 'color: #f66 !important');
                  mark.css('cssText', 'color: #f66 !important');
                  mark.text('broadcast:');

                  chat.renderPublic(false);
                  break;

                case 'alerts':
                  mark.css('cssText', 'color: #bbb !important');
                  input.css('cssText', 'color: #bbb !important');
                  mark.text('tell Jarvis:');

                  chat.renderAlerts(false);
                  break;

                case 'both':
                  mark.css('cssText', 'color: #bbb !important');
                  input.css('cssText', 'color: #bbb !important');
                  mark.text('tell Jarvis:');

                  plugin.xgress.getBothChat();
                  break;

                default:
                  throw('chat.chooser was asked to handle unknown button: ' + tt);
              }

              var elm = $('#chat' + tab);
              elm.show();

              if(elm.data('needsScrollTop')) {
                elm.data('ignoreNextScroll', true);
                elm.scrollTop(elm.data('needsScrollTop'));
                elm.data('needsScrollTop', null);
              }
            }


              $('#chatcontrols a').each(function(ind, elm) {
                if($.inArray($(elm).text(), ['all', 'faction', 'alerts', 'both']) !== -1)
                  $(elm).click(window.chat.chooser);
              });

             $('#chatboth').scroll(function() {
                var t = $(this);
                if(t.data('ignoreNextScroll')) return t.data('ignoreNextScroll', false);
                if(t.scrollTop() < CHAT_REQUEST_SCROLL_TOP) plugin.xgress.getBothChat(true);
              });

              // end both chats

        }
    }

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
