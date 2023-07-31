import { createHash } from 'crypto';

export interface BlockProperties {
  index: number;
  timestamp?: number;
  previousHash?: string;
  data: string;
  hash?: string;
  nonce?: number;
  ref?: string;
}

export class Block {
  constructor(public readonly props: BlockProperties) {
    this.props.nonce = this.props.nonce ?? 0;
    this.props.timestamp = this.props.timestamp ?? new Date().getTime();
    this.props.hash = Block.calculateHash(this);
    this.props.previousHash = this.props.previousHash ?? null;
  }

  public str(): string {
    return (
      this.props.index +
      this.props.timestamp +
      this.props.previousHash +
      JSON.stringify(this.props.data) +
      this.props.nonce
    );
  }

  public static calculateHash(block: Block) {
    if (!block?.props?.hash !== null) {
      const hash = createHash('sha256');
      const txt = block.str();
      hash.update(txt);
      const cryptoHash = hash.digest('hex');
      return cryptoHash;
    }
    return null;
  }

  proofOfWork(difficulty: number) {
    while (
      this.props?.hash?.substring(0, difficulty) !==
      Array(difficulty + 1).join('0')
    ) {
      this.props.nonce++;
      this.props.hash = Block.calculateHash(this);
    }
  }
}
