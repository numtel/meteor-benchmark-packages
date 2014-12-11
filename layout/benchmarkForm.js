var ERR_VAR = 'benchmarkError';
Session.setDefault(ERR_VAR, '');

Template.benchmarkForm.helpers({
  testCases: function(){
    return Benchmark._loaded.map(function(def, index){
      return {
        index: index,
        label: def._label
      };
    });
  },
  error: function(){
    return Session.get(ERR_VAR);
  }
});

var setCase = function(index){
  var $options = $('#benchmark textarea[name=options]');
  var newVal = Benchmark._loaded[index]._default ||
                { "count": 100, "sampleSize": 1 };
  if(typeof newVal !== 'string') newVal = JSON.stringify(newVal);
  $options.val(newVal);
};

Template.benchmarkForm.rendered = function(){
  setCase($('#benchmark select[name=testCase]').val());
};

Template.benchmarkForm.events({
  'change select[name=testCase]': function(e){
    setCase($(e.target).val());
  },
  'submit form': function(e){
    e.preventDefault();
    var $f = $(e.target);
    var $submitButton = $f.find('button');

    var testIndex = $f.find('select[name=testCase]').val();
    var test = Benchmark._loaded[testIndex];

    try{
      var options = JSON.parse($f.find('textarea[name=options]').val());
    }catch(err){
      return Session.set(ERR_VAR, 'Invalid JSON.');
    }

    Session.set(ERR_VAR, '');

    $submitButton.attr('disabled', 'disabled');
    Benchmark.runTest(test, options).then(function(results){
      console.log('Benchmark Results', results);
      createGraph(results, test);
      $submitButton.removeAttr('disabled');
    });
  }
});
