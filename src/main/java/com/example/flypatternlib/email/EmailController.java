package com.example.flypatternlib.email;
import com.example.flypatternlib.service.TokenService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;
    private final TokenService tokenService;

    public EmailController(EmailService emailService, TokenService tokenService) {
        this.emailService = emailService;
        this.tokenService = tokenService;
    }

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to, @RequestParam String subject, @RequestParam String text) {
        // Generate password token
        emailService.sendSimpleMessage(to, subject, text);
        return "Email sent successfully";
    }
}
