package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.LikeRequestDto;
import com.reely.modules.interaction.dto.LikeResponseDto;
import com.reely.modules.interaction.entity.Like;

import java.util.List;

public interface LikeService {
    Like addLike(LikeRequestDto likeRequestDTO);
    List<LikeResponseDto> getLikeByVideoId(Long videoId);
    List<LikeResponseDto> getLikeByUserId(Long userId);
    LikeResponseDto getLikeByVideoIdAndUserId(Long videoId, Long userId);
    Like getLikeById(Long likeId);
    void deleteLike(long likeId);
}
