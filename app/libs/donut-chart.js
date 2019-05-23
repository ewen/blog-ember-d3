import { select, event } from 'd3-selection';
import { arc } from 'd3-shape';

// A class to create and update a D3 donut chart.
class DonutChart {
  // Initial set up, pass anything from the component that D3 requires to
  // create the chart.
  constructor (container, sendAction, options) {

    const defaults = {
      width: 250,
      height: 250,
      margin: 10
    };

    const {height, width, margin} = Object.assign(defaults, options);

    this.svgContainer = select(container)
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    const transform = `translate(${width / 2}, ${height / 2})`;

    this.passedPath = this.svgContainer
      .append('path')
      .attr('transform', transform)
      .attr('class', 'passed-2')
      .on('click', () => sendAction('clickPassed')) // Send an action back to the component.
      .on('mousedown', () => event.preventDefault());

    this.failedPath = this.svgContainer
      .append('path')
      .attr('transform', transform)
      .attr('class', 'failed-2')
      .on('click', () => sendAction('clickFailed'))
      .on('mousedown', () => event.preventDefault());

    this.arc = arc()
      .outerRadius((width - (margin) * 2) / 2)
      .innerRadius(70);

    const textContainer = this.svgContainer
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', transform);

    this.totalText = textContainer
      .append('tspan')
      .attr('font-size', 40)
      .attr('font-weight', 600);

    textContainer
      .append('tspan')
      .attr('font-size', 16)
      .attr('x', 0)
      .attr('dy', '1.5em')
      .text('Total');
  }

  // Pass data to update the chart with.
  update (numberPassed, numberFailed) {
    const totalNumber = numberPassed + numberFailed;

    const passedArcFunction = this.arc
      .startAngle(0)
      .endAngle((Math.PI * 2) * (numberPassed / totalNumber));
    this.passedPath.attr('d', passedArcFunction());

    const failedArcFunction = this.arc
      .startAngle((Math.PI * 2) * (numberPassed / totalNumber))
      .endAngle(Math.PI * 2);
    this.failedPath.attr('d', failedArcFunction());

    this.totalText.text(totalNumber);
  }
}

export default DonutChart;
