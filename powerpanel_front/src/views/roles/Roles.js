import React, { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CSpinner,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CFormSwitch,
  CFormSelect,
  CButton,
  CFormInput,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilWarning, cilXCircle,cilPencil } from '@coreui/icons';
import axios from 'axios'
import { Link } from 'react-router-dom'
import secureLocalStorage from "react-secure-storage"

const Roles = () => {

  const [roles, setRoles] = useState();
  const [refresh, setRefresh] = useState(0);
  const [namesearch, setNamesearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))

  useEffect(() => {
    axios.get('http://localhost/nrich/public/api/roles',
      {
        headers: {
          'filters': JSON.stringify(tablefilters),
          'roleId': tokenString.data.roleId,
        }
      }
    )
      .then((res) => {
        setRoles(res.data)

      })
      .catch(function (error) {
        setShowAlert(true)
        setTimeout(function () {
          setShowAlert(false)
        }, 15000)
      })
      .finally(function () {
        setLoading(false)
      });
  }, [refresh, namesearch])

  var tablefilters = { name_search: namesearch };

  const refreshTable = () => {
    setRefresh((prev) => { return prev + 1 })
  }

  const nameSearchChange = (e) => {
    setNamesearch(e.target.value)
  }

  const handleSelectChange = event => {

    if (event.target.checked) {
      setSelectedIds((prev) => {
        // prev.push(event.target.value)
      })
      selectedIds.push(event.target.value)
    } else {
      setSelectedIds((prev) => {
        // prev.filter((item) => item != event.target.value)
      })
      // console.log(selectedIds)
    }
  };

  return (
    loading ? <CSpinner color="light" /> :

      <>
        {showAlert && <CAlert color={"danger"} className="d-flex align-items-center">
          <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>
            No Internet Connection.
          </div>
        </CAlert>}

        <CRow xs={{ gutter: 2 }}>
          <CCol sm={6} md={2}>
            <CFormSelect size="md" className="mb-3" aria-label="Small select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </CFormSelect>
          </CCol>
          <CCol sm={7}></CCol>
          <CCol sm={6} md={1}>
            <CButton color="dark" shape="rounded-pill" onClick={refreshTable}>
              Refresh
            </CButton>
          </CCol>
          <CCol xs={6} md={2}>
            <CFormInput type="text" placeholder="Search By Role" aria-label="Search By Role" onChange={nameSearchChange} />
          </CCol>
        </CRow>

        < CTable >
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Select</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created</CTableHeaderCell>
              <CTableHeaderCell scope="col">Last Updated</CTableHeaderCell>
              <CTableHeaderCell scope="col">Edit Permission</CTableHeaderCell>
              <CTableHeaderCell scope="col">Publish</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {
              roles.length > 0 ?
                roles.map((item, index) => {
                  return <CTableRow key={item.id}>
                    <CTableHeaderCell scope="row">
                      <CFormCheck onChange={handleSelectChange} value={item.id} label=""></CFormCheck>
                    </CTableHeaderCell>
                    <CTableDataCell>
                      <Link to={"edit/" + item.id}>
                        {item.name}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>{new Date(item.created_at).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{new Date(item.updated_at).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={"/rolepermission/edit/" + item.id}>
                        <CIcon icon={cilPencil} className="flex-shrink-0 me-2" width={24} height={24} />
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormSwitch></CFormSwitch>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilXCircle} className="flex-shrink-0 me-2" width={24} height={24} />
                    </CTableDataCell>
                  </CTableRow>
                })
                : <CTableRow>
                  <CTableHeaderCell scope="row">
                    <h3>No Match Found.</h3>
                  </CTableHeaderCell>
                </CTableRow>
            }
          </CTableBody>
        </CTable >

        <CRow className="justify-content-between">
          <CCol xs={10}>
            <CButton color="danger" shape="rounded-pill">
              Delete Role
            </CButton>
          </CCol>
          <CCol xs={2}>
            <Link to="add">
              <CButton color="primary" shape="rounded-pill">
                Add Role
              </CButton>
            </Link>
          </CCol>
        </CRow>

      </>

  )
}

export default Roles
