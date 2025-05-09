import React, { useEffect, useState, useContext } from "react";
import { Message, TableAdminChat } from "./TableAdminChat";
import { AuthContext, LoggedInUser } from "../../context/AuthContext";
import { ADMIN, initiallyMessages } from "../../common/common";
import { fetchAdminMessagesAndUpdateState } from "../../services/user.services";
import { messagesToLoadOnMore } from "../../common/common";

export const AdminGroupChat: React.FC = () => {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const { loggedInUser, allUsers } = useContext(AuthContext);
  const filterAdmins = allUsers?.filter((user: LoggedInUser) => user.role === ADMIN);
  const [messagesToLoad, setMessagesToLoad] = useState(initiallyMessages);
  useEffect(() => {
    const unsubscribe = fetchAdminMessagesAndUpdateState(setAllMessages, messagesToLoad);

    return () => {
      unsubscribe();
    };

  }, [messagesToLoad]);
  const loadMoreMessages = () => {
    setMessagesToLoad(messagesToLoad + messagesToLoadOnMore);
  };
  return (
    <>
      <TableAdminChat allMessages={allMessages} user={loggedInUser?.username} avatar={loggedInUser?.profilePictureURL} filterAdmins={filterAdmins} loadMoreMessages={loadMoreMessages} />
    </>
  )
}