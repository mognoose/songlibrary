const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const { log } = require('console');
const { async } = require('regenerator-runtime');

function getEnvironments() {
    const file = path.resolve(__dirname, './environments.json');
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf8', (err, data) => {
            if (err) console.error(err);

            return data
        });
        changeEnv(data);
    } else {
        console.log('No environments found! Add new');
        createEnvFile();
    }
}

function changeEnv(data) {
    const file = path.resolve(__dirname, '../../.env');
    const environemntsJSON = JSON.parse(data);
    const environments = [];

    for (const key in environemntsJSON) {
        environments.push(key);
    }

    const env = inquirer
        .prompt([
            {
                type: 'list',
                name: 'env',
                message: 'Select environment to use',
                choices: [...environments, 'Add new'],
            },
        ])
        .then(async answer => {
            if(answer.env === 'Add new') {
                const env = await addNewEnv();

                const content = JSON.stringify(Object.assign(environemntsJSON, JSON.parse(env)), null, 4);

                fs.writeFileSync(file, content, err => {
                    if (err) console.error(err);
                });
                
                return;
            }

            const env = JSON.parse(data)[answer.env];
            const content = `VUE_APP_CTF_SPACE_ID=${env.VUE_APP_CTF_SPACE_ID}
VUE_APP_CTF_ENVIRONMENT=${env.VUE_APP_CTF_ENVIRONMENT}
VUE_APP_CTF_CDA_ACCESS_TOKEN=${env.VUE_APP_CTF_CDA_ACCESS_TOKEN}
VUE_APP_CTF_CMA_ACCESS_TOKEN=${env.VUE_APP_CTF_CMA_ACCESS_TOKEN}
`;

            fs.writeFileSync(file, content, err => {
                if (err) console.error(err);
            })

            console.log('Environment chaged to:', answer.env);
        });
}

async function createEnvFile() {

    const file = path.resolve(__dirname, './environments.json');

    const content = await addNewEnv();

    fs.writeFileSync(file, content, err => {
        if (err) console.error(err);
    })

    changeEnv(content);
}

async function addNewEnv() {
    const res = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Environment name',
            },
            {
                type: 'input',
                name: 'VUE_APP_CTF_SPACE_ID',
                message: 'VUE_APP_CTF_SPACE_ID',
            },
            {
                type: 'input',
                name: 'VUE_APP_CTF_ENVIRONMENT',
                message: 'VUE_APP_CTF_ENVIRONMENT',
            },
            {
                type: 'input',
                name: 'VUE_APP_CTF_CDA_ACCESS_TOKEN',
                message: 'VUE_APP_CTF_CDA_ACCESS_TOKEN',
            },
            {
                type: 'input',
                name: 'VUE_APP_CTF_CMA_ACCESS_TOKEN',
                message: 'VUE_APP_CTF_CMA_ACCESS_TOKEN',
            },
        ])
        .then(answers => {

            const content = `{
    "${answers.name}": {
        VUE_APP_CTF_SPACE_ID: ${answers.VUE_APP_CTF_SPACE_ID},
        VUE_APP_CTF_ENVIRONMENT: ${answers.VUE_APP_CTF_ENVIRONMENT},
        VUE_APP_CTF_CDA_ACCESS_TOKEN: ${answers.VUE_APP_CTF_CDA_ACCESS_TOKEN},
        VUE_APP_CTF_CMA_ACCESS_TOKEN: ${answers.VUE_APP_CTF_CMA_ACCESS_TOKEN},
    }`

        });

    return res;
}

getEnvironments();