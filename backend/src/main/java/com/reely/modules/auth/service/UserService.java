package com.reely.modules.auth.service;

import com.reely.modules.auth.entity.User;

public interface UserService {
    User getUserByEmail(String email);
}
