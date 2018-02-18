const EthereumTx = require('ethereumjs-tx')
const Web3 = require('web3')

const web3 = new Web3 (new Web3.providers.HttpProvider (process.env.WEB3_HTTP_PROVIDER))

const sendRawTransactionFromServer = async (data, targetAddress, value) => {
  
  let nonce = await web3.eth.getTransactionCount(process.env.ADMIN_WALLET_ADDRESS)

  let details = {
    to: targetAddress,
    gasPrice: 2000000000,
    gasLimit: 5000000,
    value: Number(value),
    nonce: nonce,
    data: data,
    chainId: Number(process.env.CHAIN_ID)
  }
  const transaction = new EthereumTx(details)
  transaction.sign( Buffer.from(process.env.ADMIN_WALLET_PRIVATE_KEY, 'hex') )
  const serializedTransaction = '0x' + transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction(serializedTransaction, function(err, transactionId) {
    if(!err)
      console.log('transactionId: ', transactionId)
  })
  
}


const setInsuranceStatus = (status, contractAddress) => {
  var InsuranceJSON = require('./ethereum/build/Insurance.json')
  var c = new web3.eth.Contract(JSON.parse(InsuranceJSON.interface), contractAddress)
  var callData = c.methods.setStatus(status).encodeABI()
  sendRawTransactionFromServer(callData, contractAddress, 0)
}

module.exports = { sendRawTransactionFromServer, setInsuranceStatus }