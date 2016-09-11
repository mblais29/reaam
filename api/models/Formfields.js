/**
 * Formfields.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	formFldsId: {
		type: 'integer',
		primaryKey: true,
    	required: true,
    	unique: true,
    	autoIncrement: true,
	},
	formId: {
		type: 'integer',
		required: true,
		tableName: 'forms'
	},
	collection: {
		type: 'string',
		required: true,
		size: 64
	},
	columnName: {
		type: 'string',
		required: true,
		size: 64
	},
	description: {
		type: 'text',
		size: 4000
	},
	type: {
		type: 'string',
		size: 64,
		enum: ['string', 'text', 'integer', 'float', 'date', 'datetime', 'boolean', 'binary', 'array', 'json', 'mediumtext', 'longtext', 'objectid']
	}
  }
};

