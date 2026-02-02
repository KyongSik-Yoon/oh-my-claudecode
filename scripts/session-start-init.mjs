#!/usr/bin/env node
/**
 * SessionStart init wrapper
 *
 * Adapts SessionStart hook input to Setup init format.
 * This allows the setup-init logic to run during SessionStart.
 */

async function main() {
  // Read stdin
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const data = JSON.parse(input);

    // Transform SessionStart input to Setup init format
    const setupInput = {
      session_id: data.session_id || '',
      transcript_path: data.transcript_path || '',
      cwd: data.cwd || process.cwd(),
      permission_mode: data.permission_mode || 'normal',
      hook_event_name: 'Setup',
      trigger: 'init'
    };

    // Import and run setup init
    const { processSetupInit } = await import('../dist/hooks/setup/index.js');
    const result = await processSetupInit(setupInput);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('[session-start-init] Error:', error.message);
    process.exit(0); // Don't block on errors
  }
}

main();
