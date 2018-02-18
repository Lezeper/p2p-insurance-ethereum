import web3 from './web3'
import InsuranceFactory from './build/InsuranceFactory.json'
import env from './.env'

export default () => {
  return new web3.eth.Contract(
    JSON.parse(InsuranceFactory.interface),
    env.FACTORY_ADDRESS
  );
} 