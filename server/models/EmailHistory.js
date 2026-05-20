import mongoose from "mongoose";

const emailHistorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    emailBody: {
      type: String,
      required: true,
    },
    linkedInDm: {
      type: String,
      required: true,
    },
    followUpEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("EmailHistory", emailHistorySchema);
