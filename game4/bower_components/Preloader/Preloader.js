/**
 * @preserve Class for loading assets (images, sound, video, json, jsonp, javascript, css)
 * Provides an x out of y value and a percentage on progress
 * And lets you know when everything is done
 * Great for preloading all game assets
 * 
 * Requires MooTools and MooTools More (Assets, Reqest.JSONP)
 * 
 * Copyright Oliver Caldwell 2011 (olivercaldwell.co.uk)
 */
var Preloader = new Class({
	Implements: [Options, Events],
	options: {
		images: {},
		sounds: {},
		videos: {},
		json: {},
		jsonp: {},
		scripts: {},
		stylesheets: {}
	},
	initialize: function(options) {
		this.setOptions(options);
	},
	load: function() {
		// Initialise variables
		var assetCount = 0,
			completedCount = 0,
			startTime = new Date().getTime(),
			loaded = {
				images: {},
				sounds: {},
				videos: {},
				json: {},
				jsonp: {},
				scripts: {},
				stylesheets: {}
			},
			handleProgress = function() {
				completedCount += 1;
				this.fireEvent('progress', [completedCount, assetCount, 100 / assetCount * completedCount]);
				
				if(completedCount === assetCount) {
					this.fireEvent('complete', [loaded, assetCount, new Date().getTime() - startTime]);
				}
			}.bind(this);
		
		// Fire the start event
		this.fireEvent('start', [assetCount]);
		
		// Count all items
		Object.each(this.options, function(assetObject) {
			assetCount += Object.getLength(assetObject);
		});
		
		// Load images
		Object.each(this.options.images, function(path, name) {
			loaded.images[name] = Asset.image(path, {
				onLoad: handleProgress
			});
		});
		
		// Load sounds
		Object.each(this.options.sounds, function(path, name) {
			loaded.sounds[name] = new Element('audio');
			loaded.sounds[name].addEventListener('canplaythrough', handleProgress, false);
			loaded.sounds[name].set('src', path);
			loaded.sounds[name].load();
		});
		
		// Load videos
		Object.each(this.options.videos, function(path, name) {
			loaded.videos[name] = new Element('video');
			loaded.videos[name].addEventListener('canplaythrough', handleProgress, false);
			loaded.videos[name].set('src', path);
			loaded.videos[name].load();
		});
		
		// Load JSON
		Object.each(this.options.json, function(settings, name) {
			var request = new Request.JSON((typeof settings === 'object') ? settings : {url:settings});
			
			request.addEvent('success', function(loadedJson) {
					loaded.json[name] = loadedJson;
					handleProgress();
			});
			
			request.send();
		});
		
		// Load JSONP
		Object.each(this.options.jsonp, function(settings, name) {
			var request = new Request.JSONP((typeof settings === 'object') ? settings : {url:settings});
			
			request.addEvent('success', function(loadedJson) {
					loaded.jsonp[name] = loadedJson;
					handleProgress();
			});
			
			request.send();
		});
		
		// Load scripts
		Object.each(this.options.scripts, function(path, name) {
			loaded.scripts[name] = Asset.javascript(path, {
				onLoad: handleProgress
			});
		});
		
		// Load stylesheets
		Object.each(this.options.stylesheets, function(path, name) {
			loaded.stylesheets[name] = Asset.css(path);
			handleProgress();
		});
	}
});