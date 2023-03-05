import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import apiClient from 'src/apiclients/apiClient'
import { useParams } from 'react-router';
import { dateFormat } from 'src/commonFunctions/commonFunctions'

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
};
const colstyle = {
    width: "30%"
};
const tableStyle = {
    width: "100%"
};

const Prints = ({ bill_data }) => {
    if (Object.keys(bill_data).length != 0) {
        let sub_total = 0
        let gst = 0
        let round_off = 0
        let grand_total = 0

        bill_data.fields_ids.forEach((data,index)=>{
            let one_item_total = (data.rate * data.quantity)
            sub_total += one_item_total
        });
        gst = (sub_total*9)/100;
        grand_total = (gst * 2)+ sub_total;
        
        if(Math.round(grand_total) != grand_total){
            round_off = grand_total -Math.round(grand_total);
            round_off = Math.abs(round_off)
            grand_total = Math.round(grand_total)
        }
        return (
            <>
                <div id="logo" style={{ marginBottom: '120px' }}>

                </div>
                <h1>TAX INVOICE - LABOUR</h1>
                <div id="company" className="clearfix">
                    <div>Marutinandan Tubewell</div>
                    <div>20(B) Kalakunj Soc.,<br />Ghatlodia ,<br />AH 380061 ,India .</div>
                    <div>99999999999999</div>
                    <div>GST NO : 24DBDPP7089F1ZD</div>
                    <div>marutinandantubewell2014@gmail.com</div>
                </div>
                <div id="project">
                    <div><span>BILL NO</span> {bill_data.id}</div>
                    <div><span>DATE</span> {dateFormat(bill_data.bill_date, 'dd/MM/yyyy')}</div>
                    <div><span>CLIENT</span> {bill_data.buyer_name}</div>
                    <div><span>ADDRESS</span> {bill_data.buyer_address}</div>
                    <div><span>GST NO</span> 24AGWPP7890H1ZI</div>
                    <div><span>SITE</span> Mehsana</div>
                </div>
                <main>
                    <table>
                        <thead>
                            <tr>
                                <th className="desc">SI No</th>
                                <th className="desc">DESCRIPTION</th>
                                <th style={{paddingRight: '5px' ,paddingLeft:'5px'}}>HSN CODE</th>
                                <th>PRICE</th>
                                <th style={{width: '11%'}}>QTY</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>

                            {bill_data.fields_ids.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="service">{index+1}</td>
                                        <td className="description-table">{data.description}</td>
                                        <td className="unit">{data.hsn_code}</td>
                                        <td className="unit">₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(data.rate)}</td>
                                        <td className="qty">{data.quantity} {data.quantity_unit}</td>
                                        <td className="total">₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format((data.rate * data.quantity))}.00</td>
                                    </tr>
                                );
                            })}

                            <tr className="height-row">
                                <td colSpan="5">SUBTOTAL</td>
                                <td className="total">{sub_total}</td>
                            </tr>
                            <tr className="height-row">
                                <td colSpan="5">CGST 9%</td>
                                <td className="total">{gst}</td>
                            </tr>
                            <tr className="height-row">
                                <td colSpan="5">SGST 9%</td>
                                <td className="total">{gst}</td>
                            </tr>
                            <tr className="height-row">
                                <td colSpan="5">ROUND OFF</td>
                                <td className="total">{round_off}</td>
                            </tr>
                            <tr className="height-row">
                                <td colSpan="5" className="grand total">GRAND TOTAL</td>
                                <td className="grand total">{grand_total}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div id="notices" style={{ width: '541px' }}>
                            <div className="notice">Terms & Conditions:</div>
                            <ol>
                                <li>
                                    Subject to Ahmedabad Jurisdiction.
                                </li>
                                <li>
                                    All disputes to be settle at Ahmedabad.
                                </li>
                            </ol>
                            <div className="notice">Bank Details:</div>
                            <ol>
                                <li>
                                    Subject to Ahmedabad Jurisdiction.
                                </li>
                                <li>
                                    All disputes to be settle at Ahmedabad.
                                </li>
                            </ol>
                        </div>

                        <div style={{ float: 'right', marginTop: '50px' }}>
                            <div><h6>For. MARUTINANDAN TUBEWELL</h6></div>
                            <div style={{ marginTop: '70px', textAlign: 'center' }} className="notice"><p>PROPRITAR</p></div>
                        </div>
                    </div>
                </main>
                {/* <footer>
                Invoice was created on a computer and is valid without the signature and seal.
            </footer> */}

            </>
        )
    }
};


const print = () => {
    // const string = renderToString(<Prints />);
    // const pdf = new jsPDF("p", "mm", "a4");
    //   const columns = [
    //     "SOW Creation Date",
    //     "SOW Start Date",
    //     "Project",
    //     "Last Updated",
    //     "SOW End Date"
    //   ];
    //   var rows = [
    //     [
    //       "Dec 13, 2017",
    //       "Jan 1, 2018",
    //       "ABC Connect - ABCXYZ",
    //       "Dec 13, 2017",
    //       "Dec 31, 2018"
    //     ]
    //   ];
    //   pdf.fromHTML(string);
    var doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
    });
    var content = document.getElementById("content-22");
    doc.html(content, {
        callback: function (doc) {
            console.log("in callback");
            doc.save("pdf");
        }
    });
    // pdf.save("pdf");
};

const App = () => {

    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        apiClient.get('/bill/' + id
        )
            .then((res) => {
                setData(res.data)
            })
            .catch(function (error) {
                console.log(error)
            });
    }, [])
    return (

        <>  <style>
            {`
.clearfix:after {
content: "";
display: table;
clear: both;
}

a {
color: #5D6975;
text-decoration: underline;
}

body {
position: relative;
width: 21cm;  
height: 10in; 
margin: 0 auto; 
color: #001028;
background: #FFFFFF; 
font-family: Arial, sans-serif; 
font-size: 12px; 
font-family: Arial;
}

header {
padding: 10px 0;
margin-bottom: 30px;
}

#logo {
text-align: center;
margin-bottom: 10px;
}

#logo img {
width: 90px;
}
.height-row{
    line-height: 0px;
}

h1 {
border-top: 1px solid  #5D6975;
border-bottom: 1px solid  #5D6975;
color: #5D6975;
font-size: 2.4em;
line-height: 1.4em;
font-weight: normal;
text-align: center;
margin: 0 0 20px 0;
background: url(dimension.png);
}

#project {
float: left;
}

#project span {
color: #5D6975;
text-align: right;
width: 52px;
margin-right: 10px;
display: inline-block;
font-size: 0.8em;
}

#company {
float: right;
text-align: right;
}

#project div,
#company div {
white-space: nowrap;        
}

table {
width: 100%;
border-collapse: collapse;
border-spacing: 0;
margin-bottom: 20px;
}

table tr:nth-child(2n-1) td {
background: #F5F5F5;
}

table th,
table td {
text-align: center;
}

table th {
padding: 5px 20px;
color: #5D6975;
border-bottom: 1px solid #C1CED9;
border-top: 1px solid #C1CED9;
white-space: nowrap;        
font-weight: bold;
}

table .service,
table .desc {
text-align: left;
}

.description-table{
    text-align: left;
    vertical-align: top;
    font-size: 1.1em;
}
table td {
padding: 20px;
text-align: right;
}

table td.service,
table td.desc {
vertical-align: top;
}

table td.unit,
table td.qty,
table td.total {
font-size: 1.2em;
}

table td.grand {
border-top: 1px solid #5D6975;;
}

#notices .notice {
color: #5D6975;
font-size: 1.2em;
}

footer {
color: #5D6975;
width: 100%;
height: 30px;
position: absolute;
bottom: 0;
border-top: 1px solid #C1CED9;
padding: 8px 0;
text-align: center;
}
`}
        </style>
            <div id="content-22">
                <Prints
                    bill_data={data}
                />
            </div>
            {/* <button onClick={print}>print</button> */}
        </>
    )
};

export default App;
