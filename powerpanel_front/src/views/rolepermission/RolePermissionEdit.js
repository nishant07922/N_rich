import React, { useState, useEffect } from 'react'
import {
    CAlert,
    CCol,
    CForm,
    CButton,
    CSpinner,
    CFormInput,
    CFormCheck,

} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
import apiClient from 'src/apiclients/apiClient';
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

const RolePermissionEdit = () => {

    const [validated, setValidated] = useState(false)
    const [rolepermission, setRolePermission] = useState(false)
    const [rolepermissionId, setRolePermissionId] = useState()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [afterSubmit, setAfterSubmit] = useState(false)
    const navigate = useNavigate()
    const { role_permission_id } = useParams()
    const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))
    const [inputFields, setInputFields] = useState([])

    const onChangeRole = (e) => {
        setRolePermission(e.target.value)
    }

    useEffect(() => {

        apiClient.get('/rolepermission/' + role_permission_id)
            .then((res) => {
                setRolePermission(res.data)
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

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        const dataObj = {
            name: event.target.name,
            permission_id: event.target.value,
            isChecked: event.target.checked
        };
        data.push(dataObj)
        setInputFields(data)

    }

    const handleSubmit = (event) => {

        event.preventDefault()
        event.stopPropagation()

        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            setShowAlert(false)
        } else {
            apiClient.patch('/rolepermission/' + role_permission_id,
                {
                    rolepermission: inputFields
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
                            navigate('/rolepermission/edit/' + role_permission_id)
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
            rolepermission ?
                <>
                    <h1>Edit RolePermission</h1>
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
                        {
                            Object.entries(rolepermission).map((item, index) => {
                                return <CCol md={3} key={index}>
                                    <h6>{item[0]}</h6>

                                    {item[1].map((item, index) => {
                                        return <CFormCheck key={item.id} defaultChecked={item.roleHasPermission} name={item.name} value={item.id} onChange={event => handleFormChange(index, event)} label={item.name} />
                                    })}

                                </CCol>
                            })
                        }

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

export default RolePermissionEdit
