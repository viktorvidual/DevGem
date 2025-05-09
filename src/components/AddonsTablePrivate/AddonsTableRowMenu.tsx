import { useContext, useState } from 'react';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useNavigate } from 'react-router-dom';
import { EDIT_ADDON_PATH } from '../../common/common.ts';
import { deleteAddonAndRelatedData } from '../../services/addon.services.ts';
import ManageContributors from '../ManageContributors/ManageContributors.tsx';
import { Addon } from '../../context/AddonsContext.ts';
import { AuthContext } from '../../context/AuthContext.ts';

export default function RowMenu(addon: Addon) {
  const [isOpen, setIsOpen] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Function to handle edit click event.
   */
  const handleEditClick = () => {
    navigate(`${EDIT_ADDON_PATH}/${addon.addonId}`);
    navigate(`${EDIT_ADDON_PATH}/${addon.addonId}`);
  }

  /**
   * Function to handle delete event.
   */
  const handleDelete = () => {
    const shouldDelete = window.confirm("Are you sure you want to delete this addon and all related information?");

    if (shouldDelete) {
      deleteAddonAndRelatedData(addon.addonId)
    }
  }

  /**
     * Function to handle manage contributors click event.
     */
  const handleManageContributorsClick = () => {
    setIsOpen(true);
  }
  return (
    <div>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          {addon.ownerUid === loggedInUser?.uid && <MenuItem onClick={handleManageContributorsClick}>Manage contributors</MenuItem>}
          <Divider />
          <MenuItem color="danger" onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Dropdown>
      <ManageContributors isOpen={isOpen} setIsOpen={setIsOpen} addon={addon} />
    </div>
  );
}