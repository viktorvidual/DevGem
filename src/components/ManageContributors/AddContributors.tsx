import React, { Dispatch, SetStateAction, useState, useContext } from 'react'
import { Addon } from '../../context/AddonsContext.ts'
import CustomSelect from '../CustomSelect/CustomSelect.tsx'
import { Button, Option, Select, Stack } from '@mui/joy';
import { addAddonContributor } from '../../services/addon.services.ts';
import { AuthContext } from '../../context/AuthContext.ts';
import { addUserNotification } from '../../services/user.services.ts';

type Props = {
  setView: Dispatch<SetStateAction<string>>;
  addon: Addon;
  currentMaintainers: string[];
};

function AddContributors({addon, setView, currentMaintainers}: Props) {
  const { loggedInUser, allUsers } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("Maintainer");
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  
  const handleRoleChange = (event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null) => {
    const target = event?.target as HTMLElement;
  setSelectedRole(target.innerText);
  if (target.innerText === "Owner") {
    setSelectedUser(prev => [prev[0]]);
  }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      await addAddonContributor(selectedUser, addon.addonId, selectedRole);
      
      const findPersonByUID = allUsers?.find((currentUser) => selectedUser.includes(currentUser.uid));
      
      if (findPersonByUID) {
        await addUserNotification(findPersonByUID?.username, `You were added as a contributor with role ${selectedRole} by user ${loggedInUser?.username} for addon!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setView("manage")
    }
  }


  return (
    <div>
      <div>You're inviting contributors to the {addon.name} add-on.</div>
      <Stack spacing={2} margin="1em">
        <CustomSelect onChange={setSelectedUser} isMulti={selectedRole === "Maintainer"} currentMaintainers={currentMaintainers} />
        <Select defaultValue="Maintainer" onChange={handleRoleChange}>
          <Option value="Maintainer">Maintainer</Option>
          <Option value="Owner">Owner</Option>
        </Select>
        <Button onClick={handleSubmit}>Add users</Button>
      </Stack>
    </div>
  )
}

export default AddContributors