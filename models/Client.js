var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Client Model
 * ==========
 */

var Client = new keystone.List('Client');

Client.add({
	name: {type: Types.Name, required: true, initial: true},
	category: {type: Types.Relationship, ref: "Category", many: true}
});


/**
 * Registration
 */

Client.defaultColumns = 'name, category';
Client.register();