'use client';

import { ContentWrapper } from './ContentWrapper';
import { ApikeyForm } from './SubContents/ApiKey/ApikeyForm';

export function ApiKeyContent() {
  return (
    <ContentWrapper>
      <ApikeyForm />
    </ContentWrapper>
  );
}
