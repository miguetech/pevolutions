# Git Commit Guidelines

**CRITICAL: All commit messages MUST be in English**

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type (Required)

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature or bug fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config)
- `build`: Build system or dependencies
- `ci`: CI/CD configuration changes

## Scope (Optional)

- `backend`: Backend changes
- `frontend`: Frontend changes
- `api`: API-specific changes
- `auth`: Authentication/authorization
- `db`: Database changes
- `ui`: UI components
- `config`: Configuration files

## Subject (Required)

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Be concise but descriptive

## Body (Optional)

- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

## Footer (Optional)

- Reference issues: `Closes #123` or `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Simple Commit
```
feat(auth): add JWT token refresh endpoint
```

### Commit with Body
```
fix(backend): resolve database connection pool exhaustion

- Increase pool size from 5 to 20
- Add connection timeout of 30 seconds
- Implement proper connection cleanup in error cases

Fixes #42
```

### Multiple Changes (Enumerated List)
```
refactor(backend): restructure project architecture

1. Move legacy code to archive directory
2. Create new modular structure for routes
3. Separate business logic from API handlers
4. Add dependency injection for services
```

### Breaking Change
```
feat(api): change authentication response format

BREAKING CHANGE: Auth endpoints now return tokens in 'data' object
instead of root level. Update frontend to use response.data.token
```

### Bug Fix
```
fix(frontend): prevent infinite loop in user fetch hook

The useEffect was missing userId in dependencies array, causing
it to run on every render. Added userId to deps to fix.

Closes #89
```

### Documentation
```
docs(readme): update installation instructions

Add steps for MySQL setup and environment configuration
```

### Performance
```
perf(api): optimize user query with eager loading

Use selectinload for posts relationship to avoid N+1 queries.
Reduces response time from 500ms to 50ms for users with many posts.
```

### Testing
```
test(auth): add integration tests for login flow

- Test successful login
- Test invalid credentials
- Test token expiration
- Test refresh token flow
```

### Chore
```
chore(deps): upgrade FastAPI to 0.115.0

Update FastAPI and related dependencies to latest versions
```

## Commit Best Practices

1. **Commit frequently** - Small, focused commits are better than large ones
2. **One logical change per commit** - Don't mix unrelated changes
3. **Test before committing** - Ensure code works and tests pass
4. **Review your changes** - Use `git diff` before committing
5. **Write meaningful messages** - Future you will thank present you
6. **Use present tense** - "add feature" not "added feature"
7. **Reference issues** - Link commits to issue tracker when applicable

## Pre-commit Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Environment variables not hardcoded
- [ ] Commit message is in English
- [ ] Commit message follows format guidelines

## Bad Examples (Avoid)

```
# Too vague
fix: bug fix

# Not in English
feat: agregar autenticación de usuarios

# Wrong tense
feat: added login feature

# Too long subject
feat(auth): add new authentication system with JWT tokens and refresh token support

# Capitalized
feat: Add login feature

# With period
feat: add login feature.

# Mixed changes
feat: add login and fix database bug and update docs
```

## Good Examples

```
feat(auth): add login endpoint
fix(db): resolve connection timeout
docs(api): update authentication guide
test(users): add CRUD operation tests
refactor(api): extract validation logic
perf(db): add index on user email
chore(deps): update dependencies
```

## Tools

### Commitizen (Optional)
```bash
# Install
npm install -g commitizen

# Use
git cz
```

### Commitlint (Optional)
```bash
# Install
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

## Git Workflow

1. Create feature branch: `git checkout -b feat/user-authentication`
2. Make changes and commit: `git commit -m "feat(auth): add login endpoint"`
3. Push to remote: `git push origin feat/user-authentication`
4. Create pull request
5. After review, merge to main
6. Delete feature branch

## Branch Naming

```
feat/feature-name
fix/bug-description
docs/documentation-update
refactor/code-improvement
test/test-description
```
