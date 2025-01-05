import mongoose from 'mongoose';


const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "Member",
  }, 
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  profileImage: { 
    type: String,
    default:"https://www.w3schools.com/w3images/avatar2.png"
    
   }, 
},
{
    timestamps:true
});

const Member = mongoose.model("Member", memberSchema);
export default Member;
