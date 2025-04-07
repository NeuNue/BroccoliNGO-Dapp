import { supabaseClient } from '@/shared/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body)
  const { query_result } = body;
  const { execution_id, query_id, state, execution_ended_at } = query_result;
  const dateStr = new Date(execution_ended_at).toISOString().split('T')[0];
  if (state === 'QUERY_STATE_COMPLETED') {
    const { error } = await supabaseClient.from('DuneExecution').upsert({
      queryId: query_id,
      executionId: execution_id,
      date: dateStr,
    }, {
      onConflict: 'queryId,executionId,date'
    })
    if (error) {
      console.log(error)
    }
  }

  return NextResponse.json({
    code: 0,
    message: 'ok',
  });
}