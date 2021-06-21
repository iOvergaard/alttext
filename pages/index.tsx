import Urlzone from '../components/urlzone';
import styles from './index.module.scss';

export default function Home(): JSX.Element {
  return (
    <main className={styles.main}>
      <header>
        <h1>Welcome</h1>
        <p>This tool enables you to find an alt text from images</p>
      </header>

      <Urlzone />
      {/*<Dropzone />*/}
    </main>
  );
}
