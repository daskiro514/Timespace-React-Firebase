import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'User Management',
    route: '/userManagement',
    icon: 'cil-people',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Active Users',
        to: '/userManagement/activeUsers',
        icon:'cil-people'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Pending Users',
        to: '/userManagement/pendingUsers',
        icon:'cil-people'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Expired Users',
        to: '/userManagement/expiredUsers',
        icon:'cil-people'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Inactive Users',
        to: '/userManagement/inactiveUsers',
        icon:'cil-people'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Deleted Users',
        to: '/userManagement/deletedUsers',
        icon:'cil-people'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'User feedbacks',
        to: '/userManagement/userFeedbacks',
        icon:'cil-people'
      },
      
    ],
  },
 
  {
    _tag: 'CSidebarNavItem',
    name: 'Notification Management',
    to: '/notificationManagement',
    icon: 'cil-bell',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Calender Management',
    to: '/calenderManagement',
    icon: 'cil-calendar',
  },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Local Calender',
  //   to: '/localCalender',
  //   icon: 'cil-calendar',
  // },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Config Center',
    route: '/configcenter',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Spaceicon',
        to: '/configcenter/spaceicon',
        icon:'cil-settings'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Language Management',
        to: '/configcenter/languagemanagement',
        icon:''
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Location Management',
        to: '/configcenter/locationmanagement',
        icon:'cil-location-pin'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Manage Colors',
        to: '/configcenter/managecolors',
        icon:''
      },
      
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Subscription',
    to: '/subscription',
    icon: 'cil-chart-pie'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Settings',
    to: '/settings',
    icon: 'cil-settings'
  },

]

export default _nav
