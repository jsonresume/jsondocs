var _ = require('lodash');
var fs  = require('fs');

var schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));

console.log(schema);

var html = '';//'<style>.property {  font-family: Verdana; padding: 10px 10px 10px 20px;}.type{font-weight: bold;}.description { font-size: 10px; color: #ccc;}</style>';
var propertyOpenHTML = function(property, propertyName, first, last) {
	var comma = ',';
	if(last) {
		comma = '';
	}
	var html;
	var description = property.description || 'No description';
	if(propertyName) {
		html = '<div class="property"><span class="name">' + propertyName + '</span>: ';
 	} else {
		html = '<div class="property">';
 	}
	if(property.type === 'object') {
		html += '<span class="type">{</span> <span class="description">// '+description+'</span>';

	} else if (property.type ==='array') {
		html += '<span class="type">[</span> <span class="description">// '+description+'</span>';

	} else {
		html += '<span class="type">' + property.type + '</span>'+comma+' <span class="description">// '+description+'</span>';
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
	if(property.type === 'array') {
		html += '<span class="type">]'+comma+'</span>';
	};
	html += '</div>'
	return html;
}
var parseProperty = function (property) {
	console.log(property.properties && property.properties.length);
	var properties = [];
	_.each(property.properties, function(nestedProperty, key){
		properties.push({property: nestedProperty, key: key});

	});
	if(property.items) {
		if(property.items.properties) {
			_.each(property.items.properties, function(nestedItemProperty, key){
				properties.push({property: nestedItemProperty, key: key});
				//html += propertyOpenHTML(nestedItemProperty, key);
				//parseProperty(nestedItemProperty);
				//html += propertyCloseHTML(nestedItemProperty, key);
			})	
		} else {
			properties.push({property: property.items, key: null});

		}
	}

	_.each(properties, function(property, index){
	
		var last = (index+1 === properties.length ? true : false);
		var first = (index === 0 ? true : false);
		console.log(first, last);
		html += propertyOpenHTML(property.property, property.key, first, last);
		parseProperty(property.property);
		html += propertyCloseHTML(property.property, property.key, first, last);

	});
};
html += '<div class="property"><span class="type">{</span>';

parseProperty(schema);
html += '<span class="type">}</span></div>';


fs.writeFileSync('test.html', html);