import mongoose from 'mongoose';


const donationImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  uploadedAt: { type: Date, default: Date.now },
},
{
  timestamps:true
}
);

const DonationImage = mongoose.model('DonationImage', donationImageSchema);
export default DonationImage
