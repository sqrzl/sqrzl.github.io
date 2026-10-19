# Email with Sqrzl

Sqrzl captures outbound mail locally for development and CI. It does not relay mail or deliver it to real inboxes. Start the [quickstart](https://sqrzl.github.io/docs/quick-start/) before connecting an SDK.

## Endpoints

| Transport | Endpoint | Supported surface |
| --- | --- | --- |
| SMTP | `localhost:2525` | Plaintext SMTP subset |
| SendGrid | `http://localhost:9000` | `POST /v3/mail/send`, selected v3 Mail Send fields |
| Amazon SES v2 | `http://localhost:9000` | `SendEmail` with `Content.Simple` |
| Azure Communication Services Email | `http://localhost:9000` | `POST /emails:send`, operation polling |

The HTTP adapters share the storage API listener.

## SMTP example

```python
import smtplib
from email.message import EmailMessage

message = EmailMessage()
message["From"] = "sender@example.com"
message["To"] = "recipient@example.com"
message["Subject"] = "Local Sqrzl test"
message.set_content("This message is captured locally.")

with smtplib.SMTP("127.0.0.1", 2525, timeout=5) as client:
    client.send_message(message)
```

SMTP supports plaintext EHLO/HELO, strict angle-bracket MAIL FROM and RCPT TO paths (including the null reverse path), DATA, RSET, NOOP, and QUIT. Recipient fan-out is validated and captured atomically. AUTH, STARTTLS, relay/delivery, DSN semantics, and other extensions are unsupported.

## Request and capture limits

`SQRZL_MAX_REQUEST_BYTES` defaults to 128 MiB per HTTP request body or SMTP `DATA` payload. Separately, each capture transaction has a conservative 64 MiB projected aggregate materialization limit, including fan-out copies, raw MIME, attachments, and stored records. Oversized HTTP requests receive provider-shaped `413` responses; SMTP returns `552`. Rejected requests do not leave partial mailbox captures. See [configuration](https://sqrzl.github.io/docs/configuration/) for the request-body limit.

## Provider API limits

- **SendGrid:** selected personalizations, to/cc/bcc recipients, plain and HTML content, headers, reply-to fields, and base64 attachments. Recipient limits and a total request size below 30 MB are enforced. Templates, scheduling, tracking/settings, categories, sandbox delivery, and other unsupported fields are rejected.
- **SES v2:** `Content.Simple`, destinations, reply-to addresses, subject/body charset metadata, and selected custom headers. Raw and template content, attachments, tags, configuration sets, and other top-level options are rejected. SigV4 is validated for the local endpoint.
- **ACS Email:** API versions `2023-03-01`, `2023-03-31`, and `2025-09-01`; up to 50 combined to/cc/bcc recipients; plain or HTML content; headers; reply-to; tracking control; and base64 regular/inline attachments up to 10 MB. Operation IDs and five-minute repeatability are supported.

See the [compatibility matrix](https://sqrzl.github.io/docs/compatibility/) for exact accepted request fields and rejected variants.

## Authentication and inspection

The checked-in Compose configuration uses `admin` / `sqrzl-secret` for shared provider and admin authentication. Set both `SQRZL_ACCESS_KEY_ID` and `SQRZL_SECRET_ACCESS_KEY` to enable it. `SQRZL_SENDGRID_API_KEY` enables SendGrid bearer authentication when set. `SQRZL_ACS_CONNECTION_STRING` uses `endpoint=<url>;accesskey=<base64>` to enable ACS HMAC authentication. SMTP has no authentication.

Open `http://localhost:9001` and choose **Mailboxes** to inspect captured message content, headers, and supported attachments. A successful adapter response confirms local capture, not remote delivery. See [configuration](https://sqrzl.github.io/docs/configuration/) for runtime settings.

## SDK examples

### SendGrid

```python
import sendgrid
from sendgrid.helpers.mail import Mail

client = sendgrid.SendGridAPIClient(api_key="local-key")
client.client.host = "http://localhost:9000"
message = Mail(
    from_email="sender@example.com",
    to_emails="recipient@example.com",
    subject="Local Sqrzl test",
    plain_text_content="This message is captured locally.",
)
response = client.send(message)
```

### Amazon SES v2

```python
import boto3
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
)
```

### Azure Communication Services Email

The SDK defaults its normalized connection-string endpoint to HTTPS. The local emulator serves HTTP, so use a transport that rewrites the URL after the SDK's HMAC policy signs it.

```python
import base64
from azure.communication.email import EmailClient
from azure.core.pipeline.transport import RequestsTransport

class LocalHttpTransport(RequestsTransport):
    def send(self, request, **kwargs):
        if request.url.startswith("https://"):
            request.url = "http://" + request.url.removeprefix("https://")
        return super().send(request, **kwargs)

access_key = base64.b64encode(b"shared-secret").decode("ascii")
connection = "endpoint=http://localhost:9000;accesskey=" + access_key
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
poller.result(timeout=10)
```

Configure `SQRZL_ACS_CONNECTION_STRING` on Sqrzl with the same access key.
