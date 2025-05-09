import React, { ReactNode, useContext, useEffect, useState } from "react";
import { auth, database } from "../../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getAllUsers, getUserData } from "../../services/user.services";
import { AuthContext, LoggedInUser } from "../../context/AuthContext";
import BasicSkeleton from "../../views/BasicSkeleton/BasicSkeleton.tsx";
import { ref, onValue } from "firebase/database";

export interface AppState {
  user: User | null | undefined;
  loggedInUser: LoggedInUser | null;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const { user, loggedInUser } = useContext(AuthContext);
  const [appState, setAppState] = useState<AppState>({ user, loggedInUser });

  /**
   * Use effect hook to handle authentication state changes.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        const allUsers = await getAllUsers();

        if (currentUser) {
          const loggedUserSnapshot = await getUserData(currentUser.uid);
          const userDataArray = Object.values(loggedUserSnapshot.val()) as LoggedInUser[];
          const loggedInUserData = userDataArray.find((el) => el.uid === currentUser.uid);

          setAppState((prev) => ({
            ...prev,
            loggedInUser: loggedInUserData || null,
            user: currentUser,
            allUsers,
          }));
        } else {
          setAppState((prev) => ({
            ...prev,
            loggedInUser: null,
            user: null,
            allUsers,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Use effect hook to listen for changes in the users.
   */
  useEffect(() => {
    const usersRef = ref(database, "users");

    const usersListener = onValue(usersRef, (snapshot) => {
      const updatedUsers: LoggedInUser[] = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        updatedUsers.push(user);
      });
      setAppState((prev) => ({
            ...prev,
            allUsers: updatedUsers,
          }));
    });
    return () => {
      usersListener();
    };
  }, []);

  return (
    <div className="main-content">
      <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
        {appState.user === undefined ? (<BasicSkeleton />) : children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthContextProvider;
