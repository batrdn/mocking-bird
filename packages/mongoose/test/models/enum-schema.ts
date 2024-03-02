import mongoose from 'mongoose';

export enum Authors {
  DOSTOEVSKY = 'DOSTOEVSKY',
  NIEZTSHE = 'NIEZTSHE',
  KAFKA = 'KAFKA',
  TOLSTOY = 'TOLSTOY',
  HEMINGWAY = 'HEMINGWAY',
}

export const AuthorSchema = new mongoose.Schema(
  {
    authors: [{ type: String, enum: Authors }],
  },
  { _id: false, timestamps: false },
);
