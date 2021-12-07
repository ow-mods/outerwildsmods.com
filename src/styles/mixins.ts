import { css } from '@emotion/css';
import { breakpoints } from './variables';

type Breakpoint = keyof typeof breakpoints;

export const mediaDown = (breakpoint: Breakpoint) =>
	`@media (max-width: ${breakpoints[breakpoint]})`;

export const textOutline = (color: string) => css`
	text-shadow: -1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color}, 1px 1px 0 ${color};
`;
