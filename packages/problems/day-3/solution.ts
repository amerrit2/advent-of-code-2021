import { readInput } from "../common/util";


function mostCommon(place: number, totalPlaces: number, set: number[]) {
    let sum = 0;
    for (const val of set) {
        sum += (val >> totalPlaces - (place + 1)) & 0b1        
    }

    return sum >= set.length / 2 ? 1 : 0
}
function partOne(input: string[]) {
    const boolArr = input.map(val => parseInt(val, 2));
    
    let gamma = '';
    let epsilon = '';
    for (let i = 0 ; i < input[0].length; ++i) {
        let bit = mostCommon(i, input[0].length, boolArr);
        console.log(bit)

        gamma = `${gamma}${bit}`
        epsilon = `${epsilon}${Number(!bit)}`
        
    }
    
    console.log(parseInt(gamma, 2))
    console.log(parseInt(epsilon, 2))
    console.log("Power: ", parseInt(gamma, 2) * parseInt(epsilon, 2))
}

function partTwo(input: string[]) {
    const boolArr = input.map(val => parseInt(val, 2));

    let oxygen = [...boolArr];
    let co2 = [...boolArr];
    let place = 0;
    while (oxygen.length > 1) {
        const bit = mostCommon(place, input[0].length, oxygen)
        const mask = 0b1 << input[0].length - (place + 1);
        oxygen = oxygen.filter(val => bit === 1 ? (val & mask) > 0 : (val & mask) === 0)
        place++;
    }

    place = 0;
    while(co2.length > 1) {
        const bit = mostCommon(place, input[0].length, co2)
        const mask = 0b1 << input[0].length - (place + 1);
        co2 = co2.filter(val => !(bit === 1 ? (val & mask) > 0 : (val & mask) === 0))
        place++;   
    }

    
    console.log(oxygen[0].toString(2))
    console.log(co2[0].toString(2))
    console.log("Life support rating: ", oxygen[0] * co2[0])
}

(async function main() {
    const input = (await readInput(__dirname));
    // partOne(input);
    partTwo(input)


})().catch(e => {throw e;})