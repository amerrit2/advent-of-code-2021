import { difference } from '@nodejs-tools/utils';
import { getInput, readInput } from '../common/util';

interface Loc {
    height: number;
    coords: [number, number];
    neighbors: Loc[];
}

function calcBasinSize(current: Loc, visited: Loc[] = []): number {
    if (visited.includes(current) || current.height === 9) {
        return 0;
    } else {
        visited.push(current);
        return current.neighbors.reduce((total, loc) => total + calcBasinSize(loc, visited), 1);
    }
}

function getNode(nodes: Loc[], coords: [number, number]): Loc {
    const node = nodes.find((node) => node.coords[0] === coords[0] && node.coords[1] === coords[1]);
    if (!node) throw new Error('Yikes!');
    return node;
}

(async function main() {
    const ys = (await readInput(__dirname)).map((line) => line.split('').map(Number));

    const lowHeights = [] as number[];
    const lows = [] as Loc[];

    const nodes: Loc[] = [];

    ys.forEach((xs, y) =>
        xs.forEach((height, x) => {
            nodes.push({
                height: height,
                coords: [x, y],
                neighbors: [] as Loc[],
            });

            if (
                (x === 0 || height < ys[y][x - 1]) &&
                (x === xs.length - 1 || height < ys[y][x + 1]) &&
                (y === 0 || height < ys[y - 1][x]) &&
                (y === ys.length - 1 || height < ys[y + 1][x])
            ) {
                lowHeights.push(height);
                lows.push(nodes[nodes.length - 1]);
            }
        }),
    );

    nodes.forEach((node) => {
        node.neighbors = [
            ...(node.coords[1] === 0 ? [] : [getNode(nodes, [node.coords[0], node.coords[1] - 1])]),
            ...(node.coords[1] === ys.length - 1 ? [] : [getNode(nodes, [node.coords[0], node.coords[1] + 1])]),
            ...(node.coords[0] === 0 ? [] : [getNode(nodes, [node.coords[0] - 1, node.coords[1]])]),
            ...(node.coords[0] === ys[0].length - 1 ? [] : [getNode(nodes, [node.coords[0] + 1, node.coords[1]])]),
        ];
    });

    const sum = lowHeights.reduce((sum, low) => sum + low + 1, 0);
    console.log('Part 1:', sum);

    const sizes = lows.map((low) => calcBasinSize(low)).sort((a, b) => a - b);
    const l = sizes.length;

    console.log('Part 2: ', sizes[l - 1] * sizes[l - 2] * sizes[l - 3]);
})().catch((e) => {
    throw e;
});
