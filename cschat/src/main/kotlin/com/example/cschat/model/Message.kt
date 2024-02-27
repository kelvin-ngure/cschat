package com.example.cschat.model

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.sql.Timestamp

@Entity
data class Message(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val author: Long = 0,
    val recipient: Long = 0,
    val conversationId: Long = 0,
    val text: String = "",
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val timeStamp: Timestamp = Timestamp(System.currentTimeMillis()),
    val priority: Priority = Priority.NORMAL
)
