# Astro Framework

## Island Architecture

### Concept
Astro uses "islands" of interactivity - only the interactive components load JavaScript, while the rest is static HTML.

### Client Directives
```astro
---
import Counter from './Counter.tsx';
import Header from './Header.tsx';
---

<!-- No JavaScript loaded (static HTML) -->
<Header />

<!-- Load immediately -->
<Counter client:load />

<!-- Load when visible -->
<Counter client:visible />

<!-- Load when idle -->
<Counter client:idle />

<!-- Load on media query -->
<Counter client:media="(max-width: 768px)" />

<!-- Only render on client (no SSR) -->
<Counter client:only="react" />
```

## File-Based Routing

### Basic Routes
```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── [slug].astro     → /blog/:slug
└── [...path].astro      → catch-all route
```

### Dynamic Routes
```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
    const posts = await fetchPosts();
    return posts.map(post => ({
        params: { slug: post.slug },
        props: { post }
    }));
}

const { post } = Astro.props;
---

<article>
    <h1>{post.title}</h1>
    <div>{post.content}</div>
</article>
```

## Best Practices

1. **Use islands architecture** - only add interactivity where needed
2. **Prefer SSG over SSR** when possible for better performance
3. **Use content collections** for type-safe content management
4. **Optimize images** with Astro's Image component
5. **Minimize client-side JavaScript** - leverage static HTML
6. **Use client:visible** for below-the-fold interactive components
7. **Leverage file-based routing** for clean URL structure
