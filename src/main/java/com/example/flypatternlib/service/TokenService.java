package com.example.flypatternlib.service;
import com.example.flypatternlib.model.RestoreToken;
import com.example.flypatternlib.repository.TokenRepository;
import com.example.flypatternlib.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    public TokenService(JwtEncoder encoder, JwtDecoder decoder, TokenRepository tokenRepository, UserRepository userRepository) {
        this.encoder = encoder;
        this.decoder = decoder;
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    //Method that takes in authenticated user and returns a JWT
    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(168, ChronoUnit.HOURS)) // 1 week
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String generateRestoreToken(String email) {
        Instant now = Instant.now();

        // Build minimal JWT claims
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS)) // 1 hour
                .subject(email)
                .build();

        // Encode and return the token
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    //Method that validates a JWT string
    public Boolean validateRestoreToken(String token) {
        // Check if token has not been used already (i.e. is deleted)
        if(tokenRepository.tokenExists(token) > 0) {
            try {
                //Decode token string
                Jwt jwt = decoder.decode(token);
                //Create time stamp
                Instant now = Instant.now();
                //Get expiration time for JWT
                Instant expirationTime = jwt.getExpiresAt();
                //Return true if token exists and has not expired
                return expirationTime != null && !expirationTime.isBefore(now);
            } catch (Exception e) {
                System.out.println("Token validation failed: " + e);
                return false;
            }
        } else {
            return false;
        }
    }

    public Boolean validateToken(String token) {
        try {
            //Decode token string
            Jwt jwt = decoder.decode(token);
            //Create time stamp
            Instant now = Instant.now();
            //Get expiration time for JWT
            Instant expirationTime = jwt.getExpiresAt();
            //Return true if token exists and has not expired
            return expirationTime != null && !expirationTime.isBefore(now);
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e);
            return false;
        }
    }

    public void save(RestoreToken token) {
        tokenRepository.save(token);
    }

    public void delete(String email) {
        // Find tokens for email
        List<Integer> ids = tokenRepository.returnIds(email);
        if (ids != null) {
            for (Integer id : ids) {
                // Delete token
                tokenRepository.delete(id);
            }
        } else {
            System.out.println("No tokens found for that email");
        }

    }


    public String getUsername(String token) {
        String email = tokenRepository.findEmailByToken(token);
        return userRepository.findUsernameByEmail(email);
    }
}
