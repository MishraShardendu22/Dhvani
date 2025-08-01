import { Schema, Document, Types } from 'mongoose';

interface IBloodRequest extends Document {
  userId: Types.ObjectId;
  quantity: string;
  type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  completed: boolean;
}




const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Blood type is required'],
      trim: true,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood type',
      },
    },
    completed: {
      type: Boolean,
      required: [true, 'Completed is required'],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export { IBloodRequest, BloodRequestSchema };
