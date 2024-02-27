package com.example.cschat.config

import com.example.cschat.service.MessageService
import com.example.cschat.service.StockMessageService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DBPrepopulationConfigs(
    private val messageService: MessageService,
    private val stockMessageService: StockMessageService
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        messageService.importMessagesFromCSV()
        stockMessageService.prepopulateStockMessages()
    }
}
