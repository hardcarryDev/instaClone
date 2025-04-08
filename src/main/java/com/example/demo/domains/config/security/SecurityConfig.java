package com.example.demo.domains.config.security;

import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import com.example.demo.domains.user.UserDetailData;
import com.example.demo.domains.user.UserService;
import com.example.demo.util.ObjectUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final String LOGIN_PAGE = "/login";
    private final String LOGIN_CHECK = "/user/login";
    private final String[] SKIP_URL = new String[]{
        "/login",
        "/signup",
        "/css/**",
        "/js/**"
    };

    private final UserService userService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(SKIP_URL).permitAll()
                    .anyRequest().authenticated()
            )
            .formLogin(form -> form
                    .loginPage(LOGIN_PAGE)
                    .usernameParameter("userId")
//                    .passwordParameter("password") 기본이 password여서 안적어도됌
                    .loginProcessingUrl(LOGIN_CHECK)
                    .successHandler(new LoginSuccessHandler(userService))
                    .failureHandler(new LoginFailureHandler(userService))
                    .permitAll()
            )
            .logout(logout -> logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login?logout=true")
            );


        return http.build();
    }

    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(11);
    }

    // 아래 AuthenticationManager 코드는 생략해도됀다.
    // 셋팅안해도 기본적으로 DaoAuthenticationProvider로 지정되기 때문에
    // 그걸 사용할 경우엔 authenticationProvider 만 커스텀하면됌
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       AuthenticationProvider customAuthProvider) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(customAuthProvider)
                .build();
    }


    @Bean
    AuthenticationProvider authenticationProvider(UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder){
        DaoAuthenticationProvider dap = new DaoAuthenticationProvider();
        dap.setUserDetailsService(userService);
        dap.setPasswordEncoder(bCryptPasswordEncoder);
        dap.setHideUserNotFoundExceptions(false);
//        dap.setPreAuthenticationChecks(new IcsPreChecker(userService));
//        dap.setPostAuthenticationChecks(new IcsPostChecker(userService,bCryptPasswordEncoder,initPwd));
        return dap;
    }



    protected class LoginSuccessHandler implements AuthenticationSuccessHandler {
        // 필요한 서비스 주입 가능
        private final UserService userService;

        public LoginSuccessHandler(UserService userService) {
            this.userService = userService;
        }

        @Override
        public void onAuthenticationSuccess(HttpServletRequest request,
                                            HttpServletResponse response,
                                            Authentication auth)
                throws IOException, ServletException {

            UserDetailData user = (UserDetailData)auth.getPrincipal();

            //로그인 성공
            userService.updateLoginInfo(user.getUserId());



            Map<String,Object> rsltMap = new HashMap<String,Object>();
            rsltMap.put("redirect", "/home");
            response.getOutputStream().println(ObjectUtil.toJson(new ResultData(ApiResultEnum.SUCCESS,rsltMap)));
        }
    }

    @RequiredArgsConstructor
    public class LoginFailureHandler implements AuthenticationFailureHandler {

        private final UserService userService; // 실패 횟수 업데이트용

        @Override
        public void onAuthenticationFailure(HttpServletRequest request,
                                            HttpServletResponse response,
                                            AuthenticationException exception)
                throws IOException, ServletException {

            String userId = request.getParameter("userId");

            // 실패 횟수 업데이트
            if (userId != null && !userId.isEmpty()) {
                userService.updateLoginFailCount(userId);
            }

            // 응답 포맷 지정
            Map<String, Object> rsltMap = new HashMap<>();
            rsltMap.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(ObjectUtil.toJson(new ResultData(ApiResultEnum.ERROR, rsltMap)));
        }
    }
}