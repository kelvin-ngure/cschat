interface Conversation {
    id?: number,
    owner: number,
    resolved: boolean,
    assignedTo: number
}

export default Conversation;