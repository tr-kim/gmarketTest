package com.web.gmarket.common.auth.dto;

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
public class UserDetailsDto implements UserDetails {

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
				authorities.add(new SimpleGrantedAuthority(UserRole.OPERATOR.getValue()));		// 운영자
				break;
			default:
				authorities.add(new SimpleGrantedAuthority(UserRole.COMMON.getValue()));		// 일반
				break;
		}

        return authorities;
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
    
    @Override
	public boolean equals(Object obj) {
	    if (obj instanceof UserDetailsDto) {
	        return this.getUserName().equals(((UserDetailsDto) obj).getUserName());
	    }
	    return false;
	}
	
	@Override
	public int hashCode() {
	    return this.getUserName().hashCode();
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
    public int getUserGrade() {
        return userDto.getUserGrade();
    }
    
    /**
     * 사용자의 회사코드를 반환합니다.
     *
     * @return String
     */
    public int getCompanyCode() {
        return userDto.getCompanyCode();
    }
    
    /**
     * 사용자의 권한 이름을 반환합니다.
     *
     * @return String
     */
    public String getUserGradeName() {
    	
    	int userGrade = userDto.getUserGrade();
    	String str = "슈퍼관리자";
    	
    	if(UserRole.SUPER.getCode() == userGrade) {				// 슈퍼관리자
    		str = "슈퍼관리자";
    	} else if(UserRole.ADMIN.getCode() == userGrade) {		// 관리자
    		str = "관리자";
    	} else if(UserRole.USER.getCode() == userGrade) {		// 사용자
    		str = "사용자";
    	} else if(UserRole.OPERATOR.getCode() == userGrade) {	// 운영자
    		str = "운영자";
    	} else {												// 일반
    		str = "일반";	
    	}
    	
        return str;
    }
    
    /**
     * 사용자의 SMS 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getSmsYn() {
        return userDto.getSmsYn();
    }
    
    /**
     * 사용자의 EXCEL 발송 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getExcelYn() {
        return userDto.getExcelYn();
    }
    
    /**
     * 사용자의 FILE 발송 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getFileYn() {
        return userDto.getFileYn();
    }
    
    /**
     * 사용자의 DB 발송 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getDbYn() {
        return userDto.getDbYn();
    }
    
    /**
     * 사용자의 LMS 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getLmsYn() {
        return userDto.getLmsYn();
    }
    
    /**
     * 사용자의 MMS 사용 여부를 반환합니다.
     *
     * @return String
     */
    public String getMmsYn() {
        return userDto.getMmsYn();
    }
}
