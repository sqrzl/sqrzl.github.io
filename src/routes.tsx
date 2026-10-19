import {
  createRouteRegistry,
  fallback,
  group,
  route,
} from '@askrjs/askr/router';

import App from './app';
import AzureBlobDocsPage from './pages/docs/azure-blob';
import CompatibilityDocsPage from './pages/docs/compatibility';
import ConfigurationDocsPage from './pages/docs/configuration';
import DocsIndexPage from './pages/docs/index';
import EmailAndMessagingDocsPage from './pages/docs/email-and-messaging';
import OciDocsPage from './pages/docs/oci';
import PersistenceDocsPage from './pages/docs/persistence';
import QuickStartDocsPage from './pages/docs/quick-start';
import S3DocsPage from './pages/docs/s3';
import GcsDocsPage from './pages/docs/gcs';
import HomePage from './pages/index';
import NotFoundPage from './pages/not-found';

export const registry = createRouteRegistry(() => {
  group({ layout: App }, () => {
    route('/', HomePage);
    route('/docs', DocsIndexPage);
    route('/docs/quick-start', QuickStartDocsPage);
    route('/docs/s3', S3DocsPage);
    route('/docs/azure-blob', AzureBlobDocsPage);
    route('/docs/gcs', GcsDocsPage);
    route('/docs/oci', OciDocsPage);
    route('/docs/configuration', ConfigurationDocsPage);
    route('/docs/persistence', PersistenceDocsPage);
    route('/docs/email-and-messaging', EmailAndMessagingDocsPage);
    route('/docs/compatibility', CompatibilityDocsPage);
    fallback(NotFoundPage);
  });
});
