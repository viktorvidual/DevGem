import { Dispatch, SetStateAction, useState } from 'react';
import { Box, ModalClose, ModalDialog, Stack } from '@mui/joy';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Preview } from '../../components/Dropzone/Dropzone.tsx';
import { DummyInitialFile } from '../../components/EditAddon/EditAddon.tsx';

interface Props {
  image: Preview | DummyInitialFile;
  setFiles: Dispatch<SetStateAction<File[]>>;
  setPreview: Dispatch<SetStateAction<Preview[] | DummyInitialFile[]>>;
}

export default function DividedImagesList({ image, setFiles, setPreview }: Props) {
  const [open, setOpen] = useState(false);

  const handleRemoveItem = () => {

    setPreview((prev: DummyInitialFile[]) => prev.filter((file) => file.name !== image.name));
    setFiles((prevItems: File[]) => prevItems.filter((file: File) => file.name !== image.name));
  };

  return (
    <>
        <Stack sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 0}}>
          <img
            style={{ height: '2em', width: 'auto', margin: '0.5em', borderRadius: '5px', boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)' }}
            src={image.caption}
            onClick={() => setOpen(true)}
          />
          <p style={{fontSize: 'small'}}>{image.name}</p>
          <CloseIcon onClick={() => handleRemoveItem()} style={{ fontSize: 'large', margin: '1em' }}/>
        </Stack>
      <Modal open={open} onClose={() => setOpen(false)} >
        <ModalDialog
          layout="center"
          sx={{
            padding: 0,
            boxShadow: 24,
            borderRadius: 0,
            border: 0
          }}>
          <ModalClose
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{
              top: 'calc(-1/4 * var(--IconButton-size))',
              right: 'calc(-1/4 * var(--IconButton-size))',
              boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
              borderRadius: '50%',
              bgcolor: 'background.surface',
            }}
          />
          <Box component='img' src={image.caption} sx={{
            maxWidth: '100%', maxHeight: '100%', padding: 0, margin: 0
          }}></Box>
        </ModalDialog>
      </Modal>
    </>
  );
}
