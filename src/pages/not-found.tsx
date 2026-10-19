export default function NotFoundPage() {
  return (
    <section class="not-found-page">
      <h1>Page not found</h1>
      <p>
        The address may have changed. Return home or open the documentation
        index.
      </p>
      <p class="home-actions">
        <a class="button button-primary" href="./">
          Home
        </a>
        <a class="button button-link" href="docs/">
          Documentation
        </a>
      </p>
    </section>
  );
}
