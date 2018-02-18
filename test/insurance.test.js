const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/InsuranceFactory.json');
const compiledInsurance = require('../ethereum/build/Insurance.json');

let accounts;
let factory;
let insuranceAddress;
let insurance;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });
  
  await factory.methods.createInsurance('10').send({
    from: accounts[0],
    gas: '1000000'
  });

  [insuranceAddress] = await factory.methods.getDeployedInsurances().call();
  insurance = await new web3.eth.Contract(
    JSON.parse(compiledInsurance.interface),
    insuranceAddress
  );
});

describe('Insurances', () => {
  it('deploys a factory and a insurance', () => {
    assert.ok(factory.options.address);
    assert.ok(insurance.options.address);
  });
});