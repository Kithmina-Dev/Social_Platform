import { registerAs } from '@nestjs/config';

export default registerAs('typesense', () => ({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'your-api-key-here',
  connectionTimeoutSeconds: parseInt(process.env.TYPESENSE_CONNECTION_TIMEOUT || '2', 10),
  collections: {
    posts: {
      name: 'posts',
      fields: [
        { name: 'id', type: 'int64' as const },
        { name: 'title', type: 'string' as const },
        { name: 'content', type: 'string' as const },
        { name: 'authorId', type: 'string' as const },
        { name: 'createdAt', type: 'int64' as const },
        { name: 'updatedAt', type: 'int64' as const },
      ],
      default_sorting_field: 'createdAt',
    },
  },
}));
