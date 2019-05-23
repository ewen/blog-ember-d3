import Component from '@ember/component';
import { computed } from '@ember/object';
import { arc } from 'd3-shape';

export default Component.extend({
  width: 250,
  height: computed.alias('width'),
  margin: 10,

  // Initial values, when these are bound to an input in the template they are
  // returned as strings, which is why I prefer to keep them as strings and
  // use the computed properties below to convert them into number types.
  passedValue: '10',
  failedValue: '2',

  // Wrap these in computed properties to convert them from strings to ints.
  numberPassed: computed('passedValue', function () {
    return Number.parseInt(this.passedValue, 10);
  }),
  numberFailed: computed('failedValue', function () {
    return Number.parseInt(this.failedValue, 10);
  }),

  totalNumber: computed('numberPassed', 'numberFailed', function () {
    return this.numberPassed + this.numberFailed;
  }),

  outerRadius: computed('width', 'margin', function () {
    return (this.width - (this.margin) * 2) / 2;
  }),
  innerRadius: 70,

  transform: computed('width', 'height', function () {
    return `translate(${this.width / 2}, ${this.height / 2})`;
  }),

  // Arc function for the passed tests.
  passedArc: computed('numberPassed', 'totalNumber', 'outerRadius', 'innerRadius', function () {
    const arcFunction = arc()
      .outerRadius(this.outerRadius)
      .innerRadius(this.innerRadius)
      .startAngle(0)
      .endAngle((Math.PI * 2) * (this.numberPassed / this.totalNumber));
    return arcFunction();
  }),

  failedArc: computed('numberPassed', 'totalNumber', 'outerRadius', 'innerRadius', function () {
    const arcFunction = arc()
      .outerRadius(this.outerRadius)
      .innerRadius(this.innerRadius)
      .startAngle((Math.PI * 2) * (this.numberPassed / this.totalNumber))
      .endAngle(Math.PI * 2);
    return arcFunction();
  }),

  actions: {
    clickPassed () {
      this.set('passedValue', (this.numberPassed + 1).toString());
    },
    clickFailed () {
      this.set('failedValue', (this.numberFailed + 1).toString());
    },
    noop () {}
  }
});
