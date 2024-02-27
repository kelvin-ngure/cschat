interface Message {
    id?: Number,
    author?: Number, 
    recipient?: Number,
    conversationId: Number,
    text: String, 
    timeStamp: String,
    priority?: String
}

export default Message;