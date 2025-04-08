package com.example.demo.domains.user;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
public class UserDetailData implements UserDetails {

    private Long userSeq;
    private String userId;
    private String name;
    private String password;
    private String phone;
    private String email;
    private String memo;
    private String createdAt;
    private String createdBy;
    private String updatedAt;
    private String updatedBy;
    private String useYn;

    // 권한이 없다면 빈 리스트를 리턴 (필요 시 수정 가능)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getUsername() {
        return userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "Y".equalsIgnoreCase(useYn);
    }
}
