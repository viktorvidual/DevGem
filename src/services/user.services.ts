import {
  get,
  set,
  ref,
  orderByChild,
  equalTo,
  update,
  remove,
  push,
  onValue,
  query,
  limitToLast,
} from "firebase/database";
import { database } from "../config/firebase.ts";
import { setFileToFirebaseStorage } from "./storage.services.ts";
import { DataSnapshot } from "firebase/database";
import { Review, deleteReview } from "./review.services.ts";
import { deleteAddonAndRelatedData } from "./addon.services.ts";
import { MESSAGE_FOR_MAKE_ADMIN } from "../common/common.ts";
import { Addon } from "../context/AddonsContext.ts";
import { Dispatch, SetStateAction } from "react";
import { Message } from "../components/AdminGroupChat/TableAdminChat.tsx";
import { IDE } from "../components/SelectCreatable/selectCreatableHelpers.ts";

/**
 * Transforms the users document snapshot into an array of user objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the users document.
 * @returns {Array} - An array of user objects.
 */
export const fromUsersDocument = (snapshot: DataSnapshot) => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map((key) => {
    const post = usersDocument[key];

    return {
      ...post,
      username: key,
      createdOn: new Date(post.createdOn),
    };
  });
};

/**
 * Retrieves a user by their username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserByUsername = (username: string): Promise<object> => {
  return get(ref(database, `users/${username}`));
};

/**
 * Creates a new user using their username as the key.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} uid - The user's UID.
 * @param {string} email - The user's email.
 * @param {string} username - The username of the user.
 * @param {string} profilePictureURL - The URL of the user's profile picture.
 * @returns {Promise<void>} - A promise that resolves after creating the user.
 */
export const createUserByUsername = (
  firstName: string,
  lastName: string,
  uid: string,
  email: string,
  username: string,
  company: string,
  profilePictureURL: string,
  phoneNumber: string
): Promise<void> => {
  return set(ref(database, `users/${username}`), {
    firstName,
    lastName,
    uid,
    username,
    profilePictureURL,
    email,
    company,
    phoneNumber,
    role: "user",
    createdOn: Date.now(),
  });
};

/**
 * Retrieves user data by UID.
 *
 * @param {string} uid - The UID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserData = (uid: string): Promise<DataSnapshot> => {
  return get(ref(database, "users"), orderByChild("uid"), equalTo(uid));
};

/**
 * Retrieves all users.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
export const getAllUsers = (): Promise<Array<object>> => {
  return get(ref(database, "users")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return fromUsersDocument(snapshot);
  });
};

/**
 * Updates the profile picture URL for a user.
 *
 * @param {File} file - The new profile picture file.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<string>} - A promise that resolves with the updated profile picture URL.
 */
export const updateProfilePic = async (
  file: File,
  currentUser: string
): Promise<string> => {
  const url = await setFileToFirebaseStorage(file);

  const updateProfilePic: {[key: string]: string} = {};
  updateProfilePic[`/users/${currentUser}/profilePictureURL`] = url;

  update(ref(database), updateProfilePic);
  return url;
};

/**
 * Updates the email address for a user.
 *
 * @param {string} email - The new email address.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the email.
 */
export const updateProfileEmail = async (
  email: string,
  currentUser: string
): Promise<void> => {
  const updateEmail: {[key: string]: string} = {};
  updateEmail[`/users/${currentUser}/email`] = email;

  return update(ref(database), updateEmail);
};

/**
 * Updates the phone number for a user.
 *
 * @param {string} phone - The new phone number.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the phone number.
 */
export const updateProfilePhone = async (
  phone: string,
  currentUser: string
): Promise<void> => {
  const updatePhone: {[key: string]: string} = {};
  updatePhone[`/users/${currentUser}/phone`] = phone;

  return update(ref(database), updatePhone);
};

/**
 * Blocks a user.
 *
 * @param {string} handle - The username of the user to block.
 * @returns {Promise<void>} - A promise that resolves after blocking the user.
 */
export const blockUser = (handle: string): Promise<void> => {
  const updateBlockedStatus: {[key: string]: boolean} = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = true;

  return update(ref(database), updateBlockedStatus);
};

/**
 * Unblocks a user.
 *
 * @param {string} handle - The username of the user to unblock.
 * @returns {Promise<void>} - A promise that resolves after unblocking the user.
 */
export const unblockUser = (handle: string): Promise<void> => {
  const updateBlockedStatus: {[key: string]: boolean} = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = false;

  return update(ref(database), updateBlockedStatus);
};

/**
 * Grants admin privileges to a user.
 *
 * @param {string} handle - The username of the user to make an admin.
 * @returns {Promise<void>} - A promise that resolves after granting admin privileges.
 */
export const makeAdminUser = (handle: string): Promise<void> => {
  const updateAdminStatus: {[key: string]: string} = {};

  updateAdminStatus[`/users/${handle}/role`] = "admin";
  addUserNotification(handle, MESSAGE_FOR_MAKE_ADMIN)

  return update(ref(database), updateAdminStatus);
};

/**
 * Removes admin privileges from a user.
 *
 * @param {string} handle - The username of the user to remove admin rights from.
 * @returns {Promise<void>} - A promise that resolves after removing admin privileges.
 */
export const removeAdminRights = (handle: string): Promise<void> => {
  const updateAdminStatus: {[key: string]: string} = {};

  updateAdminStatus[`/users/${handle}/role`] = "user";

  return update(ref(database), updateAdminStatus);
};

export async function deleteUserData(
  userHandle: string,
  addons: Addon[],
  reviews: Review[]
): Promise<void> {
  await remove(ref(database, `users/${userHandle}`));

  await Promise.all(
    addons.map(async (addon) => {
      await deleteAddonAndRelatedData(addon.addonId);
    })
  );

  await Promise.all(
    reviews.map(async (review) => {
      await deleteReview(review.reviewId, review.addonId);
    })
  );

  console.log("User and associated reviews & addons deleted successfully");
}

export const addUserNotification = async(username: string, notification: string) => {
  const notificationsRef = ref(database, `users/${username}/notifications`);

  const newNotification = {
    id: 'null',
    time: Date.now(),
    content: notification,
  };
  const result = await push(notificationsRef, newNotification);

  if (result.key !== null) {
    const updateNotificationID: {[key: string]: string} = {};
    updateNotificationID[`users/${username}/notifications/${result.key}/id`] = result.key;
    await update(ref(database), updateNotificationID);
  }
};

export const getUserNotifications = async(username: string) => {
  const usersNotifications = await get(ref(database, `users/${username}/notifications`));
  if (!usersNotifications.exists()) {
    return [];
  }else{
    const notificationData = usersNotifications.val();
    const notificationArray = Object.values(notificationData);
    return notificationArray;
  }
};

export const deleteNotification = (username: string, id: string) => {
  const updateNotification: {[key: string]: string | null} = {}
  updateNotification[`users/${username}/notifications/${id}`] = null;
  return update(ref(database), updateNotification);
}

export const addAdminMessage = async(username: string, avatar: string, content:string) => {
  const messageRef = ref(database, `adminMessages`);

  const newMessage = {
    id: 'null',
    time: Date.now(),
    content: content,
    avatar: avatar,
    username: username,
  };
  const result = await push(messageRef, newMessage);

  if (result.key !== null) {
    const updateMessageID: {[key: string]: string} = {};
    updateMessageID[`adminMessages/${result.key}/id`] = result.key;
    await update(ref(database), updateMessageID);
  }
}
export const removeAdminMessage = async(id: string) => {
  const removeAdminMessage: {[key: string]: null} = {};
  removeAdminMessage[`adminMessages/${id}`] = null;
  return update(ref(database), removeAdminMessage);
}
export const editAdminMessage = async (id:string, updatedMessage: string) => {
  const updateAdminMessage: {[key: string]: string} = {};
  updateAdminMessage[`adminMessages/${id}/content`] = updatedMessage;
  return update(ref(database), updateAdminMessage);
}

export const fetchAdminMessagesAndUpdateState = (setData: Dispatch<SetStateAction<Message[]>>, messagesToLoad: number) => {
  const adminMessagesRef = ref(database, "adminMessages");
  const queryWithAdminMessages = query(adminMessagesRef, orderByChild("time"), limitToLast(messagesToLoad))
  const adminMessagesListener = onValue(queryWithAdminMessages, (snapshot) => {
    const updatedMessages: Message[] = [];

    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      updatedMessages.push(message);
    });

    setData(updatedMessages);
  });

  return () => {
    adminMessagesListener();
  };
};
export const fetchAllIDEs = (setData: Dispatch<SetStateAction<IDE[]>>) => {
  const allIDEs = ref(database, "IDEs");

  const IDEsListener = onValue(allIDEs, (snapshot) => {
    const updatedIDEs: IDE[] = [];

    snapshot.forEach((childSnapshot) => {
      const IDE = childSnapshot.val();
      updatedIDEs.push(IDE);
    });

    setData(updatedIDEs);
  });

  return () => {
    IDEsListener();
  };
};

export const fetchUserNotifications = (setData, username: string) => {

  const usersRef = ref(database, `users/${username}/notifications`);

  const notificationListener = onValue(usersRef, (snapshot) => {
    const updatedNotifications = [];
    
    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      updatedNotifications.push(notification);
    });

    setData(updatedNotifications);
  });
  return () => {
    notificationListener();
  };
};
