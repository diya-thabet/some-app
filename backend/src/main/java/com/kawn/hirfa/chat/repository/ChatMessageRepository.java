package com.kawn.hirfa.chat.repository;

import com.kawn.hirfa.chat.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByJobIdOrderByTimestampAsc(Long jobId);
}
