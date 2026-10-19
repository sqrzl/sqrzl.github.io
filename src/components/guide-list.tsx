type Guide = {
  href: string;
  title: string;
  description: string;
};

export function GuideList({ guides }: { guides: Guide[] }) {
  return (
    <ul class="guide-list">
      {guides.map((guide) => (
        <li key={guide.href}>
          <h2>
            <a href={guide.href}>{guide.title}</a>
          </h2>
          <p>{guide.description}</p>
        </li>
      ))}
    </ul>
  );
}
