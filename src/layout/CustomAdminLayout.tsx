// src/layout/CustomAdminLayout.tsx
import { Layout as RaLayout, LayoutProps } from 'react-admin'
import CustomMenu from './Menu'

const CustomAdminLayout = (props: LayoutProps) => {
  return <RaLayout {...props} menu={CustomMenu} />
}

export default CustomAdminLayout