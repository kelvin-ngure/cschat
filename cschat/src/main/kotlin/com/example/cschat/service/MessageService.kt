package com.example.cschat.service

import com.example.cschat.model.*
import com.example.cschat.repository.ConversationRepository
import com.example.cschat.repository.MessageRepository
import com.example.cschat.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service
import java.io.BufferedReader
import java.io.FileReader
import java.io.InputStreamReader
import java.sql.Timestamp
import java.util.*

@Service
class MessageService {
    @Autowired
    lateinit var messageRepository: MessageRepository

    @Autowired
    lateinit var conversationService: ConversationService

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var prioritizer: Prioritizer

    private fun makeRandomName(): String {
        val charArray = "abcdefghij".toCharArray()
        charArray.shuffle()
        val shuffledString = charArray.joinToString("")
        val randomNumber = Random().nextInt(200) + 1
        return "$shuffledString$randomNumber"
    }
    @Transactional
    fun importMessagesFromCSV() {
        val resource = ClassPathResource("messages.csv")
        val br = BufferedReader(InputStreamReader(resource.inputStream))
        var line: String?
        val usersMap = mutableMapOf<Long, User>()

        // Read the CSV file line by line
        br.readLine()
        while (br.readLine().also { line = it } != null) {
            val parts = line!!.split(",").map { it.trim() }
            println(parts)
            val userId = parts[0].toLong()
            val timestamp = Timestamp.valueOf(parts[1])
            val messageBody = parts[2]
            println(userId)

            // Check if the user already exists in the map, if not, create a new user
            val user = usersMap.getOrPut(userId) {
                val name: String = makeRandomName()
                val newUser = User(name = name, role=Role.CUSTOMER) // couldn't overwrite ids. decided to reassign
                userRepository.save(newUser)
                newUser
            }
            println(user)
            // Create a new conversation associated with the user and persist it
            var conversation = conversationService.getConversationByCustomerId(user.id!!)
            if(conversation == null) {
                conversation =  conversationService.createConversation(user.id)
            }


            // Create a new message associated with the user and persist it
            val message = Message(
                author = user.id!!, // Assuming author is always the user with given ID
                text = messageBody,
                timeStamp = timestamp,
                conversationId = conversation.id!!
            )
            println(message)
            messageRepository.save(message)
        }
        br.close()
    }

    fun getAllMessages(): List<Message> {
        return messageRepository.findAll()
    }
    fun getMessagesByConversationId(conversationId: Long): List<Message> {
        return messageRepository.findAll().filter { it.conversationId == conversationId }
    }

    fun saveMessage(message: Message): Message {
        val prioritizedMessage = prioritizer.assignPriority(message)
        val conversation = conversationService.getConversationById(message.conversationId)!!
        println(message)
        println(prioritizedMessage)
        println(conversation)

        if(conversation.priority == Priority.NORMAL && prioritizedMessage.priority == Priority.HIGH) {
            val modifiedConversation = conversation.copy(priority = Priority.HIGH)
            println(modifiedConversation)
            conversationService.editConversation(modifiedConversation)
        }

        return messageRepository.save(prioritizedMessage)
    }
}