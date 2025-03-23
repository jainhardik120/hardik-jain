import { api } from '@/server/api/server';
import SkillsPage from './SkillPage';

export default async function Page() {
  const skills = await api.portfolio.getSkills();
  return <SkillsPage data={skills} />;
}
