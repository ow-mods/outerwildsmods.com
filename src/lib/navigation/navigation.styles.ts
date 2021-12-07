import { css } from '@emotion/css';
// import { transparentize } from 'polished';

import { mediaDown, textOutline } from '../../styles/mixins';
import { colors, spacing, borderRadius } from '../../styles/variables';
// import { PageLayout } from '../page-layout';

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

export const Layout = css`
	padding: 0;
	${HiddenInput}:checked + ${NavWrapper} {
		display: flex;
	}
`;

export const NavLinkWrapper = (isActive: boolean) => css`
	color: ${isActive ? colors.light : colors.accent};
	background-color: ${isActive ? colors.background : 'none'};
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: ${spacing.medium} 0;
	margin: 0px ${spacing.small};
	border-radius: ${borderRadius.small} ${borderRadius.small} 0 0;
	${textOutline(colors.background)};
	@media (hover: hover) {
		&:hover {
			background-color: ${colors.background};
		}
	}
`;

export const NavLinkAdWrapper = (isActive: boolean) => css`
	color: ${isActive ? colors.light : colors.cta};
	font-weight: bold;
	background-color: ${isActive ? colors.background : 'none'};
`;

export const WishlistLabel = css`
	position: relative;
	top: -42px;
	height: 0;
	color: #dc5555;
	font-size: x-small;
	white-space: nowrap;
`;
