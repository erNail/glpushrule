import chalk from 'chalk';
import printSummary from './summary-service';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('summary', () => {
  it('prints the summary correctly', () => {
    const groups = 5;
    const projects = 10;
    const pushRules = 15;

    printSummary(groups, projects, pushRules);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      `${chalk.bgGreen('Success!')}\nMatched Groups: ${chalk.bgCyan('%s')}\nMatched Projects ${chalk.bgCyan(
        '%s'
      )}\nPush Rules: ${chalk.bgCyan('%s')}`,
      groups,
      projects,
      pushRules
    );
  });
});
