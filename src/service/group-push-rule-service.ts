import { CreateAndEditPushRuleOptions, GroupSchema } from '@gitbeaker/rest';
import chalk from 'chalk';
import logger from '../utils/logger';
import PushRuleError from '../model/push-rule-error';
import gitlabApi from '../utils/gitlab-api';

/**
 * Class that manages operations related to Group push rules.
 */
class GroupPushRuleService {
  pushRuleCounter = 0;

  /**
   * Fetches the push rules of a list of groups.
   * @param groups - The groups for which to fetch the push rules.
   * @returns A Promise resolving to an array of voids.
   */
  async fetchPushRules(groups: GroupSchema[]): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(groups.map(async (group) => this.fetchPushRule(group)));
  }

  /**
   * Adds push rules to a list of groups.
   * @param groups - The groups to which to add the push rules.
   * @param pushRule - The push rule to add.
   * @returns A Promise resolving to an array of voids.
   */
  async addPushRules(groups: GroupSchema[], pushRule: CreateAndEditPushRuleOptions): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(groups.map(async (group) => this.addPushRule(group, pushRule)));
  }

  /**
   * Edits the push rules of a list of groups.
   * @param groups - The groups for which to edit the push rules.
   * @param pushRule - The push rule to edit.
   * @returns A Promise resolving to an array of voids.
   */
  async editPushRules(groups: GroupSchema[], pushRule: CreateAndEditPushRuleOptions): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(groups.map(async (group) => this.editPushRule(group, pushRule)));
  }

  /**
   * Fetches the push rule of a group.
   * @param group - The group for which to fetch the push rule.
   * @returns A Promise resolving to void.
   */
  async fetchPushRule(group: GroupSchema): Promise<void> {
    try {
      const pushRule = await gitlabApi.GroupPushRules.show(group.id);
      logger.info(`${chalk.bgMagenta(group.full_path)} Group push rule:\n%o`, pushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"404 Push Rule Not Found"') {
        throw error;
      }
      logger.info(`${chalk.bgMagenta(group.full_path)} No group push rule found`);
    }
  }

  /**
   * Adds a push rule to a group.
   * @param group - The group to which to add the push rule.
   * @param pushRule - The push rule to add.
   * @returns A Promise resolving to void.
   */
  async addPushRule(group: GroupSchema, pushRule: CreateAndEditPushRuleOptions): Promise<void> {
    try {
      const createdPushRule = await gitlabApi.GroupPushRules.create(group.id, pushRule);
      logger.info(`${chalk.bgMagenta(group.full_path)} Group push rule:\n%o`, createdPushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"Group push rule exists, try updating"') {
        throw error;
      }
      logger.warn(`${chalk.bgMagenta(group.full_path)} Group push rule exists already, try editing`);
    }
  }

  /**
   * Edits the push rule of a group.
   * @param group - The group for which to edit the push rule.
   * @param pushRule - The push rule to edit.
   * @returns A Promise resolving to void.
   */
  async editPushRule(group: GroupSchema, pushRule: CreateAndEditPushRuleOptions): Promise<void> {
    try {
      const editedPushRule = await gitlabApi.GroupPushRules.edit(group.id, pushRule);
      logger.info(`${chalk.bgMagenta(group.full_path)} Group push rule:\n%o`, editedPushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"404 Push Rule Not Found"') {
        throw error;
      }
      logger.warn(`${chalk.bgMagenta(group.full_path)} No group push rule found, try adding`);
    }
  }
}

export default new GroupPushRuleService();
