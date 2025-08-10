import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Client as TypesenseClient } from 'typesense';
import typesenseConfig from '../config/typesense.config';

@Injectable()
export class TypesenseService {
  private client: TypesenseClient;

  constructor(
    @Inject(typesenseConfig.KEY)
    private readonly typesenseConfiguration: ConfigType<typeof typesenseConfig>,
  ) {
    this.client = new TypesenseClient({
      nodes: this.typesenseConfiguration.nodes,
      apiKey: this.typesenseConfiguration.apiKey,
      connectionTimeoutSeconds:
        this.typesenseConfiguration.connectionTimeoutSeconds,
    });

    // Initialize collections on startup
    this.initializeCollections();
  }

  private async initializeCollections() {
    try {
      // Check if posts collection exists, create if not
      const postsCollection = this.typesenseConfiguration.collections.posts;

      try {
        await this.client.collections(postsCollection.name).retrieve();
      } catch (error) {
        // Collection doesn't exist, create it
        await this.client.collections().create(postsCollection);
      }
    } catch (error) {
      console.error('Error initializing Typesense collections:', error);
    }
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

  async updatePost(postId: string, post: any) {
    try {
      await this.client.collections('posts').documents(postId).update(post);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  async deletePost(postId: string) {
    try {
      await this.client.collections('posts').documents(postId).delete();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
}
