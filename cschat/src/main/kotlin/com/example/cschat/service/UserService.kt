package com.example.cschat.service

import com.example.cschat.repository.UserRepository
import com.example.cschat.model.Role
import com.example.cschat.model.User
import com.google.gson.Gson
import org.springframework.beans.factory.annotation.Autowired

class UserService {

    @Autowired
    lateinit var userRepository: UserRepository

    fun addUser(user: User): String {
        userRepository.save(user)
        return Gson().toJson(user)
    }

    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }

    fun getAllCustomers(): List<User> {
        return userRepository.findAll().filter { it.role == Role.CUSTOMER }
    }

    fun getAllAgents(): List<User> {
        return userRepository.findAll().filter { it.role == Role.AGENT }
    }
}