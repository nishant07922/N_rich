import React, { useState, useEffect } from 'react'
import {
    CAlert,
    CCol,
    CForm,
    CButton,
    CSpinner,
    CFormInput,

} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
import axios from 'axios'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

const RolesEdit = () => {

    const [validated, setValidated] = useState(false)
    const [role, setRole] = useState(false)
    const [roleId, setRoleId] = useState()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [afterSubmit, setAfterSubmit] = useState(false)
    const navigate = useNavigate()
    const { role_id } = useParams()
    const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))

    const onChangeRole = (e) => {
        setRole(e.target.value)
    }

    useEffect(() => {
        axios.get('http://localhost/nrich/public/api/roles/' + role_id,
            {
                headers: {
                    'roleId': tokenString.data.roleId,
                }
            })
            .then((res) => {
                setRole(res.data.name)
                setRoleId(res.data.id)
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
            axios.patch('http://localhost/nrich/public/api/roles/' + role_id, {
                role: role
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
                            navigate('/roles/edit/' + roleId)
                        } else if (afterSubmit === 'exit') {
                            navigate('/roles')
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
            role ?
                <>
                    <h1>Edit Roles</h1>
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
                            <CFormInput
                                onChange={onChangeRole}
                                defaultValue={role}
                                type="text"
                                aria-describedby="validationCustomFeedback"
                                feedbackInvalid="Please provide a valid name."
                                id="role"
                                label="Role"
                                required
                            />
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

export default RolesEdit
