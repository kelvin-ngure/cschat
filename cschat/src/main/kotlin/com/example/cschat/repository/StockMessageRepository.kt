package com.example.cschat.repository

import com.example.cschat.model.StockMessage
import org.springframework.data.jpa.repository.JpaRepository

interface StockMessageRepository: JpaRepository<StockMessage, Long>