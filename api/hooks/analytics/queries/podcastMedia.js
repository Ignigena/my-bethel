const _ = require('lodash');

module.exports = {
  index: 'podcast.media',
  ministry: null,
  process: function(records, res) {

    PodcastMedia.find({ ministry: this.ministry }).then(function(allMedia) {
      var top = [];
      _.each(records.aggregations.topEpisodes.buckets, function(episode) {
        if (episode.key == 'mp3' || episode.key == 'mp4') return;
        var mediaRecord = _.find(allMedia, function(media) {
          return media.id == episode.key.replace(/\.\w{3}/g, '');
        });
        if (!mediaRecord) return;
        mediaRecord.hits = episode.doc_count;
        top.push(mediaRecord);
      });

      var medium = {}, total = 0;
      _.each(records.aggregations.medium.buckets, function(count) {
        medium[count.key] = count.doc_count;
        total += count.doc_count;
      });

      return res.json({
        topEpisodes: top,
        medium: medium
      });
    });
  },
  required: ['ministryId', 'start', 'end'],
  rawQuery: function(ministryId, startDate, endDate) {
    this.ministry = ministryId;
    return {
      size: 0,
      query: {
        filtered: {
          query: {
            term: {
              ministry: ministryId
            }
          },
          filter: {
            range: {
              timestamp: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      },
      aggs: {
        medium: {
          terms: {
            field: 'properties.medium'
          }
        },
        topEpisodes: {
          terms: {
            field: 'object'
          }
        }
      }
    };
  }
};
