import 'dotenv/config';
import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import addPushRules from '../service/commands/add-service';
import glpushruleCommand from './_glpushrule';

jest.mock('../service/commands/add-service');

describe('addCommand', () => {
  it('calls addPushRules with the right arguments using long flags', async () => {
    const rule: CreateAndEditPushRuleOptions = { commitMessageRegex: '^ci: .*' };
    glpushruleCommand.parse(['node', 'glpushrule', 'add', '--matcher', 'test', '--rule', JSON.stringify(rule)]);

    expect(addPushRules).toHaveBeenCalledWith(/test/, rule);
    expect(addPushRules).toHaveBeenCalledTimes(1);
  });

  it('calls addPushRules with the right arguments using short flags', async () => {
    const rule: CreateAndEditPushRuleOptions = { commitMessageRegex: '^ci: .*' };
    glpushruleCommand.parse(['node', 'glpushrule', 'add', '-m', 'test', '-r', JSON.stringify(rule)]);

    expect(addPushRules).toHaveBeenCalledWith(/test/, rule);
    expect(addPushRules).toHaveBeenCalledTimes(1);
  });
});
