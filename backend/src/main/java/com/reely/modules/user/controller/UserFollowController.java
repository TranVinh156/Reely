package com.reely.modules.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.service.UserFollowService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/users")
public class UserFollowController {
    private final UserFollowService userFollowService;

    public UserFollowController(UserFollowService userFollowService) {
        this.userFollowService = userFollowService;
    }

    @PostMapping("/{id}/follow/{targetId}")
    public ResponseEntity<String> followUser(@PathVariable long id, @PathVariable long targetId) {
        this.userFollowService.followUser(id, targetId);
        return ResponseEntity.ok().body("Following successfully");
    }

    @DeleteMapping("/{id}/unfollow/{targetId}")
    public ResponseEntity<String> unfollowUser(@PathVariable long id, @PathVariable long targetId) {
        this.userFollowService.unfollowUser(id, targetId);
        return ResponseEntity.ok().body("Unfollowing successfully");
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserDTO>> getFollowers(@PathVariable Long id) {
        return ResponseEntity.ok(userFollowService.getFollowers(id));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDTO>> getFollowing(@PathVariable Long id) {
        return ResponseEntity.ok(userFollowService.getFollowing(id));
    }

    @GetMapping("/{id}/followers/count")
    public ResponseEntity<Long> getFollowersCount(@PathVariable Long id) {
        return ResponseEntity.ok(userFollowService.getFollowersCount(id));
    }

    @GetMapping("/{id}/following/count")
    public ResponseEntity<Long> getFollowingCount(@PathVariable Long id) {
        return ResponseEntity.ok(userFollowService.getFollowingCount(id));
    }
}
