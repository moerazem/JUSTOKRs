import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['sparkline'],
  didInsertElement: function(){
    var data = this.get('controller.horizonHistory');
    $.fn.sparkline.defaults.common.width = '100';
    $.fn.sparkline.defaults.common.height = '30';
    $.fn.sparkline.defaults.common.lineColor = 'gray';
    $.fn.sparkline.defaults.common.fillColor = '#e5e5e5';
    $.fn.sparkline.defaults.line.spotColor = false;
    $.fn.sparkline.defaults.line.minSpotColor = false;
    $.fn.sparkline.defaults.line.maxSpotColor = false;
    $.fn.sparkline.defaults.line.disableInteraction = true;
    $.fn.sparkline.defaults.line.chartRangeMin = '0';
    this.$().attr('values', data);
    this.$().sparkline();  // tell sparkline to do it's thing
  }
});
