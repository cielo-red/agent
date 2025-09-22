#!/usr/bin/env bun

import { existsSync } from 'fs';
import { join } from 'path';

interface PromptFileResult {
  prompt_file: string;
  source: 'repository' | 'action' | 'default';
}

function setAgentPromptFile(jobName: string, actionPath: string): PromptFileResult {
  const repoPromptFile = `.cielo/agents/${jobName}.md`;
  const actionPromptFile = join(actionPath, 'agents', `${jobName}.md`);
  
  // Check repo first, then action path
  if (existsSync(repoPromptFile)) {
    return {
      prompt_file: repoPromptFile,
      source: 'repository'
    };
  } else if (existsSync(actionPromptFile)) {
    return {
      prompt_file: actionPromptFile,
      source: 'action'
    };
  } else {
    return {
      prompt_file: repoPromptFile,
      source: 'default'
    };
  }
}

function main() {
  const jobName = process.env.GITHUB_JOB;
  const actionPath = process.env.GITHUB_ACTION_PATH;
  
  if (!jobName) {
    console.error('GITHUB_JOB environment variable is required');
    process.exit(1);
  }
  
  if (!actionPath) {
    console.error('GITHUB_ACTION_PATH environment variable is required');
    process.exit(1);
  }
  
  const result = setAgentPromptFile(jobName, actionPath);
  
  // Output for GitHub Actions
  console.log(`prompt_file=${result.prompt_file}`);
  console.log(`source=${result.source}`);
  
  // Also write to GITHUB_OUTPUT if available
  if (process.env.GITHUB_OUTPUT) {
    const fs = require('fs');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `prompt_file=${result.prompt_file}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `source=${result.source}\n`);
  }
}

if (import.meta.main) {
  main();
}

export { setAgentPromptFile };