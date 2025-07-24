import { LayoutProps, Layout as RaLayout } from 'react-admin'
import CustomMenu from './Menu'

const CustomLayout = (props: LayoutProps) => {
  return <RaLayout {...props} menu={CustomMenu} />
}

export default CustomLayout