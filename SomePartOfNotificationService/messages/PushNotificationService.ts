import { inject, injectable } from 'inversify';
import NotificationRepository from '../../repositories/NotificationRepository';
import NotificationManager, {
	NotificationConversationTakingTooLongPayload,
	NotificationConversationUpdatedPayload,
} from '../../../../notifications/NotificationManager';
import { AppointmentUpdate } from '../../../../graphql-type/API-main/types/AppointmentUpdate';

import UserService from '../../../user/services/UserService';
import UserRepository from '../../../user/repositories/UserRepository';
import { IAppointmentConversation } from '../../../appointment/types/interfaces';
import { ConversationInitiatorType } from '../../../appointment/types/enums';
import { IUserDeviceToken } from '../../types/interfaces';
import { DeviceType, NotificationType } from '../../types/enums';
import AppointmentLoader from '../../../appointment/loaders/AppointmentLoader';
import ServiceLoader from '../../../../loaders/ServiceLoader';

@injectable()
export default class PushNotificationService {
	constructor(
		@inject(AppointmentLoader) private appointmentLoader: AppointmentLoader,
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
		@inject(NotificationManager) private notificationManager: NotificationManager,
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(ServiceLoader) private serviceLoader: ServiceLoader,
	) {}

	public static isAndroidPushToken(deviceToken: IUserDeviceToken) {
		return deviceToken.deviceType === DeviceType.ANDROID && deviceToken.tokenType === NotificationType.PUSH;
	}

	public static isIosVOIPToken(deviceToken: IUserDeviceToken) {
		return deviceToken.deviceType === DeviceType.IOS && deviceToken.tokenType === NotificationType.VOIP;
	}

	public static getNotificationTypeByTokenType(deviceToken: IUserDeviceToken) {
		if (PushNotificationService.isIosVOIPToken(deviceToken)) {
			return NotificationType.VOIP;
		}

		if (PushNotificationService.isAndroidPushToken(deviceToken)) {
			return NotificationType.PUSH;
		}

		return null;
	}

	public async sendConversationCreatedNotification(userId: string, conversation: IAppointmentConversation) {
		const appointment = await this.appointmentLoader.load(conversation.appointmentId);
		const service = await this.serviceLoader.load(appointment.serviceId);
		const createdByUser =
			conversation.initiator === ConversationInitiatorType.PARTICIPANT ? await this.userRepository.findOneById(conversation.createdBy) : null;

		const payload = {
			appointmentId: conversation.appointmentId,
			conversationId: conversation.conversationId.toString(),
			initiator: conversation.initiator,
			callerName:
				conversation.initiator === ConversationInitiatorType.DIALER
					? service.predictiveDialerConfig.callerName
					: UserService.getUserTitledFullName(createdByUser),
			callDeadLineTimestamp: conversation.call.callDeadLineTimestamp.toString(),
		};

		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);

		for (const deviceToken of deviceTokens) {
			const notificationType = PushNotificationService.getNotificationTypeByTokenType(deviceToken);

			if (!notificationType) {
				continue ;
			}

			this.notificationManager.notifyConversationCreated({
				type: notificationType,
				userId,
				token: deviceToken.token,
			}, payload);
		}
	}

	public async sendConversationUpdatedNotification(userId: string, payload: NotificationConversationUpdatedPayload) {
		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);

		// Send PUSH notifications only for ANDROID devices
		for (const deviceToken of deviceTokens) {
			if (PushNotificationService.isAndroidPushToken(deviceToken)) {
				this.notificationManager.notifyConversationUpdated({
					type: NotificationType.PUSH,
					userId,
					token: deviceToken.token,
				}, payload);
			}
		}
	}

	public async sendAppointmentUpdateNotification(userId: string, appointmentUpdate: AppointmentUpdate) {
		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);

		// Send PUSH notifications only for ANDROID devices
		for (const deviceToken of deviceTokens) {
			if (PushNotificationService.isAndroidPushToken(deviceToken)) {
				this.notificationManager.notifyAppointmentUpdated({
					type: NotificationType.PUSH,
					userId,
					token: deviceToken.token,
				}, appointmentUpdate);
			}
		}
	}

	public async sendConversationTakingTooLongNotification(userId: string, payload: NotificationConversationTakingTooLongPayload) {
		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);

		// Send PUSH notifications only for ANDROID devices
		for (const deviceToken of deviceTokens) {
			if (PushNotificationService.isAndroidPushToken(deviceToken)) {
				this.notificationManager.notifyConversationTakingTooLong({
					type: NotificationType.PUSH,
					userId,
					token: deviceToken.token,
				}, payload);
			}
		}
	}

	public async sendExpiredJwtNotification(userId: string) {
		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);

		// Send PUSH notifications only for ANDROID devices
		for (const deviceToken of deviceTokens) {
			if (PushNotificationService.isAndroidPushToken(deviceToken)) {
				this.notificationManager.notifyJWTExpired({
					type: NotificationType.PUSH,
					userId,
					token: deviceToken.token,
				});
			}
		}
	}

	public async sendAvailabilityCheckNotification(userId: string) {
		const deviceTokens = await this.notificationRepository.findUserDeviceTokensWithCache(userId);
		// Send PUSH notifications only for ANDROID devices
		for (const deviceToken of deviceTokens) {
			if (PushNotificationService.isAndroidPushToken(deviceToken)) {
				this.notificationManager.notifyAvailabilityCheck({
					type: NotificationType.PUSH,
					userId,
					token: deviceToken.token,
				});
			}
		}
	}

	public static getDeviceType(userAgent: string): DeviceType {
		switch (userAgent?.toLowerCase()) {
			case 'ios-user-agent':
				return DeviceType.IOS;
			case 'android-user-agent':
				return DeviceType.ANDROID;
			default:
				return DeviceType.WEB;
		}
	}

	public static getUserAgent(headers: string[]) {
		return headers.find(header => ['ios-user-agent', 'android-user-agent'].includes(header?.toLowerCase()));
	}
}
