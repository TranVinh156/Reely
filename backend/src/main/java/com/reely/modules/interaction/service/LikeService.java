package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.LikeRequestDTO;
import com.reely.modules.interaction.dto.LikeResponseDTO;
import com.reely.modules.interaction.entity.Like;

import java.util.List;

public interface LikeService {
    Like addLike(LikeRequestDTO likeRequestDTO);
    List<LikeResponseDTO> getLikeByVideoId(Long videoId);
    List<LikeResponseDTO> getLikeByUserId(Long userId);
    LikeResponseDTO getLikeByVideoIdAndUserId(Long videoId, Long userId);
    Like getLikeById(Long likeId);
    void deleteLike(long likeId);
}
