import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    from: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    type: {
      type: String,
      enum: [
        "like_post",
        "comment_post",
        "like_comment",
        "reply_comment",
        "friend_request",
        "friend_request_accepted",
      ],
      required: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "Posts" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comments" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications;
