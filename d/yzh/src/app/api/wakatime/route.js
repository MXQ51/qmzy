import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const username = process.env.NEXT_PUBLIC_WAKATIME_USERNAME || 'current';
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'WAKATIME_API_KEY is not set in environment variables' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://wakatime.com/api/v1/users/${username}/stats/All Time`,
            {
                headers: {
                    Authorization: `Basic ${btoa(`${apiKey}:`)}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败（状态码：${response.status}）：${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        // 提取总编码时长（单位：秒）
        const codingTime = data.data?.total_seconds || 0;
        return NextResponse.json({ codingTime });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}