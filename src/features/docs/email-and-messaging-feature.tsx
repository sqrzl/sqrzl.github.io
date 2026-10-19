import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function EmailAndMessagingDocsFeature() {
  return (
    <DocsLayout
      title="Email and messaging"
      description="Choose a focused guide for connecting a mail or text client to Sqrzl."
    >
      <DocSection title="Email">
        <p>
          Learn how to connect SMTP, SendGrid, Amazon SES, or Azure Communication
          Services Email and inspect captured messages.
        </p>
        <p>
          <a href="docs/email/">Read the email guide</a>
        </p>
      </DocSection>
      <DocSection title="SMS and MMS">
        <p>
          Configure Twilio, Amazon SNS, AWS End User Messaging, or Azure
          Communication Services SMS, then simulate inbound messages and
          delivery updates.
        </p>
        <p>
          <a href="docs/sms/">Read the SMS guide</a>
        </p>
      </DocSection>
    </DocsLayout>
  );
}
