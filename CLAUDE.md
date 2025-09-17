# Release Instructions

## Creating Releases

This repository uses Git tags for versioning. When ready to release:

1. **Check existing tags first**:
   ```bash
   git tag -l  # List all tags
   git show v1  # Show what commit v1 currently points to
   ```

2. **Create semantic version tag** (e.g., v1.0.1):
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **Update major version tag** (e.g., v1):
   ```bash
   git tag -f v1  # Force update existing tag
   git push origin v1 --force
   ```

This allows users to reference either:
- `uses: cielo-red/agent@v1` (always gets latest v1.x.x)
- `uses: cielo-red/agent@v1.0.1` (pinned to specific version)

## Version Increment Examples

- Bug fixes: v1.0.0 → v1.0.1
- New features: v1.0.1 → v1.1.0  
- Breaking changes: v1.1.0 → v2.0.0

Always update both the semantic version tag and the major version tag.

## Authentication

The action supports two authentication methods:

### Method 1: Anthropic API Key
Add your Anthropic API key as a repository secret:
```yaml
- name: Run Cielo Red
  uses: cielo-red/agent@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Method 2: Claude CLI Credentials (Recommended)
Add your Claude CLI credentials as a **base64-encoded** repository secret:

1. Get your credentials: `cat ~/.claude/.credentials.json | base64`
2. Add the base64 output as secret `CLAUDE_CREDENTIALS`

```yaml
- name: Run Cielo Red
  uses: cielo-red/agent@v1
  with:
    claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}
```

**Important**: Always use GitHub repository secrets for sensitive credentials. Never put API keys or credentials directly in workflow files.