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
  }, // e.g., Member, Volunteer, Organizer
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  address: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  profileImage: { type: String }, // URL to the member's profile image
},
{
    timestamps:true
});

const Member = mongoose.model("Member", memberSchema);
export default Member;
