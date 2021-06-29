if (process.argv[2] == '-h') {
    console.log('Пример запуска программы: node substr.mjs -hashRabinKarp/-bruteForce/-automatou string.txt template.txt');
    process.exit(0);
}

import { readFileSync } from 'fs';

const string = readFileSync(process.argv[3], 'utf8');process.argv[3]
const substring = readFileSync(process.argv[4], 'utf8');
let foundSubstringIndexes = {};
let indexForIndexes = 0;
let collisionsNumber = 0;
let comparionsAndFindability = {
    characterComparisonsnumber: 0,
    isSubstringFound: false
};

function isSubstringFound(startIndex, comparionsAndFindability) {
    for (let i = 0; i < substring.length; ++i) {
        ++comparionsAndFindability.characterComparisonsnumber;
        if (string.charAt(startIndex + i) != substring.charAt(i)) {
            comparionsAndFindability.isSubstringFound = false;
            return;
        } 
    }
    comparionsAndFindability.isSubstringFound = true;
}
function printStatistics(workingHours) {
    console.log(`Время выполнения программы: ${workingHours} мс`);
    console.log(`Количество посимвольных сравнений: ${comparionsAndFindability.characterComparisonsnumber}`);
    console.log(`Количество найденных подстрок: ${Object.keys(foundSubstringIndexes).length}`);
    if (Object.keys(foundSubstringIndexes).length != 0) {
        let indexes = '';
        for (let i = 0; i < Object.keys(foundSubstringIndexes).length && i < 10; ++i)
            if (i + 1 != Object.keys(foundSubstringIndexes).length && i + 1 < 10)
                indexes += (`${foundSubstringIndexes[i]}, `);
            else indexes += (foundSubstringIndexes[i]);
        console.log(`Первые 10 индексов вхождений подстроки: ${indexes}`);
    }
    console.log(`Количество коллизий: ${collisionsNumber}`);
}

if (process.argv[2] == '-hashRabinKarp') {
    if (string.length < substring.length) {
        console.log('Ошибка: длина подстроки больше, чем длина исходного текста');
        process.exit(2);
    }

    const constant = 2;
    const q = 3571;
    let h = 1;
    let stringHash = 0;
    let substringHash = 0;

    for (let i = 0; i < substring.length - 1; ++i)
        h = (h * constant) % q;

    for (let i = 0; i < substring.length; ++i) {
        stringHash = (stringHash * constant + string.charCodeAt(i)) % q;
        substringHash = (substringHash * constant + substring.charCodeAt(i)) % q;
    }
    
    const startTime = new Date().getTime();
    for (let i = 0; ; ++i) {
        if (stringHash == substringHash) {
            isSubstringFound(i, comparionsAndFindability);
            if (comparionsAndFindability.isSubstringFound)
                foundSubstringIndexes[indexForIndexes++] = i;
            else ++collisionsNumber;
            comparionsAndFindability.isSubstringFound = false;
        }
        if (i >= string.length - substring.length) break;
        stringHash = (constant * (stringHash - string.charCodeAt(i) * h) + string.charCodeAt(i + substring.length)) % q;
        if (stringHash < 0) stringHash += q;
    }
    const endTime = new Date().getTime();

    printStatistics(endTime - startTime);
}
else if (process.argv[2] == '-bruteForce') {
    const startTime = new Date().getTime();
    for (let i = 0; i <= string.length - substring.length; ++i) {
        isSubstringFound(i, comparionsAndFindability);
        if (comparionsAndFindability.isSubstringFound)
            foundSubstringIndexes[indexForIndexes++] = i;
        comparionsAndFindability.isSubstringFound = false;
    }
    const endTime = new Date().getTime();

    printStatistics(endTime - startTime);
}
else if (process.argv[2] == '-automatou') {
    let jumpTable = [];
    
    for (let i = 0; i <= substring.length; ++i)
        jumpTable[i] = [];
    for (let i = 0; i < substring.length; ++i)
        jumpTable[0][substring.charAt(i)] = 0;
    for (let i = 0; i < substring.length; ++i) {
        jumpTable[i][substring.charAt(i)] = i + 1;
        for (let j = 0; j < substring.length; ++j)
            jumpTable[i + 1][substring.charAt(j)] = jumpTable[i][substring.charAt(j)];
    }

    let automatouState = 0;
    const startTime = new Date().getTime();
    for (let i = 0; i < string.length; ++i)
        if (jumpTable[automatouState][string.charAt(i)] == null) automatouState = 0;
        else {
            automatouState = jumpTable[automatouState][string.charAt(i)];
            if (automatouState == substring.length)
                foundSubstringIndexes[indexForIndexes++] = i - substring.length + 1;
        }
    const endTime = new Date().getTime();

    printStatistics(endTime - startTime);
}
else {
    console.log('Ошибка: неизвестная комманда');
    process.exit(1);
}