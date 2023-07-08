import { Command } from 'commander';
import showPushRules from '../service/commands/show-service';

const showCommand = new Command()
  .name('show')
  .description('show push rules')
  .configureHelp({ showGlobalOptions: true })
  .action(async (_, command) => {
    await showPushRules(command.optsWithGlobals().matcher);
  });

export default showCommand;
