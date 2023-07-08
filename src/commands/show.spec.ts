import 'dotenv/config';
import showPushRules from '../service/commands/show-service';
import glpushruleCommand from './_glpushrule';

jest.mock('../service/commands/show-service');

describe('showCommand', () => {
  it('calls showPushRules with the right arguments using long flags', async () => {
    glpushruleCommand.parse(['node', 'glpushrule', 'show', '--matcher', 'test']);

    expect(showPushRules).toHaveBeenCalledWith(/test/);
    expect(showPushRules).toHaveBeenCalledTimes(1);
  });

  it('calls showPushRules with the right arguments using short flags', async () => {
    glpushruleCommand.parse(['node', 'glpushrule', 'show', '-m', 'test']);

    expect(showPushRules).toHaveBeenCalledWith(/test/);
    expect(showPushRules).toHaveBeenCalledTimes(1);
  });
});
