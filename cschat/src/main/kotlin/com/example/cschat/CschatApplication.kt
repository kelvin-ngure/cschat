package com.example.cschat

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories(basePackages = ["com.example.cschat.repository"])
class CschatApplication

fun main(args: Array<String>) {
	runApplication<CschatApplication>(*args)
}
