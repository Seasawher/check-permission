import * as core from '@actions/core';

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') ?? '';

type Permission = 'none' | 'read' | 'write';

function getPRPermissionLevel(): Permission {
  const rawPermissions = Deno.env.get('GITHUB_TOKEN_PERMISSIONS');
  if (!rawPermissions) {
    core.info('GITHUB_TOKEN_PERMISSIONS is not defined.');
    return 'none';
  }

  try {
    const permissions = JSON.parse(rawPermissions) as Record<string, string>;
    core.info(`Parsed GITHUB_TOKEN_PERMISSIONS: ${JSON.stringify(permissions)}`);
    const pullRequestPermission =
      permissions['pull_requests'] ?? permissions['pull-requests'];

    if (!pullRequestPermission) {
      return 'none';
    }

    const normalized = pullRequestPermission.trim().toLowerCase();
    if (normalized === 'write' || normalized === 'admin' || normalized === 'maintain') {
      return 'write';
    }

    if (normalized === 'read' || normalized === 'triage') {
      return 'read';
    }

    return 'none';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.warning(`Unable to parse GITHUB_TOKEN_PERMISSIONS: ${message}`);
    return 'none';
  }
}

function run () {
  const permission = getPRPermissionLevel();
  core.info(`Pull Request permission level: ${permission}`);
}

run();
