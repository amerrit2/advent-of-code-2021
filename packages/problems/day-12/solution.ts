import { readInput } from '../common/util';

interface Node {
    name: string | 'start' | 'end';
    isLarge: boolean;
    connections: Set<Node>;
}

function getNode(nodes: Record<string, Node>, name: string) {
    return (
        nodes[name] ||
        (nodes[name] = {
            connections: new Set(),
            isLarge: name.toUpperCase() === name,
            name,
        })
    );
}

function* getPaths(current: Node, curPath: Node[] = [current], visited: Node[] = []): Generator<Node[]> {
    if (current.name === 'end') {
        yield curPath;
    } else {
        for (const conn of current.connections) {
            if (!visited.includes(conn)) {
                yield* getPaths(conn, [...curPath, conn], current.isLarge ? visited : [...visited, current]);
            }
        }
    }
}

function* getPathsPart2(
    current: Node,
    curPath: Node[] = [current],
    visited: Node[] = [],
    hasDallied = false,
): Generator<Node[]> {
    if (current.name === 'end') {
        yield curPath;
    } else {
        for (const conn of current.connections) {
            let willDally = hasDallied;
            const canVisit =
                conn.name === 'start'
                    ? false
                    : conn.isLarge
                    ? true
                    : visited.includes(conn)
                    ? hasDallied
                        ? false
                        : (willDally = true)
                    : true;

            if (canVisit) {
                yield* getPathsPart2(conn, [...curPath, conn], [...visited, current], willDally);
            }
        }
    }
}

(async function main() {
    const inputs = (await readInput(__dirname)).map((val) => val.split('-'));

    const nodes = {} as Record<string, Node>;
    for (const input of inputs) {
        const left = getNode(nodes, input[0]);
        const right = getNode(nodes, input[1]);
        left.connections.add(right);
        right.connections.add(left);
    }

    const paths = getPaths(nodes['start']);
    let num = 0;
    for (const path of paths) {
        num++;
        // console.log(path.map(node => node.name));
    }
    console.log('Total: ', num);

    const paths2 = getPathsPart2(nodes['start']);
    let num2 = 0;
    for (const path of paths2) {
        num2++;
        // console.log(path.map(node => node.name));
    }
    console.log('Total: ', num2);
})().catch((e) => {
    throw e;
});
