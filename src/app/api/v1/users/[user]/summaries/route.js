import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        const username = process.env.NEXT_PUBLIC_WAKATIME_USERNAME || 'current';

        if (!apiKey) {
            return NextResponse.json(
                { error: 'WAKATIME_API_KEY is not set in environment variables' },
                { status: 500 }
            );
        }

        // Basic Auth 需要 base64 编码
        const encoded = Buffer.from(`${apiKey}:`).toString('base64');

        const response = await fetch(
            `https://wakatime.com/api/v1/users/${username}/stats/all_time`,
            {
                headers: {
                    'Authorization': `Basic ${encoded}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: 'Failed to fetch WakaTime data', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('WakaTime API error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}