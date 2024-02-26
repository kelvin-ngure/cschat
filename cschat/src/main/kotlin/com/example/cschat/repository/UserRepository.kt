package com.example.cschat.repository

import com.example.cschat.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long>