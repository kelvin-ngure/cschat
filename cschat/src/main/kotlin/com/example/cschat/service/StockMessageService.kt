package com.example.cschat.service

import com.example.cschat.model.StockMessage
import com.example.cschat.repository.StockMessageRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class StockMessageService {

    @Autowired
    lateinit var stockMessageRepository: StockMessageRepository

    @Transactional
    fun prepopulateStockMessages() {
        val stockMessages = listOf(
            StockMessage(1, "Please send your id photo front and back and a copy of your KRA PIN"),
            StockMessage(2, "Thank you!"),
            StockMessage(3, "You're welcome")
        )
        stockMessageRepository.saveAll(stockMessages)
    }

    fun getStockMessages(): List<StockMessage> {
        return stockMessageRepository.findAll()
    }
}