package com.example.cschat.service

import com.example.cschat.model.Conversation
import com.example.cschat.repository.ConversationRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ConversationService {
    @Autowired
    lateinit var conversationRepository: ConversationRepository
    fun createConversation(customerId: Long): Conversation {
        val newConversation = Conversation(owner = customerId)
        return conversationRepository.save(newConversation)
    }

    fun editConversation(conversation: Conversation): Conversation {
        return conversationRepository.save(conversation)
    }

    fun getAllConversations(): List<Conversation> {
        return conversationRepository.findAll()
    }

    fun getConversationById(id: Long): Conversation? {
        return conversationRepository.findByIdOrNull(id)
    }

    fun getConversationByCustomerId(customerId: Long): Conversation? {
        val conversation = conversationRepository.findAll().filter { it.owner == customerId }
        if(conversation.isEmpty()) {
            return null
        }
        return conversation.first()
    }

    fun assignConversationToAgent(conversationId: Long, agentId: Long): Conversation? {
        val conversation = conversationRepository.findByIdOrNull(conversationId)
        if(conversation != null) {
            val assignedConversation = conversation.copy(assignedTo = conversationId)
            conversationRepository.save(assignedConversation)
        }
        return null
    }
}