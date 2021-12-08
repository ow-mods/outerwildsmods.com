import { css } from '@emotion/css';

import { mediaDown } from '../../styles/mixins';
import { colors, spacing, borderRadius } from '../../styles/variables';

export const Wrapper = css`
	width: 100%;
`;

export const NavWrapper = css`
	display: flex;
	${mediaDown('small')} {
		/* display: none; */
		flex-direction: column;
	}
`;

export const HiddenInput = css`
	/* display: none; */
`;

export const MenuButton = css`
	cursor: pointer;
	font-size: x-large;
	padding: ${spacing.medium};
	background: ${colors.background};
	line-height: ${spacing.large};
	border-radius: ${borderRadius.small};
	margin: ${spacing.medium};
	/* display: none; */
	${mediaDown('small')} {
		display: inline-block;
	}
`;

export const WishlistLabel = css`
	position: relative;
	top: -42px;
	height: 0;
	color: #dc5555;
	font-size: x-small;
	white-space: nowrap;
`;
