package com.reely.modules.interaction.controller;

import com.reely.modules.interaction.dto.LikeRequestDto;
import com.reely.modules.interaction.entity.Like;
import com.reely.modules.interaction.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {
    LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<Like> getLikeByVideoIdAndUserId(
            @RequestBody LikeRequestDto likeRequestDTO
    ) {
        Like like = likeService.addLike(likeRequestDTO);
        return ResponseEntity.ok(like);
    }

    @GetMapping("{likeId}")
    public ResponseEntity<Like> getLikeByVideoIdAndUserId( @PathVariable Long likeId) {
        return ResponseEntity.ok(likeService.getLikeById(likeId));
    }

    @DeleteMapping("/{likeId}")
    public void deleteLikeById(@PathVariable Long likeId) {
        likeService.deleteLike(likeId);
    }


}
