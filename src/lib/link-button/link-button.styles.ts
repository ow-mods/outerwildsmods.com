import { css } from '@emotion/css';
import { lighten, darken } from 'polished';
import { colors, spacing, borderRadius } from '../../styles/variables';
import type { ButtonVariant } from './button-variant';

export const Content = css`
	height: 100%;
	width: 100%;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const variantColor: Record<ButtonVariant, string> = {
	primary: colors.cta,
	'main-download': colors.cta,
	secondary: colors.accent
};

export const Wrapper = (variant: ButtonVariant) => css`
	display: block;
	border-radius: ${borderRadius.small};
	border: none;
	width: 100%;
	background-color: ${variantColor[variant]};
	color: ${variant === 'secondary' ? colors.dark : colors.white};
	font-size: medium;
	cursor: pointer;
	text-align: center;
	font-weight: bold;
	outline: none;
	overflow: hidden;
	margin: 0 auto;
	margin-top: ${variant === 'main-download' ? spacing.large : 0};
	border: ${spacing.small} solid transparent;
	padding: ${spacing.small};

	&:active {
		box-shadow: none;
		background-color: ${darken(0.05)(variantColor[variant])};
	}

	&:hover:not(.disabled):not(:active) {
		border: ${spacing.small} solid ${lighten(0.1)(variantColor[variant])};
	}
`;
