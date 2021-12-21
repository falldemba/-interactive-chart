const DUMMY_DATA = [
    { id: 'd1', region: 'USA', value: 10 },
    { id: 'd2', region: 'India', value: 12 },
    { id: 'd3', region: 'China', value: 11 },
    { id: 'd4', region: 'Germany', value: 6 },
    { id: 'd5', region: 'Senegal', value: 16 },
    { id: 'd6', region: 'France', value: 46 },
    { id: 'd7', region: 'Suisse', value: 36 }
];

const MARGIN = { top: 20, bottom: 10 }
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

let selectedData = DUMMY_DATA

const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGIN.top + MARGIN.bottom);
x.domain(DUMMY_DATA.map((d) => d.region));
y.domain([0, d3.max(DUMMY_DATA, d => d.value) + 3]);

const chart = chartContainer.append('g');

chart.append('g').call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#4f009e')

function renderChart() {
    chart
        .selectAll('.bar')
        .data(selectedData, data => data.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x.bandwidth)
        .attr('height', data => CHART_HEIGHT - y(data.value))
        .attr('x', data => x(data.region))
        .attr('y', data => y(data.value))

    chart
        .selectAll('.bar')
        .data(selectedData, data => data.id)
        .exit()
        .remove()

    chart.selectAll('.label').data(selectedData, data => data.id)
        .enter()
        .append('text')
        .text((data) => data.value)
        .attr('x', data => x(data.region) + x.bandwidth() / 2)
        .attr('y', data => y(data.value) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true)

    chart
        .selectAll('.label')
        .data(selectedData, data => data.id)
        .exit()
        .remove()
}
renderChart()
let unselectedIds = []

const listItemes = d3
    .select('#data')
    .select('ul')
    .selectAll('li')
    .data(DUMMY_DATA)
    .enter()
    .append('li')
listItemes
    .append('span')
    .text(data => data.region)
listItemes
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('click', (data) => {
        if (unselectedIds.indexOf(data.id) === -1) {
            unselectedIds.push(data.id)
        } else {
            unselectedIds = unselectedIds.filter(id => id !== data.id)
        }
        selectedData = DUMMY_DATA.filter((d) => unselectedIds.indexOf(d.id) === -1)
        renderChart()
    })