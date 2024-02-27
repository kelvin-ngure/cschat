package com.example.cschat.config

import com.example.cschat.service.MessageService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class CSVImporterConfig(private val messageService: MessageService) : CommandLineRunner {
    override fun run(vararg args: String?) {
        messageService.importMessagesFromCSV()
    }
}
