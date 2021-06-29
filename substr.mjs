if (process.argv[2] == '-h') {
    console.log('...');
    process.exit(0);
}

import { readFileSync } from 'fs';

const string = readFileSync(process.argv[3], 'utf8');
const substring = readFileSync(process.argv[4], 'utf8');
let foundSubstringIndexes = [];
let indexForIndexes = 0;
let collisionsNumber = 0;

function isSubstringFound(startIndex, comparionsAndFindability) {
    for (let i = 0; i < substring.length; ++i) {
        ++comparionsAndFindability.characterComparisonsnumber;
        if (string.charAt(startIndex + i) != substring.charAt(i))
            comparionsAndFindability.isSubstringFound = false;
    }
    comparionsAndFindability.isSubstringFound = true;
}

if (process.argv[2] == '-hashRabinKarp') {
    const startTime = new Date().getTime();
    if (string.length < substring.length) {
        console.log('Ошибка: длина подстроки больше, чем длина исходного текста');
        process.exit(2);
    }

    const constant = 6;
    let stringHash = 0;
    let substringHash = 0;
    let lastCharCodeOfString = string.charCodeAt(0);
    let comparionsAndFindability = {
        characterComparisonsnumber: 0,
        isSubstringFound: false
    };

    for (let i = 0; i < substring.length; ++i) {
        stringHash = stringHash + string.charCodeAt(i) * Math.pow(constant, substring.length - 1 - i);
        substringHash = substringHash + substring.charCodeAt(i) * Math.pow(constant, substring.length - 1 - i);
    }
    
    for (let i = 0; ; ++i) {
        if (stringHash == substringHash) {
            isSubstringFound(i, comparionsAndFindability);
            if (comparionsAndFindability.isSubstringFound)
                foundSubstringIndexes[indexForIndexes++] = i;
            else ++collisionsNumber;
            comparionsAndFindability.isSubstringFound = false;
        }
        if (i >= string.length - substring.length) break;
        stringHash = (stringHash - lastCharCodeOfString * Math.pow(constant, substring.length - 1)) * constant + string.charCodeAt(i + substring.length);
        lastCharCodeOfString = string.charCodeAt(i + 1);
    }
    const endTime = new Date().getTime();

    console.log(`Время выполнения программы: ${endTime - startTime} мс`);
    console.log(`Количество найденных подстрок: ${foundSubstringIndexes.length}`);
    if (foundSubstringIndexes.length != 0) {
        let indexes = '';
        for (let i = 0; i < foundSubstringIndexes.length; ++i)
            if (i + 1 != foundSubstringIndexes.length)
                indexes += (`${foundSubstringIndexes[i]}, `);
            else indexes += (foundSubstringIndexes[i]);
        console.log(`Первые 10 индексов вхождений подстроки: ${indexes}`);
    }
    console.log(`Количество коллизий: ${collisionsNumber}`);
}
else {
    console.log('Ошибка: неизвестная комманда');
    process.exit(1);
}