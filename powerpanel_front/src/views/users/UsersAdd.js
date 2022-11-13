import React, { useState } from 'react'
import {
    CAlert,
    CCol,
    CForm,
    CButton,
    CFormInput,

} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
import SelectRole from './SelectRole';
import { useNavigate } from 'react-router-dom'
import apiClient from 'src/apiclients/apiClient';

const UsersAdd = () => {

    const [validated, setValidated] = useState(false)
    const [user, setUser] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [roleId, setRoleId] = useState()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [afterSubmit, setAfterSubmit] = useState(false)
    const navigate = useNavigate()

    const onChangeUser = (e) => {
        setUser(e.target.value)
    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangeRoleId = (e) => {
        setRoleId(e.target.value)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const navigateEdit = () => {
        setAfterSubmit('edit')
    }
    const navigateExit = () => {
        setAfterSubmit('exit')
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            setShowAlert(false)
        } else {
            apiClient.post('/users', {
                user: user,
                email: email,
                password:password,
                roleId: roleId
            })
                .then((res) => {
                    if ('error_message' in res.data) {
                        setSuccess(false)
                        setError(res.data.error_message)
                        setShowAlert(true)
                        setTimeout(function () {
                            setShowAlert(false)
                        }, 5000)

                    } else {
                        setError(false)
                        setSuccess(res.data)
                        setShowAlert(true)
                        setTimeout(function () {
                            setShowAlert(false)
                        }, 3000)

                        if (afterSubmit === 'edit') {
                            navigate('/users/edit/' + res.data.data.id)
                        } else if (afterSubmit === 'exit') {
                            navigate('/users')
                        }
                    }
                })
                .catch(function (error) {
                    setSuccess(false)
                    setError("No Internet Connection.")
                    setShowAlert(true)
                    setTimeout(function () {
                        setShowAlert(false)
                    }, 5000)
                });

        }

        setValidated(true)

    }
    return (
        <>
            <h1>Add Users</h1>
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
                        <CFormInput
                            onChange={onChangePassword}
                            defaultValue={password}
                            type="password"
                            aria-describedby="validationCustomFeedback"
                            feedbackInvalid="Please provide a valid password."
                            id="password"
                            label="Password"
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
                        <CButton onClick={navigateExit} color="primary" type="submit">
                            Save and exit
                        </CButton>
                    </div>
                </CCol>
            </CForm>
        </>
    )
}

export default UsersAdd
