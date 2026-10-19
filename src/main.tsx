import { createSPA } from '@askrjs/askr/boot';

import './styles.css';
import { registry } from './routes';

await createSPA({
  root: document.getElementById('app')!,
  registry,
});
