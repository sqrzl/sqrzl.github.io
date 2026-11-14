import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function PersistenceDocsFeature() {
  return (
    <DocsLayout
      current="persistence"
      title="Data and reset"
      description="Keep local storage between runs, or remove a disposable volume when you want a clean start."
    >
      <DocSection title="Keep data between runs">
        <p>
          The Compose setup mounts a named volume at <code>/app/blobs</code>.
          Stop Sqrzl with:
        </p>
        <pre>
          <code>docker compose down --timeout 35</code>
        </pre>
        <p>
          The container stops and the volume stays in place. Start it again with{' '}
          <code>docker compose up</code> to use the same stored objects.
        </p>
      </DocSection>

      <DocSection title="Back up before upgrades">
        <p>
          Stop the emulator before copying or snapshotting its entire storage
          volume. Back up the whole root, including hidden metadata and capture
          files. Do not edit index or intent files independently.
        </p>
        <p>
          Compatible existing mail is indexed once at startup, one payload at a
          time. SES intent and event history use a transactional index at{' '}
          <code>.ses-events-v1.redb</code>; existing JSON records migrate
          idempotently and remain as backups. The database becomes
          authoritative. Keep a backup and check version-specific storage notes
          before downgrading a writer.
        </p>
        <p>
          Admin mailbox listings use metadata summaries rather than loading
          attachments. Pages normally retain up to 8 MiB of metadata and at most
          500 records; one large record can use up to 64 MiB. Mailbox scans
          remain linear, and substring search can scan multiple batches.
        </p>
      </DocSection>
      <DocSection title="Reset a disposable volume">
        <p>
          This removes Compose-managed volumes, including Sqrzl's stored
          objects:
        </p>
        <pre>
          <code>
            {
              'docker compose down --timeout 35 --volumes\ndocker compose up --build'
            }
          </code>
        </pre>
        <p>
          Only use this for data you are ready to delete. If you use a bind
          mount, back up or clear its host directory yourself.
        </p>
      </DocSection>

      <DocSection title="Storage root rules">
        <p>
          Mount persistent storage at <code>SQRZL_BLOBS_PATH</code>. Sqrzl
          initializes an empty root with its storage format marker and refuses
          to start if a nonempty root has no marker. It does not migrate an
          unmarked blob root or delete its data automatically.
        </p>
        <p>
          Run one emulator writer per storage root. Sqrzl holds an exclusive
          writer lock until its storage writers finish.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
