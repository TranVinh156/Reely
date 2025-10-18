package com.reely.modules.auth.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.auth.dto.UserDTO;
import com.reely.modules.auth.entity.User;
import com.reely.modules.auth.repository.UserRepository;
import com.reely.modules.auth.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        return user;
    }

    @Override
    public UserDTO createUser(RegistrationRequest request) {
        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already existed.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPassword());

        this.userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public User getUserById(Long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        return userOptional.orElseThrow(() -> new RuntimeException("User with id " + id + " not found."));
    }

    @Override
    public PaginationResponse<UserDTO> getAllUser(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        Page<User> users = this.userRepository.findAll(pageable);
        Page<UserDTO> userDTOs = users.map(user -> new UserDTO(user));
        PaginationResponse<UserDTO> response = new PaginationResponse<>(userDTOs);
        return response;
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = this.getUserById(id);
        if (userDTO.getAvatarUrl() != null) {
            user.setAvatarUrl(userDTO.getAvatarUrl());
        }
        if (userDTO.getBio() != null) {
            user.setBio(userDTO.getBio());
        }
        if (userDTO.getDisplayName() != null) {
            user.setDisplayName(userDTO.getDisplayName());
        }
        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        this.userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public void deleteUser(Long id) {
        this.userRepository.deleteById(id);
    }

    @Override
    public void updateRefreshToken(Long id, String refreshToken) {
        User user = this.getUserById(id);
        user.setRefreshToken(refreshToken);
        this.userRepository.save(user);
    }

}
