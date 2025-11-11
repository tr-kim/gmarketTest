package com.web.gmarket.common.utils;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.text.StringEscapeUtils;

import com.fasterxml.jackson.core.SerializableString;
import com.fasterxml.jackson.core.io.CharacterEscapes;
import com.fasterxml.jackson.core.io.SerializedString;

/**
 * XSS Filter 커스텀 필터
 * 
 */
public class HTMLCharacterEscapes extends CharacterEscapes {

	private static final long serialVersionUID = 1L;

	private final int[] asciiEscapes;

//    private final CharSequenceTranslator translator;

    //1. XSS 방지 처리할 특수문자 지정하기
    public HTMLCharacterEscapes(){
        // json 객체 만들때 특수문자를 이스케이프 하기 위해 asciiEscape 를 이용함
        // 커스텀 이스케이프 정의: 기본 이스케이프시퀀스를 가져온후 원하는 문자에 대한 커스텀 이스케이프 설정
        asciiEscapes = CharacterEscapes.standardAsciiEscapesForJSON();
        asciiEscapes['<'] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['>'] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['&'] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['\"'] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['\''] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['('] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes[')'] = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['#'] = CharacterEscapes.ESCAPE_CUSTOM;

        // 사용자 정의 시퀀스
        Map<CharSequence, CharSequence> customMap = new HashMap<>();
        customMap.put("(", "&#40;");
        customMap.put(")", "&#41;");
        customMap.put("#", "&#35;");
        customMap.put("\'", "&#39;");

        // 2. XSS 방지 처리 특수 문자 인코딩 값 지정하기
//        translator = new AggregateTranslator(
//                new LookupTranslator(EntityArrays.BASIC_ESCAPE),  // <, >, &, " 는 여기에 포함됨
//                new LookupTranslator(EntityArrays.ISO8859_1_ESCAPE),
//                new LookupTranslator(EntityArrays.HTML40_EXTENDED_ESCAPE),
//                // 여기에서 커스터마이징 가능
//                new LookupTranslator(customMap)
//        );
    }

    @Override
    public int[] getEscapeCodesForAscii() {
        return asciiEscapes;
    }

    @Override
    public SerializableString getEscapeSequence(int ch) {
//        return new SerializedString(translator.translate(Character.toString((char) ch)));
        // 참고 - 커스터마이징이 필요없다면 아래와 같이 Apache Commons Text에서 제공하는 메서드 사용 해도 됨
         return new SerializedString(StringEscapeUtils.escapeHtml4(Character.toString((char) ch)));
    }
}
