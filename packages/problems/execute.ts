import { resolve } from 'path';

const [_, __, day] = process.argv;

require(resolve(__dirname, `day-${day}`, 'solution'));
