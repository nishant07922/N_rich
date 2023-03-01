import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CAlert,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilWarning, cilCheckCircle } from '@coreui/icons'
import secureLocalStorage from "react-secure-storage"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

  const [validated, setValidated] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [password, setPassword] = useState(false)
  const [email, setEmail] = useState(false)
  const navigate = useNavigate()
  
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      axios.post('http://localhost/nrich/public/api/user-login', {
        email: email,
        password: password
      })
        .then((res) => {
          
          if (!res.data.success || res.data.status === 'failed') {
            setSuccess(false)
            setError(res.data.message)
            setShowAlert(true)
            setTimeout(function () {
              setShowAlert(false)
            }, 5000)
          } else {
            setError(false)
            setSuccess(res.data.message)
            setShowAlert(true)
            setTimeout(function () {
              setShowAlert(false)
            }, 3000)
            secureLocalStorage.setItem('loginUser', JSON.stringify({
              "isLoggedIn": true,
              "data": res.data.data,
              "permissions":res.data.permissions
            }))
          
            navigate('/dashboard')
          }
        })
        .catch(function (error) {
          setSuccess(false)
          setError(error.response.data.message)
          setShowAlert(true)
          setTimeout(function () {
            setShowAlert(false)
          }, 5000)
        });
    }
    setValidated(true)
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {showAlert && <CAlert color={error ? "danger" : "success"} className="d-flex align-items-center">
                    <CIcon icon={error ? cilWarning : cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
                    <div>
                      {error ? error : success}
                    </div>
                  </CAlert>}
                  <CForm onSubmit={handleSubmit} noValidate className="needs-validation" validated={validated}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3 has-validation">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput onChange={onChangeEmail} type="text" aria-describedby="Username" feedbackInvalid="Please choose a username." placeholder="Username" autoComplete="username" required />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={onChangePassword}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        feedbackInvalid="Please choose a password."
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
