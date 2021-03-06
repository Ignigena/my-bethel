/**
 * LocationController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  ministry: function(req, res) {
    var findById = req.param('id');

    if (!findById && req.session.ministry) {
      findById = req.session.ministry;
    }

    if (!findById)
      return res.forbidden('You must be logged in.');

    Location.find({ministry: findById}, function foundLocations(err, locations) {
      if (err) return res.serverError(err);

      Location.watch(req);
      Location.subscribe(req, _.pluck(locations, 'id'));

      res.send(locations);
    });
  },

  map: function(req, res) {
    var lat = parseFloat(req.param('lng')),
        lng = parseFloat(req.param('lat')),
        rad = parseFloat(req.param('radius'));

    if (!lat || !lng || !rad) {
      return res.send(404);
    }

    Location.native(function (err, collection) {
      sails.log.info('Searching '+lat+','+lng+' with radius of '+rad+' kilometers.');

      collection.geoNear(lat, lng, {
        maxDistance: rad / 6371,
        distanceMultiplier: 6371,
        spherical: true
      }, function (mongoErr, docs) {
        if (mongoErr) return res.send(mongoErr, 500);
        var ministries = [];

        _.each(docs.results, function(location) {
          ministries.push({_id: location.obj.ministry});
        });

        if (!ministries.length)
          return res.send({locations: docs.results}, 200);

        Ministry.find({
          or: ministries
        }).done(function(err, foundMinistries) {
          ministries = {};
          _.each(foundMinistries, function(ministry) {
            ministries[ministry.id] = ministry;
          })
          res.send({locations: docs.results, ministries: ministries}, 200);
        });
      });
    });
  },

  show: function (req, res) {
    Location.findOne(req.param('id'), function foundLocation(err, location) {
      if (err) return res.serverError(err);
      if (!location) return res.notFound();

      res.send(200, location);
    });
  }

};
