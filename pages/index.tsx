import Dropzone from '../components/dropzone';

export default function Home(): JSX.Element {
  return (
    <main>
      <header>
        <h1>Welcome</h1>
        <p>This tool enables you to find an alt text from images</p>
      </header>

      <Dropzone />
    </main>
  );
}
