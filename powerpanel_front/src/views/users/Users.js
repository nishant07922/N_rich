import React, { useState, useMemo, useEffect } from 'react'
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilXCircle, cilPencil } from '@coreui/icons'
import apiClient from 'src/apiclients/apiClient'
import { Link } from 'react-router-dom'
import secureLocalStorage from "react-secure-storage"
import Pagination from 'src/components/pagination/Pagination'

const Users = () => {

  const [PageSize, setPageSize] = useState(100)
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [namesearch, setNamesearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))
  const [currentPage, setCurrentPage] = useState(0)

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    if (!loading) {
      return users.slice(firstPageIndex, lastPageIndex);
    } else {
      return [];
    }
  }, [currentPage, namesearch, refresh, PageSize, users]);

  useEffect(() => {

    apiClient.get('/users',
      {
        headers: {
          'filters': JSON.stringify(tablefilters)
        }
      }
    )
      .then((res) => {
        setUsers(res.data)
        setCurrentPage(1)
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

  const deleteSelectedId = () => {
    apiClient.delete('/users/' + JSON.stringify(selectedIds))
      .then((res) => {
        setRefresh((prev) => { return prev + 1 })
      })
      .catch(function (error) {
        setShowAlert(true)
        setTimeout(function () {
          setShowAlert(false)
        }, 15000)
      })
  }

  const deleteId = (e) => {
    apiClient.delete('/users/' + e.target.getAttribute('data-value'))
      .then((res) => {
        setRefresh((prev) => { return prev + 1 })
      })
      .catch(function (error) {
        setShowAlert(true)
        setTimeout(function () {
          setShowAlert(false)
        }, 15000)
      })
  }

  var tablefilters = { name_search: namesearch };

  const refreshTable = () => {
    setRefresh((prev) => { return prev + 1 })
  }

  const nameSearchChange = (e) => {
    setNamesearch(e.target.value)
  }

  function removeDuplicates(arr) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }

  const handleSelectChange = event => {

    if (event.target.checked) {

      var arrSelected = [...selectedIds]
      arrSelected.push(event.target.value)
      setSelectedIds(arrSelected)

    } else {

      var arrSelected = [...selectedIds]
      arrSelected = arrSelected.filter(function (value) {
        return value != event.target.value
      })

      setSelectedIds(arrSelected)
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
            <CFormSelect size="md" onChange={(e) => { setPageSize(e.target.value) }} className="mb-3" aria-label="Small select example">
              <option value="100">Results length  100</option>
              <option value="80">Results length  80</option>
              <option value="50">Results length  50</option>
              <option value="30">Results length  30</option>
              <option value="20">Results length  20</option>
              <option value="10">Results length  10</option>
            </CFormSelect>
          </CCol>
          <CCol sm={7}>{users.length > PageSize ? "Showing Results " + PageSize + " out of " + users.length : "Showing All " + users.length + " Results"}</CCol>
          <CCol sm={6} md={1}>
            <CButton color="dark" shape="rounded-pill" onClick={refreshTable}>
              Refresh
            </CButton>
          </CCol>
          <CCol xs={6} md={2}>
            <CFormInput type="text" placeholder="Search By User" aria-label="Search By User" onKeyUp={nameSearchChange} />
          </CCol>
        </CRow>

        < CTable >
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Select</CTableHeaderCell>
              <CTableHeaderCell scope="col">User</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created</CTableHeaderCell>
              <CTableHeaderCell scope="col">Last Updated</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {
              users.length > 0 ?
                currentTableData.map((item, index) => {
                  return <CTableRow key={item.id}>
                    <CTableHeaderCell scope="row">
                      <CFormCheck onChange={handleSelectChange} value={item.id} label=""></CFormCheck>
                    </CTableHeaderCell>
                    <CTableDataCell>
                      <Link to={"edit/" + item.id}>
                        {item.name}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.roles.name}
                    </CTableDataCell>
                    <CTableDataCell>{new Date(item.created_at).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{new Date(item.updated_at).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilXCircle} data-value={item.id} onClick={deleteId} className="flex-shrink-0 me-2" width={24} height={24} />
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

        {currentTableData.length > 0 &&
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={users.length}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)}
          />
        }

        <CRow className="justify-content-between">
          <CCol xs={10}>
            <CButton color="danger" onClick={deleteSelectedId} shape="rounded-pill">
              Delete Selected Users
            </CButton>
          </CCol>
          <CCol xs={2}>
            <Link to="add">
              <CButton color="primary" shape="rounded-pill">
                Add User
              </CButton>
            </Link>
          </CCol>
        </CRow>

      </>

  )
}

export default Users
