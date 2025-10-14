package com.reely.modules.auth.service.impl;

import com.reely.modules.auth.entity.User;
import com.reely.modules.auth.repository.UserRepository;
import com.reely.modules.auth.service.UserService;

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

}
