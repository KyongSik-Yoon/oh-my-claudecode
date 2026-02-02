#!/usr/bin/env node
/**
 * SessionStart maintenance wrapper
 *
 * Adapts SessionStart hook input to Setup maintenance format.
 * This allows the setup-maintenance logic to run during SessionStart.
 */

async function main() {
  // Read stdin
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const data = JSON.parse(input);

    // Transform SessionStart input to Setup maintenance format
    const setupInput = {
      session_id: data.session_id || '',
      transcript_path: data.transcript_path || '',
      cwd: data.cwd || process.cwd(),
      permission_mode: data.permission_mode || 'normal',
      hook_event_name: 'Setup',
      trigger: 'maintenance'
    };

    // Import and run setup maintenance
    const { processSetupMaintenance } = await import('../dist/hooks/setup/index.js');
    const result = await processSetupMaintenance(setupInput);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('[session-start-maintenance] Error:', error.message);
    process.exit(0); // Don't block on errors
  }
}

main();
