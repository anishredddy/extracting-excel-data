"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, Row } from "react-bootstrap";

export default function MyNextJsExcelSheet() {
  const [items, setItems] = useState([]);
  const [subjectsArray, setSubjectsArray] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, {
          type: "buffer",
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        console.log(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
      extractSubjects(d);
    });
  };

  const extractSubjects = (data) => {
    const subjectsSet = new Set();

    data.forEach((rowData) => {
      Object.keys(rowData).forEach((day) => {
        // Skip non-day properties (e.g., index)
        if (["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"].includes(day)) {
          const subject = rowData[day];
          if (subject) {
            subjectsSet.add(subject);
          }
        }
      });
    });

    const subjectsArray = Array.from(subjectsSet);
    setSubjectsArray(subjectsArray);
    console.log("Unique Subjects:", subjectsArray);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <br />
      <br />
      <br />

      <Row>
        <Col lg={12}>
          <h3>The Data of The Uploaded Excel Sheet</h3>
          <Table striped bordered hover variant="warning">
            <thead>
              <tr>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thurs</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
              </tr>
            </thead>
            <tbody>
              {items.map((rowData, index) => (
                <tr key={index}>
                  <td>{rowData.Mon}</td>
                  <td>{rowData.Tue}</td>
                  <td>{rowData.Wed}</td>
                  <td>{rowData.Thurs}</td>
                  <td>{rowData.Fri}</td>
                  <td>{rowData.Sat}</td>
                  <td>{rowData.Sun}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <div>
        <p className="text text-5xl font-bold text-underline px-4 ">
          Individual Subjects
        </p>
        <div className="flex">
          {subjectsArray.map((subject, index) => (
            <p key={index} className="text text-md font-bold text-green px-3">
              {subject}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
