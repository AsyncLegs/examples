import { AbstractDynamicLinkGenerator } from '../AbstractDynamicLinkGenerator';
import { IDynamicLinkMessage, IGenerateDynamicLinkResponse, IGenerateDynamicLinkRequest } from '../../../types/interfaces';
import superagent from 'superagent';
import { IConfig } from '../../../../../types/Config';
import Logger from '../../../../../LoggerWrapper.class';
import { DynamicLinksOption } from '../../../types/enums';

export class FirebaseDynamicLinkGenerator extends AbstractDynamicLinkGenerator {
	private readonly dynamicLinksServerEndpoint: string;

	constructor(private readonly config: IConfig, private readonly logger: Logger) {
		super();
		this.dynamicLinksServerEndpoint = config.firebase.links.dynamicLinksServerEndpoint;
	}

	async generateDynamicLink(params: IGenerateDynamicLinkRequest): Promise<IGenerateDynamicLinkResponse> {
		this.logger.trace('FIREBASE LEGACY METHOD generateDynamicLink: ', params);
		const { domainUriPrefix, link, webApiKey, parameters, androidPackageName, iosBundleId, iosAppStoreId } = params;
		const generateLinkRequest: IDynamicLinkMessage = {
			dynamicLinkInfo: {
				domainUriPrefix,
				link: this.createParameterizedLink(link, parameters),
				androidInfo: {
					androidPackageName,
				},
				iosInfo: {
					iosBundleId,
					iosAppStoreId: Number(iosAppStoreId) > 0 ? String(iosAppStoreId) : null,
				},
				navigationInfo: {
					enableForcedRedirect: true,
				},
			},
			suffix: {
				option: this.config.firebase.links.dynamicLinksOption || DynamicLinksOption.UNGUESSABLE,
			},
		};
		try {
			const {
				body: { shortLink, previewLink },
			} =
				(await superagent
					.post(`${this.dynamicLinksServerEndpoint}?key=${webApiKey}`)
					.send({ ...generateLinkRequest })
					.set('Content-Type', 'application/json')) || {};

			this.logger.trace(`Successfully generated dynamic link [${link}]`);
			return {
				dynamicLink: shortLink,
				debugLink: previewLink,
			};
		} catch (e) {
			this.logger.error('Failed to generate dynamic link via Firebase legacy transport: ', e);
			return {
				dynamicLink: '',
				debugLink: '',
			};
		}
	}
}
