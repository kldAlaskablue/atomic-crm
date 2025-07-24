import React from 'react'
import styles from './AdminTemplate.module.css'

interface AdminTemplateProps {
  title?: string
  children: React.ReactNode
}

const AdminTemplate: React.FC<AdminTemplateProps> = ({ title = 'Painel Admin', children }) => {
  return (
    <div className={styles.layout}>
      {/* <aside className={styles.sidebar}>
        <div className={styles.logo}>Atomic CRM</div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}>Dashboard</a>
          <a href="#" className={styles.navItem}>Templates</a>
          <a href="#" className={styles.navItem}>Usuários</a>
        </nav>
      </aside> */}

      <div className={styles.main}>
        <header className={styles.header}>
          <h1>{title}</h1>
          <div className={styles.user}>
            <span>👤 Kleber</span>
          </div>
        </header>

        <section className={styles.content}>
          {children}
        </section>
      </div>
    </div>
  )
}

export default AdminTemplate