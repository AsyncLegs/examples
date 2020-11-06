import { inject, injectable } from 'inversify';
import { DynamicLinkTransportFactory } from './DynamicLinkTransportFactory';
import { IDynamicLinkGenerator, IGenerateDynamicLinkRequest, IGenerateDynamicLinkResponse } from '../../types/interfaces';

@injectable()
export class DynamicLinkGeneratorService implements Pick<IDynamicLinkGenerator, 'generateDynamicLink'> {
	constructor(@inject(DynamicLinkTransportFactory) private readonly dynamicLinkTransportFactory: DynamicLinkTransportFactory) {}

	public generateDynamicLink(params: IGenerateDynamicLinkRequest): Promise<IGenerateDynamicLinkResponse> {
		return this.dynamicLinkTransportFactory.getTransport().generateDynamicLink(params);
	}
}
