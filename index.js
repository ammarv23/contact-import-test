const commander = require('commander');
const stringify = require('csv-stringify');
const faker = require('faker');
const fs = require('fs');

const FILE_PATH = '~/contacts.csv';

//Generate fake data

function createHeaders(hasGroup) {
    return [
        'Type',
        'First Name',
        'Last Name',
        'Company',
        'Emails',
        ...(hasGroup ? ['Group Name'] : [])
    ];

}

// Contact data is generated from contact template provided as part of onboarding
function createContact(hasGroup) {
    return [
        pickRandomValues(
            [
                'VESSEL',
                'COMPANY',
                'PERSON'
            ]
        ),
        faker.name.firstName(),
        faker.name.lastName(),
        faker.company.companyName(),
        generateEmails(),
        ...(hasGroup ? [pickRandomValues(
            [
                'Work Colleagues',
                'New Contacts',
                'Prospects',
                'Ready Runners'
            ]
        )] : [])
    ];

}

function pickRandomValues(valueArray) {
    return valueArray[Math.floor((Math.random() * valueArray.length))];
}

function generateEmails() {
    return `${faker.internet.email()}, ${faker.internet.email()}`;
}

function buildCsv(data, cb) {
    fs.writeFile(FILE_PATH, data, 'utf8', cb)
}

commander
    .option('-f, --force', 'Generate csv')
    .option('-n, --number <n>', 'Number of contacts to generate', parseInt)
    .option('-g, --group', 'Include Groups in the csv')
    .parse(process.argv);

if (!commander.number) {
    console.log('Must provide a number of contacts to generate');
    process.exit(1);
}

let i = commander.number;

const csvArray = [createHeaders(commander.group)];

while (i--) {
    csvArray.push(createContact(commander.group));
}

stringify(csvArray, (err, output) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    if (!commander.force) {
        console.log(output);
        process.exit(0);
    } else {
        buildCsv(output, err => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            process.exit(0);
        });
    }
});



