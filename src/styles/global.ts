import { css } from '@emotion/css';

import { colors } from './variables';

export const globalStyle = css`
	body {
		padding: 0;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
			Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
		line-height: 1.6;
		font-size: 18px;
		color: ${colors.light};
		font-weight: lighter;
		background-color: ${colors.dark};
		overflow-y: scroll;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: ${colors.white};
		font-weight: normal;
	}

	* {
		box-sizing: border-box;
	}

	a {
		text-decoration: none;
		font-weight: normal;
	}
`;
