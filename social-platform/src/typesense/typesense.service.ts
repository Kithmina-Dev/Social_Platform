import { Injectable } from '@nestjs/common';
import { Client as TypesenseClient } from 'typesense';

@Injectable()
export class TypesenseService {
  private client: TypesenseClient;

  constructor() {
    this.client = new TypesenseClient({
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ],
      apiKey: '',
      connectionTimeoutSeconds: 2,
    });
  }

  async indexPost(post: any) {
    try {
      await this.client.collections('posts').documents().create(post);
    } catch (error) {
      console.error('Error indexing post:', error);
    }
  }

  async searchPosts(query: string) {
    try {
      const searchResults = await this.client
        .collections('posts')
        .documents()
        .search({
          q: query,
          query_by: 'title,content',
        });
      return searchResults.hits?.map((hit) => hit.document) || [];
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }
}
