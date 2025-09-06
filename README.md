# Cielo Red

A GitHub Action that integrates AI assistant into your GitHub workflows for automated code tasks, reviews, and issue resolution.

## Usage

```yaml
- uses: cielo-red/agent@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: 'Your task for Cielo Red'
```

## Features

- 🤖 **Auto-detection**: Automatically detects execution mode based on GitHub event type
- 💬 **Comment triggers**: Responds to @cielo mentions in issues and PRs
- 🏷️ **Label triggers**: Activates when specific labels are added
- 👤 **Assignment triggers**: Works when issues are assigned to cielo-red[bot]
- 🔄 **Pull request creation**: Automatically creates PRs with changes
- 🔍 **Code review**: Provides intelligent code reviews and suggestions

## Inputs

### Core Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `anthropic_api_key` | Anthropic API key | Yes | - |
| `prompt` | Instructions for Cielo Red | No | - |
| `github_token` | GitHub token with repo permissions | No | `${{ github.token }}` |

### Configuration

| Input | Description | Default |
|-------|-------------|---------|
| `model` | AI model to use | `claude-3-5-sonnet-20241022` |
| `temperature` | Response generation temperature (0-1) | `0` |
| `max_tokens` | Maximum tokens for response | `8192` |
| `auto_approve` | Auto-approve all Cielo Red actions | `false` |
| `create_pr` | Create pull request with changes | `true` |
| `base_branch` | Base branch for pull requests | `main` |

### Triggers

| Input | Description | Default |
|-------|-------------|---------|
| `trigger_phrase` | Phrase to trigger in comments | `@cielo` |
| `assignee_trigger` | Trigger on issue assignment | `true` |
| `label_trigger` | Trigger on label addition | `false` |
| `label_name` | Label name to trigger on | `cielo-red` |

## Outputs

| Output | Description |
|--------|-------------|
| `execution_file` | Path to execution output file |
| `branch_name` | Created branch name |
| `pr_url` | URL of created pull request |
| `files_changed` | List of modified files |
| `status` | Execution status (success/failure) |

## Examples

### Basic Usage

```yaml
name: Cielo Red

on:
  issue_comment:
    types: [created]

jobs:
  cielo:
    runs-on: ubuntu-latest
    if: contains(github.event.comment.body, '@cielo')
    steps:
      - uses: actions/checkout@v4
      - uses: cielo-red/agent@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: ${{ github.event.comment.body }}
```

### Manual Workflow

```yaml
name: Run Cielo Red

on:
  workflow_dispatch:
    inputs:
      task:
        description: 'Task for Cielo Red'
        required: true

jobs:
  cielo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cielo-red/agent@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: ${{ github.event.inputs.task }}
          auto_approve: true
```

### Code Review on PR

```yaml
name: PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cielo-red/agent@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review this pull request for:
            - Code quality issues
            - Security vulnerabilities
            - Performance improvements
            - Best practices
```

## Setup

1. **Add API Key**: Add your Anthropic API key as a repository secret named `ANTHROPIC_API_KEY`

2. **Create Workflow**: Add a workflow file to `.github/workflows/` using one of the examples above

3. **Trigger Action**: 
   - Comment with `@cielo` in issues or PRs
   - Assign issues to `cielo-red[bot]`
   - Add configured labels
   - Run manually via workflow dispatch

## Security

- API keys are stored as GitHub secrets
- Actions run in isolated environments
- File system access is restricted to repository
- Network access can be configured

## License

MIT