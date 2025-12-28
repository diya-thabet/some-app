package com.kawn.hirfa.auth.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.auth.dto.AuthenticationRequest;
import com.kawn.hirfa.auth.dto.AuthenticationResponse;
import com.kawn.hirfa.auth.dto.RegisterRequest;
import com.kawn.hirfa.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final JwtService jwtService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = repository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow();
        // Here we would verify OTP. For now, trust the phone number login.
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
