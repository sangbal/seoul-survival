// Supabase Edge Function: delete-account
// 계정 삭제는 서버측에서만 수행 (Service Role Key 사용)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteAccountResponse {
  status: 'ALL_SUCCESS' | 'DATA_DELETED_BUT_AUTH_DELETE_FAILED' | 'AUTH_FAILED' | 'NOT_CONFIGURED' | 'UNKNOWN_ERROR';
  message?: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // JWT 토큰 추출
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ status: 'AUTH_FAILED', message: 'Authorization header missing or invalid' } as DeleteAccountResponse),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Supabase 클라이언트 생성 (ANON KEY로 사용자 인증)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(
        JSON.stringify({ status: 'NOT_CONFIGURED', message: 'Server configuration error' } as DeleteAccountResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 사용자 인증 (ANON KEY로 토큰 검증)
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth verification failed:', authError?.message);
      return new Response(
        JSON.stringify({ status: 'AUTH_FAILED', message: 'Invalid or expired token' } as DeleteAccountResponse),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userId = user.id;

    // Service Role Key로 관리자 클라이언트 생성 (RLS 우회)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. 관련 데이터 삭제 (game_saves, leaderboard)
    let dataDeleteSuccess = true;
    let dataDeleteError = null;

    try {
      // game_saves 삭제
      const { error: savesError } = await supabaseAdmin
        .from('game_saves')
        .delete()
        .eq('user_id', userId);

      if (savesError) {
        console.error('Failed to delete game_saves:', savesError.message);
        dataDeleteSuccess = false;
        dataDeleteError = savesError;
      }

      // leaderboard 삭제
      const { error: leaderboardError } = await supabaseAdmin
        .from('leaderboard')
        .delete()
        .eq('user_id', userId);

      if (leaderboardError) {
        console.error('Failed to delete leaderboard:', leaderboardError.message);
        dataDeleteSuccess = false;
        dataDeleteError = leaderboardError;
      }
    } catch (e) {
      console.error('Exception during data deletion:', e);
      dataDeleteSuccess = false;
      dataDeleteError = e;
    }

    // 2. Auth 사용자 삭제
    let authDeleteSuccess = false;
    let authDeleteError = null;

    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        console.error('Failed to delete auth user:', deleteError.message);
        authDeleteError = deleteError;
      } else {
        authDeleteSuccess = true;
      }
    } catch (e) {
      console.error('Exception during auth user deletion:', e);
      authDeleteError = e;
    }

    // 응답 결정
    if (authDeleteSuccess && dataDeleteSuccess) {
      return new Response(
        JSON.stringify({ status: 'ALL_SUCCESS' } as DeleteAccountResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (dataDeleteSuccess && !authDeleteSuccess) {
      return new Response(
        JSON.stringify({
          status: 'DATA_DELETED_BUT_AUTH_DELETE_FAILED',
          message: 'Data deleted but account deletion failed',
        } as DeleteAccountResponse),
        {
          status: 207, // Multi-Status
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // 데이터 삭제 실패
      return new Response(
        JSON.stringify({
          status: 'UNKNOWN_ERROR',
          message: 'Failed to delete data',
        } as DeleteAccountResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        status: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      } as DeleteAccountResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});






