import { css } from '@emotion/css';
import { lighten } from 'polished';

import { colors } from '../../styles/variables';

export const TextLink = css`
	color: ${colors.accent};

	&:hover {
		color: ${lighten(0.2)(colors.accent)};
	}
`;
