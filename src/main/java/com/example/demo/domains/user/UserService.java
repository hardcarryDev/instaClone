package com.example.demo.domains.user;

import com.example.demo.util.ObjectUtil;
import com.example.demo.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;

    public int userSignup(Map<String, Object> params) {
        return  userMapper.insertUser(params);
    }

    public Map<String, Object> selectUserInfo(Map<String, Object> params){
        return userMapper.selectUserInfo(params);
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        HttpServletRequest req = RequestUtil.getRequest();
        Map<String,Object> params = ObjectUtil.getParameterMap(req);

        UserDetailData userDetails = null;

        Map<String,Object> user = this.selectUserInfo(params);
        if(user==null){
            throw new UsernameNotFoundException(userId+"는 없는 유저임");
        }else{
            String useYn = (String)user.get("useYn");
            if(!"Y".equalsIgnoreCase(useYn)){
                throw new UsernameNotFoundException("탈퇴한 유저입니다.");
            }

            userDetails = ObjectUtil.objectToClass(user, UserDetailData.class);
        }

        log.info("USER: {}",user.toString());


        return userDetails;
    }
}
