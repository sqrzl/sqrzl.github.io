# SMS and MMS with Sqrzl

Sqrzl captures outbound text requests locally, stores them for inspection, and lets you simulate inbound messages and delivery updates. It does not send messages through a carrier. Start the [quickstart](https://sqrzl.github.io/docs/quick-start/) first. SMS APIs use `http://localhost:9000`; the admin UI is at `http://localhost:9001`.

## Provider endpoints

| Provider | Local endpoint | Supported operation |
| --- | --- | --- |
| Twilio | `http://localhost:9000` | `POST /2010-04-01/Accounts/{AccountSid}/Messages.json` |
| Amazon SNS | `http://localhost:9000` | Query API `Publish` with direct `PhoneNumber` |
| AWS End User Messaging SMS Voice v2 | `http://localhost:9000` | `SendTextMessage`, `SendMediaMessage` |
| Azure Communication Services SMS | `http://localhost:9000` | `POST /sms?api-version=...` |

## SDK examples

### Twilio

```python
import os
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
)
```

### Amazon SNS

```python
import boto3

client = boto3.client(
    "sns",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="admin",
    aws_secret_access_key="sqrzl-secret",
    region_name="us-east-1",
)
client.publish(PhoneNumber="+15550001002", Message="Local Sqrzl test")
```

SNS supports raw SMS or `MessageStructure=json` selecting the `sms` value with `default` fallback, and up to 10 message attributes. Topic and target publishing, fan-out, subscriptions, and management APIs are unsupported.

### AWS End User Messaging SMS Voice v2

```python
import boto3

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
)
```

The adapter also supports `SendMediaMessage`, with exactly one optional S3 media URI, and `DryRun` validation without capture. Sqrzl stores the URI as a reference and never fetches it.

### Azure Communication Services SMS

The SDK defaults its normalized connection-string endpoint to HTTPS. The local emulator serves HTTP, so use a transport that rewrites the URL after the SDK's HMAC policy signs it.

```python
import base64
from azure.communication.sms import SmsClient
from azure.core.pipeline.transport import RequestsTransport

class LocalHttpTransport(RequestsTransport):
    def send(self, request, **kwargs):
        if request.url.startswith("https://"):
            request.url = "http://" + request.url.removeprefix("https://")
        return super().send(request, **kwargs)

access_key = base64.b64encode(b"shared-secret").decode("ascii")
connection = "endpoint=http://localhost:9000;accesskey=" + access_key
client = SmsClient.from_connection_string(
    connection,
    transport=LocalHttpTransport(),
)
client.send(
    from_="+15550001000",
    to=["+15550001004", "+15550001005"],
    message="Local Sqrzl test",
    enable_delivery_report=True,
)
```

Configure `SQRZL_ACS_CONNECTION_STRING` on Sqrzl with the same access key.

## Configure authentication

- Set both `SQRZL_TWILIO_ACCOUNT_SID` and `SQRZL_TWILIO_AUTH_TOKEN` to require Twilio Basic authentication and sign its callbacks.
- AWS adapters use `SQRZL_ACCESS_KEY_ID` and `SQRZL_SECRET_ACCESS_KEY` when generic provider authentication is enabled. The checked-in Compose defaults are `admin` and `sqrzl-secret`.
- ACS SMS uses the shared key in `SQRZL_ACS_CONNECTION_STRING` (`endpoint=<url>;accesskey=<base64>`).

See [configuration](https://sqrzl.github.io/docs/configuration/) for all runtime settings.

## Inspect messages and simulate delivery

Open `http://localhost:9001` and choose **Texts**. Search messages and conversations, inject an inbound message, change an outbound message to delivered or failed, configure callback destinations per provider and local number, inspect callback requests and bounded responses, and create linked retries.

Delivery changes are explicit; there is no automatic delivery timer. Callback failures do not undo a captured message or terminal delivery state, and callback redirects are not followed.

## Callback access and media

Callback hosts default to `localhost`, `127.0.0.1`, and `::1`. Add comma-separated hosts with `SQRZL_TEXT_CALLBACK_ALLOWED_HOSTS`. The default callback timeout is 5000 ms; change it with `SQRZL_TEXT_CALLBACK_TIMEOUT_MS`. A Twilio `StatusCallback` URL must pass the same allowlist.

Outbound Twilio media URLs and AWS S3 media URIs are stored as references; Sqrzl never fetches remote media. Inbound Twilio simulations can include base64 media, which is stored and served at authenticated Twilio-shaped media URLs. AWS inbound MMS and all ACS MMS requests are rejected.

## Supported request scope

- **Twilio:** `To`, `From` or `MessagingServiceSid`, optional body up to 1600 characters, up to 10 absolute HTTP(S) `MediaUrl` values, and an optional allowlisted `StatusCallback`. Service-selected senders initially return `accepted` with zero segments; explicit senders return `queued`.
- **Amazon SNS:** direct E.164 `PhoneNumber` Publish only; up to 10 message attributes. Topic fan-out is unsupported.
- **SMS Voice v2:** documented JSON fields for `SendTextMessage` and `SendMediaMessage`; `DryRun` validates without capture. Inbound MMS, voice operations, and RCS are unsupported.
- **ACS SMS:** API versions `2021-03-07` and `2026-01-23`; 1–100 E.164 recipients; per-recipient repeatability results; delivery-report options, tags, and timeouts from 60 to 43200 seconds. Rejected recipients in mixed results are not captured. `messagingConnect` and MMS are unsupported.

TwiML execution, WhatsApp, voice calls, automatic delivery timing, remote media fetching, and full provider management APIs are outside scope. See the [compatibility matrix](https://sqrzl.github.io/docs/compatibility/) for exact accepted fields and errors.

## Request and capture limits

`SQRZL_MAX_REQUEST_BYTES` defaults to 128 MiB per HTTP request body. Separately, each capture transaction has a conservative 64 MiB projected aggregate materialization limit, including message fan-out copies and inline media. Oversized requests receive provider-shaped `413` responses and create no partial captures. See [configuration](https://sqrzl.github.io/docs/configuration/) for the request-body limit.
