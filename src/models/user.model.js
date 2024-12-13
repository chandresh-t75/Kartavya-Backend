import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  donations: [
    {
      campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
      amount: { type: Number },
      date: { type: Date, default: Date.now },
    },
  ],
  totalDonated: { type: Number, default: 0 }, // Sum of all donations by the user
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }], // Reference to badges earned
  resetPasswordToken: { type: String }, // Token for resetting password
  resetPasswordExpires: { type: Date },
},
 {
   timestamps: true,
});



const User = mongoose.model('User', userSchema);
export default User;
