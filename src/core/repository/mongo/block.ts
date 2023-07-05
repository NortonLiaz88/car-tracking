import * as mongoose from 'mongoose';

export const BlockSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    index: { type: Number },
    timestamp: { type: Number },
    data: { type: String },
    hash: { type: String },
    nonce: { type: Number },
  },
  { timestamps: true, collection: 'blocks' },
);
