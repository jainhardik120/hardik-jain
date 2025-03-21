import EmailEditor from '@/components/email-editor/EmailEditor';
import { api as serverApi } from '@/server/api/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const emailTemplate = await serverApi.email.getEmailTemplate((await params).id);
  return (
    <EmailEditor initialLayout={emailTemplate.layout} emailTemplate={emailTemplate.emailTemplate} />
  );
}
