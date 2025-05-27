import styled from '@emotion/styled'
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt'
import LightModeIcon from '@mui/icons-material/LightMode'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import { grey, indigo } from '@mui/material/colors'
import type { JSX } from 'react'
import { Fragment } from 'react'

import type { ColorMode } from '@shared/hooks/useContexts'
import { useColorMode } from '@shared/hooks/useContexts'

const themeMap: { mode: ColorMode; icon: JSX.Element }[] = [
  { mode: 'light', icon: <LightModeIcon /> },
  { mode: 'os', icon: <AppSettingsAltIcon /> },
  { mode: 'dark', icon: <NightlightRoundIcon /> },
]

const ThemeToggler = () => {
  const { mode, setMode } = useColorMode()
  const handleChange = (mode: ColorMode) => () => setMode(mode)

  return (
    <ThemeTogglerRoot
      className="theme-toggler__root"
      role="radiogroup"
      aria-label="ライト／OS設定／ダークモード切替"
      $mode={mode}
    >
      <div className="theme-toggler__container">
        {themeMap.map(({ mode: _mode, icon }) => (
          <Fragment key={_mode}>
            <input
              type="radio"
              name="theme"
              id={`theme-toggler__input-${_mode}`}
              value={_mode}
              checked={mode === _mode}
              onChange={handleChange(_mode)}
            />
            <label className="theme-toggler__label" htmlFor={`theme-toggler__input-${_mode}`}>
              {icon}
            </label>
          </Fragment>
        ))}

        <span className="theme-toggler__selection-circle"></span>
      </div>
    </ThemeTogglerRoot>
  )
}

const ThemeTogglerRoot = styled.div<{ $mode: 'light' | 'dark' | 'os' }>`
  --gap: 1.6rem;
  --size: 2.4rem;
  --icon-inactive-color: ${grey[500]};
  margin-left: auto;
  background: ${({ $mode }) => ($mode === 'light' ? indigo[100] : $mode === 'os' ? indigo[500] : indigo[900])};
  transition: background-color 300ms ease;
  padding: 0.25rem 0.5rem;
  border-radius: 5rem;

  div {
    position: relative;
    display: flex;
    gap: var(--gap);
    align-items: center;
    input[type='radio'] {
      display: none;
    }

    label {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--size);
      width: var(--size);
      cursor: pointer;
      svg {
        padding: 0.1rem;
      }
    }
    label[for='theme-toggler__input-light'] {
      svg {
        color: ${({ $mode }) => ($mode === 'light' ? grey[50] : 'var(--icon-inactive-color)')};
      }
    }
    label[for='theme-toggler__input-os'] {
      svg {
        color: ${({ $mode }) => ($mode === 'os' ? grey[700] : 'var(--icon-inactive-color)')};
      }
    }
    label[for='theme-toggler__input-dark'] {
      svg {
        color: ${({ $mode }) => ($mode === 'dark' ? grey[900] : 'var(--icon-inactive-color)')};
      }
    }

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 0;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      background: ${({ $mode }) => ($mode === 'light' ? indigo[900] : $mode === 'os' ? indigo[100] : indigo[50])};
      left: ${({ $mode }) =>
        $mode === 'light'
          ? 0
          : $mode === 'os'
            ? 'calc(var(--size) + var(--gap))'
            : 'calc(2 * (var(--size) + var(--gap)))'};
      transition:
        left 300ms,
        background-color 300ms;
    }
  }
`

export default ThemeToggler
