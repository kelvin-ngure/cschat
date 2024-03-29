package com.example.cschat.controller

import com.example.cschat.model.Role
import com.example.cschat.model.User
import com.example.cschat.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@CrossOrigin("*")
@RestController
@RequestMapping("/user/agent")
class AgentController {
    @Autowired
    lateinit var userService: UserService

    @PostMapping
    fun addAgent(@RequestBody user: User): String {
        val modified = user.copy(
            role = Role.AGENT
        )
        return userService.addUser(modified)
    }

    @GetMapping
    fun getAllAgents(): List<User> {
        return userService.getAllAgents()
    }
}