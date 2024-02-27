package com.example.cschat.controller

import com.example.cschat.model.StockMessage
import com.example.cschat.service.StockMessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin("*")
@RestController
@RequestMapping("/message/stock")
class StockMessageController {
    @Autowired lateinit var  stockMessageService: StockMessageService
    @GetMapping
    fun getStockMessages() : List<StockMessage> {
        return stockMessageService.getStockMessages()
    }
}