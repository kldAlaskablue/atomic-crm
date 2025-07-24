// src/layout/Menu.tsx
import { MenuItemLink, useSidebarState } from 'react-admin'
import { Fragment } from 'react'
import { DashboardMenuItem } from 'react-admin'

const CustomMenu = () => {
    const [open] = useSidebarState()

    return (
        <Fragment>
            <DashboardMenuItem />
            {/* Demais menus existentes */}
            <MenuItemLink
                to="/admin"
                primaryText="Administração"
                leftIcon={<span>🛠️</span>}
                sidebarIsOpen={open}
            />
            <MenuItemLink
                to="/templates"
                primaryText="Templates"
                sidebarIsOpen={open}
            />
        </Fragment>
    )
}

export default CustomMenu