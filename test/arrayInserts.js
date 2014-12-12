var myArr = [];

var genCase = function(eachFun){
  return {
    run: function(options, done){
      for(var i = 0; i < options.count; i++){
        eachFun(String(Math.random() * 10000));
      }
      done();
    },
    reset: function(options, done){
      myArr.splice(0, myArr.length);
      done();
    }
  };
};

Benchmark.addCase({
  _label: 'Array inserts',
  _value: 'rate',
  _default: {
    count: 60000,
    sampleSize: 2
  },
  'push': genCase(function(val){ myArr.push(val); }),
  'by-index-end': genCase(function(val){ myArr[myArr.length] = val; }),
  'unshift': genCase(function(val){ myArr.unshift(val); }),
  'splice-beginning': genCase(function(val){ myArr.splice(0, 0, val); }),
  'splice-end': genCase(function(val){ myArr.splice(myArr.length, 0, val); })
});
