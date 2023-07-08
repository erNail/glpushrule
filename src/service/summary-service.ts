import chalk from 'chalk';
import logger from '../utils/logger';

/**
 * Prints a summary of the push rule operations, including the number of matched groups, projects, and push rules.
 * @param groups - The number of matched groups.
 * @param projects - The number of matched projects.
 * @param pushRules - The number of push rules.
 */
function printSummary(groups: number, projects: number, pushRules: number): void {
  logger.info(
    `${chalk.bgGreen('Success!')}\nMatched Groups: ${chalk.bgCyan('%s')}\nMatched Projects ${chalk.bgCyan(
      '%s'
    )}\nPush Rules: ${chalk.bgCyan('%s')}`,
    groups,
    projects,
    pushRules
  );
}

export default printSummary;
