## Social Media Platform - API Documentation

### Project Status

✅ **Completed Steps:**

1. NestJS backend project created
2. Prisma schema configured with Post model
3. Database connection setup (PostgreSQL via Prisma)
4. Posts module, controller, and service generated
5. CRUD operations implemented for posts
6. Basic search functionality added
7. DTOs created for validation
8. CORS enabled for frontend communication
9. API endpoints tested with Postman - all working!

### Current API Endpoints

**Base URL:** `http://localhost:8000` (when server is running)

#### Posts Endpoints:

1. **Create Post**
   - `POST /posts`
   - Body: `{ "title": "string", "content": "string" }`

2. **Get All Posts**
   - `GET /posts`
   - Returns: Array of posts ordered by creation date (newest first)

3. **Get Single Post**
   - `GET /posts/:id`
   - Returns: Single post by ID

4. **Update Post**
   - `PATCH /posts/:id`
   - Body: `{ "title": "string", "content": "string" }` (both optional)

5. **Delete Post**
   - `DELETE /posts/:id`

6. **Search Posts**
   - `GET /posts/search?q=search_term`
   - Returns: Posts matching the search term in title or content

### Database Schema (Prisma)

```prisma
model Post {
  id String @id @default(cuid())
  title String
  content String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Next Steps to Complete the Platform:

#### Backend (NestJS) - Current Priority:

1. **Fix server startup issues** - Resolve the current npm script execution problems
2. **Test API endpoints** - Use Postman or similar to test all CRUD operations
3. **Set up Typesense integration** - For advanced search functionality
4. **Add file upload support** - For images/media in posts
5. **Add user authentication** - JWT-based auth system
6. **Add user management** - User model and relationships

#### Frontend (Nuxt.js) - Next Phase:

1. **Create Nuxt.js project** - Set up the frontend application
2. **Create components** - Post creation form, post display, search bar
3. **Add API integration** - Connect to the NestJS backend
4. **Style the interface** - Make it look like Facebook/Instagram
5. **Add image upload** - Frontend for media posts
6. **Add user interface** - Login, registration, profile pages

#### Database Setup:

1. **Start Prisma database** - Get the local PostgreSQL running
2. **Run migrations** - Apply the schema to the database
3. **Seed data** - Add some sample posts for testing

### How to Test the Current Setup:

1. **Start the database:**

   ```bash
   npx prisma dev
   ```

2. **Push the schema:**

   ```bash
   npx prisma db push
   ```

3. **Start the server:**

   ```bash
   npm run build
   node dist/main.js
   ```

4. **Test with curl or Postman:**

   ```bash
   # Create a post
   curl -X POST http://localhost:8000/posts \
     -H "Content-Type: application/json" \
     -d '{"title":"My First Post","content":"This is my first social media post!"}'

   # Get all posts
   curl http://localhost:8000/posts

   # Search posts
   curl http://localhost:8000/posts/search?q=first
   ```

### Tech Stack Integration Plan:

- **Backend:** NestJS (✅ Setup complete)
- **Database:** PostgreSQL + Prisma ORM (✅ Schema ready)
- **Frontend:** Nuxt.js + Vue.js (⏳ Next to implement)
- **Search:** Typesense (⏳ Integration needed)
- **Deployment:** TBD

The foundation is solid! The main next step is getting the server running properly to test the API endpoints.
