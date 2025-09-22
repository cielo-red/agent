#!/bin/bash

set -euo pipefail

# Cielo Red Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/cielo-red/agent/main/install.sh | bash

BOLD='\033[1m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
RESET='\033[0m'

print_header() {
    echo -e "${CYAN}${BOLD}"
    echo "  ████████╗██╗███████╗██╗      ██████╗     ██████╗ ███████╗██████╗ "
    echo "  ██╔═════╝██║██╔════╝██║     ██╔═══██╗    ██╔══██╗██╔════╝██╔══██╗"
    echo "  ██║      ██║█████╗  ██║     ██║   ██║    ██████╔╝█████╗  ██║  ██║"
    echo "  ██║      ██║██╔══╝  ██║     ██║   ██║    ██╔══██╗██╔══╝  ██║  ██║"
    echo "  ╚███████╗██║███████╗███████╗╚██████╔╝    ██║  ██║███████╗██████╔╝"
    echo "   ╚══════╝╚═╝╚══════╝╚══════╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝╚═════╝ "
    echo -e "${RESET}"
    echo -e "${BOLD}Your Entire Dev Team, Automated${RESET}"
    echo
}

log_info() {
    echo -e "${BLUE}ℹ${RESET} $1"
}

log_success() {
    echo -e "${GREEN}✓${RESET} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${RESET} $1"
}

log_error() {
    echo -e "${RED}✗${RESET} $1" >&2
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if we're in a git repository
    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
        log_error "Not in a git repository. Please run this in your project root."
        exit 1
    fi
    
    # Check if GitHub CLI is available (optional but recommended)
    if ! command -v gh &>/dev/null; then
        log_warning "GitHub CLI not found. You'll need to set up secrets manually."
        echo "  Install with: brew install gh (macOS) or see https://cli.github.com/"
    fi
    
    log_success "Requirements checked"
}

create_workflows_dir() {
    log_info "Creating .github/workflows directory..."
    mkdir -p .github/workflows
    log_success "Workflows directory ready"
}

download_team_workflow() {
    log_info "Downloading SDLC team workflow..."
    
    local workflow_url="https://raw.githubusercontent.com/cielo-red/agent/main/.github/workflows/team.yml"
    local workflow_file=".github/workflows/cielo-team.yml"
    
    if curl -fsSL "$workflow_url" -o "$workflow_file"; then
        log_success "Team workflow downloaded to $workflow_file"
    else
        log_error "Failed to download team workflow"
        exit 1
    fi
}

create_basic_workflow() {
    log_info "Creating basic Cielo Red workflow..."
    
    cat > .github/workflows/cielo.yml << 'EOF'
name: Cielo Red

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  cielo:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@cielo')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@cielo')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@cielo') || contains(github.event.issue.title, '@cielo')))
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Cielo Red
        uses: cielo-red/agent@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
EOF

    log_success "Basic workflow created at .github/workflows/cielo.yml"
}

setup_secrets() {
    log_info "Setting up authentication..."
    
    if command -v gh &>/dev/null && gh auth status &>/dev/null; then
        echo
        echo -e "${BOLD}Choose authentication method:${RESET}"
        echo "1) Anthropic API Key (recommended)"
        echo "2) Claude CLI Credentials"
        echo "3) Skip (set up manually later)"
        
        read -p "Enter your choice (1-3): " auth_choice
        
        case $auth_choice in
            1)
                echo
                echo -e "${YELLOW}Get your API key from: https://console.anthropic.com/${RESET}"
                read -p "Enter your Anthropic API key: " -s api_key
                echo
                
                if [[ -n "$api_key" ]]; then
                    echo "$api_key" | gh secret set ANTHROPIC_API_KEY
                    log_success "API key saved as repository secret"
                else
                    log_warning "No API key provided. You'll need to set ANTHROPIC_API_KEY manually."
                fi
                ;;
            2)
                if [[ -f "$HOME/.claude/.credentials.json" ]]; then
                    log_info "Found Claude CLI credentials, encoding..."
                    credentials=$(base64 < "$HOME/.claude/.credentials.json")
                    echo "$credentials" | gh secret set CLAUDE_CREDENTIALS
                    log_success "Claude credentials saved as repository secret"
                else
                    log_warning "Claude CLI credentials not found at ~/.claude/.credentials.json"
                    echo "Install Claude CLI first: https://docs.anthropic.com/en/docs/claude-code"
                fi
                ;;
            3)
                log_warning "Skipping authentication setup"
                ;;
            *)
                log_warning "Invalid choice. Skipping authentication setup."
                ;;
        esac
    else
        log_warning "GitHub CLI not authenticated. Set up secrets manually:"
        echo "  1. Go to your repository settings"
        echo "  2. Navigate to Secrets and variables > Actions"
        echo "  3. Add ANTHROPIC_API_KEY with your API key from https://console.anthropic.com/"
    fi
}

create_agent_directory() {
    log_info "Creating agent configuration directory..."
    mkdir -p .cielo/agents
    
    # Create a sample agent file
    cat > .cielo/agents/README.md << 'EOF'
# Agent Configuration

This directory contains role-specific prompts for your AI development team.

## How it works

- Each file corresponds to a GitHub Actions job name (e.g., `developer.md`, `security.md`)
- The system automatically reads the appropriate prompt based on the job name
- If no prompt exists, Cielo Red generates one automatically

## Example roles

Common roles you might want to customize:
- `manager.md` - Project management and coordination
- `developer.md` - Code implementation and bug fixes  
- `architect.md` - System design and technical decisions
- `security.md` - Security analysis and vulnerability assessment
- `qa.md` - Testing strategy and quality assurance
- `devops.md` - Infrastructure and deployment automation

## Customization

Create any `<role>.md` file in this directory to customize that role's behavior.
The prompt should be written in second person ("You are a...").
EOF

    log_success "Agent configuration directory created at .cielo/agents/"
}

show_next_steps() {
    echo
    echo -e "${GREEN}${BOLD}🎉 Cielo Red is now installed!${RESET}"
    echo
    echo -e "${BOLD}Next steps:${RESET}"
    echo
    echo "1. 🔑 Set up authentication (if you haven't already):"
    echo "   • Get API key: https://console.anthropic.com/"
    echo "   • Add as repository secret: ANTHROPIC_API_KEY"
    echo
    echo "2. 🚀 Try it out:"
    echo "   • Create an issue and mention @cielo"
    echo "   • Comment '@cielo fix this bug' on a PR"
    echo "   • Assign an issue to cielo-red[bot]"
    echo
    echo "3. ⚙️ Customize your team:"
    echo "   • Edit files in .cielo/agents/ to customize roles"
    echo "   • Run the full team workflow: .github/workflows/cielo-team.yml"
    echo
    echo "4. 📚 Learn more:"
    echo "   • Documentation: https://github.com/cielo-red/agent"
    echo "   • Examples: https://github.com/cielo-red/agent/tree/main/.github/workflows"
    echo
    echo -e "${CYAN}Happy coding with your new AI team! 🤖${RESET}"
}

main() {
    print_header
    
    echo -e "${BOLD}Installing Cielo Red - Your AI Development Team${RESET}"
    echo
    
    # Parse command line arguments
    INSTALL_TYPE="basic"
    while [[ $# -gt 0 ]]; do
        case $1 in
            --team)
                INSTALL_TYPE="team"
                shift
                ;;
            --basic)
                INSTALL_TYPE="basic"
                shift
                ;;
            -h|--help)
                echo "Usage: install.sh [--team|--basic]"
                echo "  --team   Install full SDLC team workflow"
                echo "  --basic  Install basic Cielo Red workflow (default)"
                exit 0
                ;;
            *)
                log_warning "Unknown option: $1"
                shift
                ;;
        esac
    done
    
    # Run installation steps
    check_requirements
    create_workflows_dir
    
    if [[ "$INSTALL_TYPE" == "team" ]]; then
        download_team_workflow
        log_success "Full SDLC team workflow installed"
    else
        create_basic_workflow
        log_success "Basic Cielo Red workflow installed"
    fi
    
    create_agent_directory
    setup_secrets
    show_next_steps
}

# Run main function with all arguments
main "$@"