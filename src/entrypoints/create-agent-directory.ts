#!/usr/bin/env bun

import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

function createAgentDirectory(promptFile: string): void {
  const dir = dirname(promptFile);
  
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
}

function main() {
  const promptFile = process.argv[2];
  
  if (!promptFile) {
    console.error('Usage: create-agent-directory.ts <prompt-file-path>');
    process.exit(1);
  }
  
  try {
    createAgentDirectory(promptFile);
  } catch (error) {
    console.error('Error creating directory:', error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { createAgentDirectory };