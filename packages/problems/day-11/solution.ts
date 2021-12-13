import { readInput } from '../common/util';

interface Node {
    coords: [number, number];
    energy: number;
    neighbors: Node[];
}

function getNode(nodes: Node[], coords: [number, number]) {
    const node = nodes.find((node) => node.coords[0] === coords[0] && node.coords[1] === coords[1]);
    if (!node) throw new Error('Yikes!');
    return node;
}

const printOctopuses = (nodes: Node[]) => {
    let out = [] as number[][];
    nodes.forEach((node) => {
        (out[node.coords[1]] ??= [])[node.coords[0]] = node.energy;
    });

    for (const y of out) {
        console.log(...y);
    }
};

function simSteps(nodes: Node[], steps: number) {
    let flashCount = 0;
    for (let step = 0; step < steps; ++step) {
        if (step % 100 === 0) {
            console.log('step: ', step);
        }
        nodes.forEach((node) => {
            node.energy++;
        });

        let toFlash = [];
        const flashed = [] as Node[];
        while ((toFlash = nodes.filter((node) => node.energy > 9 && !flashed.includes(node))).length > 0) {
            toFlash.forEach((node) => {
                if (!flashed.includes(node)) {
                    flashed.push(node);
                    node.neighbors.forEach((neighbor) => neighbor.energy++);
                }
            });
        }
        flashCount += flashed.length;
        flashed.forEach((node) => (node.energy = 0));
        // if (flashed.length === nodes.length) {
        //     return step;
        // }
    }
    return flashCount;
}

function findSyncStep(nodes: Node[]) {
    for (let step = 0; ; ++step) {
        if (step % 100 === 0) {
            console.log('step: ', step);
        }
        nodes.forEach((node) => {
            node.energy++;
        });

        let toFlash = [];
        const flashed = [] as Node[];
        while ((toFlash = nodes.filter((node) => node.energy > 9 && !flashed.includes(node))).length > 0) {
            toFlash.forEach((node) => {
                if (!flashed.includes(node)) {
                    flashed.push(node);
                    node.neighbors.forEach((neighbor) => neighbor.energy++);
                }
            });
        }
        flashed.forEach((node) => (node.energy = 0));
        if (flashed.length === nodes.length) {
            return step + 1;
        }
    }
}

(async function main() {
    const ys = (await readInput(__dirname)).map((val) => val.split('').map(Number));

    const nodes = [] as Node[];
    ys.forEach((xs, y) =>
        xs.forEach((energy, x) => {
            nodes.push({
                coords: [x, y],
                energy: energy,
                neighbors: [],
            });
        }),
    );

    const xLength = ys[0].length;
    nodes.forEach((node) => {
        node.neighbors = [
            ...(node.coords[1] === 0 ? [] : [getNode(nodes, [node.coords[0], node.coords[1] - 1])]),
            ...(node.coords[1] === ys.length - 1 ? [] : [getNode(nodes, [node.coords[0], node.coords[1] + 1])]),
            ...(node.coords[0] === 0 ? [] : [getNode(nodes, [node.coords[0] - 1, node.coords[1]])]),
            ...(node.coords[0] === xLength - 1 ? [] : [getNode(nodes, [node.coords[0] + 1, node.coords[1]])]),
        ];

        if (node.coords[0] !== 0 && node.coords[1] !== 0) {
            node.neighbors.push(getNode(nodes, [node.coords[0] - 1, node.coords[1] - 1]));
        }

        if (node.coords[0] !== 0 && node.coords[1] !== ys.length - 1) {
            node.neighbors.push(getNode(nodes, [node.coords[0] - 1, node.coords[1] + 1]));
        }
        if (node.coords[0] !== xLength - 1 && node.coords[1] !== 0) {
            node.neighbors.push(getNode(nodes, [node.coords[0] + 1, node.coords[1] - 1]));
        }

        if (node.coords[0] !== xLength - 1 && node.coords[1] !== ys.length - 1) {
            node.neighbors.push(getNode(nodes, [node.coords[0] + 1, node.coords[1] + 1]));
        }
    });

    const syncStep = findSyncStep(nodes);
    // printOctopuses(nodes);
    console.log('synced on: ', syncStep);
})().catch((e) => {
    throw e;
});
