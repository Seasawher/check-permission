import * as core from '@actions/core';

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') ?? '';

function hasPRWritePermission(): boolean {
  if (!GITHUB_TOKEN) {
    core.debug('GITHUB_TOKEN is not available.');
    return false;
  }

  const rawPermissions = Deno.env.get('GITHUB_TOKEN_PERMISSIONS');
  if (!rawPermissions) {
    core.debug('GITHUB_TOKEN_PERMISSIONS is not defined.');
    return false;
  }

  try {
    const permissions = JSON.parse(rawPermissions) as Record<string, string>;
    const pullRequestPermission =
      permissions['pull_requests'] ?? permissions['pull-requests'];

    if (!pullRequestPermission) {
      return false;
    }

    const normalized = pullRequestPermission.toLowerCase();
    return normalized === 'write' || normalized === 'admin';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.warning(`Unable to parse GITHUB_TOKEN_PERMISSIONS: ${message}`);
    return false;
  }
}

function run () {
  const hasPermission = hasPRWritePermission();
  if (!hasPermission) {
    core.info("This GitHub Action does not have write permission for pull requests.");
    // does nothing
    return 0;
  }
}

run();
