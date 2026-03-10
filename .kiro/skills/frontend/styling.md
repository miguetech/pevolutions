# Styling & Accessibility

## Tailwind CSS

### Utility-First Approach
```tsx
// Good - utility classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
</button>

// Avoid - inline styles
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
    Click me
</button>
```

### Responsive Design (Mobile-First)
```tsx
<div className="
    w-full          /* mobile: full width */
    md:w-1/2        /* tablet: half width */
    lg:w-1/3        /* desktop: third width */
    xl:w-1/4        /* large: quarter width */
">
    Content
</div>
```

### Custom Classes with @apply
```css
/* styles/components.css */
@layer components {
    .btn-primary {
        @apply px-4 py-2 bg-blue-500 text-white rounded;
        @apply hover:bg-blue-600 focus:ring-2 focus:ring-blue-300;
        @apply disabled:opacity-50 disabled:cursor-not-allowed;
    }
}
```

### Dark Mode
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
    Content
</div>
```

## Accessibility (WCAG 2.1 Level AA)

### Semantic HTML
```tsx
// Good - semantic elements
<nav>
    <ul>
        <li><a href="/">Home</a></li>
    </ul>
</nav>

<main>
    <article>
        <h1>Title</h1>
        <p>Content</p>
    </article>
</main>

// Bad - div soup
<div className="nav">
    <div className="link">Home</div>
</div>
```

### ARIA Labels
```tsx
// Button with icon only
<button aria-label="Close dialog">
    <XIcon />
</button>

// Form inputs
<label htmlFor="email">Email</label>
<input 
    id="email" 
    type="email" 
    aria-required="true"
    aria-describedby="email-error"
/>
<span id="email-error" role="alert">Invalid email</span>

// Loading state
<div aria-live="polite" aria-busy="true">
    Loading...
</div>
```

### Keyboard Navigation
```tsx
function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen);
    };
    
    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                Menu
            </button>
            {isOpen && (
                <ul role="menu">
                    <li role="menuitem"><a href="/profile">Profile</a></li>
                    <li role="menuitem"><a href="/settings">Settings</a></li>
                </ul>
            )}
        </div>
    );
}
```

### Focus Management
```tsx
import { useRef, useEffect } from 'react';

function Modal({ isOpen, onClose }: ModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        if (isOpen) {
            closeButtonRef.current?.focus();
        }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
        <div role="dialog" aria-modal="true">
            <button 
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close modal"
            >
                Close
            </button>
            <div>Modal content</div>
        </div>
    );
}
```

### Color Contrast
```tsx
// Good - sufficient contrast (4.5:1 for normal text)
<p className="text-gray-900 bg-white">High contrast text</p>

// Bad - insufficient contrast
<p className="text-gray-400 bg-white">Low contrast text</p>

// Use tools to check: https://webaim.org/resources/contrastchecker/
```

### Alt Text for Images
```tsx
// Decorative image
<img src="decoration.png" alt="" role="presentation" />

// Informative image
<img src="chart.png" alt="Sales increased by 25% in Q4" />

// Linked image
<a href="/profile">
    <img src="avatar.png" alt="View John's profile" />
</a>
```

### Form Validation
```tsx
function LoginForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    return (
        <form>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                    <span id="email-error" role="alert" className="text-red-600">
                        {errors.email}
                    </span>
                )}
            </div>
        </form>
    );
}
```

## Responsive Design Patterns

### Container Queries (Modern)
```css
@container (min-width: 400px) {
    .card {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
}
```

### Breakpoints (Tailwind)
```
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large
2xl: 1536px - 2X Extra large
```

### Flexible Layouts
```tsx
// Flexbox
<div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">Column 1</div>
    <div className="flex-1">Column 2</div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

## Best Practices

1. **Use semantic HTML** - nav, main, article, section, aside
2. **Provide alt text** for all meaningful images
3. **Ensure keyboard navigation** works for all interactive elements
4. **Maintain color contrast** ratios (4.5:1 for text)
5. **Use ARIA labels** when semantic HTML isn't enough
6. **Test with screen readers** (NVDA, JAWS, VoiceOver)
7. **Mobile-first approach** with Tailwind breakpoints
8. **Focus visible** - ensure focus indicators are visible
9. **Skip links** for keyboard users to skip navigation
10. **Test without mouse** - ensure full keyboard accessibility
