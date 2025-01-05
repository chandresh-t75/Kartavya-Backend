import mongoose from 'mongoose';

// Like schema to track which user liked which campaign
const likeSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',  // Reference to the Member (User)
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',  // Reference to the Campaign
    required: true,
  },
  likedAt: {
    type: Date,
    default: Date.now,  // Timestamp when the like was created
  },
}, 
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create an index for the combination of memberId and campaignId to ensure a user can only like a campaign once
likeSchema.index({ memberId: 1, campaignId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
