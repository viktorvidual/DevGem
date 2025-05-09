import { Box, Button, FormControl, FormLabel, Input, Stack } from '@mui/joy'
import React, { useContext, useState } from 'react'
import UploadInput from '../UploadInput/UploadInput.tsx'
import TextInputField from '../TextInputField/TextInputField.tsx'
import SelectCreatable from '../SelectCreatable/SelectCreatable.tsx'
import DropzoneComponent from '../Dropzone/Dropzone.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import { Addon, AddonsContext } from '../../context/AddonsContext.ts'
import { AuthContext } from '../../context/AuthContext.ts'
import { editAddon, getAllAddons, updateAddonTags } from '../../services/addon.services.ts'
import { getAllTags, updateTags } from '../../services/tag.services.ts'
import { getAllIDEs, updateIDEs } from '../../services/IDE.services.ts'
import { RequestError } from 'octokit'
import Error from '../../views/CustomSnackbarError/CustomSnackbarError.tsx'
import { IDEs, MY_ADDONS_PATH, TAGS, errorMap } from '../../common/common.ts'
import _ from "lodash";
import Loading from '../../views/Loading/Loading.tsx'
import { isValidCompany, isValidDescription, isValidFile, isValidIDE, isValidName, isValidOriginLink, isValidTag, isValidVersion, isValidVersionInfo } from '../CreateAddon/createAddonValidations.ts'
import Typography from '@mui/material/Typography';

const errorMapNew = _.cloneDeep(errorMap);
errorMapNew.delete('logo');
errorMapNew.set('upload', null);
errorMapNew.set("tags", null);
errorMapNew.set("IDEs", null);
errorMapNew.set("Version", null);
errorMapNew.set("Version info", null);
export interface DummyInitialFile {
  name: string;
  caption?: string;
}

const EditAddon = () => {
  const params = useParams();
  const { loggedInUser } = useContext(AuthContext);
  const { allAddons, setAllAddons } = useContext(AddonsContext);
  const [addon, setAddon] = useState<Addon>(allAddons.filter(el => el.addonId === params.id)[0]);
  const [addonFile, setAddonFile] = useState<File | DummyInitialFile>(
    {
      name: addon.downloadLink.substring(addon.downloadLink.lastIndexOf('/') + 1,
        addon.downloadLink.length)
    });
  const [images, setImages] = useState<File[] | DummyInitialFile[]>(
    addon.images?.map(el => (
      {
        name: el.substring(el.lastIndexOf('/') + 1, el.length) || '',
        caption: el || ''
      })) || []);
  const [logo, setLogo] = useState<File | DummyInitialFile>(
    {
      name: addon.logo?.substring(addon.logo?.lastIndexOf('/') + 1,
        addon.logo?.length) || ''
    });
  const [name, setName] = useState<string>(addon.name);
  const [description, setDescription] = useState<string>(addon.description);
  const [originLink, setOriginLink] = useState<string>(addon.originLink);
  const [tags, setTags] = useState<string[]>(Object.keys(addon.tags));
  const [IDE, setIDE] = useState<string[]>([addon.targetIDE]);
  const [company, setCompany] = useState<string>(addon.company || '');
  const [version, setVersion] = useState<string>('');
  const [price, setPrice] = useState<number | undefined | string>(addon.price || "");
  const [versionInfo, setVersionInfo] = useState<string>('');
  const [submitError, setSubmitError] = useState<Map<string, null | string>>(errorMapNew);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useState(() => {
    setAddon(allAddons.filter(el => el.addonId === params.id)[0]);
  });

  const handleCancel = () => {
    navigate(`/${MY_ADDONS_PATH}`);
  }

  const handleSubmit = async () => {

    if (!loggedInUser?.uid) {
      return;
    }

    setIsSubmitted(true);
    if (!Array.from(submitError.values()).every(el => el === null)) {
      return;
    }
    try {
      if (addonFile) {
        setLoading(true);
        await editAddon(addon, name, description, IDE[0], [addonFile], images, originLink, company, [logo], version, versionInfo, price);
        await updateAddonTags(addon.addonId, tags);
        await updateTags(tags);
        await updateIDEs(IDE);
        const result = await getAllAddons();
        setAllAddons((prev) => ({ ...prev, allAddons: result }));
      }
    } catch (error) {
      if (error instanceof RequestError) {
        setUploadError(error.message);
      }
    } finally {
      setLoading(false);
      navigate(`/${MY_ADDONS_PATH}`);
    }
  }

  /**
 * Handle change event for the Tags component.
 * @param {Array} e - The selected tags.
 */
  const handleTagsChange = (e: string[]) => {
    setTags(e);
  };

  /** 
   * Handle change event for the IDEs component.
   * @param {Array} e - The selected IDE.
   */
  const handleIDEChange = (values: string[]) => {
    setIDE(values);
  };

  if (loading) {
    return <Loading />;
  }

  if (uploadError) {
    return <Error error={uploadError} />
  }

  return (
    <Stack spacing={4}
      sx={{
        maxWidth: '60%',
        borderRadius: 'sm',
        marginRight: 'auto',
        marginLeft: 'auto'
      }}>
      <Typography variant='h4' fontWeight="bold">Edit addon</Typography>
      <UploadInput
        setValue={setAddonFile}
        setSubmitError={setSubmitError}
        isSubmitted={isSubmitted}
        validateValue={isValidFile}
        isRequired={true}
        acceptedFormats='.jar, .zip'
        inputLabel='Plugin file'
        initialValue={addonFile} />

      {!addon.downloadLink.includes(addonFile.name) &&
        (<Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flexGrow: 1 }}>

            <FormControl>
              <TextInputField setValue={setVersion}
                inputType="text"
                inputPlaceholder="Enter version #"
                inputLabel="Version"
                setSubmitError={setSubmitError}
                isSubmitted={isSubmitted}
                validateValue={isValidVersion}
                initialValue={version}
                currentAddonId={addon.addonId} />
            </FormControl>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <FormControl>
              <TextInputField setValue={setVersionInfo}
                inputType="text"
                inputPlaceholder="Enter version info"
                inputLabel="Version info"
                setSubmitError={setSubmitError}
                isSubmitted={isSubmitted}
                validateValue={isValidVersionInfo}
                initialValue={versionInfo}
                currentAddonId={addon.addonId}
                isRequired={false} />
            </FormControl>
          </Box>

        </Box>)}

      <TextInputField setValue={setName}
        inputType="text"
        inputPlaceholder="Enter unique name"
        inputLabel="Name"
        setSubmitError={setSubmitError}
        isSubmitted={isSubmitted}
        validateValue={isValidName}
        initialValue={name}
        currentAddonId={addon.addonId} />
      <TextInputField setValue={setOriginLink}
        inputType="text"
        inputPlaceholder="https://"
        inputLabel="Source code URL"
        isSubmitted={isSubmitted}
        validateValue={isValidOriginLink}
        setSubmitError={setSubmitError}
        initialValue={originLink} />
      <TextInputField setValue={setDescription}
        inputType="text"
        inputPlaceholder="Add details"
        inputLabel="Description"
        isSubmitted={isSubmitted}
        validateValue={isValidDescription}
        setSubmitError={setSubmitError}
        initialValue={description} />

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1 }}>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <SelectCreatable
              changeValues={handleTagsChange}
              getAllValues={getAllTags}
              type={TAGS}
              targetId={addon.addonId}
              setSubmitError={setSubmitError}
              isSubmitted={isSubmitted}
              validateValue={isValidTag}
              initialValue={Object.keys(addon.tags)} />
          </FormControl>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <FormControl>
            <FormLabel>Target IDE</FormLabel>
            <SelectCreatable
              changeValues={handleIDEChange}
              getAllValues={getAllIDEs}
              type={IDEs}
              targetId={addon.addonId}
              setSubmitError={setSubmitError}
              isSubmitted={isSubmitted}
              validateValue={isValidIDE}
              initialValue={[addon.targetIDE]} />
          </FormControl>
        </Box>

      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <UploadInput
            setValue={setLogo}
            setSubmitError={setSubmitError}
            isSubmitted={isSubmitted}
            validateValue={isValidFile}
            isRequired={false}
            acceptedFormats='.jpg, .png, .svg'
            inputLabel='Logo'
            initialValue={logo} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextInputField setValue={setCompany}
            inputType="text"
            inputPlaceholder="Enter name"
            inputLabel="Company"
            isSubmitted={isSubmitted}
            validateValue={isValidCompany}
            setSubmitError={setSubmitError}
            initialValue={company} />
        </Box>
      </Box>

      <FormControl sx={{ alignItems: 'center' }}>
        <DropzoneComponent
          setFiles={setImages}
          validateValue={isValidFile}
          initialValue={images} />
      </FormControl>

      <FormControl>
        <FormLabel>
          Price
        </FormLabel>
        <Input
          type='number'
          sx={{ minHeight: '3em' }}
          name="currency-input"
          placeholder="Amount"
          onChange={(e) => {
            const value = e.target.value;
            if ((typeof value === 'number' && value < 0)) {
              setPrice(0);
            } else {
              setPrice(value);
            }
          }}
          startDecorator={{ dollar: '$' }['dollar']}
          value={price} />
      </FormControl>

      <Button
        type="submit"
        className="mt-3"
        onClick={handleSubmit}
      >
        Save changes
      </Button>
      <Button
        type="submit"
        className="mt-3"
        onClick={handleCancel}
      >
        Cancel changes
      </Button>
    </Stack>
  )
}

export default EditAddon