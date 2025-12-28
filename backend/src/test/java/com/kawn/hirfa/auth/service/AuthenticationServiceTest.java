package com.kawn.hirfa.auth.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.auth.domain.UserRole;
import com.kawn.hirfa.auth.dto.AuthenticationRequest;
import com.kawn.hirfa.auth.dto.AuthenticationResponse;
import com.kawn.hirfa.auth.dto.RegisterRequest;
import com.kawn.hirfa.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthenticationService service;

    private RegisterRequest registerRequest;
    private AuthenticationRequest authRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .fullName("Dhia Test")
                .phoneNumber("55123456")
                .role(UserRole.PROVIDER)
                .build();

        authRequest = AuthenticationRequest.builder()
                .phoneNumber("55123456")
                .build();

        user = User.builder()
                .id(1L)
                .fullName("Dhia Test")
                .phoneNumber("55123456")
                .role(UserRole.PROVIDER)
                .build();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(repository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

        AuthenticationResponse response = service.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        verify(repository, times(1)).save(any(User.class));
    }

    @Test
    void shouldAuthenticateUserSuccessfully() {
        when(repository.findByPhoneNumber("55123456")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

        AuthenticationResponse response = service.authenticate(authRequest);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
    }
}
