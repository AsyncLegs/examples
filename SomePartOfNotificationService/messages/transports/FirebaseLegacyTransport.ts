import { ISendPushRequest } from '../../../types/interfaces';
import { AbstractPushNotificationSender } from './AbstractPushNotificationSender';
import superagent from 'superagent';

export class FirebaseLegacyTransport extends AbstractPushNotificationSender {
	private messageServerEndpoint: string;
	private static instances = new Map<string, FirebaseLegacyTransport>();

	private constructor() { super(); }

	public static getInstanceFor(endpoint: string) {
		let endpointBasedInstance = FirebaseLegacyTransport.instances.get(endpoint);

		if (!endpointBasedInstance) {
			endpointBasedInstance = new FirebaseLegacyTransport().setMessageServerEndpoint(endpoint);
			FirebaseLegacyTransport.instances.set(endpoint, endpointBasedInstance);
		}

		return endpointBasedInstance;
	}

	public async sendPush(notificationRequest: ISendPushRequest) {
		this.logger.trace('FIREBASE LEGACY METHOD push sent: ', notificationRequest);
		try {
			const {
				body: { success, results },
			} = await superagent
				.post(this.messageServerEndpoint)
				.send(FirebaseLegacyTransport.createMessage(notificationRequest))
				.set('Content-Type', 'application/json')
				.set('Authorization', `key=${notificationRequest.serverKey}`);

			const result = results.shift();
			this.logger.trace(
				`Push to device: ${notificationRequest.token} sent ${
					success === 1 ? `successfully: ${result?.message_id}` : `failed: ${result?.error}`
				}`,
			);
		} catch (e) {
			this.logger.error('Failed to send push notification via Firebase legacy transport: ', e);
		}
	}

	public setMessageServerEndpoint(endpoint: string) {
		if (endpoint) {
			this.messageServerEndpoint = endpoint;
		}
		return this;
	}

	private static createMessage(notificationRequest: ISendPushRequest) {
		return {
			to: notificationRequest.token,
			data: {
				attributes: notificationRequest.attributes,
			},
		};
	}
}
