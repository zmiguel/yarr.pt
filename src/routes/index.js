var express = require('express');
var router = express.Router();
var prometheus = require('prometheus-query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yarr | Home', home: true });
});

/* GET info page. */
router.get('/info', function(req, res, next) {
  res.render('info', { title: 'Yarr | Info', info: true});
});

/* GET tos page. */
router.get('/tos', function(req, res, next) {
  res.render('tos', { title: 'Yarr | ToS', tos: true});
});

/* GET stats page. */
router.get('/stats', function(req, res, next) {
  let tracker_stats = {};
  const prom = new prometheus.PrometheusDriver({
    endpoint: "http://tracker-prometheus:9090",
    baseURL: "/api/v1" // default value
  });
  prom.instantQuery('avg(chihaya_storage_infohashes_count)')
    .then((result) => {
      const resp = result.result;
      tracker_stats.hashes = Math.round(resp.value.value);

      prom.instantQuery('avg(chihaya_storage_seeders_count)')
        .then((result) => {
          const resp = result.result;
          tracker_stats.seed = Math.round(resp.value.value);

          prom.instantQuery('avg(chihaya_storage_leechers_count)')
            .then((result) => {
              const resp = result.result;
              tracker_stats.leech = Math.round(resp.value.value);
              tracker_stats.peer = tracker_stats.seed + tracker_stats.leech;
              res.render('stats', { title: 'Yarr | Stats', stats: true, data: tracker_stats});
            })
            .catch(console.error);

        })
        .catch(console.error);

    })
    .catch(console.error);

  
  res.render('stats', { title: 'Yarr | Stats', stats: true, data: tracker_stats});
});

module.exports = router;
