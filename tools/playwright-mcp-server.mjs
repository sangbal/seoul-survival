#!/usr/bin/env node

/**
 * Playwright MCP Server (Project-local)
 *
 * - 이 서버는 현재 레포의 Playwright 테스트를 MCP 툴로 노출합니다.
 * - 기본 툴: runSmokeTests → `npx playwright test tests/smoke.spec.js`
 *
 * 준비:
 *   npm install -D @modelcontextprotocol/sdk
 *   npm install
 *   npx playwright install
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const pExec = promisify(exec);

const mcpServer = new McpServer({
  name: 'clicksurvivor-playwright',
  version: '0.1.0',
});

const transport = new StdioServerTransport();

mcpServer.registerTool('runSmokeTests', {
  description: 'Run Playwright smoke tests (tests/smoke.spec.js) for ClickSurvivor.',
}, async () => {
    try {
      const { stdout, stderr } = await pExec('npx playwright test tests/smoke.spec.js', {
        cwd: process.cwd(),
        env: {
          ...process.env,
          CI: '1',
        },
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        content: [
          {
            type: 'text',
            text:
              'Playwright smoke tests finished.\n\n' +
              'STDOUT:\n' +
              stdout +
              (stderr ? '\nSTDERR:\n' + stderr : ''),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text:
              'Playwright smoke tests failed.\n\n' +
              'MESSAGE:\n' +
              String(error?.message || error) +
              (error?.stdout ? '\n\nSTDOUT:\n' + error.stdout : '') +
              (error?.stderr ? '\n\nSTDERR:\n' + error.stderr : ''),
          },
        ],
      };
    }
  }
);

// 에러 핸들링 추가 (stdio transport 사용 시 console.log/error 사용 주의)
process.on('uncaughtException', (error) => {
  process.stderr.write(`Uncaught exception: ${error.message}\n`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  process.stderr.write(`Unhandled rejection: ${reason}\n`);
  process.exit(1);
});

try {
  await mcpServer.connect(transport);
} catch (error) {
  // stdio transport를 사용하므로 console.error 대신 stderr에 직접 쓰기
  process.stderr.write(`Failed to start MCP server: ${error.message}\n`);
  process.exit(1);
}



