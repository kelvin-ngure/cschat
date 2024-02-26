package com.example.cschat.service

import com.example.cschat.model.Message
import com.example.cschat.repository.MessageRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageService {
    @Autowired
    lateinit var messageRepository: MessageRepository

    fun getAllMessages(): List<Message> {
        return messageRepository.findAll()
    }
    fun getMessagesByConversationId(conversationId: Long): List<Message> {
        return messageRepository.findAll().filter { it.conversationId == conversationId }
    }

    fun saveMessage(message: Message): Message {
        messageRepository.save(message)
        return message
    }
}