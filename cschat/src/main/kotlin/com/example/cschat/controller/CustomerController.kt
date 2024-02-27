package com.example.cschat.controller

import com.example.cschat.model.Role
import com.example.cschat.model.User
import com.example.cschat.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@CrossOrigin("*")
@RestController
@RequestMapping("/user/customer")
class CustomerController {
    @Autowired
    lateinit var userService: UserService

    @PostMapping
    fun addCustomer(@RequestBody user: User): String {
        user.role = Role.CUSTOMER
        return userService.addUser(user)
    }

    @GetMapping
    fun getAllCustomers(): List<User> {
        return userService.getAllCustomers()
    }

    @GetMapping("/{userId}")
    fun getCustomerById(@PathVariable userId: Long): User? {
        return userService.getUserById(userId)
    }
}