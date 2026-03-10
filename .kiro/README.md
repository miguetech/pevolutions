# .kiro Directory

This directory contains Kiro CLI configuration and project-specific guidelines.

## Structure

```
.kiro/
├── README.md
├── skills/
│   ├── backend/
│   │   ├── python.md           # Python best practices
│   │   ├── fastapi.md          # FastAPI development
│   │   ├── sqlalchemy.md       # ORM patterns
│   │   └── security.md         # Security & authentication
│   ├── frontend/
│   │   ├── typescript.md       # TypeScript best practices
│   │   ├── react.md            # React patterns
│   │   ├── astro.md            # Astro framework
│   │   └── styling.md          # Tailwind & accessibility
│   ├── testing/
│   │   ├── backend-testing.md  # pytest patterns
│   │   └── frontend-testing.md # React testing
│   └── general/
│       ├── api-integration.md  # API patterns
│       ├── architecture.md     # Code organization
│       └── documentation.md    # Documentation standards
├── guidelines/
│   └── git-commits.md          # Git commit rules (English only)
└── settings/
    └── lsp.json                # LSP configuration (auto-generated)
```

## Usage

Kiro will automatically reference these guidelines when helping with development tasks. The modular structure allows Kiro to load only relevant skills based on your current task.

## Benefits

- **Selective Loading**: Kiro loads only relevant files for your task
- **Better Organization**: Skills grouped by technology and purpose
- **Easy Maintenance**: Update specific skills without affecting others
- **Scalable**: Add new skills as project grows
