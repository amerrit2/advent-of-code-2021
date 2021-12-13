import { getInput, readInput } from '../common/util';
import { intersection, difference } from '@nodejs-tools/utils';

//                   0  1  2  3  4  5  6  7  8  9
const digitSizes = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
const uniqueSizes = [2, 4, 3, 7];
const sizeMap = {
    2: [1],
    3: [7],
    4: [4],
    5: [2, 3, 5],
    6: [0, 9, 6],
    7: [8],
};
const segMap = {
    0: ['a', 'b', 'c', 'e', 'f', 'g'],
    1: ['c', 'f'],
    2: ['a', 'c', 'd', 'e', 'g'],
    3: ['a', 'c', 'd', 'f', 'g'],
    4: ['b', 'c', 'd', 'f'],
    5: ['a', 'b', 'd', 'f', 'g'],
    6: ['a', 'b', 'd', 'f', 'e', 'g'],
    7: ['a', 'c', 'f'],
    8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

function isDigit(left: string[], right: string[]) {
    return difference(left, right).length === 0;
}

function getDigit(knownDigits: Record<number, string[]>, input: string[]) {
    for (const [digit, encoded] of Object.entries(knownDigits)) {
        if (isDigit(input, encoded)) return digit;
    }
    throw new Error(`Failed to find matching digit for ${input} in ${JSON.stringify(knownDigits, null, 2)}`);
}

const solveDigits = (knownDigits: Record<number, string[]>, samples: string[][]) => {
    const [one, four, seven] = [knownDigits[1], knownDigits[4], knownDigits[7]];

    const samples235 = samples.filter((sample) => sample.length === 5);
    for (const sample235 of samples235) {
        const diffOne = difference(sample235, one);
        const diffSeven = difference(sample235, seven);
        if (diffOne.length === 3 || diffSeven.length === 2) {
            knownDigits[3] = knownDigits[3] ? knownDigits[3].filter((char) => sample235.includes(char)) : sample235;
        }

        const diffFour = difference(sample235, four);
        if (diffFour.length === 5) {
            knownDigits[2] = knownDigits[2] ? knownDigits[2].filter((char) => sample235.includes(char)) : sample235;
        }
    }

    knownDigits[5] = samples235.filter(
        (sample) => !isDigit(sample, knownDigits[3]) && !isDigit(sample, knownDigits[2]),
    )[0];

    const samples096 = samples.filter((sample) => sample.length === 6);
    for (const sample096 of samples096) {
        const diffOne = difference(sample096, one);
        const diffFour = difference(sample096, four);
        const diffSeven = difference(sample096, seven);

        if (diffOne.length === 6 || diffSeven.length === 5) {
            knownDigits[6] = knownDigits[6] ? knownDigits[6].filter((char) => sample096.includes(char)) : sample096;
        }

        if (diffFour.length === 2) {
            knownDigits[9] = knownDigits[9] ? knownDigits[9].filter((char) => sample096.includes(char)) : sample096;
        }
    }

    knownDigits[0] = samples096.filter(
        (sample) => !isDigit(sample, knownDigits[6]) && !isDigit(sample, knownDigits[9]),
    )[0];
};

// function setMapping(mappings: Record<string, string[]>, input: string, output: string) {
//     mappings[input] = [output];
//     for (const mapIn of Object.keys(mappings).filter(key => key !== input)) {
//         mappings[mapIn] = mappings[mapIn].filter(key => key !== output);
//     }
// }

// function solveMapping(knownDigits: Record<number, string[]>, mappings: Record<string, string[]>) {
//     const reverseMapping = {} as Record<string, string>
//     const a = difference(knownDigits[1], knownDigits[7])[0]
//     setMapping(mappings, a, 'a')

//     reverseMapping.a = a;

//     for (const char of knownDigits[1]) {
//         if (!knownDigits[6].includes(char)) {
//             reverseMapping.c = char;
//             setMapping(mappings, char, 'c');
//         }
//     }

//     for (const char of Array.from('abcdefg')) {
//         if (!knownDigits[9].includes(char)) {
//             reverseMapping.e = char;
//             setMapping(mappings, char, 'e');
//         }
//     }

//     const f = knownDigits[7].filter(char => !knownDigits[2].includes(char))[0];
//     setMapping(mappings, f, 'f');
//     reverseMapping.f = f;
//     // knownDigits[4].filter(char => char !== mappings.b[0] && char !== mappings.)
//     // const inter = intersection(knownDigits[4], knownDigits[3])
//     // // const diff = difference(knownDigits[4], knownDigits[3])

//     for (const char of knownDigits[6]) {
//         if (reverseMapping[char] === undefined  && !knownDigits[4].includes(char)) {
//             setMapping(mappings, 'g', char);
//             reverseMapping[char] = 'g';
//         }
//     }

//     const b = knownDigits[4].filter(char => !['c', 'd', 'f'].map(inFour => reverseMapping[inFour]).includes(char))[0];
//     setMapping(mappings, 'b', b);
//     reverseMapping[b] = 'b'
// }

function decodeMapping([tests, output]: string[][]) {
    const samples = [...tests, ...output]
        .map((val) => Array.from(val))
        .sort()
        .filter((left, idx, all) => !all.slice(idx + 1).some((right) => difference(left, right).length === 0));

    const knownDigits = {} as Record<number, string[]>;

    // In to actual
    const mappings = Array.from('abcdefg').reduce(
        (out, char, _, all) => Object.assign(out, { [char]: [...all] }),
        {} as Record<string, string[]>,
    );

    samples.forEach((value) => {
        const possDigits = sizeMap[value.length as keyof typeof sizeMap];

        const allChars = new Set<string>();
        for (const digit of sizeMap[value.length as keyof typeof sizeMap]) {
            segMap[digit as keyof typeof segMap].forEach((char) => allChars.add(char));
        }

        for (const char of value) {
            mappings[char] = mappings[char].filter((val) => allChars.has(val));
        }

        if (possDigits.length === 1) {
            knownDigits[possDigits[0]] = value;
        }
    });

    if (!knownDigits[1] || !knownDigits[7] || !knownDigits[4]) {
        throw new Error("Didn't find 1 or 7 or 4!");
    }

    solveDigits(knownDigits, samples);

    return knownDigits;
}

(async function main() {
    const input = await readInput(__dirname);

    const parsed = input.map((line) =>
        line
            .trim()
            .split('|')
            .map((section) => section.trim().split(' ')),
    );

    // Part 1
    console.log(
        'Unique digits in output: ',
        parsed.reduce(
            (count, line) =>
                count +
                line[1].reduce((numUnique, value) => numUnique + (uniqueSizes.includes(value.length) ? 1 : 0), 0),
            0,
        ),
    );

    let total = 0;
    for (const line of parsed) {
        const knownDigits = decodeMapping(line);
        const [_, output] = line;

        let numString = '';
        for (const encodedDigit of output) {
            numString += getDigit(knownDigits, Array.from(encodedDigit));
        }

        total += Number(numString);
    }

    console.log('Total: ', total);
})().catch((e) => {
    throw e;
});
