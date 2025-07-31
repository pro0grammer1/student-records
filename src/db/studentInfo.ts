import mongoose from 'mongoose';

export interface StudentInterface {
  _id: mongoose.Types.ObjectId;
  roll_no: number,
  name: string,
  class: string,
  ph_no?: number
  image?: string, 
}

const studentSchema = new mongoose.Schema({
  roll_no: { type: Number, required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  ph_no: { type: Number },
  image: { type: String }
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
