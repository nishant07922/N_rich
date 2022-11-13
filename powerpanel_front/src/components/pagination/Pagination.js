import React from 'react';
import { usePagination, DOTS } from './usePagination';
import {
    CPagination,
    CPaginationItem,
} from '@coreui/react'

const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <CPagination align="center" >
            {/* Left navigation arrow */}
            {/* <li
                className={classnames('pagination-item', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li> */}
            <CPaginationItem aria-label="Previous" onClick={onPrevious} disabled={currentPage === 1 ? true : false}>
                <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {paginationRange.map((pageNumber,index) => {

                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                    return <CPaginationItem className="pagination-item dots" disabled>&#8230;</CPaginationItem>;
                }

                // Render our Page Pills
                return (
                    // <li
                    //     className={classnames('pagination-item', {
                    //         selected: pageNumber === currentPage
                    //     })}
                    //     onClick={() => onPageChange(pageNumber)}
                    // >
                    //     {pageNumber}
                    // </li>
                    <CPaginationItem key={index}active={pageNumber === currentPage ? true : false} onClick={() => onPageChange(pageNumber)} >{pageNumber}</CPaginationItem>
                );
            })}
            {/*  Right Navigation arrow */}
            {/* <li
                className={classnames('pagination-item', {
                    disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li> */}
            <CPaginationItem aria-label="Next" onClick={onNext} disabled={currentPage === lastPage ? true : false}>
                <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>

        </CPagination>
    );
};

export default Pagination;