import { DocsLayout } from '../../components/docs-layout';

export default function PersistenceDocsPage() {
  return (
    <DocsLayout
      current="persistence"
      title="Data and reset"
      description="Keep local storage between runs, or remove a disposable volume when you want a clean start."
    >
      <section class="doc-section">
        <h2>Keep data between runs</h2>
        <p>
          The Compose setup mounts a named volume at <code>/app/blobs</code>.
          Stop Sqrzl with:
        </p>
        <pre>
          <code>docker compose down</code>
        </pre>
        <p>
          The container stops and the volume stays in place. Start it again with{' '}
          <code>docker compose up</code> to use the same stored objects.
        </p>
      </section>

      <section class="doc-section">
        <h2>Reset a disposable volume</h2>
        <p>
          This removes Compose-managed volumes, including Sqrzl's stored
          objects:
        </p>
        <pre>
          <code>
            {'docker compose down --volumes\ndocker compose up --build'}
          </code>
        </pre>
        <p>
          Only use this for data you are ready to delete. If you use a bind
          mount, back up or clear its host directory yourself.
        </p>
      </section>

      <section class="doc-section">
        <h2>Storage root rules</h2>
        <p>
          Mount persistent storage at <code>SQRZL_BLOBS_PATH</code>. Sqrzl
          initializes an empty root with its storage format marker and refuses
          to start if a nonempty root has no marker. It does not migrate or
          delete older data automatically.
        </p>
        <p>
          Run one emulator writer per storage root. Sqrzl holds an exclusive
          writer lock while it is running.
        </p>
      </section>
    </DocsLayout>
  );
}
