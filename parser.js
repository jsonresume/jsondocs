#!/usr/bin/env node

var _ = require('lodash');
var fs  = require('fs');


var file = process.argv[2];
if(!file) {
	console.log('No json schema file specified');
	return;
}
var schema = JSON.parse(fs.readFileSync(file, 'utf8'));

if(!schema){
	console.log('Not a valid json schema');
	return;
}
var propertyOpenHTML = function(property, propertyName, first, last) {
	var comma = ',';
	if(last) {
		comma = '';
	}
	var html;
	var description = property.description || '';
	if(description.length !== 0) {
		description = '// ' + description;
	}
	if(propertyName) {
		html = '<div class="property"><span class="name">' + propertyName + '</span>: ';
 	} else {
		html = '<div class="property">';
 	}
	if(property.type === 'object') {
		html += '<span class="type">{</span> <span class="description">'+description+'</span>';

	} else if (property.type ==='array' && property.items.type ==='object') {
		html += '<span class="type">[{</span> <span class="description">'+description+'</span>';
	} else if (property.type ==='array') {
		html += '<span class="type">[</span> <span class="description">'+description+'</span>';

	} else {
		html += '<span class="type">' + property.type + '</span>'+comma+' <span class="description">'+description+'</span>';
	}
	return html;
}
var propertyCloseHTML = function(property, propertyName, first, last) {
	var html = '';
	var comma = ',';
	if(last) {
		comma = '';
	}
	if(property.type === 'object') {
		html += '<span class="type">}'+comma+'</span>';
	};
	if (property.type ==='array' && property.items.type ==='object') {
		html += '<span class="type">}]'+comma+'</span>';
	} else if(property.type === 'array') {
		html += '<span class="type">]'+comma+'</span>';
	};
	html += '</div>'
	return html;
}
var parseProperty = function (property) {
	var properties = [];
	_.each(property.properties, function(nestedProperty, key){
		properties.push({property: nestedProperty, key: key});

	});
	if(property.items) {
		if(property.items.properties) {
			_.each(property.items.properties, function(nestedItemProperty, key){
				properties.push({property: nestedItemProperty, key: key});
			})	
		} else {
			properties.push({property: property.items, key: null});

		}
	}

	_.each(properties, function(property, index){
	
		var last = (index+1 === properties.length ? true : false);
		var first = (index === 0 ? true : false);
		html += propertyOpenHTML(property.property, property.key, first, last);
		parseProperty(property.property);
		html += propertyCloseHTML(property.property, property.key, first, last);

	});
};

// Start building the html string
var html = '<div class="json-schema">';
html += '<div class="property"><span class="type">{</span>';
parseProperty(schema);
html += '<span class="type">}</span></div>';
html += '</div>';
// Finished
fs.writeFileSync(file + '.html', html);


