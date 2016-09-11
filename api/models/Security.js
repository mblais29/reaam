/**
 * Security.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	securityId:{
		type: 'string',
		primaryKey: true,
		required: true,
		unique: true,
    	size: 64
	},
	securityName:{
		type: 'string',
		required: true,
    	size: 64
	},
	description: {
		type: 'text',
		size: 4000
	}
  }
};

