package com.web.gmarket.common.validation;

import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup1;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup2;
import com.web.gmarket.common.validation.ValidationGroups.NotBlankGroup3;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup1;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup2;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup3;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup4;
import com.web.gmarket.common.validation.ValidationGroups.PatternGroup5;
import com.web.gmarket.common.validation.ValidationGroups.SizeGroup1;
import com.web.gmarket.common.validation.ValidationGroups.SizeGroup2;

import jakarta.validation.GroupSequence;

@GroupSequence(
		{
			NotBlankGroup1.class
			, NotBlankGroup2.class
			, NotBlankGroup3.class
			, SizeGroup1.class
			, SizeGroup2.class
			, PatternGroup1.class
			, PatternGroup2.class
			, PatternGroup3.class
			, PatternGroup4.class
			, PatternGroup5.class
		}
)
public interface ValidationSequence {

}
