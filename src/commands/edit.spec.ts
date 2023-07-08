import 'dotenv/config';
import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import editPushRules from '../service/commands/edit-service';
import glpushruleCommand from './_glpushrule';

jest.mock('../service/commands/edit-service');

describe('editCommand', () => {
  it('calls editPushRules with the right arguments using long flags', async () => {
    const rule: CreateAndEditPushRuleOptions = { commitMessageRegex: '^ci: .*' };
    glpushruleCommand.parse(['node', 'glpushrule', 'edit', '--matcher', 'test', '--rule', JSON.stringify(rule)]);

    expect(editPushRules).toHaveBeenCalledWith(/test/, rule);
    expect(editPushRules).toHaveBeenCalledTimes(1);
  });

  it('calls editPushRules with the right arguments using short flags', async () => {
    const rule: CreateAndEditPushRuleOptions = { commitMessageRegex: '^ci: .*' };
    glpushruleCommand.parse(['node', 'glpushrule', 'edit', '-m', 'test', '-r', JSON.stringify(rule)]);

    expect(editPushRules).toHaveBeenCalledWith(/test/, rule);
    expect(editPushRules).toHaveBeenCalledTimes(1);
  });
});
