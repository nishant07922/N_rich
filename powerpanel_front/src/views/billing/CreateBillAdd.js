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
    CCardBody,
    CFormTextarea
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle } from '@coreui/icons';
import { useNavigate } from 'react-router-dom'
import apiClient from 'src/apiclients/apiClient';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateBillAdd = () => {

    const [validated, setValidated] = useState(false)
    const [bill_date, setBillDate] = useState()
    const [bill_site, setBillSite] = useState()
    const [buyer_address, setBuyerAddress] = useState()
    const [buyer_gst, setBuyerGst] = useState()
    const [buyer_name, setBuyerName] = useState()
    const [fields, setFields] = useState()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [afterSubmit, setAfterSubmit] = useState(false)
    const navigate = useNavigate()


    const [formValues, setFormValues] = useState([{ description: "", hsn_code: "", quantity: "", rate: "", quantity_unit: "" }])
    const [formValuesForInputValidations, setFormValuesForInputValidations] = useState([{ input_name: "" }])

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }

    let addFormFields = () => {
        setFormValues([...formValues, { description: "", hsn_code: "", quantity: "", rate: "", quantity_unit: "" }])
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

    const onChangeBillDate = (value) => {
        setBillDate(value)
    }
    const onChangeBillSite = (e) => {
        setBillSite(e.target.value)
    }
    const onChangeBuyerGst = (e) => {
        setBuyerGst(e.target.value)
    }
    const onChangeBuyerAddress = (e) => {
        setBuyerAddress(e.target.value)
    }
    const onChangeBuyerName = (e) => {
        setBuyerName(e.target.value)
    }
    const onProductChange = (index, option) => {
        let newFormValues = [...formValues];
        newFormValues[index].description = option.text;
        newFormValues[index].hsn_code = option.dataset.hsn_code;
        newFormValues[index].quantity_unit = option.dataset.quantity_unit;
        setFormValues(newFormValues);
    }

    const navigateEdit = () => {
        setAfterSubmit('edit')
    }
    const navigateExit = () => {
        setAfterSubmit('exit')
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const form = event.currentTarget
        var date = new Date(bill_date);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        date = year + '-' + (month + 1) + '-' + day;

        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            setShowAlert(false)
        } else {
            apiClient.post('/bill', {
                bill_date: date,
                bill_site: bill_site,
                buyer_address: buyer_address,
                buyer_name: buyer_name,
                buyer_gst: buyer_gst,
                fields: formValues,
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
                            navigate('/bill/edit/' + res.data.data.id)
                        } else if (afterSubmit === 'exit') {
                            navigate('/bill')
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
            <h1>Add Bill</h1>
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
                <CCard className="mb-12">
                    <CCardHeader>
                        <strong>Bill Fields</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>

                            <CCol md={2}>
                                <div className="mb-3">
                                    <label>Bill Date</label>
                                    <DatePicker selected={bill_date} onChange={(date) => onChangeBillDate(date)} />
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="mb-3">
                                    <CFormInput
                                        onChange={e => onChangeBillSite(e)}
                                        name="bill_site"
                                        feedbackInvalid="Please select a valid Input Name."
                                        label="Bill Site"
                                        value={bill_site}
                                        required
                                    />
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="mb-3">
                                    <CFormInput
                                        onChange={e => onChangeBuyerName(e)}
                                        name="buyer_name"
                                        feedbackInvalid="Please select a valid Input Name."
                                        label="Buyer Name"
                                        value={buyer_name}
                                        required
                                    />
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="mb-3">
                                    <CFormTextarea
                                        onChange={e => onChangeBuyerAddress(e)}
                                        name="buyer_address"
                                        feedbackInvalid="Please select a valid Input Name."
                                        label="Buyer Address"
                                        value={buyer_address}
                                        required
                                    />
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="mb-3">
                                    <CFormInput
                                        onChange={e => onChangeBuyerGst(e)}
                                        name="buyer_gst"
                                        feedbackInvalid="Please select a valid Input Name."
                                        label="Buyer Gst"
                                        value={buyer_gst}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
                {formValues.map((element, index) => (
                    <React.Fragment key={index}>

                        <CCard className="mb-12">
                            <CCardHeader>
                                <strong>Add Fields</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol md={8}>

                                        <div className="mb-3">
                                            <CFormSelect
                                                onChange={e => [handleChange(index, e), onProductChange(index, e.nativeEvent.target[e.target.selectedIndex])]}
                                                name="product_id"
                                                feedbackInvalid="Please select a valid Product."
                                                id={"product_id_" + index}
                                                label="Product"
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                <option value="1" data-hsn_code="995434" data-quantity_unit="Ft">10&quot; DIA M.S TUBEWELL DRILLING, AND REMING AND WASHING LABOUR</option>
                                                <option value="2" data-hsn_code="" data-quantity_unit="JOB">GRAVEL PACKING & CLAY BALL PACKING</option>

                                            </CFormSelect>
                                        </div>
                                    </CCol>
                                    <CCol md={8}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="description"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id={"description_" + index}
                                                label="Description"
                                                value={formValues[index].description}
                                                required
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="hsn_code"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id="hsn_code"
                                                label="Hsn Code"
                                                value={formValues[index].hsn_code}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="quantity"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id="quantity"
                                                label="Quantity"
                                                required
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="quantity_unit"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id="quantity_unit"
                                                label="Quantity Unit"
                                                value={formValues[index].quantity_unit}
                                                required
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormInput
                                                onChange={e => handleChange(index, e)}
                                                name="rate"
                                                feedbackInvalid="Please select a valid Input Name."
                                                id="rate"
                                                label="$ Rate"
                                                required
                                            />
                                        </div>

                                    </CCol>

                                    <CCol md={2}>
                                        {
                                            index ?
                                                <button type="button" style={{ marginTop: "32px" }} className="btn btn-danger" onClick={() => removeFormFields(index)}>X Remove</button>
                                                : null
                                        }
                                    </CCol>
                                </CRow>
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

export default CreateBillAdd
