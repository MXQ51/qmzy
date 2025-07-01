import { NextResponse } from 'next/server';

// 配置常量
const CONFIG = {
  DATE_RANGE_DAYS: 7,
  API_BASE_URL: 'https://wakatime.com/api/v1',
  // 免费账户限制：仅查询当天数据（无日期范围参数）
  REQUEST_DELAY_MS: 3000, // 增加基础延迟时间
  TIMEOUT_MS: 10000,
};

// 类型定义
/**
 * @typedef {Object} WakaTimeSummary
 * @property {Array<{ grand_total?: { total_seconds: number } }>} data
 * @property {string} [error]
 */

export async function GET() {
  try {
    const apiKey = process.env.WAKATIME_API_KEY;
    const username = process.env.NEXT_PUBLIC_WAKATIME_USERNAME;
    console.log('WakaTime用户名:', username ? username : '未设置');
    console.log('API密钥存在:', !!apiKey);

    if (!apiKey || !username) {
      const missing = [];
      if (!apiKey) missing.push('WAKATIME_API_KEY');
      if (!username) missing.push('NEXT_PUBLIC_WAKATIME_USERNAME');
      return NextResponse.json(
        { error: `Missing environment variables: ${missing.join(', ')}`, total_seconds: 0 },
        { status: 500 }
      );
    }

    // 递归获取所有分页数据
    const fetchPage = async (url) => {
      try {
        // 添加请求超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`API请求失败: ${response.status} - ${JSON.stringify(errorData)}`);
          if (response.status === 402) {
            const error = new Error('WakaTime API请求失败: 需要高级账户才能访问此API端点');
            error.status = 402;
            throw error;
          }
          const error = new Error(`WakaTime API请求失败: ${response.status} - ${errorData.message || '未知错误'}`);
          error.status = response.status;
          throw error;
        }
        clearTimeout(timeoutId);
        const data = await response.json();
        console.log('WakaTime API原始响应数据:', JSON.stringify(data, null, 2));
        console.log('响应结构:', Object.keys(data).join(','));
        if (data.grand_total) console.log('grand_total结构:', Object.keys(data.grand_total).join(','));

        if (data.error) {
          console.error(`WakaTime API error: ${data.error}`);
          return 0;
        }

        // 验证API响应结构并提取total_seconds
        let totalSeconds = 0;
        
        // 1. 检查根级别grand_total
        if (data.grand_total && 'total_seconds' in data.grand_total) {
          totalSeconds = Number(data.grand_total.total_seconds);
          if (!isNaN(totalSeconds)) {
            return totalSeconds;
          }
        }
        
        // 2. 检查data.data.grand_total路径
        if (data.data?.grand_total && 'total_seconds' in data.data.grand_total) {
          totalSeconds = Number(data.data.grand_total.total_seconds);
          if (!isNaN(totalSeconds)) {
            return totalSeconds;
          }
        }
        
        // 3. 检查data数组中的项
        if (data.data && Array.isArray(data.data)) {
          for (const item of data.data) {
            if (item.grand_total && 'total_seconds' in item.grand_total) {
              totalSeconds = Number(item.grand_total.total_seconds);
              if (!isNaN(totalSeconds)) {
                return totalSeconds;
              }
            }
          }
        }
        
        // 未找到有效数据
        console.error('WakaTime API返回数据格式异常，未找到有效的total_seconds字段');
        return 0;
      } catch (error) {
        console.error('fetchPage函数内部发生未捕获错误:', error);
        throw error; // 重新抛出错误以便上层处理
      }
    };

    // 将时间范围拆分为逐年查询以符合API限制
    let totalSeconds = 0;
    // 免费账户仅查询当天数据
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = startDate;

    console.log('WakaTime API请求日期:', startDate);
    // 免费账户不允许指定日期范围参数，使用默认当天数据
const url = `${CONFIG.API_BASE_URL}/users/${username}/stats/all_time`;
    console.log(`API请求URL: ${url}`);

    try {
      totalSeconds = await fetchPage(url);
      console.log(`当天编码时间: ${totalSeconds.toFixed(2)}秒`);
    } catch (error) {
      console.error('获取WakaTime数据时发生错误:', error);
      const status = error.status || 500;
      return NextResponse.json(
        { error: error.message, total_seconds: 0 },
        { status }
      );
    }

    // 确保始终返回有效的total_seconds数值
    totalSeconds = typeof totalSeconds === 'number' && !isNaN(totalSeconds) ? totalSeconds : 0;

    // 最终检查并记录总时间
    console.log(`数据获取完成，总时间: ${totalSeconds.toFixed(2)}秒 (约${Math.round(totalSeconds / 3600)}小时)`);
    if (totalSeconds === 0) {
      console.warn('总时间为0，可能是所有API请求失败或无活动记录');
    }
    const finalSeconds = Math.max(0, Math.round(totalSeconds));
    console.log('最终返回的total_seconds值:', finalSeconds);
    return NextResponse.json({ total_seconds: finalSeconds });
  } catch (error) {
    console.error('API处理过程中发生未捕获错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误', total_seconds: 0 },
      { status: 500 }
    );
  }
}