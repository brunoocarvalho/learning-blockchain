import { Blockchain } from './blockchain'

const difficult = Number(process.argv[2]) || 4
const blockchain = new Blockchain(difficult)

const blocks = Number(process.argv[3]) || 10

let chain = blockchain.chain

for (let i = 0; i <= blocks; i++) {
  const block = blockchain.createBlock(`Block ${i}`)
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.sendBlock(mineInfo.mineredBlock)
}

console.log('--- BLOCKCHAIN ---')
console.log(chain)