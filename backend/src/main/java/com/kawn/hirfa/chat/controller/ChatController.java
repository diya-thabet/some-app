package com.kawn.hirfa.chat.controller;

import com.kawn.hirfa.chat.domain.ChatMessage;
import com.kawn.hirfa.chat.dto.SendMessageRequest;
import com.kawn.hirfa.chat.repository.ChatMessageRepository;
import com.kawn.hirfa.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/history/{jobId}")
    public ApiResponse<List<ChatMessage>> getChatHistory(@PathVariable Long jobId) {
        List<ChatMessage> messages = chatMessageRepository.findByJobIdOrderByTimestampAsc(jobId);
        return ApiResponse.success(messages, "Chat history retrieved");
    }

    @PostMapping("/send")
    public ApiResponse<ChatMessage> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        ChatMessage message = ChatMessage.builder()
                .senderId(request.senderId())
                .receiverId(request.receiverId())
                .jobId(request.jobId())
                .content(request.content())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/job." + request.jobId(), saved);

        return ApiResponse.success(saved, "Message sent");
    }

    // WebSocket handler for real-time messaging
    @MessageMapping("/chat.send")
    public void handleWebSocketMessage(@Payload SendMessageRequest request) {
        ChatMessage message = ChatMessage.builder()
                .senderId(request.senderId())
                .receiverId(request.receiverId())
                .jobId(request.jobId())
                .content(request.content())
                .build();

        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/job." + request.jobId(), message);
    }
}
