import { getInput, readInput } from '../common/util';

type Timers = [number, number, number, number, number, number, number, number, number];

function advanceTimers(timers: Timers) {
    const zeros = timers.shift()!;
    timers[8] = zeros;
    timers[6] = timers[6] + zeros;
}

function makeTimers(fish: number[]) {
    const timerCounts = new Array(9).fill(0) as Timers;
    fish.forEach((timer) => timerCounts[timer]++);
    return timerCounts;
}

(async function main() {
    const input = (await readInput(__dirname))[0].split(',').map((val) => parseInt(val, 10));

    let timerCounts = makeTimers(input);

    // Part 1
    const days = 80;
    for (let i = 0; i < days; ++i) {
        advanceTimers(timerCounts);
    }

    // Part 2
    timerCounts = makeTimers(input);
    const days2 = 256;
    for (let i = 0; i < days2; ++i) {
        advanceTimers(timerCounts);
    }

    console.log(
        'answer? ',
        timerCounts.reduce((sum, timer) => sum + timer, 0),
    );
})().catch((e) => {
    throw e;
});
