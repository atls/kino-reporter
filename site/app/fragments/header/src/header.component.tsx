import React                       from 'react'
import { FC }                      from 'react'
import { useEffect }               from 'react'
import { useRef }                  from 'react'
import { useState }                from 'react'
import { useIntl }                 from 'react-intl'

import { Avatar }                  from '@ui/avatar'
import { GhostButton }             from '@ui/button'
import { Drawer }                  from '@ui/drawer'
import { LogoIcon }                from '@ui/icons'
import { SearchSecondaryIcon }     from '@ui/icons'
import { Input }                   from '@ui/input'
import { Box }                     from '@ui/layout'
import { Column }                  from '@ui/layout'
import { Layout }                  from '@ui/layout'
import { Row }                     from '@ui/layout'
import { addSearchHistoryAction }  from '@app/store'
import { updateSearchValueAction } from '@app/store'
import { useSearchValue }          from '@app/store'
import { useSearchHistory }        from '@app/store'
import { useMockedUser }           from '@globals/data'
import { usePopover }              from '@ui/utils'

import { DropdownMenu }            from './dropdown-menu'
import { HeaderProps }             from './header.interface'
import { MenuButton }              from './menu-button'
import { NavigationList }          from './navigation-list'
import { SearchPopup }             from './search-popup'
import { MotionBox }               from './styles'

const Header: FC<HeaderProps> = ({ transparent = false }) => {
  const intl = useIntl()

  const searchHistory = useSearchHistory()
  const searchValue = useSearchValue()

  const { triggerProps, layerProps, setOpen, render } = usePopover('bottom-center', 8, 'click')

  const [activeDrawer, setActiveDrawer] = useState<boolean>(false)
  const [popupWidth, setPopupWidth] = useState<number>(0)

  const { user } = useMockedUser()

  const inputLayoutRef = useRef<HTMLDivElement | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPopupWidth(inputLayoutRef!.current!.clientWidth)
  })

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addSearchHistoryAction(searchHistory, searchValue)
    }
  }

  return (
    <Box
      width='100%'
      zIndex={950}
      height={[64, 64, 88]}
      backgroundColor={transparent ? 'transparent' : 'white'}
      position='fixed'
    >
      <Layout flexBasis={[16, 16, 80]} flexShrink={0} />
      <Column fill>
        <Layout flexBasis={[16, 16, 20]} flexShrink={0} />
        <Row justifyContent={['flex-start', 'flex-start', 'center']}>
          <Layout>
            <MotionBox display='flex' initial={false} animate={activeDrawer ? 'open' : 'closed'}>
              <MenuButton
                transparent={transparent}
                activeDrawer={activeDrawer}
                setActiveDrawer={setActiveDrawer}
              />
            </MotionBox>
            <Drawer
              top={88}
              mobileTop={64}
              active={activeDrawer}
              onClose={() => setActiveDrawer(false)}
            >
              <DropdownMenu />
            </Drawer>
          </Layout>
          <Layout flexBasis={[16, 16, 24]} flexShrink={0} />
          <Layout display={['none', 'none', 'flex']}>
            <LogoIcon width={102} height={40} />
          </Layout>
          <Layout display={['flex', 'flex', 'none']}>
            <LogoIcon width={82} height={32} />
          </Layout>
          <Layout flexBasis={[0, 0, 64]} flexShrink={0} />
          <Layout display={['none', 'none', 'flex']} maxWidth={526} width='100%'>
            <NavigationList />
          </Layout>
          <Layout flexBasis={[0, 0, 89.5]} />
          <Layout
            ref={inputLayoutRef}
            onClick={() => setOpen(true)}
            width='100%'
            maxWidth={360}
            display={['none', 'none', 'flex']}
          >
            <Layout width='100%' {...triggerProps}>
              <Input
                type='search'
                value={searchValue}
                onChange={updateSearchValueAction}
                onKeyPress={handleKeyPress}
                placeholder={intl.formatMessage({
                  id: 'header.materials_films_persons',
                  defaultMessage: 'Материалы, фильмы, персоны...',
                })}
              />
            </Layout>
          </Layout>
          {render(
            <MotionBox
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
              }}
              width='100%'
              maxWidth={popupWidth}
              zIndex={951}
              {...layerProps}
            >
              <SearchPopup />
            </MotionBox>
          )}
          <Layout flexBasis={[24, 24, 0]} flexShrink={0} flexGrow={[1, 1, 0]} />
          <Row justifyContent='center' display={['flex', 'flex', 'none']} width={32} height={32}>
            <GhostButton>
              <SearchSecondaryIcon width={24} height={24} />
            </GhostButton>
          </Row>
          <Layout flexBasis={[16, 16, 24]} flexShrink={0} />
          <Layout alignItems='center'>
            <Avatar imageUrl={user.imageUrl} width={[32, 32, 40]} height={[32, 32, 40]} />
          </Layout>
        </Row>
        <Layout flexBasis={[16, 16, 20]} flexShrink={0} />
      </Column>
      <Layout flexBasis={[16, 16, 90]} flexShrink={0} />
    </Box>
  )
}

export { Header }