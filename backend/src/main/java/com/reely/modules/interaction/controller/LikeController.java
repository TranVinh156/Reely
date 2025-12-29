package com.reely.modules.interaction.controller;

import com.reely.modules.interaction.dto.LikeRequestDto;
import com.reely.modules.interaction.dto.LikeResponseDto;
import com.reely.modules.interaction.dto.LikeStat;
import com.reely.modules.interaction.entity.Likes;
import com.reely.modules.interaction.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {
    LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<Likes> addLike(
            @RequestBody LikeRequestDto likeRequestDTO,
            @RequestHeader("X-UserId") Long userId
    ) {
        likeRequestDTO.setUserId(userId);
        Likes like = likeService.addLike(likeRequestDTO);
        return ResponseEntity.ok(like);
    }

    @GetMapping("{likeId}")
    public ResponseEntity<Likes> getLikeByVideoIdAndUserId(@PathVariable Long likeId) {
        return ResponseEntity.ok(likeService.getLikeById(likeId));
    }

    @GetMapping()
    public ResponseEntity<List<LikeStat>> getLikeStat(@RequestHeader("X-UserId") Long userId, @RequestParam Long days) {
        return ResponseEntity.ok(likeService.countLikesByUserIdAndDate(userId, days));
    }

    @GetMapping("/stat-age")
    public ResponseEntity<List<Long>> getAllLikeStatAge(@RequestHeader("X-UserId") Long userId) {
        return ResponseEntity.ok(likeService.statisticLikesUserAge(userId));
    }

    @DeleteMapping("/{likeId}")
    public void deleteLikeById(@PathVariable Long likeId) {
        likeService.deleteLike(likeId);
    }

    @DeleteMapping
    public void deleteLikeByVideoId(
            @RequestParam Long videoId,
            @RequestHeader("X-UserId") Long userId
    ) {
        likeService.deleteLikeByVideoIdAndUserId(videoId, userId);
    }


}
