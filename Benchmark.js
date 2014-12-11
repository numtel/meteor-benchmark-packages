Benchmark = { _loaded: [] };

Benchmark.addCase = function(def){
  Benchmark._loaded.push(def);
}

Session.setDefault('benchmarkProgress', 0);
var progress = 0, progressMajor = 0, majorSize;
var setProgress = function(value, isMajor){
  if(isMajor){
    progress = progressMajor = value;
  } else{
    progress = progressMajor + (majorSize * value / 100);
  }
  Session.set('benchmarkProgress', progress);
}

// @return Promise
// @param {object} test - Description of test case
// @param {[string]} options.methods - Which methods to run (Default: all)
// @param {int} options.count - number of rows/docs to insert (Default: 1)
// @param {int} options.sampleSize - how many times to run each method (Default: 1)
Benchmark.runTest = function(test, options){
  var results = {};
  options = _.clone(options) || {};
  options.methods = options.methods instanceof Array ? options.methods : 
    _.filter(_.keys(test), function(methodName){
      return methodName.substr(0, 1) !== '_';
    });
  options.count = options.count || 1;
  options.sampleSize = options.sampleSize || 1;

  var runMethods = [], methodCount, doneCount = 0;
  var sampleSize = options.sampleSize;
  while(sampleSize--){
    runMethods = runMethods.concat(_.clone(options.methods));
  }
  methodCount = runMethods.length;
  majorSize = (1 / methodCount) * 100; // For progress bar
  
  return new Promise(function(fulfill, reject){
    var nextMethod = function(result){
      if(result){
        if(!(result.name in results)) results[result.name] = [];
        results[result.name].push(result);
      }

      if(runMethods.length === 0){
        setProgress(0, true);
        return fulfill(results);
      }
      var methodName = runMethods.shift();
      setProgress(Math.round(doneCount / methodCount * 100), true);
      doneCount++;
      Meteor.setTimeout(function(){
        executeMethod(test[methodName], methodName, options, nextMethod);
      }, 0);
    };
    nextMethod();
  });
}


var executeMethod = function(method, methodName, options, fulfill){
  var startTime = Date.now();
  var doneTime;
  var result = {
    name: methodName,
    count: options.count
  };
  var initDone = function(){
    // After initial reset, run test
    method.run(options, done);
  };
  var done = function(part){
    if(part){
      result[part] = Date.now() - startTime;
    }else{
      // Record duration of test
      doneTime = Date.now();
      result.time =  doneTime - startTime;
      result.rate = result.count / (result.time / 1000);
      result.rate = Math.floor(result.rate * 100) / 100;
      setProgress(50);
      method.reset(options, resetDone);
    }
  };
  var resetDone = function(){
    // Record duration of cleanup
    result.resetTime = Date.now() - doneTime;
    fulfill(result)
  };
  // Begin by resetting the data
  method.reset(options, initDone);
};

