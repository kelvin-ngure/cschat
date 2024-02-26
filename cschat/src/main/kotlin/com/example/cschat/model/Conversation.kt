package com.example.cschat.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
@Entity
data class Conversation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val owner: Long = 0, // customer is owner
    val resolved: Boolean = false,
    val assignedTo: Long? = null, // agent
)
