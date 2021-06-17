import { SyntheticEvent } from 'react';

import styles from './dropzone.module.scss';

function Dropzone(): JSX.Element {
  const onDropHandler = async (event: any) => {
    console.log('uh oh, something dropped', event);

    event.preventDefault();

    const filesToHandle: File[] = [];

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile();
          filesToHandle.push(file);
          console.log('... file[' + i + '].name = ' + file.name);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        filesToHandle.push(event.dataTransfer.files[i]);
      }
    }

    for (let i = 0; i < filesToHandle.length; i++) {
      const file = filesToHandle[i];

      if (!file.type.startsWith('image/')) continue;

      const formData = new FormData();
      formData.append('file', file, file.name);

      const res = await fetch('/api/image', {
        method: 'POST',
        body: formData
      }).catch((res) => {
        console.error('Something went wrong', res.message);
        return null;
      });

      if (res?.ok) {
        const caption = res.json();
        console.log('caption', caption);
      }

      /*const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = async (what) => {
        console.log('finished load', what);
        if (what.target?.result) {
          const res = await fetch('/api/image', {
            method: 'POST',
            body: what.target.result,
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          }).catch((res) => {
            console.error('Something went wrong', res.message);
            return null;
          });

          if (res?.ok) {
            const caption = res.json();
            console.log('caption', caption);
          }
        }
      };*/
    }

    console.log('what to do with these files', filesToHandle);
  };

  const onDragOverHandler = (event: SyntheticEvent) => {
    console.log('something is over me', event);

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  };

  return (
    <div className={styles.dropzone} onDrop={onDropHandler} onDragOver={onDragOverHandler}>
      <p>Drag one or more files to this Drop Zone ...</p>
    </div>
  );
}

export default Dropzone;
