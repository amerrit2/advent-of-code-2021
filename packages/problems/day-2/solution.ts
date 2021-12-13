import { readInput } from '../common/util';
import assert from 'assert';

interface Coords {
    x: number;
    y: number;
    aim: number;
}

const Operations = {
    down: (val: number, { x, y, aim }: Coords) => ({ x, y, aim: aim + val }),
    up: (val: number, { x, y, aim }: Coords) => ({ x, y, aim: aim - val }),
    forward: (val: number, { x, y, aim }: Coords) => ({ x: x + val, y: y + aim * val, aim }),
} as const;

function* reader(lines: string[]) {
    for (const line of lines) {
        const [op, val] = line.split(' ');
        assert(op in Operations);
        yield (coords: Coords) => Operations[op as keyof typeof Operations](parseInt(val, 10), coords);
    }
}

(async function main() {
    const input = await readInput(__dirname);
    const commands = reader(input);

    let position = { x: 0, y: 0, aim: 0 };
    for (const comm of commands) {
        position = comm(position);
    }

    console.log(position);
    console.log(position.x * position.y);
})().catch((e) => {
    throw e;
});
