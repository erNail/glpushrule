import 'dotenv/config';
import { Command, Option } from 'commander';
import packageJson from '../../package.json';
import editCommand from './edit';
import showCommand from './show';
import addCommand from './add';

const glpushruleCommand = new Command()
  .name('glpushrule')
  .description('CLI for managing Gitlab push rules across multiple groups and repositories')
  .version(packageJson.version)
  .addOption(
    new Option('-m, --matcher <matcherRegEx>', 'the regex to use for filtering groups and repositories')
      .env('MATCHER')
      .makeOptionMandatory()
      .argParser((matcher) => new RegExp(matcher))
  )
  .addCommand(editCommand)
  .addCommand(showCommand)
  .addCommand(addCommand);

export default glpushruleCommand;
