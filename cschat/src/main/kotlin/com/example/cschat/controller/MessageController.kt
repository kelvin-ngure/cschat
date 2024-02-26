package com.example.cschat.controller

import com.example.cschat.model.Message
import com.example.cschat.service.MessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@CrossOrigin("*")
@RestController
@RequestMapping("/message")
class MessageController {
    @Autowired
    lateinit var messageService: MessageService

    @PostMapping
    fun saveMessage(@RequestBody message: Message): Message {
        return messageService.saveMessage(message)
    }

    @GetMapping
    fun getAllMessages(): List<Message> {
        return messageService.getAllMessages()
    }
}