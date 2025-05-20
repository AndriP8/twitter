# Requirement Exploration

## Supported core features

- Browse news feed that containing post from user and their friends
- Linking and reacting a post
- Creating and publishing new post

## Supported post

- Text and image

## What pagination should be used

- Infinite scrolling

## Are should supported on mobile devices

- Would be nice

## Architecture / high level design

![Architecture diagram](../../../public/assets/news-feed/architecture-diagram.png)

## Component responsibilities

- **Server:** Provide http APIs to fetch post and create new post
- **Controller:** Control flow data withih application and make newtwork request to the server
- **Client Store:** Store data that needed for the whole application
- **Feed UI:**
  - **Feed posts:** Present the data for a feed post and contain button to interate with post(like/react/share)
  - **Feed composer:** Editor for user to create a post

## Rendering approach

- **SSR** for inital data that prefetch in the server
- **CSR** When user have interaction in the app like load new page/like/react/share

## Data model

- **Feed:** List of post and pagination data
- **Post:** `id`, `created_time`, `content`, `author`, `reactions`, `image_url?`
- **User:** `id`, `name`, `profile_photo_url`
- **New Post:** `message`, `image` from user input

## API definition

- **POST /posts:** Create new post

  ```
  Body / payload
  {
    "author": {
        "id": "456",
        "name": "John Doe"
    },
    "content": "Hello world",
    "image": {
        "src": "https://www.example.com/feed-images.jpg",
        "alt": "An image alt" // Either user-provided, or generated on the server.
      }
  }
  ```

- **GET /feed:** Get list feed

  ```
  {
    "pagination": {}
    "results": [
        {
            "id": "123",
            "author": {
            "id": "456",
            "name": "John Doe"
            },
            "content": "Hello world",
            "image": "https://www.example.com/feed-images.jpg",
            "reactions": {
                "likes": 20,
            },
            "created_time": 1620639583
        }
        // ... More posts.
    ]
  }
  ```

  TODO: Design response for like interaction

- **PUT /feed/like:** like interaction

  ```
  {
      "post_id": "123",
      "user_id": "123asd"
  }
  ```

## Pagination

Using cursor based pagination to consider large dataset and avoid inacurrate page window

```
 {
   "pagination": {
        "size": 10,
        "next_cursor": "=dXNlcjpVMEc5V0ZYTlo"
   }
   "results": [ // data  ]
   }
```

## Optimization and deep dive

- **Code splitting:**

  - Only load code that needed
  - Lazy load code that needed later

  For the reference Facebook splite code by 3 tier

  -. **Tier 1:** Basic layout needed to display the first paint for the above-the-fold content, including UI skeletons for initial loading states.

  -. **Tier 2:** JavaScript needed to fully render all above-the-fold content. After Tier 2, nothing on the screen should still be visually changing as a result of code loading.

  -. **Tier 3:** Resources that are only needed after display that doesn't affect the current pixels on the screen, including logging code and subscriptions for live-updating data.

- **Keyboard shortcut:** For example facebook.com that have shortcut `shift` + `?`
- **Error states:** Clearly display error states if any network requests have failed, or when there's no network connectivity.

### Feed list optimizations

- **Infinite Scrolling**
- **Virtualized list**
- **Loading indicators**
- **Infinite Scrolling**
- **Stale Feeds**
  - Prompt the user to refresh or refetch feed if last fetched timestamp is more than spesific time

### Feed post optimizations

- **Rendering Images**
  - Use CDN to host and serve image for faster loading performance
  - Use Webp format which provides superior lossless and lossy image compression.
  - Proper `alt` tag
  - Use `srcset` if there are image processing (resizing) capabilities to load the most suitable image file for the current viewport.
  - Prefetch offscreen images that are not in the viewport yet but about to enter viewport or render low resolution image and require user click on them to load high resoulution
- **Lazy load code that not need for initial render:**
  - Reactions popover
- **Optimistic updates** is a powerful feature built into modern query libraries like Relay, SWR and React Query.
- **Post truncation** is truncate long message content or truncate high interaction activite like 102K others instead of 102,111 others

### A11Y

- **Feed list**
  - Add `role="feed"` to the feed HTML element
- **Feed post**
  - Add `role="feed"` to the each post HTML element or use `article` tag
  - `aria-labelledby="<id>"` where the HTML tag containing the feed author name has that id attribute.
  - Contents within the feed post should be focusable via keyboards (add `tabindex="0"`) and the appropriate aria-role.
- **Feed interaction**
  - icon-only buttons should have aria-labels if there are no accompanying labels (e.g. Twitter).
