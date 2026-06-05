import { modules } from '@/lib/course-data'
import CourseLessonClient from './client'

export function generateStaticParams() {
  return modules.flatMap((m) => m.lessons).map((l) => ({ lesson: l.id }))
}

export default function Page() {
  return <CourseLessonClient />
}
