import { readInput } from '../common/util';

const scoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};
const closeMap = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};

const opens = Object.keys(closeMap);

const part2ScoreMap = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};

(async function main() {
    const lines = (await readInput(__dirname)).map((line) => Array.from(line));

    let score = 0;
    let part2Scores = [];
    for (const line of lines) {
        const stack = [] as string[];
        let next = line.shift();
        let isCorrupt = false;
        while (next) {
            if (opens.includes(next)) {
                stack.push(next);
            } else {
                const expected = closeMap[stack.pop() as keyof typeof closeMap];
                if (next !== expected) {
                    score += scoreMap[next as keyof typeof scoreMap];
                    isCorrupt = true;
                    break;
                }
            }
            next = line.shift();
        }
        !isCorrupt &&
            part2Scores.push(
                stack
                    .map((val) => closeMap[val as keyof typeof closeMap])
                    .reverse()
                    .reduce((out, closer) => {
                        return out * 5 + part2ScoreMap[closer as keyof typeof part2ScoreMap];
                    }, 0),
            );
    }

    console.log(score);
    console.log(part2Scores.sort((a, b) => a - b));
    console.log(part2Scores.sort((a, b) => a - b)[Math.floor(part2Scores.length / 2)]);
})().catch((e) => {
    throw e;
});
