import * as core from '@actions/core';

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') ?? '';

type Permission = 'none' | 'read' | 'write';

function getPRPermissionLevel(): Permission {
  // gh コマンドを使用して、PR を読み取りできるか試し、
  // 権限不足で失敗した場合は none を返す
  return 'none';
}

function run () {
  const permission = getPRPermissionLevel();
  core.info(`Pull Request permission level: ${permission}`);
}

run();
