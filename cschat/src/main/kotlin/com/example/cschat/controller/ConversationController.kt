package com.example.cschat.controller

import com.example.cschat.model.Conversation
import com.example.cschat.model.Message
import com.example.cschat.model.User
import com.example.cschat.service.ConversationService
import com.example.cschat.service.MessageService
import org.apache.coyote.Response
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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
        return conversationService.createConversation(user.id!!)
    }

    @GetMapping
    fun getAllConversations(): List<Conversation> {
        return conversationService.getAllConversations()
    }

    @GetMapping("/{conversationId}")
    fun getConversationById(@PathVariable conversationId: Long) : Conversation? {
        return conversationService.getConversationById(conversationId)
    }

    @GetMapping("/customer/{customerId}")
    fun getConversationByCustomerId(@PathVariable customerId: Long): Conversation? {
        return conversationService.getConversationByCustomerId(customerId)
    }

    @GetMapping("/{conversationId}/messages")
    fun getAllMessagesInConversation(@PathVariable conversationId: Long): List<Message> {
        return messageService.getAllMessages().filter { it.conversationId == conversationId }
    }

    @GetMapping("/latest/{conversationId}")
    fun getLatestMessageInConversation(@PathVariable conversationId: Long): List<Message> {
        val conversations = messageService.getMessagesByConversationId(conversationId)
        if(conversations.isNotEmpty()) return listOf(conversations.last())
        return conversations
    }

    @PostMapping("/assign/{agentId}")
    fun selfAssignConversation(
        @RequestBody conversation: Conversation,
        @PathVariable agentId: Long
    ): Conversation {
        val currentState = conversationService.getConversationById(conversation.id)!!
        if(currentState.resolved || currentState.assignedTo != null) {
            return currentState
        }

        val assigned = conversationService.editConversation(currentState.copy(assignedTo = agentId))
        return assigned
    }
}