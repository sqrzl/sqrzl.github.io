import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function EmailAndMessagingDocsFeature() {
  return (
    <DocsLayout
      current="email-and-messaging"
      title="Email and messaging"
      description="Use the local listeners and API endpoints to develop against mail and SMS providers."
    >
      <DocSection title="Local endpoints">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Local address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SMTP capture</td>
              <td>
                <code>localhost:2525</code>
              </td>
            </tr>
            <tr>
              <td>SendGrid Mail Send API</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
            </tr>
            <tr>
              <td>Amazon SES v2</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
            </tr>
            <tr>
              <td>Azure Communication Services Email and SMS</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
            </tr>
            <tr>
              <td>Twilio Messages, Amazon SNS, and AWS SMS Voice</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          For API-based providers, point the SDK's service endpoint or base URL
          at the local API address. Configure the provider-specific credentials
          in the SDK and Sqrzl where the integration requires authentication.
        </p>
      </DocSection>

      <DocSection title="Inspect and simulate messages">
        <p>
          Open the admin UI at <code>http://localhost:9001</code> to inspect
          local mail and texts. The UI also supports provider-specific
          inbound-message and delivery simulations where listed by the
          compatibility matrix.
        </p>
      </DocSection>

      <DocSection title="Scope">
        <p>
          These adapters implement documented subsets. SMTP AUTH and STARTTLS
          are not supported. Check the{' '}
          <a href="docs/compatibility/">compatibility matrix</a> before depending
          on a particular message type, API operation, or callback behavior.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
