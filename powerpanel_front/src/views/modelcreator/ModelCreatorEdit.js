import React, { useState, useEffect } from 'react'
import {
    CAlert,
    CCol,
    CForm,
    CButton,
    CSpinner,
    CFormInput,
    CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import apiClient from 'src/apiclients/apiClient'
import SelectRole from './SelectRole';

const UsersEdit = () => {

    const [validated, setValidated] = useState(false)
    const [user, setUser] = useState(false)
    const [email, setEmail] = useState(false)
    const [roleId, setRoleId] = useState(false)
    const [userId, setUserId] = useState()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [afterSubmit, setAfterSubmit] = useState(false)
    const navigate = useNavigate()
    const { user_id } = useParams()
    const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))

    const onChangeUser = (e) => {
        setUser(e.target.value)
    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangeRoleId = (e) => {
        setRoleId(e.target.value)
    }

    useEffect(() => {
        apiClient.get('/users/' + user_id)
            .then((res) => {
                setUser(res.data.name)
                setEmail(res.data.email)
                setRoleId(res.data.roleId)
                setUserId(res.data.id)
                setIsError(false)
            })
            .catch(function (error) {
                setIsError(true)
            })
            .finally(function () {
                setLoading(false)
            });
    }, [])

    const navigateEdit = () => {
        setAfterSubmit('edit')
    }
    const navigateBack = () => {
        setAfterSubmit('exit')
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            setShowAlert(false)
        } else {
            apiClient.patch('/users/' + user_id, {
                user: user,
                email: email,
                roleId: roleId
            })
                .then((res) => {
                    if ('error_message' in res.data) {
                        setSuccess(false)
                        setError(error.response.data.message)
                        setShowAlert(true)
                        setTimeout(function () {
                            setShowAlert(false)
                        }, 5000)
                    } else {
                        setError(false)
                        setSuccess(res.data.success_message)
                        setShowAlert(true)
                        setTimeout(function () {
                            setShowAlert(false)
                        }, 3000)

                        if (afterSubmit === 'edit') {
                            navigate('/users/edit/' + userId)
                        } else if (afterSubmit === 'exit') {
                            navigate('/users')
                        }
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
    return (
        loading ? <CSpinner color="light" /> :
            !isError ?
                <>
                    <h1>Edit Users</h1>
                    {isError && <h4>No Internet Connection.</h4>}
                    {showAlert && <CAlert color={error ? "danger" : "success"} className="d-flex align-items-center">
                        <CIcon icon={error ? cilWarning : cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
                        <div>
                            {error ? error : success}
                        </div>
                    </CAlert>}

                    <CForm
                        className="row g-3 needs-validation"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <CCol md={8}>
                            <div className="mb-3">
                                <CFormInput
                                    onChange={onChangeUser}
                                    defaultValue={user}
                                    type="text"
                                    aria-describedby="validationCustomFeedback"
                                    feedbackInvalid="Please provide a valid name."
                                    id="user"
                                    label="Name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <CFormInput
                                    onChange={onChangeEmail}
                                    defaultValue={email}
                                    type="email"
                                    aria-describedby="validationCustomFeedback"
                                    feedbackInvalid="Please provide a valid email."
                                    id="email"
                                    label="Email"
                                    required
                                />
                            </div>
                            <div className="mb-3">

                                <SelectRole onChange={onChangeRoleId}
                                    defaultroleId={roleId}></SelectRole>
                            </div>
                        </CCol>


                        <CCol xs={12}>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <CButton onClick={navigateEdit} color="primary" type="submit">
                                    Save and keep editing
                                </CButton>
                                <CButton onClick={navigateBack} color="primary" type="submit">
                                    Save and exit
                                </CButton>
                            </div>
                        </CCol>
                    </CForm>
                </>
                : <>
                    <Navigate to="/404" replace />
                </>
    )
}

export default UsersEdit
