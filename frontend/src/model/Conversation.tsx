interface Conversation {
    id?: number,
    owner: number,
    resolved: boolean,
    assignedTo: number,
    priority?: String
}

export default Conversation;