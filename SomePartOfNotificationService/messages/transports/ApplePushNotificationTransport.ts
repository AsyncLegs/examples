import { IApnsClientConfig, ISendPushRequest } from '../../../types/interfaces';
import { Notification, Provider } from 'apn';
import { AbstractPushNotificationSender } from './AbstractPushNotificationSender';

export class ApplePushNotificationTransport extends AbstractPushNotificationSender {
	private static instance: ApplePushNotificationTransport;
	private apnsConfig: IApnsClientConfig;
	private readonly providers = new Map<string, Provider>();
	private currentTransport?: Provider;

	private constructor() { super(); }

	public static getInstance() {
		if (!ApplePushNotificationTransport.instance) {
			ApplePushNotificationTransport.instance = new ApplePushNotificationTransport();
		}

		return ApplePushNotificationTransport.instance;
	}

	public setApnsConfig(config: IApnsClientConfig) {
		if (config) {
			this.apnsConfig = config;
		}

		return this;
	}

	public build() {
		if (!this.apnsConfig || !this.logger) {
			throw new Error(`Failed to build PushNotificationAppleTransport: Apns config and logger should be set!`);
		}
		const applicationId = this.apnsConfig.applicationId;

		if (this.providers.has(applicationId)) {
			this.setCurrentProvider(this.providers.get(applicationId), applicationId);

			return this;
		}

		try {
			const newProvider = new Provider({
				key: Buffer.from(this.apnsConfig.key),
				cert: Buffer.from(this.apnsConfig.certificate),
				passphrase: this.apnsConfig.password,
			});
			this.setCurrentProvider(newProvider, applicationId);

			return this;
		} catch (e) {
			this.logger.error(`Failed to build PushNotificationAppleTransport: ${e}`);
		}
	}

	public async sendPush(notificationRequest: ISendPushRequest) {
		try {
			const { sent, failed } = await this.currentTransport.send(
				ApplePushNotificationTransport.createMessage(notificationRequest),
				notificationRequest.token,
			);
			sent.forEach(({ device }) => this.logger.info(`Push to device: ${device} sent successfully`));
			failed.forEach(({ device, response: { reason } }) => console.info(`Push to device: ${device} failed to sent, reason: ${reason}`));
		} catch (e) {
			this.logger.error('Failed to send push notification via Apple transport: ', e);
		}
	}

	private static createMessage(notificationRequest: ISendPushRequest) {
		return new Notification({
			expiry: notificationRequest.ttlInSeconds,
			sound: notificationRequest.sound,
			alert: notificationRequest.message,
			payload: { ...notificationRequest.attributes },
		});
	}

	private setCurrentProvider(newProvider: Provider, applicationId: string) {
		this.providers.set(applicationId, newProvider);
		this.currentTransport = newProvider;
		return this;
	}
}
