import { css } from '@emotion/css';

import { colors } from '../../styles/variables';

export const wrapper = css`
	position: absolute;
	top: 0;
	right: 0;
	fill: ${colors.accent};
	opacity: 0.7;
	&:hover {
		opacity: 1;
	}
`;
