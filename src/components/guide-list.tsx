import { For } from '@askrjs/askr/control';

type Guide = {
  href: string;
  title: string;
  description: string;
};

export function GuideList({ guides }: { guides: Guide[] }) {
  return (
    <ul class="guide-list">
      <For each={guides} by={(guide) => guide.href}>
        {(guide) => (
          <li>
            <h2>
              <a href={guide.href}>{guide.title}</a>
            </h2>
            <p>{guide.description}</p>
          </li>
        )}
      </For>
    </ul>
  );
}
