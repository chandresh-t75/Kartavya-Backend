import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Bronze Donor", "Silver Donor", "Gold Donor"
  description: { type: String, required: true }, // e.g., "Awarded for donating over $500."
  milestoneAmount: { type: Number, required: true }, // Amount required to achieve this badge
  icon: { type: String }, // URL for the badge icon
  createdAt: { type: Date, default: Date.now },
},{
    timestamps:true
});

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
