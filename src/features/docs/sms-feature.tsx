import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function SmsDocsFeature() {
  return (
    <DocsLayout
      current="sms"
      title="SMS and MMS"
      description="Connect Twilio, Amazon SNS, AWS End User Messaging, or Azure Communication Services to the local text emulator."
    >
      <DocSection title="What Sqrzl does">
        <p>
          Sqrzl captures outbound text requests, stores them for inspection, and
          lets you simulate inbound messages and delivery updates. It does not
          send messages through a carrier. Start Sqrzl with the{' '}
          <a href="docs/quick-start/">quickstart</a>; SMS APIs use{' '}
          <code>http://localhost:9000</code> and the admin UI uses{' '}
          <code>http://localhost:9001</code>.
        </p>
      </DocSection>

      <DocSection title="Provider endpoints">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Local entry point</th>
              <th>Supported send operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Twilio</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>
                <code>POST /2010-04-01/Accounts/{'{AccountSid}'}/Messages.json</code>
              </td>
            </tr>
            <tr>
              <td>Amazon SNS</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>Query API Publish with a direct phone number.</td>
            </tr>
            <tr>
              <td>AWS End User Messaging SMS Voice v2</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>
                <code>SendTextMessage</code> and <code>SendMediaMessage</code>.
              </td>
            </tr>
            <tr>
              <td>Azure Communication Services SMS</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
              <td>
                <code>POST /sms?api-version=...</code> with one or more recipients.
              </td>
            </tr>
          </tbody>
        </table>
      </DocSection>

      <DocSection title="Connect an SDK">
        <h3>Twilio</h3>
        <pre>
          <code>
            {`import os
import twilio

client = twilio.Client(
    os.environ["SQRZL_TWILIO_ACCOUNT_SID"],
    os.environ["SQRZL_TWILIO_AUTH_TOKEN"],
)
client.api.base_url = "http://localhost:9000"
message = client.messages.create(
    to="+15550001001",
    from_="+15550001000",
    body="Local Sqrzl test",
)`}
          </code>
        </pre>
        <p>
          Configure both <code>SQRZL_TWILIO_ACCOUNT_SID</code> and{' '}
          <code>SQRZL_TWILIO_AUTH_TOKEN</code> on Sqrzl to require Basic
          authentication and sign Twilio callbacks.
        </p>

        <h3>Amazon SNS</h3>
        <pre>
          <code>
            {`import boto3

client = boto3.client(
    "sns",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="admin",
    aws_secret_access_key="sqrzl-secret",
    region_name="us-east-1",
)
client.publish(
    PhoneNumber="+15550001002",
    Message="Local Sqrzl test",
)`}
          </code>
        </pre>

        <h3>AWS End User Messaging SMS Voice v2</h3>
        <pre>
          <code>
            {`import boto3

client = boto3.client(
    "pinpoint-sms-voice-v2",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="admin",
    aws_secret_access_key="sqrzl-secret",
    region_name="us-east-1",
)
client.send_text_message(
    DestinationPhoneNumber="+15550001003",
    OriginationIdentity="+15550001000",
    MessageBody="Local Sqrzl test",
    MessageType="TRANSACTIONAL",
)`}
          </code>
        </pre>
        <p>
          The v2 adapter also supports <code>send_media_message</code> with an
          optional S3 media URI, plus <code>DryRun</code> validation without
          capture.
        </p>

        <h3>Azure Communication Services SMS</h3>
        <pre>
          <code>
            {`import base64
from azure.communication.sms import SmsClient
from azure.core.pipeline.transport import RequestsTransport

class LocalHttpTransport(RequestsTransport):
    def send(self, request, **kwargs):
        if request.url.startswith("https://"):
            request.url = "http://" + request.url.removeprefix("https://")
        return super().send(request, **kwargs)

access_key = base64.b64encode(b"shared-secret").decode("ascii")
connection = (
    "endpoint=http://localhost:9000;accesskey=" + access_key
)
client = SmsClient.from_connection_string(
    connection,
    transport=LocalHttpTransport(),
)
client.send(
    from_="+15550001000",
    to=["+15550001004", "+15550001005"],
    message="Local Sqrzl test",
    enable_delivery_report=True,
)`}
          </code>
        </pre>
        <p>
          The ACS SDK normalizes its endpoint to HTTPS. This transport rewrites
          the signed request to the emulator's local HTTP listener. Set{' '}
          <code>SQRZL_ACS_CONNECTION_STRING</code> on Sqrzl with the same access
          key.
        </p>
      </DocSection>

      <DocSection title="Configure authentication">
        <ul>
          <li>
            Twilio uses <code>SQRZL_TWILIO_ACCOUNT_SID</code> and{' '}
            <code>SQRZL_TWILIO_AUTH_TOKEN</code> together.
          </li>
          <li>
            AWS adapters use <code>SQRZL_ACCESS_KEY_ID</code> and{' '}
            <code>SQRZL_SECRET_ACCESS_KEY</code> when generic API authentication
            is enabled.
          </li>
          <li>
            ACS SMS uses the shared key in{' '}
            <code>SQRZL_ACS_CONNECTION_STRING</code>.
          </li>
        </ul>
        <p>
          The checked-in Compose file sets generic credentials to{' '}
          <code>admin</code> and <code>sqrzl-secret</code>. See{' '}
          <a href="docs/configuration/">configuration</a> to change them.
        </p>
      </DocSection>

      <DocSection title="Inspect and simulate messages">
        <p>
          Open <code>http://localhost:9001</code> and choose{' '}
          <strong>Texts</strong>. The admin surface lets you search messages and
          conversations, inject an inbound message, change an outbound message
          to delivered or failed, configure callback destinations by provider
          and local number, inspect callback requests and their bounded
          responses, and create linked retries.
        </p>
        <p>
          Delivery changes are explicit. Sqrzl does not advance messages on a
          timer. Callback failures do not undo a captured message or delivery
          state; redirects are not followed.
        </p>
      </DocSection>

      <DocSection title="Callback access">
        <p>
          Callback destinations may use <code>localhost</code>,{' '}
          <code>127.0.0.1</code>, or <code>::1</code> by default. Add other
          local callback hosts as a comma-separated list in{' '}
          <code>SQRZL_TEXT_CALLBACK_ALLOWED_HOSTS</code>. Each callback attempt
          times out after 5000 ms by default; set{' '}
          <code>SQRZL_TEXT_CALLBACK_TIMEOUT_MS</code> to change the limit.
        </p>
        <p>
          A Twilio <code>StatusCallback</code> URL must pass the same host
          allowlist. Outbound media URLs are references only: Sqrzl does not
          fetch them. Inbound Twilio simulations can include base64 media that
          is stored and served from authenticated Twilio-shaped media URLs.
        </p>
      </DocSection>

      <DocSection title="Supported scope">
        <ul>
          <li>
            Twilio accepts <code>To</code>, <code>From</code> or{' '}
            <code>MessagingServiceSid</code>, an optional body up to 1600
            characters, up to 10 absolute HTTP(S) media URLs, and an optional
            allowlisted status callback. A service-selected sender initially
            returns accepted with zero segments; an explicit sender returns
            queued.
          </li>
          <li>
            SNS accepts direct E.164 <code>PhoneNumber</code> Publish requests,
            raw messages or <code>MessageStructure=json</code> selecting the{' '}
            <code>sms</code> value with <code>default</code> fallback, and up
            to 10 message attributes.
          </li>
          <li>
            SMS Voice v2 accepts the documented JSON fields for its text and
            media send operations. MMS can reference one optional S3 media URI;
            remote media is never fetched.
          </li>
          <li>
            ACS SMS supports API versions <code>2021-03-07</code> and{' '}
            <code>2026-01-23</code>, 1 to 100 E.164 recipients, per-recipient
            repeatability results, delivery-report options, tags, and timeouts
            from 60 to 43200 seconds. Rejected recipients in a mixed result are
            not captured.
          </li>
        </ul>
        <p>
          SNS topics and fan-out, AWS inbound MMS, ACS MMS, TwiML execution,
          WhatsApp, RCS, voice calls, automatic delivery timing, remote media
          fetching, and provider management APIs are unsupported. Check the{' '}
          <a href="docs/compatibility/">compatibility matrix</a> for exact
          request fields and errors.
        </p>
      </DocSection>

      <DocSection title="Request and capture limits">
        <p>
          <code>SQRZL_MAX_REQUEST_BYTES</code> defaults to 128 MiB per HTTP
          request body. Separately, each capture transaction has a conservative
          64 MiB projected aggregate materialization limit, including message
          fan-out copies and inline media.
        </p>
        <p>
          Oversized requests receive a provider-shaped <code>413</code> and
          create no partial captures. This capture limit is separate from the
          request-body setting; see{' '}
          <a href="docs/configuration/">configuration</a> for that setting.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
