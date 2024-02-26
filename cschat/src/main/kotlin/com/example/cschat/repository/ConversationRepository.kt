package com.example.cschat.repository

import com.example.cschat.model.Conversation
import org.springframework.data.jpa.repository.JpaRepository

interface ConversationRepository: JpaRepository<Conversation, Long>