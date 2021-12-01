import {readFile} from 'fs/promises';
import { resolve } from 'path';


async function readInput() {
    return `${await readFile(resolve(__dirname, process.argv[2] === 'test' ? "test_input.txt" : "input.txt"))}`.trim().split(/\r\n?/);
}

function calcWindow(readings: number[], window: number, index: number) {
    return Array.from((new Array(window)).keys()).reduce((acc, idx) => acc + readings[index - idx], 0);
}

function countIncreases(readings: number[], window = 1) {
    return readings.reduce((increases, _, idx) => {
        if (idx < window) return increases;
        return increases + (calcWindow(readings, window, idx) > calcWindow(readings, window, idx - 1) ? 1 : 0)
    }, 0)
}

(async function main() {
    const readings = (await readInput()).map(val => parseInt(val, 10));
    console.log(countIncreases(readings));
    console.log(countIncreases(readings, 3));
})().catch(e => {throw e});