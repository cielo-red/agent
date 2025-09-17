# Cielo Red

A GitHub Action that integrates AI assistant into your GitHub workflows for automated code tasks, reviews, and issue resolution.

## Usage

```yaml
- uses: cielo-red/agent@v1
  with:
    claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}  # or anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
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
| `anthropic_api_key` | Anthropic API key | No* | - |
| `claude_credentials` | Claude CLI credentials JSON | No* | - |
| `prompt` | Instructions for Cielo Red | No** | - |
| `github_token` | GitHub token with repo permissions | No | `${{ github.token }}` |

*Either `anthropic_api_key` OR `claude_credentials` is required for authentication.
**When triggered by issue/PR comments, the comment body is automatically used if no prompt is provided.

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
          claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}
          # prompt is optional - automatically uses comment body for comment triggers
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
          claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}
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
          claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}
          prompt: |
            Review this pull request for:
            - Code quality issues
            - Security vulnerabilities
            - Performance improvements
            - Best practices
```

## Setup

### Authentication

Choose one of the following authentication methods:

#### Method 1: Anthropic API Key
Add your Anthropic API key as a repository secret named `ANTHROPIC_API_KEY`:

```yaml
- uses: cielo-red/agent@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: 'Your task'
```

#### Method 2: Claude CLI Credentials (Recommended)
Add your Claude CLI credentials as a **base64-encoded** repository secret:

1. First, make sure you have Claude CLI installed and authenticated:
   ```bash
   # Install Claude CLI if not already installed
   curl -fsSL https://releases.anthropic.com/claude-code/install.sh | bash
   
   # Authenticate with Claude CLI
   claude auth login
   ```

2. Get your credentials file and encode it:
   ```bash
   cat ~/.claude/.credentials.json | base64
   ```

3. Add the base64 output as a repository secret named `CLAUDE_CREDENTIALS`

4. Use in your workflow:
   ```yaml
   - uses: cielo-red/agent@v1
     with:
       claude_credentials: ${{ secrets.CLAUDE_CREDENTIALS }}
       prompt: 'Your task'
   ```

**Note**: The `claude_credentials` should contain the base64-encoded contents of your `~/.claude/.credentials.json` file. This method is recommended as it provides more robust authentication compared to API keys alone.

### Workflow Setup

1. **Add Credentials**: Choose one of the authentication methods above

2. **Create Workflow**: Add a workflow file to `.github/workflows/` using one of the examples above

3. **Trigger Action**: 
   - Comment with `@cielo` in issues or PRs
   - Assign issues to `cielo-red[bot]`
   - Add configured labels
   - Run manually via workflow dispatch

## Troubleshooting

### Common Issues

#### Authentication Errors
- **"Invalid API key"**: Ensure your `ANTHROPIC_API_KEY` is correctly set in repository secrets
- **"Please run /login"**: Your Claude CLI credentials may be invalid or expired. Re-authenticate using `claude auth login` and update the `CLAUDE_CREDENTIALS` secret

#### Installation Issues
- **Package not found**: The action automatically installs Claude CLI using the official installer. If you encounter issues, ensure your runner has internet access and can execute shell scripts
- **Permission errors**: Make sure the GitHub token has sufficient permissions (repo access)

#### Execution Issues
- **No prompt provided**: When triggered by comments, ensure the trigger phrase (`@cielo` by default) is present
- **Action not triggering**: Check that your workflow file has the correct event triggers and conditions

### Getting Help
- Check the [Claude CLI documentation](https://docs.anthropic.com/en/docs/claude-code) for detailed setup instructions
- Verify your repository secrets are correctly configured
- Ensure workflow permissions allow the action to create branches and PRs

## Security

- API keys are stored as GitHub secrets
- Actions run in isolated environments
- File system access is restricted to repository
- Network access can be configured

## License

MIT