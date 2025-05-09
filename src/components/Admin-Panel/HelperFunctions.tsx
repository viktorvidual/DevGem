import { addUserNotification, blockUser, unblockUser } from "../../services/user.services";
import { MESSAGE_FOR_BLOCK_USER, MESSAGE_FOR_UNBLOCK_USER } from "../../common/common";
export const handleBlockUser = (userName: string) => {
    blockUser(userName)
    addUserNotification(userName, MESSAGE_FOR_BLOCK_USER)
  };

export const handleUnBlockUser = (userName: string) => {
    unblockUser(userName)
    addUserNotification(userName, MESSAGE_FOR_UNBLOCK_USER)
  };