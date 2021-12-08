import { css } from '@emotion/css';
import { mediaDown } from '../../styles/mixins';

import { borderRadius, colors, spacing } from '../../styles/variables';

export const TitleWrapper = css`
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: ${spacing.large};
`;

export const Title = css`
	font-size: 1.5rem;
	line-height: 1.4;
	margin: 0;
`;

export const SectionImageWrapper = (hideOnMobile: boolean) => css`
	${hideOnMobile
		? css`
				${mediaDown('small')} {
					display: none;
				}
		  `
		: ''}
	flex: 1;
	&:first-child:not(:only-child) {
		margin-right: ${spacing.large};
		${mediaDown('small')} {
			margin-right: 0;
			margin-bottom: ${spacing.large};
		}
	}
	&:not(:first-child) {
		margin-left: ${spacing.large};
		${mediaDown('small')} {
			margin-left: 0;
			margin-top: ${spacing.large};
		}
	}
	img {
		object-fit: cover;
		object-position: top;
		border-radius: ${borderRadius.small};
		border: 2px solid ${colors.dark};
		overflow: hidden;
		width: 100%;
	}
`;

export const SectionDescriptionWrapper = css`
	flex: 1;
`;

export const SectionDescription = css`
	margin-top: 0;
`;
