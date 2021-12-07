import { css } from '@emotion/css';
import { colors, spacing, borderRadius } from '../../styles/variables';

export const GridWrapper = css`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`;

export const ItemWrapper = css`
	display: flex;
	flex-direction: column;
	max-width: 280px;
	height: calc(100% - 2 * ${spacing.small});
	border-radius: ${borderRadius.medium};
	margin: ${spacing.small};
	background-color: ${colors.dark};
	overflow: hidden;
	border: ${spacing.small} solid;
	border-color: ${colors.background};
	&:hover {
		border-color: ${colors.dark};
		background-color: transparent;
	}
`;

export const ImageWrapper = (hue = 0) => css`
	filter: hue-rotate(${hue}deg);
`;

export const PlaceholderText = css`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	opacity: 0.2;
	color: ${colors.white};
	font-size: 1.5em;
	line-height: 1em;
	text-align: center;
	overflow: hidden;
	padding: ${spacing.medium};
	z-index: 1;
`;

export const TextWrapper = css`
	padding: ${spacing.medium};
`;

export const Title = css`
	color: ${colors.accent};
`;

export const DescriptionWrapper = css`
	line-height: normal;
`;

export const Description = css`
	color: ${colors.light};
`;
