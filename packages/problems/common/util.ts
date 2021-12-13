import { read } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import fetch, { Headers, Request } from 'node-fetch';

export async function readInput(solutionDir: string) {
    return `${await readFile(resolve(solutionDir, process.argv[3] === 'test' ? 'test_input.txt' : 'input.txt'))}`
        .trim()
        .split(/\r\n?/)
        .map((val) => val.trim());
}

export async function getInput(solutionDir: string, day: number) {
    const isTest = process.argv[2] === 'test';
    if (isTest)
        return `${await readFile(resolve(solutionDir, 'test_input.txt'))}`
            .trim()
            .split(/\r\n?/)
            .map((val) => val.trim());

    try {
        return `${await readFile(resolve(solutionDir, 'input.txt'))}`
            .trim()
            .split(/\r\n?/)
            .map((val) => val.trim());
    } catch (e) {
        const response = await fetch(`https://adventofcode.com/2021/day/${day}/input`, {
            method: 'GET',
            headers: {
                session:
                    '53616c7465645f5f4a86b1a166e37d9359ede92f8429706693c230d52545860e998bdaea983e12dfd1af8567bab438fa',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            },
        });

        console.log(response.statusText);
        console.log(response.body);
    }
}
