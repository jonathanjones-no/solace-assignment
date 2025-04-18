"use client";

import { useEffect, useState } from "react";
import _, {debounce} from 'lodash';
import { Advocate } from "./interface/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    })
    .catch((error) => {
      console.error("Error fetching advocates:", error);
    });
  }, []);

  const onChange = debounce((e) => {
    const searchTerm = e.target.value;
    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(advocate.yearsOfExperience).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, 300);

  const onClick = () => {
    (document.getElementById("search-term") as HTMLInputElement)!.value = '';
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">City</th>
                <th scope="col">Degree</th>
                <th scope="col">Specialties</th>
                <th scope="col">Years of Experience</th>
                <th scope="col">Phone Number</th>
             </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate: Advocate) => {
                return (
                  <tr key={advocate.id}>
                    <td>{advocate.firstName}</td>
                    <td>{advocate.lastName}</td>
                    <td>{advocate.city}</td>
                    <td>{advocate.degree}</td>
                    <td>
                      {advocate.specialties.map((s: string, index) => (
                        <div key={index}>{s}</div>
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td>{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
