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