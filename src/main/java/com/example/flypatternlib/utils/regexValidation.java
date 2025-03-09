package com.example.flypatternlib.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class regexValidation {
    public static boolean validateRegex(String regex, String input) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);
        return matcher.matches();
    }
}
