package com.example.cschat.model


enum class Priority {
    NORMAL, HIGH;
    companion object {
        // allows sorting messages by priority
        val comparator: Comparator<Priority> = compareBy { priority ->
            when (priority) {
                NORMAL -> 0
                HIGH -> 1
            }
        }
    }
}