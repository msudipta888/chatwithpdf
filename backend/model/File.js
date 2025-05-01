const { default: mongoose } = require("mongoose");

const FileSchema = new mongoose.Schema({
    fileId:{
        type: String,
        required: true,
    },
    fileName:{
        type: String,
        required: true,
    },
    filePath:{
        type: String,
        required: true,
    },
    FileSize:{
        type: Number,
    },
    uploadAt:{
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model("File", FileSchema);