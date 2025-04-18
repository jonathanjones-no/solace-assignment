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
    <main>
      <div className="s-page-title bs-lg">
        <h1 className="s-page-title--header mt16 ml16">
          Solace Advocates
        </h1>
      </div>
      <div className="mx-auto w100 wmx12">
        <div className="d-flex gy4 fd-column">
          <div className="flex--item mt16"> 
            <label className="s-label" htmlFor="search-term">Search</label>
          </div>
          <div className="flex--item">
            <p className="s-description mtn2 mb0">What are you looking for?</p>
          </div>
          <div className="flex--item mb2 bs-md">
            <input className="s-input" id="search-term" type="text" onChange={onChange} />
          </div>
          <div className="flex--item mb16">
            <button className="flex--item s-btn s-btn__outlined bs-md" onClick={onClick}>Reset Search</button>
          </div>
        </div>
        <div className="s-table-container bs-lg mb16">
          <table className="s-table s-table__stripes s-table__sm">
            <thead>
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
