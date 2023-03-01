import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import secureLocalStorage from "react-secure-storage"

// routes config
import routes from '../routes'

const AppContent = () => {
  const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))

  let permissionsArr = [];
  if(tokenString != null){
    permissionsArr = tokenString.permissions
  }

  permissionsArr.forEach((permission_obj ,index) => {
    permissionsArr[index] = permission_obj.name
  })
  // console.log(permissionsArr.includes("edit rolespermission"))
  
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            
            return (
              route.element && (permissionsArr.includes(route.permission)) ?(
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              ):(
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<Navigate to="/login" replace/>}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
