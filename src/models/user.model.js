import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  pic: { type: String,
     default:`https://www.w3schools.com/w3images/avatar2.png`
  },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  donations: [
    {
      campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
      amount: { type: Number },
      date: { type: Date, default: Date.now },
    },
  ],
  totalDonated: { type: Number, default: 0 }, 
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date },
},
 {
   timestamps: true,
});



const User = mongoose.model('User', userSchema);
export default User;
