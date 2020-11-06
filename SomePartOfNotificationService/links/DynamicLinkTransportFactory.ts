import { inject, injectable } from 'inversify';
import Logger from '../../../../LoggerWrapper.class';
import { TYPES } from '../../../../types/TYPES';
import { IConfig } from '../../../../types/Config';
import { FirebaseDynamicLinkGenerator } from './transports/FirebaseDynamicLinkGenerator';

@injectable()
export class DynamicLinkTransportFactory {
	constructor(
		@inject(Logger) private readonly logger: Logger,
		@inject(TYPES.IConfig) private config: IConfig,
	) {}

	public getTransport()  {
		return new FirebaseDynamicLinkGenerator(this.config, this.logger);
	}
}
