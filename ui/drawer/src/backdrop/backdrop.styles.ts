import { styleFn } from 'styled-system'

export const baseBackdropStyles: styleFn = ({ theme }) => ({
  backgroundColor: theme.colors.semiBlack,
  width: '100%',
  height: '100%',
  cursor: 'pointer',
})
