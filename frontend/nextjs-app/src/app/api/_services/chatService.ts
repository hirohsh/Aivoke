import { ENDPOINTS, SourceId } from '@/lib/endpoints';

interface UrlOptions {
  url: string;
  hasUrl: boolean;
  stream: boolean;
}

export const geturlOptons = (modelId: SourceId): UrlOptions => {
  const urlOptions: UrlOptions = {
    url: '',
    hasUrl: false,
    stream: false,
  };

  if (!modelId) {
    return urlOptions;
  }

  switch (modelId) {
    case 'test':
      urlOptions.url = ENDPOINTS[modelId];
      urlOptions.hasUrl = true;
      urlOptions.stream = true;
      break;
  }
  return urlOptions;
};
