import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Alert, Box, List, ListDivider, Stack, SvgIcon } from '@mui/joy';
import _ from 'lodash';

import { useDropzone } from "react-dropzone";
import "./Dropzone.css";
import DividedImagesList from "../../views/DividedList/DividedImagesList.tsx";
import { DummyInitialFile } from "../EditAddon/EditAddon.tsx";
import { validateDropzoneFile } from "./dropzoneValidations.tsx";
import { tenMB } from "../../common/common.ts";

interface DropzoneComponentProps {
  setFiles: Dispatch<SetStateAction<File[]>>;
  validateValue: (value: string, type: string) => Promise<string | null>;
  initialValue?: DummyInitialFile[];
}

export interface Preview {
  caption: string;
  name: string;
  type: string;
}

/**
 * A component for handling file uploads using a dropzone.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setFile - A callback function to set the selected file.
 * return (
 *   <DropzoneComponent setFile={handleSetFile} />
 * );
 */
export default function DropzoneComponent({
  setFiles,
  validateValue,
  initialValue
}: DropzoneComponentProps): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview[] | DummyInitialFile[]>(initialValue || []);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    acceptedFiles.map(async (file: File) => {
      const isValidDropzoneFile = await validateDropzoneFile(file, validateValue);

      if (!isValidDropzoneFile.flag) {
        setError(isValidDropzoneFile.error);
        return;
      }

      setFiles((prev) => {
        const updated = [...prev];
        updated.push(file);
        return updated;
      })


      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setPreview((prev) => {
          const newImage = {
            caption: url,
            name: file.name,
            type: file.type.split("/")[0]
          }
          const updated = [...prev];
          updated.push(newImage);
          return updated;
        });
      };
    })
  }, []);

  const renderUploadedPreview = preview.map((image, i) => {
    return (<div  key={image.name}>
      <DividedImagesList image={image} setFiles={setFiles} setPreview={setPreview} />
      {!(i === preview.length - 1) && (<ListDivider />)}
    </div>)
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDragEventsBubbling: false,
    maxSize: tenMB,
    multiple: true,
  });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Stack
          className="align-items-center justify-content-center text-center d-flex flex-column dropzone"
          sx={{ width: 'fit-content', alignItems: 'center' }}
        >
          <SvgIcon sx={{ marginBottom: 0 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          </SvgIcon>
          <p style={{ fontSize: "0.9em", marginBottom: "0.2em", marginTop: "0.4em" }}>Click to upload extra images for your addon description or drag and drop them.</p>
          <p style={{ fontSize: "0.7em", marginTop: 0 }}>
            Allowed file types: PNG, JPG, GIF up to 100MB
          </p>
          {error && <Alert variant="outlined" color="warning">{error}</Alert>}
        </Stack>
      </div>
      {!(_.isEmpty(preview)) && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            minWidth: 'fit-content',
            gap: 2,
            marginTop: '1em',
          }}
        >
          <List
            variant="outlined"
            sx={{
              minWidth: 'fit-content',
              borderRadius: 'sm',
            }}
          >
            {renderUploadedPreview}
          </List>
        </Box>
      )}
    </>
  )
}
