import { css } from '@emotion/css';

import { mediaDown } from '../../styles/mixins';
import { spacing, breakpoints } from '../../styles/variables';

export const PageLayout = (isWide?: boolean) => css`
	padding: ${spacing.large};
	margin: 0 auto;
	max-width: ${isWide ? breakpoints.medium : breakpoints.small};
	h1 {
		margin-top: 0;
	}
`;

export const PageLayoutColumns = css`
	display: flex;
	${mediaDown('medium')} {
		flex-direction: column-reverse;
	}
`;
