import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Bronze Donor", "Silver Donor", "Gold Donor"
  description: { type: String, required: true }, 
  milestoneAmount: { type: Number, required: true }, 
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now },
},{
    timestamps:true
});

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
