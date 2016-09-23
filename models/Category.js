var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Category Model
 * ==========
 */

var Category = new keystone.List('Category');

Category.add({
	name: {type: String, required: true, initial: true},
});


/**
 * Registration
 */

Category.defaultColumns = 'name';
Category.register();