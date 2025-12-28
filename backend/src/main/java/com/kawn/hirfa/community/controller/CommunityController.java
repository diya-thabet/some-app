package com.kawn.hirfa.community.controller;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.common.api.ApiResponse;
import com.kawn.hirfa.community.domain.Story;
import com.kawn.hirfa.community.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final StoryRepository storyRepository;

    @PostMapping("/stories")
    public ApiResponse<Story> postStory(
            @AuthenticationPrincipal User user,
            @RequestBody StoryRequest request) {
        Story story = Story.builder()
                .user(user)
                .mediaUrl(request.mediaUrl())
                .caption(request.caption())
                .build();
        return ApiResponse.success(storyRepository.save(story), "Story posted!");
    }

    @GetMapping("/feed")
    public ApiResponse<List<Story>> getFeed() {
        // Return stories from last 24 hours
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        return ApiResponse.success(storyRepository.findAllActive(yesterday), "Community Feed");
    }

    public record StoryRequest(String mediaUrl, String caption) {
    }
}
