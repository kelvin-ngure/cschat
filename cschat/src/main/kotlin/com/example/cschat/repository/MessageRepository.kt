package com.example.cschat.repository

import com.example.cschat.model.Message
import org.springframework.data.jpa.repository.JpaRepository

interface MessageRepository: JpaRepository<Message, Long>