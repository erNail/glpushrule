import { CreateAndEditPushRuleOptions, ProjectSchema } from '@gitbeaker/rest';
import chalk from 'chalk';
import logger from '../utils/logger';
import PushRuleError from '../model/push-rule-error';
import gitlabApi from '../utils/gitlab-api';

/**
 * Class that manages operations related to Project push rules.
 */
class ProjectPushRuleService {
  pushRuleCounter = 0;

  /**
   * Fetches the push rules of a list of projects.
   * @param projects - The projects for which to fetch the push rules.
   * @returns A Promise resolving to an array of voids.
   */
  async fetchPushRules(projects: ProjectSchema[]): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(projects.map(async (project) => this.fetchPushRule(project)));
  }

  /**
   * Adds push rules to a list of projects.
   * @param projects - The projects to which to add the push rules.
   * @param pushRule - The push rule to add.
   * @returns A Promise resolving to an array of voids.
   */
  async addPushRules(projects: ProjectSchema[], pushRule: CreateAndEditPushRuleOptions): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(projects.map(async (project) => this.addPushRule(project, pushRule)));
  }

  /**
   * Edits the push rules of a list of projects.
   * @param projects - The projects for which to edit the push rules.
   * @param pushRule - The push rule to edit.
   * @returns A Promise resolving to an array of voids.
   */
  async editPushRules(projects: ProjectSchema[], pushRule: CreateAndEditPushRuleOptions): Promise<void[]> {
    this.pushRuleCounter = 0;
    return Promise.all(projects.map(async (project) => this.editPushRule(project, pushRule)));
  }

  /**
   * Fetches the push rule of a project.
   * @param project - The project for which to fetch the push rule.
   * @returns A Promise resolving to void.
   */
  async fetchPushRule(project: ProjectSchema): Promise<void> {
    try {
      const pushRule = await gitlabApi.ProjectPushRules.show(project.id);
      logger.info(`${chalk.bgBlue(project.path)} Project push rule:\n%o`, pushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"404 Push Rule Not Found"') {
        throw error;
      }
      logger.info(`${chalk.bgBlue(project.path)} No project push rule found`);
    }
  }

  /**
   * Adds a push rule to a project.
   * @param project - The project to which to add the push rule.
   * @param pushRule - The push rule to add.
   * @returns A Promise resolving to void.
   */
  async addPushRule(project: ProjectSchema, pushRule: CreateAndEditPushRuleOptions): Promise<void> {
    try {
      const createdPushRule = await gitlabApi.ProjectPushRules.create(project.id, pushRule);
      logger.info(`${chalk.bgBlue(project.path)} project push rule:\n%o`, createdPushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"Project push rule exists, try updating"') {
        throw error;
      }
      logger.warn(`${chalk.bgBlue(project.path)} Project push rule exists already, try editing`);
    }
  }

  /**
   * Edits the push rule of a project.
   * @param project - The project for which to edit the push rule.
   * @param pushRule - The push rule to edit.
   * @returns A Promise resolving to void.
   */
  async editPushRule(project: ProjectSchema, pushRule: CreateAndEditPushRuleOptions): Promise<void> {
    try {
      const editedPushRule = await gitlabApi.ProjectPushRules.edit(project.id, pushRule);
      logger.info(`${chalk.bgBlue(project.path)} Project push rule:\n%o`, editedPushRule);
      this.pushRuleCounter += 1;
    } catch (error) {
      if (error instanceof PushRuleError && error.cause.description !== '"404 Push Rule Not Found"') {
        throw error;
      }
      logger.warn(`${chalk.bgBlue(project.path)} No group push rule found, try adding`);
    }
  }
}

export default new ProjectPushRuleService();
