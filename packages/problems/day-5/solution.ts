import { readInput } from '../common/util';

const numSort = (a: number, b: number) => a - b;

(async function main() {
    const input = await readInput(__dirname);

    const segments = input.map((line) =>
        line
            .trim()
            .split('->')
            .map((val) =>
                val
                    .trim()
                    .split(',')
                    .map((val) => parseInt(val, 10)),
            ),
    );

    const markedPoints: Record<number, Record<number, number>> = {};

    for (const line of segments) {
        let x1 = line[0][0];
        let y1 = line[0][1];

        let x2 = line[1][0];
        let y2 = line[1][1];

        if (x1 === x2) {
            const sorted = [y1, y2].sort(numSort);
            for (let y = sorted[0]; y <= sorted[1]; ++y) {
                (markedPoints[y] ?? (markedPoints[y] = {}))[x1] ? markedPoints[y][x1]++ : (markedPoints[y][x1] = 1);
            }
        } else if (y1 === y2) {
            const sorted = [x1, x2].sort(numSort);
            for (let x = sorted[0]; x <= sorted[1]; ++x) {
                (markedPoints[y1] ?? (markedPoints[y1] = {}))[x] ? markedPoints[y1][x]++ : (markedPoints[y1][x] = 1);
            }
        } else {
            // Assume x and y are same distance (45 degrees)
            const xDir = x2 > x1 ? 1 : -1;
            const yDir = y2 > y1 ? 1 : -1;
            for (let step = 0; step <= Math.abs(x1 - x2); ++step) {
                const y = y1 + step * yDir;
                const x = x1 + step * xDir;
                (markedPoints[y] ?? (markedPoints[y] = {}))[x] ? markedPoints[y][x]++ : (markedPoints[y][x] = 1);
            }
        }
    }

    // plane.forEach(row => console.log(row.join(' ')));
    let totalPlane = 0;
    Object.values(markedPoints).forEach((xs) => Object.values(xs).forEach((count) => count >= 2 && totalPlane++));
    console.log(totalPlane);
})().catch((e) => {
    throw e;
});
