import WakaTimeClient from './components/WakaTimeClient';
import Image from 'next/image';
import Link from 'next/link';
import { courses } from './lib/courses';
import WakaTimeDisplay from './components/WakaTimeDisplayWrapper';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WakaTimeDisplay />
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">欢迎来到我的个人网站</h1>
          <a
            href="https://github.com/MXQ51/qmzy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            GitHub仓库
          </a>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          记录我的编程学习历程和项目成果
        </p>
      </div>

      {/* 主要内容区 */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* 个人头像 */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-indigo-500">
          <Image
            src="/html.jpg"
            alt="个人头像"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* WakaTime统计 */}
        <WakaTimeClient />

        {/* 课程板块 */}
        <div className="mt-16 w-full">
          <h2 className="text-3xl font-bold text-center mb-10">我的学习课程</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                href={course.id === 2 ? '/second/提交记录.html' : course.id === 4 ? '/second/index.html' : '/second/首页1.html'}
                target="_blank"
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{course.description}</p>
                    <span className="inline-block text-indigo-600 font-medium hover:underline">
                      查看详情 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} 我的个人网站. 保留所有权利.</p>
      </footer>

      <script
        src="https://ai.youdao.com/saas/qanything/js/agent-iframe-min.js"
        id="qanything-iframe"
        data-agent-src="https://ai.youdao.com/saas/qanything/#/bots/6B0B5D166C34401A/share"
        data-default-open={false}
        data-drag={false}
        data-open-icon="https://download.ydstatic.com/ead/icon-qanything-iframe-btn.png"
        data-close-icon="https://download.ydstatic.com/ead/icon-qanything-iframe-btn.png"
        defer
      ></script>

    </main>
  );
}

