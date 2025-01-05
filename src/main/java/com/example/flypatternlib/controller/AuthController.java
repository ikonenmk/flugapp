package com.example.flypatternlib.controller;
import com.example.flypatternlib.email.EmailService;
import com.example.flypatternlib.model.RestoreToken;
import com.example.flypatternlib.model.UserRegRequest;
import com.example.flypatternlib.service.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager, EmailService emailService) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    // Endpoint for JWT token
    @PostMapping("/token")
    public String token(@RequestBody UserRegRequest userLogin) {
        //Authenticate using username and password
        System.out.println("username: " +userLogin.username());
        System.out.println("password: " +userLogin.password());
        try {
            Authentication test = new UsernamePasswordAuthenticationToken(userLogin.username(), userLogin.password());
            System.out.println("token is: " +test);
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLogin.username(), userLogin.password()));
            System.out.println("Authentication created successfully");
            return tokenService.generateToken(authentication);
        } catch (AuthenticationException e) {
            System.out.println("Authentication failed: " +e.getMessage());
            throw e;
        }
    }

    // Endpoint for validating token
    @GetMapping("/validate")
    public Boolean validateToken(@RequestParam String token) {
        System.out.println("Token is: " + token);
        Boolean isValid = tokenService.validateToken(token);
        System.out.println("Token is = " + isValid);
        return isValid;
    }

    // Endpoint for returning username
    @GetMapping("/username")
    public String home(Principal principal) {
        return principal.getName();
    }

    // Endpoint for restoring password
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/restore")
    public void restoreToken(@RequestParam String email) {
        // generate a restore token
        String tokenString = tokenService.generateRestoreToken(email);
        RestoreToken newToken = new RestoreToken();
        newToken.setTokenString(tokenString);
        newToken.setEmail(email);

        // save token and email to database
        tokenService.save(newToken);

        // Send email with token link
        System.out.println("token is: " + tokenString);
        String subject = "Restore your password";
        String restorationLink = "https://flylib.duckdns.org/restore/"+tokenString;
        String text = "You have requested a password restoration link. Click on this link to restore your password: " + restorationLink;
        emailService.sendSimpleMessage(email, subject, text);
    }

    // Endpoint for validating restoreToken
    @GetMapping("/restore")
    public Boolean validateRestoreToken(@RequestParam String token) {
        return tokenService.validateRestoreToken(token);
    }

    // Endpoint for getting username associated with a restore token
    @GetMapping("/restore/email")
    public String getEmail(@RequestParam String token) {
        return tokenService.getUsername(token);
    }
}



