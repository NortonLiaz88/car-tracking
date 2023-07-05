import { Document } from 'mongoose';

export interface Block extends Document {
  index: number;
  timestamp?: number;
  previousHash?: string;
  data: string;
  hash?: string;
  nonce?: number;
}
