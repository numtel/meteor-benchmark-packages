var VIS_VAR = 'benchmarkVisible';
Session.setDefault(VIS_VAR, false);

Template.benchmarkOverlay.rendered = function(){
  var toggle = function(){ Session.set(VIS_VAR, !Session.get(VIS_VAR)); };
  $('#benchmark-toggle')
    .detach().appendTo('.navbar-fixed-bottom  form.pull-right')
    .on('click', toggle);
  KeyboardJS.on('f2', toggle);
};

Template.benchmarkOverlay.helpers({
  hidden: function(){
    return Session.get(VIS_VAR) ? '' : ' hidden '
  }
});

Template.benchmarkToggle.helpers({
  active: function(){
    return Session.get(VIS_VAR) ? ' active ' : ''
  }
});

Template.benchmarkProgress.helpers({
  width: function(){ return Session.get('benchmarkProgress'); }
});
