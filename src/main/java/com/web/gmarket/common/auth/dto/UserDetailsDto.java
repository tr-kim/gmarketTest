package com.web.gmarket.common.auth.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.web.gmarket.common.utils.UserRole;
import com.web.gmarket.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.Delegate;
import lombok.extern.slf4j.Slf4j;

/**
 * Spring Security에서 사용되는 UserDetails 인터페이스를 정의한 DTO 클래스입니다.
 */

@Slf4j
@Getter
@AllArgsConstructor
public class UserDetailsDto implements UserDetails, Serializable {

	private static final long serialVersionUID = 1L;

	// @Delegate 어노테이션을 사용하여 UserDto 객체의 메서드를 이 클래스에서 직접 사용할 수 있게 합니다.
    @Delegate
    private UserDto userDto;

    /**
     * 사용자의 권한 목록을 반환합니다.
     *
     * @return Collection<? extends GrantedAuthority>
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    	
    	// 등급에 따라 사용자 룰 추가
        int userGrade = userDto.getUserGrade();
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        
        switch (userGrade) {
			case 0:
				authorities.add(new SimpleGrantedAuthority(UserRole.SUPER.getValue()));			// 슈퍼관리자
				break;
			case 1:
				authorities.add(new SimpleGrantedAuthority(UserRole.ADMIN.getValue()));			// 관리자
				break;
			case 2:
				authorities.add(new SimpleGrantedAuthority(UserRole.USER.getValue()));			// 사용자
				break;
			case 3:
				authorities.add(new SimpleGrantedAuthority(UserRole.COMMON.getValue()));		// 일반
				break;
			default:
				authorities.add(new SimpleGrantedAuthority(UserRole.OPERATOR.getValue()));		// 그 외
				break;
		}

        return authorities;
    }
    
    /**
     * 사용자의 아이디를 반환합니다.
     *
     * @return String
     */
    public String getUserId() {
        return userDto.getUserId();
    }
    
    /**
     * 사용자의 권한을 반환합니다.
     *
     * @return String
     */
    public String getUserGrade() {
    	
    	int userGrade = userDto.getUserGrade();
    	String str = "슈퍼관리자";
    	
    	switch (userGrade) {
			case 0:
				str = "슈퍼관리자";	// 슈퍼관리자
				break;
			case 1:
				str = "관리자";		// 관리자
				break;
			case 2:
				str = "사용자";		// 사용자
				break;
			case 3:
				str = "일반";		// 일반
				break;
			default:
				str = "그 외";			// 그 외
				break;
    	}
        return str;
    }


    /**
     * 사용자의 비밀번호를 반환합니다.
     *
     * @return String
     */
    @Override
    public String getPassword() {
        return userDto.getUserPwd();
    }


    /**
     * 사용자의 이름을 반환합니다.
     *
     * @return String
     */
    @Override
    public String getUsername() {
        return userDto.getUserName();
    }

    /**
     * 계정이 만료되지 않았는지 여부를 반환합니다.
     * 현재 항상 false를 반환하므로, 모든 계정이 만료된 것으로 처리됩니다.
     *
     * @return boolean
     */
    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    /**
     * 계정이 잠기지 않았는지 여부를 반환합니다.
     *
     * @return boolean
     */
    @Override
    public boolean isAccountNonLocked() {
        return false;
    }


    /**
     * 자격 증명(비밀번호)이 만료되지 않았는지 여부를 반환합니다.
     *
     * @return boolean
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    /**
     * 계정이 활성화되어 있는지 여부를 반환합니다.
     *
     * @return boolean
     */
    @Override
    public boolean isEnabled() {
        return false;
    }
}
