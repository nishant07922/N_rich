import React, { useState } from 'react'
import {
    CAlert,
    CCol,
    CForm,
    CButton,
    CFormInput,
    CFormSelect,
    CRow,
    CCard,
    CCardHeader,
    CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
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


    const [formValues, setFormValues] = useState([{ field_type: "", input_name: "", input_placeholder: "", column_space: "" }])
    const [formValuesForInputValidations, setFormValuesForInputValidations] = useState([{ input_name: "" }])

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);

    }

    let addFormFields = () => {
        setFormValues([...formValues, { field_type: "", input_name: "", input_placeholder: "", column_space: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    //Form Changes for Input Start
    let handleChangeForInputValidations = (i, e) => {
        let newFormValues = [...formValuesForInputValidations];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValuesForInputValidations(newFormValues);
    }

    let addFormFieldsForInputValidations = () => {
        setFormValuesForInputValidations([...formValuesForInputValidations, { input_name: "" }])
    }

    let removeFormFieldsForInputValidations = (i) => {
        let newFormValues = [...formValuesForInputValidations];
        newFormValues.splice(i, 1);
        setFormValuesForInputValidations(newFormValues)
    }
    //Form Changes for Input End

    const onChangeUser = (e) => {
        setUser(e.target.value)
    }

    const onChangeFieldType = (e) => {
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
                password: password,
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
            <h1>Add Model</h1>
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

                {formValues.map((element, index) => (
                    <React.Fragment key={index}>
                        <CCard className="mb-12">
                            <CCardHeader>
                                <strong>Add Fields</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CCol md={8}>

                                    <div className="mb-3">

                                        <CFormSelect
                                            onChange={e => handleChange(index, e)}
                                            name="field_type"
                                            feedbackInvalid="Please select a valid Field Type."
                                            id="field_type"
                                            label="Field Type"
                                            required
                                        >
                                            <option value="">Select Field Type</option>
                                            <option value="input">Input</option>

                                        </CFormSelect>

                                    </div>

                                </CCol>
                                {/* Input From start */}
                                <CRow>
                                    <CCol md={4} key={index}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="input_name"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id="input_name"
                                                label="Input Name"
                                                required
                                            />
                                        </div>

                                    </CCol>
                                    <CCol md={4} >
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="input_placeholder"
                                                feedbackInvalid="Please select a valid Input PlaceHolder."
                                                id="input_placeholder"
                                                label="Input Placeholder"
                                                required
                                            />
                                        </div>

                                    </CCol>
                                    <CCol md={4} >
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="column_space"
                                                feedbackInvalid="Please select a valid Input Column Space."
                                                id="column_space"
                                                label="Input Column Space"
                                                required
                                            />
                                        </div>

                                    </CCol>
                                    <CRow>
                                        {formValuesForInputValidations.map((element, index) => (
                                            <React.Fragment key={index}>
                                                <CCol md={4} key={index}>
                                                    <CFormSelect
                                                        onChange={e => handleChangeForInputValidations(index, e)}
                                                        name="field_type"
                                                        feedbackInvalid="Please select a valid Field Type."
                                                        id="field_type"
                                                        label="Field Type"
                                                        required
                                                    >
                                                        <option value="">Select Field Type</option>
                                                        <option value="input">Input</option>

                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={4} key={index}>
                                                    <CFormSelect
                                                        onChange={e => handleChangeForInputValidations(index, e)}
                                                        name="field_type"
                                                        feedbackInvalid="Please select a valid Field Type."
                                                        id="field_type"
                                                        label="Field Type"
                                                        required
                                                    >
                                                        <option value="">Select Field Type</option>
                                                        <option value="input">Input</option>

                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={2} key={index}>
                                                    {
                                                        index ?
                                                            <button type="button" style={{ marginTop: "32px" }} className="btn btn-danger" onClick={() => removeFormFieldsForInputValidations(index)}>X Remove</button>
                                                            : null
                                                    }
                                                </CCol>
                                            </React.Fragment>
                                        ))}

                                        <CCol md={2}>
                                            <button className="btn btn-info" style={{ marginTop: "31px" }} type="button" onClick={() => addFormFieldsForInputValidations()}>+Add Validations</button>
                                        </CCol>
                                    </CRow>
                                </CRow>
                                {/* input Form end */}

                                <CCol md={2}>
                                    {
                                        index ?
                                            <button type="button" style={{ marginTop: "32px" }} className="btn btn-danger" onClick={() => removeFormFields(index)}>X Remove</button>
                                            : null
                                    }
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </React.Fragment>
                ))}

                <CCol xs={12}>
                    <button className="btn btn-info" type="button" onClick={() => addFormFields()}>+Add</button>
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
