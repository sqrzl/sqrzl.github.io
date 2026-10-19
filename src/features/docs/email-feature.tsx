import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function EmailDocsFeature() {
  return (
    <DocsLayout
      current="email"
      title="Email"
      description="Send test messages through local SMTP, SendGrid, Amazon SES, or Azure Communication Services and inspect the captured mail."
    >
      <DocSection title="What Sqrzl does">
        <p>
          Sqrzl accepts outbound mail requests and stores each message locally
          for inspection. It does not relay mail or deliver it to real inboxes.
          Start the emulator with the <a href="docs/quick-start/">quickstart</a>{' '}
          before connecting an SDK.
        </p>
      </DocSection>

      <DocSection title="Choose an endpoint">
        <table>
          <thead>
            <tr>
              <th>Transport</th>
              <th>Local endpoint</th>
              <th>Use it for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SMTP</td>
              <td>
                <code>localhost:2525</code>
              </td>
              <td>Applications that send mail through an SMTP client.</td>
            </tr>
            <tr>
              <td>SendGrid Mail Send v3</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>SendGrid SDKs and requests to <code>/v3/mail/send</code>.</td>
            </tr>
            <tr>
              <td>Amazon SES v2</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>
                SES v2 <code>SendEmail</code> with simple content.
              </td>
            </tr>
            <tr>
              <td>Azure Communication Services Email</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>
                ACS Email send and operation polling.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The API providers share the HTTP listener with the storage APIs. Set
          the SDK endpoint or base URL to <code>http://localhost:9000</code>.
        </p>
      </DocSection>

      <DocSection title="Connect an SDK">
        <h3>SMTP with Python</h3>
        <pre>
          <code>
            {`import smtplib
from email.message import EmailMessage

message = EmailMessage()
message["From"] = "sender@example.com"
message["To"] = "recipient@example.com"
message["Subject"] = "Local Sqrzl test"
message.set_content("This message is captured locally.")

with smtplib.SMTP("127.0.0.1", 2525, timeout=5) as client:
    client.send_message(message)`}
          </code>
        </pre>
        <p>
          SMTP is plaintext and accepts strict angle-bracket envelope paths.
          Use a client that does not require SMTP AUTH or STARTTLS.
        </p>

        <h3>SendGrid</h3>
        <pre>
          <code>
            {`import sendgrid
from sendgrid.helpers.mail import Mail

client = sendgrid.SendGridAPIClient(api_key="local-key")
client.client.host = "http://localhost:9000"
message = Mail(
    from_email="sender@example.com",
    to_emails="recipient@example.com",
    subject="Local Sqrzl test",
    plain_text_content="This message is captured locally.",
)
response = client.send(message)`}
          </code>
        </pre>
        <p>
          If <code>SQRZL_SENDGRID_API_KEY</code> is set on Sqrzl, pass the same
          key to the SDK. If it is unset, the adapter does not require a
          SendGrid bearer token.
        </p>

        <h3>Amazon SES v2</h3>
        <pre>
          <code>
            {`import boto3
from botocore.config import Config

client = boto3.client(
    "sesv2",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="admin",
    aws_secret_access_key="sqrzl-secret",
    region_name="us-east-1",
    config=Config(signature_version="s3v4"),
)
client.send_email(
    FromEmailAddress="sender@example.com",
    Destination={"ToAddresses": ["recipient@example.com"]},
    Content={"Simple": {
        "Subject": {"Data": "Local Sqrzl test"},
        "Body": {"Text": {"Data": "This message is captured locally."}},
    }},
)`}
          </code>
        </pre>
        <p>
          The credentials above match the checked-in Compose defaults. Use the
          values configured for your local instance if you changed them.
        </p>

        <h3>Azure Communication Services Email</h3>
        <pre>
          <code>
            {`import base64
from azure.communication.email import EmailClient
from azure.core.pipeline.transport import RequestsTransport

class LocalHttpTransport(RequestsTransport):
    def send(self, request, **kwargs):
        # The SDK signs its HTTPS URL; Sqrzl serves local HTTP.
        if request.url.startswith("https://"):
            request.url = "http://" + request.url.removeprefix("https://")
        return super().send(request, **kwargs)

access_key = base64.b64encode(b"shared-secret").decode("ascii")
connection = (
    "endpoint=http://localhost:9000;accesskey=" + access_key
)
client = EmailClient.from_connection_string(
    connection,
    transport=LocalHttpTransport(),
)
poller = client.begin_send({
    "senderAddress": "sender@example.com",
    "recipients": {"to": [{"address": "recipient@example.com"}]},
    "content": {
        "subject": "Local Sqrzl test",
        "plainText": "This message is captured locally.",
    },
})
poller.result(timeout=10)`}
          </code>
        </pre>
        <p>
          Configure <code>SQRZL_ACS_CONNECTION_STRING</code> on Sqrzl with the
          same base64 access key. This transport adapts the official SDK to the
          emulator's local HTTP endpoint after the SDK signs the request.
        </p>
      </DocSection>

      <DocSection title="Configure authentication">
        <table>
          <thead>
            <tr>
              <th>Setting</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SQRZL_ACCESS_KEY_ID</code> and{' '}
                <code>SQRZL_SECRET_ACCESS_KEY</code>
              </td>
              <td>
                Set both to enable shared provider and admin authentication.
                The default Compose values are <code>admin</code> and{' '}
                <code>sqrzl-secret</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_SENDGRID_API_KEY</code>
              </td>
              <td>
                Require this bearer token on the SendGrid adapter when set.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_ACS_CONNECTION_STRING</code>
              </td>
              <td>
                Set <code>endpoint=&lt;url&gt;;accesskey=&lt;base64&gt;</code> to
                enable ACS HMAC authentication for Email and SMS.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          SES requests use SigV4. SMTP has no authentication. See{' '}
          <a href="docs/configuration/">configuration</a> for the complete
          environment settings.
        </p>
      </DocSection>

      <DocSection title="Inspect captured mail">
        <p>
          Open <code>http://localhost:9001</code>, sign in if admin
          authentication is enabled, and choose <strong>Mailboxes</strong>.
          Sqrzl creates a mailbox for each recipient and shows the captured
          message content, headers, and attachments where supported.
        </p>
        <p>
          All adapters capture locally. A successful provider-shaped response
          means the request was accepted by the emulator; it does not mean a
          remote mail server sent or delivered the message.
        </p>
      </DocSection>

      <DocSection title="Supported behavior">
        <ul>
          <li>
            SMTP accepts a plaintext subset of EHLO/HELO, MAIL FROM, RCPT TO,
            DATA, RSET, NOOP, and QUIT. Recipient fan-out is validated and
            captured atomically.
          </li>
          <li>
            SendGrid supports selected personalizations, to/cc/bcc recipients,
            plain and HTML content, headers, reply-to fields, and base64
            attachments. Its accepted request size is under 30 MB.
          </li>
          <li>
            SES v2 supports <code>Content.Simple</code>, destinations, reply-to
            addresses, subject and body charset metadata, and selected custom
            headers. It does not support attachments.
          </li>
          <li>
            ACS Email supports API versions <code>2023-03-01</code>,{' '}
            <code>2023-03-31</code>, and <code>2025-09-01</code>, up to 50
            combined to/cc/bcc recipients, plain or HTML content, and base64
            regular or inline attachments up to 10 MB. Operation IDs and
            five-minute repeatability are supported.
          </li>
        </ul>
        <p>
          SMTP AUTH, STARTTLS, relay and delivery, SES raw and template content,
          SendGrid templates and scheduling, and ACS delivery events are outside
          the supported scope. The provider-specific limits and rejected
          features are listed in the{' '}
          <a href="docs/compatibility/">compatibility matrix</a>.
        </p>
      </DocSection>

      <DocSection title="Request and capture limits">
        <p>
          <code>SQRZL_MAX_REQUEST_BYTES</code> defaults to 128 MiB per HTTP
          request body or SMTP <code>DATA</code> payload. Separately, each
          capture transaction has a conservative 64 MiB projected aggregate
          materialization limit. It accounts for fan-out copies, raw MIME,
          attachments, and stored records.
        </p>
        <p>
          Oversized HTTP requests receive a provider-shaped{' '}
          <code>413</code>; SMTP returns <code>552</code>. Rejected requests do
          not leave partial mailbox captures. See{' '}
          <a href="docs/configuration/">configuration</a> for the request-body
          limit.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
