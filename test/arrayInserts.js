var myArray = [];

var resetArray = function(options, done){
  myArray.splice(0, myArray.length);
  done();
};

var repeatRandomString = function(eachFun){
  return function(options, done){
      for(var i = 0; i < options.count; i++){
        eachFun(String(Math.random() * 10000));
      }
      done();
    };
};

Benchmark.addCase({
  _label: 'Array inserts',
  _value: 'rate',
  _default: {
    count: 50000,
    sampleSize: 4
  },
  'push': {
    run: repeatRandomString(function(val){ myArray.push(val); }),
    reset: resetArray
  },
  'by-index': {
    run: repeatRandomString(function(val){ myArray[myArray.length] = val; }),
    reset: resetArray
  },
  'unshift': {
    run: repeatRandomString(function(val){ myArray.unshift(val); }),
    reset: resetArray
  },
  'splice': {
    run: repeatRandomString(function(val){ myArray.splice(0, 0, val); }),
    reset: resetArray
  }
});
