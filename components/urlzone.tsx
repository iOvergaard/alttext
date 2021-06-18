/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import { ImageCaption } from '../lib/models/image-caption';
import styles from './urlzone.module.scss';

function Urlzone(): JSX.Element {
  const defaultImage =
    'https://images.unsplash.com/photo-1591638848692-0c789163f6f7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80';
  const [caption, setCaption] = useState<ImageCaption>();
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    setCaption(undefined);
    setImage(undefined);
    setLoading(true);
    setError(undefined);

    const target = event.target as typeof event.target & {
      url: { value: string };
    };

    const { url } = target;

    if (url?.value) {
      const caption = await fetch(`/api/image?describeURL=${encodeURIComponent(url.value)}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => (res.ok ? res.json() : setError(res.statusText)))
        .catch((err) => {
          console.log(err);
          setError(err.message);
          return null;
        });

      if (caption) {
        setCaption(caption);
        setImage(url.value);
      }
    }

    setLoading(false);
  };

  return (
    <section>
      <header>
        <h2>Get image details from URL</h2>
      </header>

      <div>
        <p>
          Copy a URL into the field and see the details, or try it out with the default photo by{' '}
          <a href="https://unsplash.com/@torigwise?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tori Wise</a> on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        </p>

        <form onSubmit={submitHandler}>
          <div className={styles.block}>
            <input className={styles.url} type="text" name="url" placeholder="<url to image>" defaultValue={defaultImage} />
          </div>
          <div className={styles.block}>
            <button className={styles.button} type="submit">
              Get details
            </button>
          </div>
        </form>
      </div>

      <hr />

      {loading ? <div>Results are in soon...</div> : ''}

      {error ? <div>{error}</div> : ''}

      {caption ? (
        <div>
          <header>
            <h3>Here are the results:</h3>
          </header>
          <p>
            Caption (with a confidence of {caption.confidence}): This is probably a photo showing <strong>{caption.caption}</strong>
          </p>

          {image ? <img className={styles.image} alt={caption.caption} title={caption.caption} src={image} loading="lazy" /> : ''}
        </div>
      ) : (
        ''
      )}
    </section>
  );
}

export default Urlzone;
