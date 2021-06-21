/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import { ImageCaptionResult } from '../lib/models/image-caption';
import styles from './urlzone.module.scss';

function Urlzone(): JSX.Element {
  const defaultImage = 'https://images.unsplash.com/photo-1591638848692-0c789163f6f7?w=500';
  const [captions, setCaptions] = useState<ImageCaptionResult>();
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    setCaptions(undefined);
    setImage(undefined);
    setLoading(true);
    setError(undefined);

    const target = event.target as typeof event.target & {
      url: { value: string };
    };

    const { url } = target;

    if (url?.value) {
      const captions: ImageCaptionResult = await fetch(`/api/image?describeURL=${encodeURIComponent(url.value)}`, {
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

      if (captions) {
        setCaptions(captions);
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

        <form onSubmit={submitHandler} noValidate autoComplete="off">
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

      {captions ? (
        <div>
          <header>
            <h3>Here are the results:</h3>
          </header>
          {captions.tags.length ? (
            <p>
              This image is tagged with{' '}
              {captions.tags.map((tag) => (
                <strong key={tag}>{tag} </strong>
              ))}
            </p>
          ) : (
            ''
          )}
          {captions.captions.map((caption, idx) => (
            <p key={idx}>
              Caption (with a confidence of {caption.confidence}): This may be a <strong>{caption.caption}</strong>
            </p>
          ))}

          {image ? <img className={styles.image} alt={captions.captions[0]?.caption} title={captions.captions[0]?.caption} src={image} loading="lazy" /> : ''}
        </div>
      ) : (
        ''
      )}
    </section>
  );
}

export default Urlzone;
