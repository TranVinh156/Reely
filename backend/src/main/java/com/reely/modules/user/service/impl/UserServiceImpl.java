package com.reely.modules.user.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.user.dto.UpdateUserRequest;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.Role;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.entity.enums.RoleName;
import com.reely.modules.user.repository.RoleRepository;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException(email);
        }
        return convertToDto(user.get());
    }

    @Override
    public User getUserEntityByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException(email);
        }
        return user.get();
    }

    @Override
    public UserDTO createUser(RegistrationRequest request) {
        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already existed.");
        }

        Role role = this.roleRepository.findByName(RoleName.USER).get();

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPassword());
        user.setRole(role);

        this.userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User with id " + id + " not found."));
        return convertToDto(user);
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
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        Optional<User> userOptional = this.userRepository.findById(id);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User with id " + id + " not found."));

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
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
        Optional<User> userOptional = this.userRepository.findById(id);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User with id " + id + " not found."));
        user.setRefreshToken(refreshToken);
        this.userRepository.save(user);
    }

    @Override
    public UserDTO getUserByRefreshToken(String refreshToken) {
        Optional<User> user = this.userRepository.findByRefreshToken(refreshToken);
        return convertToDto(user.orElseThrow(() -> new RuntimeException("User with this refresh token not found.")));
    }

    public UserDTO convertToDto(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setDisplayName(user.getDisplayName());
        userDTO.setBio(user.getBio());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    @Override
    public Role getUserRole(Long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User with id " + id + " not found.");
        }
        return userOptional.get().getRole();
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        List<User> user = this.userRepository.findByUsername(username);
        if (user.size() == 0) {
            throw new RuntimeException("User with username " + username + " not found.");
        }
        return this.convertToDto(user.get(0));
    }
}
