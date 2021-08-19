import React from "react";
const Dashboard = React.lazy(() => import("./Timespace/Dashboard"));

const UserManagement = React.lazy(() => import("./Timespace/Users/Active Users/"));
const ExpiredUser = React.lazy(() => import("./Timespace/Users/ExpiredUser"));
const PendingUser = React.lazy(() => import("./Timespace/Users/Pending User/"));
const InactiveUser = React.lazy(() => import("./Timespace/Users/InActive Users"));
const DeletedUser = React.lazy(() => import("./Timespace/Users/DeletedUser"));
const UserFeedbacks = React.lazy(() => import("./Timespace/Users/UserFeedbacks"));

const CalenderManagement = React.lazy(() => import("./Timespace/Calendar Management"));

const SpaceIcon = React.lazy(() => import("./Timespace/Config Center/SpaceIcon"));
const LanguageManagement = React.lazy(() => import("./Timespace/Config Center/LanguageManagement"));
const LocationManagement = React.lazy(() => import("./Timespace/Config Center/LocationManagement"));

const Subscription = React.lazy(() => import("./Timespace/Subscriptions/SubscriptionPlan"));

const Settings = React.lazy(() => import("./Timespace/Settings/index.js"));

const Toaster = React.lazy(() => import("./views/notifications/toaster/Toaster"));
const Tables = React.lazy(() => import("./views/base/tables/Tables"));
const Breadcrumbs = React.lazy(() => import("./views/base/breadcrumbs/Breadcrumbs"));
const Jumbotrons = React.lazy(() => import("./views/base/jumbotrons/Jumbotrons"));
const ListGroups = React.lazy(() => import("./views/base/list-groups/ListGroups"));
const Navbars = React.lazy(() => import("./views/base/navbars/Navbars"));
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(() => import("./views/base/paginations/Pagnations"));
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const ProgressBar = React.lazy(() => import("./views/base/progress-bar/ProgressBar"));
const Switches = React.lazy(() => import("./views/base/switches/Switches"));
const Tabs = React.lazy(() => import("./views/base/tabs/Tabs"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));
const BrandButtons = React.lazy(() => import("./views/buttons/brand-buttons/BrandButtons"));
const ButtonDropdowns = React.lazy(() => import("./views/buttons/button-dropdowns/ButtonDropdowns"));
const ButtonGroups = React.lazy(() => import("./views/buttons/button-groups/ButtonGroups"));
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const Charts = React.lazy(() => import("./views/charts/Charts"));
const CoreUIIcons = React.lazy(() => import("./views/icons/coreui-icons/CoreUIIcons"));
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(() => import("./views/theme/typography/Typography"));
const Widgets = React.lazy(() => import("./views/widgets/Widgets"));
const Users = React.lazy(() => import("./Timespace/Users/Users"));
const User = React.lazy(() => import("./Timespace/Users/User"));
const NotificationManagement = React.lazy(() => import("./views/NotificationManagement"));
const ManageColors = React.lazy(() => import("./Timespace/Config Center/ManageColors"));
// const LocalCalender = React.lazy(() => import("./views/LocalCalendar/LocalCalender"));
const EventList = React.lazy(() => import("./views/EventList"));


const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/userManagement", exact: true, name: "User Management", component: UserManagement },
  { path: "/userManagement/activeUsers", exact: true, name: "Active Users", component: UserManagement },
  { path: "/userManagement/pendingUsers", exact: true, name: "Pending Users", component: PendingUser },
  { path: "/userManagement/expiredUsers", exact: true, name: "Expired Users", component: ExpiredUser },
  { path: "/userManagement/inactiveUsers", exact: true, name: "Inactive Users", component: InactiveUser },
  { path: "/userManagement/deletedUsers", exact: true, name: "Deleted Users", component: DeletedUser },
  { path: "/userManagement/userFeedbacks", exact: true, name: "userfeedbacks", component: UserFeedbacks },
  
  { path: "/calenderManagement", exact: true, name: "Calendar Management", component: CalenderManagement },

  { path: "/configcenter/spaceicon", name: "spaceicon", component: SpaceIcon },
  { path: "/configcenter/languagemanagement", name: "languagemanagement", component: LanguageManagement },
  { path: "/configcenter/locationmanagement", name: "locationmanagement", component: LocationManagement },

  { path: "/subscription", exact: true, name: "subscription", component: Subscription },
  { path: "/settings", exact: true, name: "setting", component: Settings },
  
  { path: "/theme", name: "Theme", component: Colors, exact: true },
  { path: "/theme/colors", name: "Colors", component: Colors },
  { path: "/theme/typography", name: "Typography", component: Typography },
  { path: "/configcenter", name: "configcenter", component: SpaceIcon, exact: true },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", component: Breadcrumbs },
  { path: "/configcenter/managecolors", name: "managecolors", component: ManageColors },
  { path: "/base/jumbotrons", name: "Jumbotrons", component: Jumbotrons },
  { path: "/base/list-groups", name: "List Groups", component: ListGroups },
  { path: "/base/navbars", name: "Navbars", component: Navbars },
  { path: "/base/navs", name: "Navs", component: Navs },
  { path: "/base/paginations", name: "Paginations", component: Paginations },
  { path: "/base/popovers", name: "Popovers", component: Popovers },
  { path: "/base/progress-bar", name: "Progress Bar", component: ProgressBar },
  { path: "/base/switches", name: "Switches", component: Switches },
  { path: "/base/tables", name: "Tables", component: Tables },
  { path: "/base/tabs", name: "Tabs", component: Tabs },
  { path: "/base/tooltips", name: "Tooltips", component: Tooltips },
  { path: "/buttons", name: "Buttons", component: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", component: Buttons },
  { path: "/buttons/button-dropdowns", name: "Dropdowns", component: ButtonDropdowns },
  { path: "/buttons/button-groups", name: "Button Groups", component: ButtonGroups },
  { path: "/buttons/brand-buttons", name: "Brand Buttons", component: BrandButtons },
  { path: "/charts", name: "Charts", component: Charts },
  { path: "/icons", exact: true, name: "Icons", component: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", component: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", component: Flags },
  { path: "/icons/brands", name: "Brands", component: Brands },
  { path: "/notifications", name: "Notifications", component: Alerts, exact: true },
  { path: "/notifications/alerts", name: "Alerts", component: Alerts },
  { path: "/notifications/badges", name: "Badges", component: Badges },
  { path: "/notifications/modals", name: "Modals", component: Modals },
  { path: "/notifications/toaster", name: "Toaster", component: Toaster },
  { path: "/widgets", name: "Widgets", component: Widgets },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/users/:id", exact: true, name: "User Details", component: User },
  { path: "/notificationManagement", exact: true, name: "notificationmanagement", component: NotificationManagement },
  { path: "/eventlist/:id", exact: true, component: EventList },
  // { path: "/localCalender", exact: true, name: "localcalender", component: LocalCalender },
];

export default routes;
