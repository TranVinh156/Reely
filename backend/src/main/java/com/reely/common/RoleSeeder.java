package com.reely.common;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.reely.modules.user.entity.Role;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.entity.enums.RoleName;
import com.reely.modules.user.repository.RoleRepository;
import com.reely.modules.user.repository.UserRepository;

@Component
public class RoleSeeder implements ApplicationListener<ContextRefreshedEvent> {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${super.admin.email}")
    private String email;

    @Value("${super.admin.password}")
    private String password;

    @Value("${super.admin.username}")
    private String username;

    public RoleSeeder(RoleRepository roleRepository, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        initRole();
        initSuperAdmin();
    }

    private void initRole() {
        RoleName[] roleNames = new RoleName[] { RoleName.USER, RoleName.ADMIN, RoleName.SUPER_ADMIN };
        Map<RoleName, String> roleDescriptions = Map.of(
                RoleName.USER, "Default user role",
                RoleName.ADMIN, "Admin role",
                RoleName.SUPER_ADMIN, "Super admin role who can create admin");

        Arrays.stream(roleNames).forEach((roleName) -> {
            Optional<Role> optionalRole = this.roleRepository.findByName(roleName);

            if (!optionalRole.isPresent()) {
                Role role = new Role();
                role.setName(roleName);
                role.setDescription(roleDescriptions.get(roleName));
                this.roleRepository.save(role);
            }
        });
    }

    private void initSuperAdmin() {
        Optional<User> userOptional = this.userRepository.findByEmail(email);
        Optional<Role> roleOptional = this.roleRepository.findByName(RoleName.SUPER_ADMIN);

        if (roleOptional.isPresent() && !userOptional.isPresent()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(this.passwordEncoder.encode(password));
            user.setRole(roleOptional.get());
            this.userRepository.save(user);
        } else {
            return;
        }
    }
}
