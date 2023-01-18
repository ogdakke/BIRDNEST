import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Header(context) {
  return (
    <>
    <section className={styles.description}>
      <div>
        <h1 className={styles.h1}>
          BIRDNEST
        </h1>
        <p>This webapp gets data on drones, stores it in the browsers localStorage and removes data that is over 10 minutes old. Newest data gets added to the top of the list.
        <Link href={'https://github.com/ogdakke/BIRDNEST'}>GitHub repository for the project.</Link>
        <Link href={'https://www.deweloper.fi/'}>My website: deweloper.fi</Link>
        </p>
      </div>
    </section>
    </>
  )
}
