import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Alert, Box, Button, IconButton, Modal, ModalClose, ModalDialog } from '@mui/joy'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/joy/Typography';
import { Addon, AddonsContext } from '../../context/AddonsContext.ts';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReportIcon from '@mui/icons-material/Report';
import ContributorsList from './ContributorsList.tsx';
import AddContributors from './AddContributors.tsx';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addon: Addon;
}

function ManageContributors({ isOpen, setIsOpen, addon }: Props) {
  const { allAddons } = useContext(AddonsContext);
  const [maintainers, setMaintainers] = useState<string[]>(addon.contributors || []);
  const [error, setError] = useState<null | string>(null);
  const [view, setView] = useState<string>("manage");
  
  useEffect(() => {
    setMaintainers(allAddons.find(el => el.addonId === addon.addonId)?.contributors || []);
  }, [allAddons])

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setView(newValue);
  }

  return (
    <Modal open={isOpen} onClick={() => setIsOpen(false)}>

      <ModalDialog aria-labelledby="dialog-vertical-scroll-title" layout='center' onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={() => setIsOpen(false)}
          variant="outlined"
          sx={{
            top: 'calc(-1/4 * var(--IconButton-size))',
            right: 'calc(-1/4 * var(--IconButton-size))',
            boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
            borderRadius: '50%',
            bgcolor: 'background.surface',
          }} />
        <TabContext value={view}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="tabs to manage contributors">
              <Tab label="Manage contributors" value="manage" />
              <Tab label="Add contributors" value="add" />
            </TabList>
          </Box>
          {error && (
            <Alert
              key="Error"
              sx={{ alignItems: 'flex-start' }}
              startDecorator={(<ReportIcon />)}
              variant="soft"
              color="danger"
              endDecorator={
                <IconButton variant="soft" color="danger">
                  <CloseRoundedIcon />
                </IconButton>
              }
            >
              <div>
                <div>Error</div>
                <Typography level="body-sm" color="danger">
                  The following error has occurred: {error}
                </Typography>
              </div>
            </Alert>
          )}
          <TabPanel value="manage">
            <ContributorsList maintainers={maintainers} addon={addon} />
            <Button onClick={() => setView("add")} fullWidth >Add new contributors</Button>
          </TabPanel>
          <TabPanel value="add">
            <AddContributors addon={addon} setView={setView} currentMaintainers={maintainers} />
          </TabPanel>
        </TabContext>
      </ModalDialog>
    </Modal>
  )
}

export default ManageContributors