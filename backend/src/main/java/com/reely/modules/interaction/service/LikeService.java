package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.LikeRequestDto;
import com.reely.modules.interaction.dto.LikeResponseDto;
import com.reely.modules.interaction.entity.Likes;

import java.util.List;

public interface LikeService {
    Likes addLike(LikeRequestDto likeRequestDTO);
    List<LikeResponseDto> getLikeByVideoId(Long videoId);
    List<LikeResponseDto> getLikeByUserId(Long userId);
    LikeResponseDto getLikeByVideoIdAndUserId(Long videoId, Long userId);
    Likes getLikeById(Long likeId);
    void deleteLike(long likeId);
}
