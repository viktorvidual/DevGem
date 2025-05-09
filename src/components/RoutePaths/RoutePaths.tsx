import Home from "../../views/Home/Home";
import { Routes, Route } from "react-router-dom";
import {
  CREATE_ADDON_PATH,
  HOME_PATH,
  FILTER_ADDONS_PATH,
  LOG_IN_PATH,
  SIGN_UP_PATH,
  FORGOT_PASSWORD_PATH,
  DETAILED_ADDON_VIEW_ID_PATH,
  SUCCESS_UPLOAD_PATH,
  MY_ADDONS_PATH,
  ACCOUNT_SETTING_PATH,
  ADMIN_PANEL_PATH,
  ADMIN_INBOX_PATH,
  EDIT_ADDON_ID_PATH,
  CHECKOUT_PATH_ID,
  USER_NOTIFICATION,
  ADMIN_CHAT_PATH,
  ANALYTICS_DASHBOARD,
  MY_SUBSCRIPTIONS_PATH,
} from "../../common/common";
import FilterAddons from "../Filter-Addons/FilterAddons";
import RegistrationForm from "../Sign-Up/SignUp";
import Login from "../Login/Login";
import ForgottenPassword from "../ForgottenPassword/ForgottenPassword";
import DetailedAddonView from "../DetailedAddonView/DetailedAddonView";
import CreateAddon from "../CreateAddon/CreateAddon.tsx";
import SuccessUploadAddon from "../../views/SuccessUploadAddon/SuccessUploadAddon.tsx";
import AuthenticatedPaths from "../AuthenticatedPaths/AuthenticatedPaths.tsx";
import AccountSettings from "../AccountSettings/AccountSettings.tsx";
import AdminPanel from "../Admin-Panel/Admin-Panel.tsx";
import { AdminInbox } from "../InboxAdminNotifications.tsx/InboxAdmin.tsx";
import EditAddon from "../EditAddon/EditAddon.tsx";
import AddonsTablePrivate from "../AddonsTablePrivate/AddonsTablePrivate.tsx";
import Checkout from "../Checkout/Checkout.tsx";
import { UserNotification } from "../InboxUserNotification/UserNotification.tsx";
import { AdminGroupChat } from "../AdminGroupChat/AdminGroupChat.tsx";
import { AnalyticsDashboard } from "../AnalyticsDashboard/AnalyticsDashboard.tsx";
import AccountSubscriptions from "../AccountSubscriptions/AccountSubscriptions.tsx";

/**
 * Component defining the routing structure for the application.
 *
 * Defines the routing paths and corresponding components for different routes
 * within the application.
 *
 * @component
 * @returns {JSX.Element} Rendered component defining the application's routing.
 * @example
 * return (
 *   <RouteElement />
 * );
 */
const RoutePaths: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={HOME_PATH} element={<Home />} />
        <Route path={FILTER_ADDONS_PATH} element={<FilterAddons />} />
        <Route path={SIGN_UP_PATH} element={<RegistrationForm />} />
        <Route path={LOG_IN_PATH} element={<Login />} />
        <Route path={FORGOT_PASSWORD_PATH} element={<ForgottenPassword />} />
        <Route
          path={`${DETAILED_ADDON_VIEW_ID_PATH}:id`}
          element={<DetailedAddonView />}
        />
        <Route
          path={CREATE_ADDON_PATH}
          element={
            <AuthenticatedPaths>
              <CreateAddon />
            </AuthenticatedPaths>
          }
        />
        <Route
          path={ADMIN_PANEL_PATH}
          element={
            <AuthenticatedPaths>
              <AdminPanel />
            </AuthenticatedPaths>
          }
        />
        <Route
          path={ADMIN_INBOX_PATH}
          element={
            <AuthenticatedPaths>
              <AdminInbox />
            </AuthenticatedPaths>
          }
        />
        <Route path={SUCCESS_UPLOAD_PATH} element={<AuthenticatedPaths><SuccessUploadAddon /></AuthenticatedPaths>} />
        <Route path={MY_ADDONS_PATH} element={<AuthenticatedPaths><AddonsTablePrivate /></AuthenticatedPaths>} />
        <Route path={ACCOUNT_SETTING_PATH} element={<AuthenticatedPaths> <AccountSettings /> </AuthenticatedPaths>
        }
        />
        <Route path={CHECKOUT_PATH_ID} element={<AuthenticatedPaths><Checkout /></AuthenticatedPaths>} />
        <Route path={EDIT_ADDON_ID_PATH} element={<AuthenticatedPaths><EditAddon /></AuthenticatedPaths>} />
        <Route path={USER_NOTIFICATION} element={<AuthenticatedPaths><UserNotification /></AuthenticatedPaths>} />
        <Route path={ADMIN_CHAT_PATH} element={<AuthenticatedPaths><AdminGroupChat /></AuthenticatedPaths>} />
        <Route path={ANALYTICS_DASHBOARD} element={<AuthenticatedPaths><AnalyticsDashboard /></AuthenticatedPaths>} />
        <Route path={MY_SUBSCRIPTIONS_PATH} element={<AuthenticatedPaths><AccountSubscriptions /></AuthenticatedPaths>} />
      </Routes>
    </>
  );
};

export default RoutePaths;
