// compile
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const insurancePath = path.resolve(__dirname, 'contracts', 'Insurance.sol');
const source = fs.readFileSync(insurancePath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for(let contrat in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contrat.replace(':', '') + '.json'),
    output[contrat]
  );
}

// deploy
require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const insuranceFactory = require('./build/InsuranceFactory.json')

const provider = new HDWalletProvider(
  process.env.ADMIN_SEED_WORD,
  process.env.WEB3_HTTP_PROVIDER
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(insuranceFactory.interface)
  )
    .deploy({ data: insuranceFactory.bytecode })
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};

deploy();