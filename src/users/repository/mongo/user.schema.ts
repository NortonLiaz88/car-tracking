import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean },
  },
  { timestamps: true, collection: 'users' },
);
