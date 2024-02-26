package com.example.cschat.controller

import com.example.cschat.model.Message
import com.example.cschat.service.MessageService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin

@CrossOrigin("*")
@Controller
class WSMessageController {

    @Autowired
    private lateinit var simpMessagingTemplate: SimpMessagingTemplate

    @Autowired
    private lateinit var messageService: MessageService

    // when customer sends message to all agents in general, they receive the message back after is saved successfully
    @MessageMapping("/send_to_agents")
    @SendTo("/topic/read_public")
    fun messageAgents(message: Message): Message {
        // message could already be saved e.g. when we are only calling this function to bounce back the processed message to the agent that sent it
        if(message.id == null) { // if there is no message id, the message is coming from a customer
            val savedMessage = messageService.saveMessage(message)
            simpMessagingTemplate.convertAndSendToUser(savedMessage.author.toString(), "/private", savedMessage) // bounce processed message back to customer
            return savedMessage
        }

        return message // if message is returned as is, it means it is being bounced back to the agent from the messageCustomer() function below
    }

    // when agent messages user, the processed and saved message is sent back to them via messageAgents(). the conversation id organizes it automatically on the UI
    @MessageMapping("/send_to_customer") // used by agent
    fun messageCustomer(@Payload message: Message): Message {
        val savedMessage = messageService.saveMessage(message)
        messageAgents(savedMessage)
        simpMessagingTemplate.convertAndSendToUser(savedMessage.recipient.toString(), "/private", savedMessage)
        return savedMessage
    }

}