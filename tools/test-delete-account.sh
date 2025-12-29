#!/bin/bash
# Edge Function (delete-account) 로컬 검증 스크립트 (Bash 버전)
# 
# 사용법:
#   ./tools/test-delete-account.sh <FUNCTION_URL> [JWT_TOKEN]
# 
# 예시:
#   # OPTIONS 프리플라이트 확인
#   ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account --options
# 
#   # 토큰 없는 요청 (401 확인)
#   ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account
# 
#   # 유효한 토큰으로 요청 (⚠️ 테스트 계정만 사용)
#   ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account eyJ...

FUNCTION_URL="$1"
JWT_TOKEN="$2"

if [ -z "$FUNCTION_URL" ]; then
  echo "❌ 사용법: ./tools/test-delete-account.sh <FUNCTION_URL> [JWT_TOKEN]"
  echo ""
  echo "예시:"
  echo "  # OPTIONS 프리플라이트 확인"
  echo "  ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account --options"
  echo ""
  echo "  # 토큰 없는 요청 (401 확인)"
  echo "  ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account"
  echo ""
  echo "  # 유효한 토큰으로 요청 (⚠️ 테스트 계정만 사용)"
  echo "  ./tools/test-delete-account.sh https://xxxx.supabase.co/functions/v1/delete-account eyJ..."
  exit 1
fi

if [ "$2" = "--options" ]; then
  # OPTIONS 프리플라이트 테스트
  echo "🔍 OPTIONS 프리플라이트 테스트..."
  echo "   URL: $FUNCTION_URL"
  echo ""
  
  RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "$FUNCTION_URL" \
    -H "Origin: https://clicksurvivor.com" \
    -H "Access-Control-Request-Method: POST" \
    -v 2>&1)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  echo "📊 Status: $HTTP_CODE"
  echo "📋 Response Headers:"
  echo "$BODY" | grep -i "access-control"
  echo ""
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OPTIONS 프리플라이트 성공"
  else
    echo "❌ OPTIONS 프리플라이트 실패"
    exit 1
  fi
  exit 0
fi

# POST 요청 테스트
HAS_TOKEN=false
if [ -n "$JWT_TOKEN" ]; then
  HAS_TOKEN=true
fi

echo "🔍 Edge Function 테스트..."
echo "   URL: $FUNCTION_URL"
echo "   Method: POST"
echo "   Authorization: $([ "$HAS_TOKEN" = true ] && echo "Bearer [TOKEN]" || echo "없음")"
echo ""

if [ "$HAS_TOKEN" = true ]; then
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$FUNCTION_URL" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json")
else
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$FUNCTION_URL" \
    -H "Content-Type: application/json")
fi

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Status: $HTTP_CODE"
echo "📋 Response:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HAS_TOKEN" = false ]; then
  # 토큰 없는 요청: 401 예상
  if [ "$HTTP_CODE" = "401" ]; then
    echo "✅ 토큰 없는 요청 → 401 (예상대로 동작)"
  else
    echo "❌ 예상과 다른 응답 (401 예상)"
    exit 1
  fi
else
  # 토큰 있는 요청: 실제 삭제 수행 (⚠️ 테스트 계정만 사용)
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 계정 삭제 성공"
    echo "⚠️  주의: 실제 계정이 삭제되었습니다!"
  elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ 인증 실패: 토큰이 유효하지 않거나 만료되었습니다"
    exit 1
  else
    echo "❌ 예상과 다른 응답"
    echo "   Status: $HTTP_CODE"
    exit 1
  fi
fi







