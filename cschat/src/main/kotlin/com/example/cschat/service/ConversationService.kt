package com.example.cschat.service

import com.example.cschat.model.Conversation
import com.example.cschat.repository.ConversationRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ConversationService {
    @Autowired
    lateinit var conversationRepository: ConversationRepository
    fun createConversation(customerId: Long): Conversation {
        val newConversation = Conversation(owner = customerId)
        saveConversation(newConversation)
        return getConversationByCustomerId(customerId)!!
    }

    fun saveConversation(conversation: Conversation) {
        conversationRepository.save(conversation)
    }

    fun getAllConversations(): List<Conversation> {
        return conversationRepository.findAll()
    }

    fun getConversationByCustomerId(customerId: Long): Conversation? {
        val conversation = conversationRepository.findAll().filter { it.owner == customerId }
        if(conversation.isEmpty()) {
            return null
        }
        return conversation.first()
    }
}