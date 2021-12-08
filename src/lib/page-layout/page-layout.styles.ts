import { css } from '@emotion/css';

import { mediaDown } from '../../styles/mixins';

export const PageLayoutColumns = css`
	display: flex;
	${mediaDown('medium')} {
		flex-direction: column-reverse;
	}
`;
