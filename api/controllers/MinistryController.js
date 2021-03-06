/**
 * MinistryController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MinistryController)
   */
  _config: {},

  edit: function (req, res) {
    Ministry.findOne(req.param('id'), function foundMinistry(err, ministry) {
      if (err) res.send(err, 500);

      var uploadForm = S3Upload.prepare('images/ministry/tmp');

      return res.view({
        ministry: ministry,
        s3form: uploadForm
      });
    });
  },

  team: function(req, res) {
    ministryId = req.param('id') || req.session.ministry;
    User.find({ ministry: ministryId }).exec(function(err, users) {
      return res.send(users);
    });
  }

};
