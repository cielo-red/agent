#!/usr/bin/env bun

import { readFileSync, existsSync, appendFileSync } from 'fs';

interface ReadPromptOptions {
  promptFile: string;
  task?: string;
}

function readAgentPrompt(options: ReadPromptOptions): string {
  const { promptFile, task } = options;
  
  if (!existsSync(promptFile)) {
    throw new Error(`Prompt file does not exist: ${promptFile}`);
  }
  
  let prompt = readFileSync(promptFile, 'utf-8').trim();
  
  if (task && task.trim()) {
    prompt += `\n\nTask to implement: ${task.trim()}`;
  }
  
  return prompt;
}

function writeGitHubOutput(key: string, value: string): void {
  const githubOutput = process.env.GITHUB_OUTPUT;
  
  if (githubOutput) {
    // Use heredoc format for multiline values
    const delimiter = 'EOF';
    appendFileSync(githubOutput, `${key}<<${delimiter}\n${value}\n${delimiter}\n`);
  }
  
  // Also output to console for debugging
  console.log(`Set output ${key} with ${value.split('\n').length} lines`);
}

function main() {
  const promptFile = process.argv[2];
  const task = process.env.GITHUB_EVENT_INPUTS_TASK || process.argv[3];
  
  if (!promptFile) {
    console.error('Usage: read-agent-prompt.ts <prompt-file-path> [task]');
    process.exit(1);
  }
  
  try {
    const prompt = readAgentPrompt({ promptFile, task });
    writeGitHubOutput('prompt', prompt);
    console.log(`Successfully read prompt from: ${promptFile}`);
  } catch (error) {
    console.error('Error reading prompt:', error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { readAgentPrompt, writeGitHubOutput };