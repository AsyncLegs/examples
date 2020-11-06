import { IPushNotificationSender, ISendPushRequest } from '../../types/interfaces';
import { NotificationType } from '../../types/enums';
import { ApplePushNotificationTransport, FirebaseLegacyTransport } from './transports';
import { inject, injectable } from 'inversify';
import Logger from '../../../../LoggerWrapper.class';
import NotificationRepository from '../../repositories/NotificationRepository';
import { UnsupportedNotificationtypeException } from '../../exceptions/UnsupportedNotificationtypeException';
import { ApnsClientConfigEntityRepository } from '../../repositories/ApnsClientConfigEntityRepository';
import { TYPES } from '../../../../types/TYPES';
import { IConfig } from '../../../../types/Config';

@injectable()
export class PushNotificationTransportFactory {
	constructor(
		@inject(NotificationRepository) private readonly notificationRepository: NotificationRepository,
		@inject(ApnsClientConfigEntityRepository) private readonly apnsClientConfigEntityRepository: ApnsClientConfigEntityRepository,
		@inject(Logger) private readonly logger: Logger,
		@inject(TYPES.IConfig) private configProvider?: IConfig,
	) {}

	public async getTransport(notification: ISendPushRequest): Promise<IPushNotificationSender> {
		const { token } = notification;
		const userDeviceToken = await this.notificationRepository.findUserDeviceTokenWithCache(token);
		switch (notification.notificationType) {
			case NotificationType.VOIP: {
				const apnsConfig = await this.apnsClientConfigEntityRepository.findByApplicationId(userDeviceToken.applicationId);

				return ApplePushNotificationTransport
					.getInstance()
					.setApnsConfig(apnsConfig)
					.setLogger(this.logger)
					.build();
			}
			case NotificationType.PUSH: {
				return FirebaseLegacyTransport
					.getInstanceFor(this.configProvider.firebase.messages.messageServerEndpoint)
					.setLogger(this.logger)
			}
			default:
				throw new UnsupportedNotificationtypeException(`Notification type: ${notification.notificationType} isn't supported yet!`);
		}
	}

	public getFirebaseTransport() {
		return FirebaseLegacyTransport
			.getInstanceFor(this.configProvider.firebase.messages.messageServerEndpoint)
			.setLogger(this.logger)
	}
}
