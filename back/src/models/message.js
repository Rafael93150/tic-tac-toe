import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		fromUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toRoom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Room",
			required: false,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
