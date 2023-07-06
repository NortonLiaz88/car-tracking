import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, auto: true, required: false },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean },
  },
  { timestamps: true, collection: 'users' },
);
