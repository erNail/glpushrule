import 'dotenv/config';
import { GroupSchema, GroupStatisticsSchema, CreateAndEditPushRuleOptions, PushRuleSchema } from '@gitbeaker/rest';
import chalk from 'chalk';
import GroupPushRuleService from './group-push-rule-service';
import logger from '../utils/logger';
import PushRuleError from '../model/push-rule-error';
import gitlabApi from '../utils/gitlab-api';

jest.mock('../utils/gitlab-api');
jest.mock('../utils/logger');

describe('GroupPushRuleService', () => {
  const mockGroupPushRules = gitlabApi.GroupPushRules as jest.Mocked<typeof gitlabApi.GroupPushRules>;
  const mockLogger = logger as jest.Mocked<typeof logger>;

  const testGroup: GroupSchema & { statistics: GroupStatisticsSchema } = {
    id: 1,
    full_path: 'test/test',
  } as GroupSchema & { statistics: GroupStatisticsSchema };

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
      mockGroupPushRules.show.mockResolvedValue(testPushRuleSchema);
      await GroupPushRuleService.fetchPushRules([testGroup]);

      expect(mockGroupPushRules.show).toHaveBeenCalledWith(testGroup.id);
      expect(mockGroupPushRules.show).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "404 Push Rule Not Found" description', async () => {
      mockGroupPushRules.show.mockRejectedValue(
        new PushRuleError('Error', { description: '"404 Push Rule Not Found"' })
      );
      await GroupPushRuleService.fetchPushRules([testGroup]);

      expect(mockGroupPushRules.show).toHaveBeenCalledWith(testGroup.id);
      expect(mockGroupPushRules.show).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith(`${chalk.bgMagenta(testGroup.full_path)} No group push rule found`);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockGroupPushRules.show.mockRejectedValue(new PushRuleError('Error', { description: '"Other error"' }));
      await expect(GroupPushRuleService.fetchPushRules([testGroup])).rejects.toThrow(PushRuleError);

      expect(mockGroupPushRules.show).toHaveBeenCalledWith(testGroup.id);
      expect(mockGroupPushRules.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('addPushRules', () => {
    it('should successfully add push rules', async () => {
      mockGroupPushRules.create.mockResolvedValue(testPushRuleSchema);
      await GroupPushRuleService.addPushRules([testGroup], testPushRule);

      expect(mockGroupPushRules.create).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.create).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "Group push rule exists, try updating" description', async () => {
      mockGroupPushRules.create.mockRejectedValue(
        new PushRuleError('Error', { description: '"Group push rule exists, try updating"' })
      );
      await GroupPushRuleService.addPushRules([testGroup], testPushRule);

      expect(mockGroupPushRules.create).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.create).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `${chalk.bgMagenta(testGroup.full_path)} Group push rule exists already, try editing`
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockGroupPushRules.create.mockRejectedValue(new PushRuleError('Error', { description: 'Other error' }));

      await expect(GroupPushRuleService.addPushRules([testGroup], testPushRule)).rejects.toThrow(PushRuleError);

      expect(mockGroupPushRules.create).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('editPushRules', () => {
    it('should successfully edit push rules', async () => {
      mockGroupPushRules.edit.mockResolvedValue(testPushRuleSchema);
      await GroupPushRuleService.editPushRules([testGroup], testPushRule);

      expect(mockGroupPushRules.edit).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.edit).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle PushRuleError with "404 Push Rule Not Found" description', async () => {
      mockGroupPushRules.edit.mockRejectedValue(
        new PushRuleError('Error', { description: '"404 Push Rule Not Found"' })
      );
      await GroupPushRuleService.editPushRules([testGroup], testPushRule);

      expect(mockGroupPushRules.edit).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.edit).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `${chalk.bgMagenta(testGroup.full_path)} No group push rule found, try adding`
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw PushRuleError with other descriptions', async () => {
      mockGroupPushRules.edit.mockRejectedValue(new PushRuleError('Error', { description: 'Other error' }));

      await expect(GroupPushRuleService.editPushRules([testGroup], testPushRule)).rejects.toThrow(PushRuleError);

      expect(mockGroupPushRules.edit).toHaveBeenCalledWith(testGroup.id, testPushRule);
      expect(mockGroupPushRules.edit).toHaveBeenCalledTimes(1);
    });
  });
});
