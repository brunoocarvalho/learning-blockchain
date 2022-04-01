import { hash, validatedHash } from "./helpers"

export interface Block {
  header: {
    nonce: number
    hashBlock: string
  }
  payload: {
    sequence: number
    timestamp: number
    data: any
    previousHash: string
  }
}


export class Blockchain {
  #chain: Block[] = []

  private prefixPOW = '0'

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      previousHash: ''
    }

    return {
      header: {
        nonce: 0,
        hashBlock: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  private get previousBlock(): Block {
    return this.#chain.at(-1) as Block
  }

  get chain() {
    return this.#chain
  }

  private previousHashBlock() {
    return this.previousBlock.header.hashBlock
  }

  createBlock(payload: any): Block['payload'] {
    const newBlock: Block['payload'] = {
      sequence: this.previousBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data: payload,
      previousHash: this.previousHashBlock()
    }

    console.log(`Block #${newBlock.sequence} created: ${JSON.stringify(newBlock)}`)

    return newBlock
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0
    const initial = +new Date()

    while (true) {
      const hashBlock = hash(JSON.stringify(block))
      const hashPOW = hash(hashBlock + nonce)

      if (validatedHash({ hash: hashPOW, difficult: this.difficult, prefix: this.prefixPOW })) {
        const final = +new Date()
        const reducedHash = hashBlock.slice(0, 12)
        const mineTime = (final - initial) / 1000

        console.log(`Block #${block.sequence} minered in ${mineTime}s.
          Hash${reducedHash} (${nonce} tentatives)`)

        return {
          mineredBlock: {
            payload: {...block},
            header: {
              nonce,
              hashBlock
            }
          }
        }
      }

      nonce++
    }
  }

  verifyBlock(block: Block): boolean {
    if (block.payload.previousHash !== this.previousHashBlock()) {
      console.error(` Block #${block.payload.sequence} is invalid: The previous hash
        is ${this.previousHashBlock().slice(0, 12)} not ${block.payload.previousHash.slice(0, 12)}`)

      return false
    }

    const testHash = hash(hash(JSON.stringify(block.payload)) + block.header.nonce)
    if (!validatedHash({ hash: testHash, difficult: this.difficult, prefix: this.prefixPOW })) {
      console.error(`Block #${block.payload.sequence} is invalid:
        Nonce ${block.header.nonce} is invalid and cannot be verified`)

      return false
    }

    return true
  }

  sendBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) {
      this.#chain.push(block)
      console.log(`Block #${block.payload.sequence} has been added to
        blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }

  constructor(private readonly difficult: number = 4) {
    this.#chain.push(this.createGenesisBlock())
  }

}