import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import Select from 'react-select';




export default function CardOrdonnance() {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);


  const [selectedId,setSelectedId]= useState([]);
  const [medicaments, setMedicaments] = useState([]); 



  useEffect(() => {
    apiInstance
      .get('/api/medicaments')
      .then((response) => {
        setMedicaments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  



const handleChangeSearch = (searchValue) => {
  medicaments.filter((medicament) => {
  const fullName = ` ${medicament.nom} `;
  return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });
};

 
  

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <br></br>
      <div className="rounded-t bg-white mb-0 px-6 py-6">
         <Select
          className="w-1/2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"  
            placeholder="Sélectionner un médicament"
            options={medicaments.map((medicament) => ({
              value: medicament.id_medicament,
              label: ` ${medicament.nom}`,
            }))}
            onChange={(selectedOption) => {
              setSelectedId(selectedOption.value);
            }}
            onInputChange={(inputValue) => handleChangeSearch(inputValue)}
            isSearchable
          />
          <i className="fas fa-download"></i>
          <br></br>
          <div style={{display:'flex'}}>
            <div style={{flex:'1'}}>
              <table>
              <tr>
                <td>
                  <input class="number" type="button" value="1" id="button-1" onclick="btm(1)"/>
                </td>
                <td>
                  <input class="number" type="button" value="2" id="button-2" onclick="btm(2)"/>
                </td>
                <td>
                  <input class="number" type="button" value="3" id="button-3" onclick="btm(3)"/>
                </td>
                
              </tr>

              <tr>
                <td>
                  <input class="number" type="button" value="4" id="button-4" onclick="btm(4)"/>
                </td>
                <td>
                  <input class="number" type="button" value="5" id="button-5" onclick="btm(5)"/>
                </td>
                <td>
                  <input class="number" type="button" value="6" id="button-6" onclick="btm(6)"/>
                </td>
                
              </tr>

              <tr>
                <td>
                  <input class="number" type="button" value="7" id="button-7" onclick="btm(7)"/>
                </td>
                <td>
                  <input class="number" type="button" value="8" id="button-8" onclick="btm(8)"/>
                </td>
                <td>
                  <input class="number" type="button" value="9" id="button-9" onclick="btm(9)"/>
                </td>
                
              </tr>

              <tr>
                <td>
                  <input class="number" type="button" value="1/4" id="button-1/4" onclick=""/>
                </td>
                <td>
                  <input class="number" type="button" value="1/2" id="button-1/2" onclick=""/>
                </td>
                <td>
                  <input class="number" type="button" value="3/4" id="button-3/4" onclick=""/>
                </td>      
              </tr>

              <tr>
                <td colSpan="2">
                  <input class="number1" type="button" value="0" id="button-0" onclick=""/>
                </td>
                <td>
                  <input class="number" type="button" value="." id="button-." onclick=""/>
                </td>
                    
              </tr>

            </table>
            </div>
            <div style={{flex:'1'}}>
             <p style={{marginLeft:'-9cm'}}>Nombre:</p>
            <div className="ec">
                matin: <input type="text" />
                matin: <input type="text" />
                soir: <input type="text" />
            </div>

            <p style={{marginLeft:'-9cm'}}>Quand:</p>
            <div className="ec">
            <select>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>

            </div>


            </div>

        </div>
      </div>
   
    </div>

  );
}
