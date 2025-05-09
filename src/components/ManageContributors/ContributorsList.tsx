import React, { useContext } from 'react'
import { Avatar, IconButton, List, ListDivider, ListItem, ListItemContent, ListItemDecorator, Tooltip, Typography } from '@mui/joy'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { AuthContext, LoggedInUser } from '../../context/AuthContext.ts';
import { removeAddonContributor } from '../../services/addon.services.ts';
import { Addon } from '../../context/AddonsContext.ts';
import { addUserNotification } from '../../services/user.services.ts';

interface Props {
  maintainers: string[];
  addon: Addon;
}

function ContributorsList({ maintainers, addon }: Props) {
  const { allUsers, loggedInUser } = useContext(AuthContext);

  const handleRemoveContributor = async (userId: string, addonId: string) => {
    try {
      await removeAddonContributor(userId, addonId);
      const findPersonByUID = allUsers?.find((user) => user.uid === userId);
      if (findPersonByUID) {
        await addUserNotification(findPersonByUID?.username, `You were removed as a contributor by user ${loggedInUser?.username}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <List>
      {Object.values(maintainers)?.length ? Object.values(maintainers).map((item) => {
        const targetUser = allUsers?.filter((el: LoggedInUser) => el.uid === item)[0];
        if (!targetUser) {
          return;
        }

        return (
          <div key={targetUser.uid}>
            <ListItem
              endAction={
                <Tooltip
                  title="Remove contributor"
                  color="danger"
                  placement="bottom"
                  size="md">
                  <IconButton aria-label="Remove" size="sm" color="danger" onClick={() => handleRemoveContributor(item, addon.addonId)}>
                    <PersonRemoveIcon />
                  </IconButton>
                </Tooltip>
              }>
              <ListItemDecorator>
                <Avatar size="sm" src={targetUser.profilePictureURL} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">{targetUser.firstName + " " + targetUser.lastName}</Typography>
                <Typography level="body-sm" noWrap>
                  {targetUser.username}
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListDivider />
          </div>
        )
      }) : <Typography>No maintainers yet</Typography>}
    </List>
  )
}

export default ContributorsList