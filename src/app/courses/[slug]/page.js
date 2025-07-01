import Image from 'next/image';
import { courses } from '../../lib/courses';
import Link from 'next/link';

export default function CourseDetailPage({ params }) {
  // 查找匹配的课程数据
  const course = courses.find(c => c.slug === params.slug);

  // 如果课程不存在，显示404页面
  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>课程不存在</h1>
        <p>抱歉，请求的课程不存在或已被移除。</p>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#0070f3', textDecoration: 'none' }}>
        ← 返回课程列表
      </Link>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src={course.image}
          alt={course.title}
          width={400}
          height={400}
          style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
        />
        <h1 style={{ fontSize: '32px', marginTop: '20px', marginBottom: '10px' }}>{course.title}</h1>
        <p style={{ fontSize: '18px', color: '#555', lineHeight: '1.6' }}>{course.description}</p>
        
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>课程详情</h2>
          <p>这是{course.title}的详细页面。在这里可以展示更多关于该课程的学习内容、作业要求和相关资源。</p>
        </div>
      </div>
    </div>
  );
}