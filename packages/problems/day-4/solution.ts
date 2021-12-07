import assert from "assert";
import { readInput } from "../common/util";


class Board extends Array<number[]> {
    #rowHits: Record<number, number> = {};
    #columnHits: Record<number, number> = {};
    sum: number = 0;
    constructor() {
        super();
        Array.from((new Array(5)).keys()).forEach(val => {
            this.#rowHits[val] = 0;
            this.#columnHits[val] = 0;
        });
    }

    /**
     * Must push completed rows
     */
    push(row: number[]) {
        const len = super.push(row);
        this.sum += row.reduce((sum, val) => sum + val, 0);
        return len;
    }

    /**
     * Assumes any value is called once
     */ 
    mark(value: number) {
        for (const row in this) {
            for (const col in this[row]) {
                if (value === this[row][col]) {
                    this.sum -= value;
                    this.#rowHits[row] += 1;
                    this.#columnHits[col] += 1;
                    if (this.#rowHits[row] === 5 || this.#columnHits[col] === 5) {
                        return this.sum * value;
                    }
                }
            }
        }

        return null;
    }
    
}

function parseData(inputLines: string[]) {
    const chosen = inputLines.shift()!.split(',');

    const boards: Board[] = [];
    let currentBoard: Board;
    let currentRow: number[];
    while (inputLines.length) {
        let line = inputLines.shift()?.split(/\s+/).reduce((out, val) => {
            if (val !== '') {
                out.push(parseInt(val, 10));
            }
            return out;
        }, [] as number[]);
        if (line?.length) {
            assert(currentBoard!);
            currentRow = [] as number[];
            while (line.length) {
                currentRow.push(line.shift()!);
            }
            currentBoard.push(currentRow);
        } else {
            currentBoard = new Board();
            boards.push(currentBoard);
        }
    }

    return {
        chosen,
        boards,
    }
}

(async function main() {
    const input = await readInput(__dirname);
  
    let {boards, chosen} = parseData([...input]);

    // Part 1
    outer:
    for (const value of chosen) {
        for (const board of boards) {
            const score = board.mark(parseInt(value, 10));
            if (score !== null) {
                console.log("Winning score: ", score);
                break outer;
            }
        }
    }

    // Part 2
    const rebuild = parseData([...input]);
    boards = rebuild.boards;

    outer2:
    for (const value of chosen) {
        for (let boardIdx = boards.length - 1; boardIdx >= 0; boardIdx--) {
            const score = boards[boardIdx].mark(parseInt(value, 10));
            if (score !== null) {
                if (boards.length === 1) {
                    console.log("Losing score: ", score);
                    break outer2;
                } 
                boards.splice(boardIdx, 1);
            }
        }
    }
})().catch(e => {throw e;}) 