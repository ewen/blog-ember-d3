import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import DonutChart from 'blog-ember-d3/libs/donut-chart';

export default Component.extend({
  componentClass: 'donut-chart',

  // Dimensions.
  width: 250,
  height: computed.alias('width'),
  margin: 10,

  // Initial values.
  passedValue: '34',
  failedValue: '21',

  // Wrap these in computed properties to convert them from strings to ints.
  numberPassed: computed('passedValue', function () {
    return Number.parseInt(this.passedValue, 10);
  }),
  numberFailed: computed('failedValue', function () {
    return Number.parseInt(this.failedValue, 10);
  }),

  // After the component has been created in the DOM
  didInsertElement () {
    this._super(...arguments);

    // Grab the DOM element and create the chart.
    const container = this.element.querySelector(`.${this.componentClass}`);

    // This is what we'll use to send actions from the D3 chart Class back to
    // the component actions. It's important to bind it to "this" so that the
    // actions have the correct context when the run.
    const sendAction = this.send.bind(this);

    // Create the chart.
    const chart = new DonutChart(container, sendAction, {
      height: this.height,
      width: this.width,
      margin: this.margin
    });
    this.set('chart', chart);

    // Run an initial update on the chart with the data.
    chart.update(this.numberPassed, this.numberFailed);

    // *** Bonus feature ***
    // You can use a pattern like this if you need to update the chart on
    // browser window resizing. It will wait for the size to stabilise for
    // 500ms so it only runs once the user has stopped dragging the window.
    let resizeId;
    window.addEventListener('resize', () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(() => {
        chart.update(this.numberPassed, this.numberFailed);
      }, 500)
    });
  },

  // Set up an observer here to detect any changes to the data, and tell the
  // chart to update. The linter doesn't like the use of an observer although
  // it seems like a legitimate use case to me (perhaps using an action on
  // the template would be better). One advantage of an observer is it would
  // require no change if the "numberPassed" and "numberFailed" properties were
  // switched to being passed in rather than modified within the component.
  // eslint-disable-next-line ember/no-observers
  changeObserver: observer('numberPassed', 'numberFailed', function () {
    this.chart.update(this.numberPassed, this.numberFailed);
  }),

  actions: {
    // Actions to run when the chart is clicked.
    clickPassed() {
      this.set('passedValue', (this.numberPassed + 1).toString());
    },
    clickFailed() {
      this.set('failedValue', (this.numberFailed + 1).toString());
    }
  }
});
