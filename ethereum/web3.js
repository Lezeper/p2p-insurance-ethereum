import Web3 from 'web3';
import env from './.env';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    env.WEB3_HTTP_PROVIDER
  );
  web3 = new Web3(provider);
}

export default web3;