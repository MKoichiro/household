import styled from '@emotion/styled'
import { alpha, ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { MouseEvent } from 'react'

import type { TransactionType } from '@shared/types'
import { cp } from '@styles/theme/helpers/colorPickers'

interface TransactionTypeToggleButtonProps {
  currentType: TransactionType
  handleChange: (e: MouseEvent<HTMLElement>, newValue: TransactionType) => void
}

const TransactionTypeToggleButton = ({ currentType, handleChange }: TransactionTypeToggleButtonProps) => {
  return (
    <ToggleButtonGroup fullWidth exclusive value={currentType} onChange={handleChange} sx={{ height: '2.2em' }}>
      <StyledToggleButton value="expense" $type={'expense'} $currentType={currentType}>
        支出
      </StyledToggleButton>
      <StyledToggleButton value="income" $type={'income'} $currentType={currentType}>
        収入
      </StyledToggleButton>
    </ToggleButtonGroup>
  )
}

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== '$type' && prop !== '$currentType',
})<{ $type: TransactionType; $currentType: TransactionType }>`
  --common-color: ${({ theme, $type }) => cp(theme, `${$type}.bg.lighter`)};
  --background-color: ${({ $type, $currentType }) => ($currentType === $type ? 'var(--common-color)' : 'transparent')};

  &.Mui-selected {
    background-color: var(--background-color);
  }
  &:not(.Mui-selected):hover {
    background-color: ${({ theme, $type }) => alpha(cp(theme, `${$type}.bg.lighter`), 0.3)};
  }
  &.Mui-selected:hover {
    background-color: var(--background-color);
    opacity: 0.8;
  }
  color: ${({ theme, $type }) => cp(theme, `${$type}.font.lighter`)};

  border-width: 0.2rem;
  border-top-color: var(--common-color);
  border-bottom-color: var(--common-color);
  border-left-color: ${({ $type }) => ($type === 'expense' ? 'var(--common-color)' : 'transparent')};
  border-right-color: ${({ $type }) => ($type === 'income' ? 'var(--common-color)' : 'transparent')};

  transition:
    opacity 300ms,
    background-color 300ms;
`

export default TransactionTypeToggleButton
