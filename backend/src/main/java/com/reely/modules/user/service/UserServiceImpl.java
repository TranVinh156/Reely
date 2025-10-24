package com.reely.modules.user.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.Role;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.entity.enums.RoleName;
import com.reely.modules.user.repository.RoleRepository;
import com.reely.modules.user.repository.UserRepository;

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
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        Optional<User> userOptional = this.userRepository.findById(id);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User with id " + id + " not found."));

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
}
