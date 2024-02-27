package com.example.cschat.service

import com.example.cschat.model.Message
import com.example.cschat.model.Priority
import org.springframework.stereotype.Service

@Service
class Prioritizer {

    private val keywords = listOf(
        "when", "today", "??", "!!", "must", "now", "soon", "quickly", "fast", "urgent", "deadline"
    )
    fun containsKeyword(text: String): Boolean {
        val lowercaseText = text.lowercase()

        return keywords.any { keyword ->
            lowercaseText.contains(keyword.lowercase())
        }
    }
    fun assignPriority(message: Message): Message {
        if(containsKeyword(message.text)) {
            return message.copy(priority = Priority.HIGH)
        }
        return message.copy(priority = Priority.NORMAL)
    }
}