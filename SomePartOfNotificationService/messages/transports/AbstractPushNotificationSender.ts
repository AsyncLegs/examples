import { IPushNotificationSender, ISendPushRequest } from '../../../types/interfaces';
import Logger from '../../../../../LoggerWrapper.class';

export abstract class AbstractPushNotificationSender implements IPushNotificationSender {

	protected logger: Logger;
	abstract sendPush(_: ISendPushRequest): Promise<void>;

	setLogger(logger: Logger) {

		if (logger) {
			this.logger = logger;
		}
		return this;
	}
}
