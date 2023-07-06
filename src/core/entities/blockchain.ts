import { Block } from './block';

interface BlockChainProperties {
  difficulty: number;
  blocks?: Array<Block>;
}

export class BlockChain {
  constructor(public readonly props: BlockChainProperties) {
    this.props.blocks = this.props.blocks ?? [];
    const genesisBlock = this.startGenesisBlock();
    this.props.blocks.push(genesisBlock);
    const validation = this.isFirstBlockValid();
    console.log('VALIDATION', validation);
  }

  public startGenesisBlock(): Block {
    return new Block({ index: 0, previousHash: null, data: 'Block genesis' });
  }

  public latestBlock(): Block {
    return this.props.blocks[this.props.blocks.length - 1];
  }

  public addNewBlock(newBlock: Block): void {
    newBlock.props.previousHash = this.latestBlock().props.hash;
    console.log('NEW BLOCK', newBlock);
    newBlock.proofOfWork(this.props.difficulty);
    this.props.blocks.push(newBlock);
  }

  public isFirstBlockValid(): boolean {
    const firstBlock: Block = this.props.blocks[0];

    if (firstBlock.props.index != 0) {
      console.log('INDEX NOT 0');
      return false;
    }

    if (firstBlock.props.previousHash != null) {
      console.log('PREVIOUS HASH NOT NULL');
      return false;
    }

    if (
      firstBlock.props.hash == null ||
      !(Block.calculateHash(firstBlock) === firstBlock.props.hash)
    ) {
      console.log('HASH NULL', Block.calculateHash(firstBlock), firstBlock);
      return false;
    }

    return true;
  }

  public isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
    if (newBlock != null && previousBlock != null) {
      if (previousBlock.props.index + 1 != newBlock.props.index) {
        return false;
      }

      if (
        newBlock.props.previousHash == null ||
        !(newBlock.props.previousHash === previousBlock.props.previousHash)
      ) {
        return false;
      }

      if (
        newBlock?.props?.hash == null ||
        !(Block.calculateHash(newBlock) === newBlock.props.hash)
      ) {
        return false;
      }

      return true;
    }

    return false;
  }

  public isBlockChainValid(): boolean {
    if (!this.isFirstBlockValid()) {
      console.log('INVALID FIRST BLOCK');
      return false;
    }

    for (let i = 1; i < this.props.blocks.length; i++) {
      const currentBlock: Block = this.props.blocks[i];
      const previousBlock: Block = this.props.blocks[i - 1];

      if (!this.isValidNewBlock(currentBlock, previousBlock)) {
        return false;
      }
    }

    return true;
  }
}
