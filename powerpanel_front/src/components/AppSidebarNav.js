import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes, { array } from 'prop-types'
import { useSelector } from 'react-redux'

import { CBadge } from '@coreui/react'
import secureLocalStorage from 'react-secure-storage'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))
  let permissionsArr = [];
  
  if(tokenString != null){
    permissionsArr = tokenString.permissions
  }

  permissionsArr.forEach((permission_obj ,index) => {
    permissionsArr[index] = permission_obj.name
  })

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    let permissionArr = rest.permission;
    let is_permitted = true
    
    permissionArr.forEach((item, index) => {
      if(!permissionsArr.includes(item))
      {
        is_permitted = false
      }
    })
   
   if(is_permitted){
     return (
       <Component
         {...(rest.to &&
           !rest.items && {
           component: NavLink,
         })}
         key={index}
         {...rest}
       >
         {navLink(name, icon, badge)}
       </Component>
     )
   }else{
    return
   }
  }

  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    let permissionArr = rest.permission;
    let is_permitted = false
    
    permissionArr.forEach((item, index) => {
      if(permissionsArr.includes(item))
      {
        is_permitted = true
      }
    })

    if(is_permitted){
      return (
        <Component
          idx={String(index)}
          key={index}
          toggler={navLink(name, icon)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </Component>
      )
    }else{
      return
    }
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
