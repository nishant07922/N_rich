import React, { useState, useEffect } from 'react'
import {
    CFormSelect,
    CSpinner
} from '@coreui/react'
import apiClient from 'src/apiclients/apiClient'
import { capitalizeFirstLetter } from 'src/commonFunctions/commonFunctions'

const SelectRole = (props) => {

    const [selectRole, setSelectRole] = useState([])
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        apiClient.get('/selectroles')
            .then((res) => {
                setSelectRole(res.data)
            })
            .catch(function (error) {
                setIsError(true)
            })
            .finally(function () {
                setLoading(false)
            });
    }, [])

    return (
        loading || isError == true ? <CSpinner color="light" /> : <CFormSelect
            onChange={props.onChange}
            defaultValue={props.defaultroleId}
            feedbackInvalid="Please select a valid role."
            id="role_id"
            label="Role"
            required
        >
            <option>Select Role</option>
            {selectRole.map((item) => {
                return <option key={item.id} value={item.id}>{capitalizeFirstLetter(item.name)}</option>
            })}
        </CFormSelect>



    )
}
export default SelectRole