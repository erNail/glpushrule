import { Command, Option } from 'commander';
import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import editPushRules from '../service/commands/edit-service';

const editCommand = new Command()
  .name('edit')
  .description('edit already existing push rules')
  .configureHelp({ showGlobalOptions: true })
  .addOption(
    new Option('-r, --rule <pushRulesJson>', 'the push rules as JSON. Example: \'{"commitMessageRegex": "^ci: .*"}\'')
      .env('PUSH_RULE')
      .makeOptionMandatory()
      .argParser((rules: string) => JSON.parse(rules))
  )
  .action(async (options: { rule: CreateAndEditPushRuleOptions }, command) => {
    await editPushRules(command.optsWithGlobals().matcher, options.rule);
  });

export default editCommand;
