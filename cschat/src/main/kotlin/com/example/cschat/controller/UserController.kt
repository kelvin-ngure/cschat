package com.example.cschat.controller

import com.example.cschat.model.User
import com.example.cschat.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin("*")
@RestController
@RequestMapping("/user")
class UserController {
    @Autowired lateinit var userService: UserService

    @GetMapping
    fun getAllUsers(): List<User> {
        return userService.getAllUsers()
    }
}