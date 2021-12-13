import { getInput, readInput } from '../common/util';

function median(values: number[]) {
    if (values.length === 0) throw new Error('No inputs');

    values.sort(function (a, b) {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return Math.floor((values[half - 1] + values[half]) / 2.0);
}

function calcCrabFuel(start: number, end: number) {
    const n = Math.abs(start - end);
    return (n * (n + 1)) / 2;
}

function calcFuel(positions: number[], newPos: number) {
    return positions.reduce((fuel, pos) => fuel + calcCrabFuel(pos, newPos), 0);
}

(async function main() {
    const crabPositions = (await readInput(__dirname))[0].split(',').map(Number);

    const avg = crabPositions.reduce((sum, pos) => sum + pos, 0) / crabPositions.length;

    const [min, max] = [Math.min(...crabPositions), Math.max(...crabPositions)];

    const allCosts = [];
    for (let pos = min; pos <= max; ++pos) {
        allCosts.push(calcFuel(crabPositions, pos));
    }

    console.log('Min cost: ', Math.min(...allCosts));

    // Maybe the average is fine?

    console.log('avg: ', Math.round(avg));

    console.log('med: ', median(crabPositions));
    console.log('Fuel: ', calcFuel(crabPositions, Math.round(avg)));
})().catch((e) => {
    throw e;
});
