/**
 * Forms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	formId: {
		type: 'integer',
		primaryKey: true,
    	autoIncrement: true,
	},
	formName: {
		type: 'string',
		required: true,
    	size: 64
	},
	collection: {
		type: 'string',
		required: true,
		size: 64
	},
	description: {
		type: 'text',
		size: 4000
	},
	security: {
		type: 'string',
		size: 64,
		tableName: 'security'
	}
  }
};

