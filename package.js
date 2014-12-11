Package.describe({
  name: 'numtel:benchmark-packages',
  summary: 'Perform benchmarks in meteor --test-packages',
  version: '0.0.1',
  git: 'https://github.com/numtel/meteor-benchmark-packages.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.use([
    'less',
    'session',
    'templating',
    'jquery',
    'keyboardjs:keyboardjs@0.4.2_1',
    'd3js:d3@3.4.13',
    'clinical:nvd3@0.0.3'
  ]);
  api.addFiles([
    'promise-6.0.0.min.js',
    'Benchmark.js',
    'layout/benchmarkForm.html',
    'layout/benchmarkForm.js',
    'layout/graph.js',
    'layout/index.html',
    'layout/index.js',
    'layout/index.less'
  ], 'client');
  api.export('Benchmark', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('numtel:benchmark-packages');
  api.addFiles('test/example.js');
  api.addFiles([
    'test/arrayInserts.js'
  ], 'client');
});
