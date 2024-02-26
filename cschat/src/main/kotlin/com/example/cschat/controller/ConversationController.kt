package com.example.cschat.controller

import com.example.cschat.model.Conversation
import com.example.cschat.model.Message
import com.example.cschat.model.User
import com.example.cschat.service.ConversationService
import com.example.cschat.service.MessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@CrossOrigin("*")
@RestController
@RequestMapping("/conversation")
class ConversationController {
    @Autowired
    lateinit var conversationService: ConversationService
    @Autowired
    lateinit var messageService: MessageService

    @PostMapping
    fun createConversation(@RequestBody user: User): Conversation {
        return conversationService.createConversation(user.id)
    }

    @GetMapping
    fun getAllConversations(): List<Conversation> {
        return conversationService.getAllConversations()
    }

    @GetMapping("/customer/{customerId}")
    fun getConversationByCustomerId(@PathVariable customerId: Long): Conversation? {
        return conversationService.getConversationByCustomerId(customerId)
    }

    @GetMapping("/{conversationId}")
    fun getAllMessagesInConversation(@PathVariable conversationId: Long): List<Message> {
        return messageService.getAllMessages().filter { it.conversationId == conversationId }
    }

    @GetMapping("/latest/{conversationId}")
    fun getLatestMessageInConversation(@PathVariable conversationId: Long): List<Message> {
        val conversations = messageService.getMessagesByConversationId(conversationId)
        if(conversations.isNotEmpty()) return listOf(conversations.last())
        return conversations
    }
}