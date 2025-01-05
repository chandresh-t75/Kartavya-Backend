import mongoose from 'mongoose';


const campaignSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  collectedAmount: {
    type: Number,
    default: 0,
  },
  targetAmount:{
    type:Number,
    default:0,
  },
  image: { // Add image field to store the image URL
    type: String,
    required: true,
  },
  location:{
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
   
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  status: {
    type: String,
    default:"Upcoming",
  },
  likes:{
    type: Number,
    default:0,
  }
},{
    timestamps:true
});

const Campaign= mongoose.model("Campaign", campaignSchema);
export default Campaign
