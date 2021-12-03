import { readFile } from 'fs/promises';
import { resolve } from 'path'

export async function readInput(solutionDir: string) {
    return `${await readFile(resolve(solutionDir, process.argv[2] === 'test' ? "test_input.txt" : "input.txt"))}`.trim().split(/\r\n?/);
}