const { default: mongoose, model } = require("mongoose");

const ChatSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    userChat: {
        type: String,
        required: true,
    },
    botChat: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

 module.exports = mongoose.model("Chat", ChatSchema);
 