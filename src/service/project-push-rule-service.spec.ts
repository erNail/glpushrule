import 'dotenv/config';
import { ProjectSchema, CreateAndEditPushRuleOptions, PushRuleSchema } from '@gitbeaker/rest';
import chalk from 'chalk';
import ProjectPushRuleService from './project-push-rule-service';
import gitlabApi from '../utils/gitlab-api';
import logger from '../utils/logger';
import PushRuleError from '../model/push-rule-error';

jest.mock('../utils/gitlab-api');
jest.mock('../utils/logger');

describe('ProjectPushRuleService', () => {
  const mockProjectPushRules = gitlabApi.GroupPushRules as jest.Mocked<typeof gitlabApi.GroupPushRules>;
  const mockLogger = logger as jest.Mocked<typeof logger>;

  const testProject: ProjectSchema = {
    id: 1,
    path: 'test/test',
  } as ProjectSchema;

  const testPushRule: CreateAndEditPushRuleOptions = {
    commitMessageRegex: 'test',
  };

  const testPushRuleSchema: PushRuleSchema = {
    commit_message_regex: 'test',
  } as PushRuleSchema;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchPushRules', () => {
    it('should successfully fetch push rules', async () => {
      mockProjectPushRules.show.mockResolvedValue(testPushRuleSchema);
      await ProjectPushRuleService.fetchPushRules([testProject]);

      expect(mockProjectPushRules.show).toHaveBeenCalledWith(testProject.id);
      expect(mockProjectPushRules.show).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "404 Push Rule Not Found" description', async () => {
      mockProjectPushRules.show.mockRejectedValue(
        new PushRuleError('Error', { description: '"404 Push Rule Not Found"' })
      );
      await ProjectPushRuleService.fetchPushRules([testProject]);

      expect(mockProjectPushRules.show).toHaveBeenCalledWith(testProject.id);
      expect(mockProjectPushRules.show).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith(`${chalk.bgBlue(testProject.path)} No project push rule found`);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockProjectPushRules.show.mockRejectedValue(new PushRuleError('Error', { description: '"Other error"' }));
      await expect(ProjectPushRuleService.fetchPushRules([testProject])).rejects.toThrow(PushRuleError);

      expect(mockProjectPushRules.show).toHaveBeenCalledWith(testProject.id);
      expect(mockProjectPushRules.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('addPushRules', () => {
    it('should successfully add push rules', async () => {
      mockProjectPushRules.create.mockResolvedValue(testPushRuleSchema);
      await ProjectPushRuleService.addPushRules([testProject], testPushRule);

      expect(mockProjectPushRules.create).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.create).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "Project push rule exists, try updating" description', async () => {
      mockProjectPushRules.create.mockRejectedValue(
        new PushRuleError('Error', { description: '"Project push rule exists, try updating"' })
      );
      await ProjectPushRuleService.addPushRules([testProject], testPushRule);

      expect(mockProjectPushRules.create).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.create).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `${chalk.bgBlue(testProject.path)} Project push rule exists already, try editing`
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockProjectPushRules.create.mockRejectedValue(new PushRuleError('Error', { description: 'Other error' }));

      await expect(ProjectPushRuleService.addPushRules([testProject], testPushRule)).rejects.toThrow(PushRuleError);

      expect(mockProjectPushRules.create).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('editPushRules', () => {
    it('should successfully edit push rules', async () => {
      mockProjectPushRules.edit.mockResolvedValue(testPushRuleSchema);
      await ProjectPushRuleService.editPushRules([testProject], testPushRule);

      expect(mockProjectPushRules.edit).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.edit).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "404 Push Rule Not Found" description', async () => {
      mockProjectPushRules.edit.mockRejectedValue(
        new PushRuleError('Error', { description: '"404 Push Rule Not Found"' })
      );
      await ProjectPushRuleService.editPushRules([testProject], testPushRule);

      expect(mockProjectPushRules.edit).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.edit).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `${chalk.bgBlue(testProject.path)} No group push rule found, try adding`
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockProjectPushRules.edit.mockRejectedValue(new PushRuleError('Error', { description: 'Other error' }));

      await expect(ProjectPushRuleService.editPushRules([testProject], testPushRule)).rejects.toThrow(PushRuleError);

      expect(mockProjectPushRules.edit).toHaveBeenCalledWith(testProject.id, testPushRule);
      expect(mockProjectPushRules.edit).toHaveBeenCalledTimes(1);
    });
  });
});
