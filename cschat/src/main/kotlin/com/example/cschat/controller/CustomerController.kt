package com.example.cschat.controller

import com.example.cschat.model.User
import com.example.cschat.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

class CustomerController {
    @Autowired
    lateinit var userService: UserService

    @PostMapping
    fun addCustomer(@RequestBody user: User): String {
        return userService.addUser(user)
    }

    @GetMapping
    fun getAllCustomers(): List<User> {
        return userService.getAllCustomers()
    }
}