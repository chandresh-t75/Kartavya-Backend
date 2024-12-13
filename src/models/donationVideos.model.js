import mongoose from 'mongoose';


const donationVideoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  uploadedAt: { type: Date, default: Date.now },
},{
    timestamps:true
});

const DonationVideo= mongoose.model('DonationVideo', donationVideoSchema);
export default DonationVideo
