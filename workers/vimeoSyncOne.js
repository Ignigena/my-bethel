module.exports.run = function(cb, podcast) {
  VimeoStorageSync.syncOne(podcast).then(cb);
}
