interface Message {
    id?: Number,
    author?: Number, 
    recepient?: Number,
    conversationId: Number,
    text: String, 
    timeStamp: String,
    priority: String
}

export default Message;