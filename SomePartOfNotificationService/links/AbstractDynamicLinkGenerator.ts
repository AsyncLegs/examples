import {
	IDynamicLinkGenerator,
	IGenerateDynamicLinkRequest,
	IGenerateDynamicLinkResponse,
} from '../../types/interfaces';

export abstract class AbstractDynamicLinkGenerator implements IDynamicLinkGenerator{
	abstract async generateDynamicLink(_: IGenerateDynamicLinkRequest): Promise<IGenerateDynamicLinkResponse>;

	createParameterizedLink(link: string, parameters?: Record<string, string>): string {
		const uriBuilder = new URL(link);

		if (parameters) {
			Object.entries(parameters).forEach(([key, value]) => {
				if (key && value) {
					uriBuilder.searchParams.append(key, value);
				}
			});
		}

		return uriBuilder?.href;
	}
}
