import { Command, Option } from 'commander';
import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import addPushRules from '../service/commands/add-service';

const addCommand = new Command()
  .name('add')
  .description('add push rules if non exist')
  .configureHelp({ showGlobalOptions: true })
  .addOption(
    new Option('-r, --rule <pushRuleJson>', 'the push rules as JSON. Example: \'{"commitMessageRegex": "^ci: .*"}\'')
      .env('PUSH_RULE')
      .makeOptionMandatory()
      .argParser((rules: string) => JSON.parse(rules))
  )
  .action(async (options: { rule: CreateAndEditPushRuleOptions }, command) => {
    await addPushRules(command.optsWithGlobals().matcher, options.rule);
  });

export default addCommand;
