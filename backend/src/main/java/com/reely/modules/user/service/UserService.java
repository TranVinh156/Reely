package com.reely.modules.user.service;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.user.dto.UpdateProfileRequest;
import com.reely.modules.user.dto.UpdateUserRequest;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.Role;
import com.reely.modules.user.entity.User;

public interface UserService {
    UserDTO getUserByEmail(String email);

    User getUserEntityByEmail(String email);

    UserDTO createUser(RegistrationRequest request);

    UserDTO getUserById(Long id);

    UserDTO getUserByUsername(String username);

    PaginationResponse<UserDTO> getAllUser(int page, int pageSize);

    UserDTO updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);

    void updateRefreshToken(Long id, String refreshToken);

    UserDTO getUserByRefreshToken(String refreshToken);

    UserDTO convertToDto(User user);

    Role getUserRole(Long id);

    UserDTO updateUserProfile(UpdateProfileRequest request);

}
