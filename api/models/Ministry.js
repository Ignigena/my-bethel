/**
 * Ministry
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    name: {
      type: 'string'
    },

    description: {
      type: 'text'
    },

    temporaryImage: {
      type: 'string'
    },

    image: {
      type: 'string'
    },

    color: {
      type: 'string'
    },

  	users: {
      collection: 'user',
      via: 'ministry'
    },

    media: {
      collection: 'media',
      via: 'ministry'
    },

    podcasts: {
      collection: 'podcast',
      via: 'ministry'
    },

    locations: {
      collection: 'location',
      via: 'ministry'
    }
    
  },

  beforeUpdate: function(values, next) {
    if (values.temporaryImage) {
      values.image = S3Upload.removeTemp('images/ministry', values.temporaryImage, values.id);
      delete values.temporaryImage;
    }

    next();
  },

};
