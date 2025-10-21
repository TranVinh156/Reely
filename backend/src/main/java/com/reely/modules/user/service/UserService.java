package com.reely.modules.user.service;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.User;

public interface UserService {
    User getUserByEmail(String email);

    UserDTO createUser(RegistrationRequest request);

    User getUserById(Long id);

    PaginationResponse<UserDTO> getAllUser(int page, int pageSize);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);

    void updateRefreshToken(Long id, String refreshToken);

    User getUserByRefreshToken(String refreshToken);
}
