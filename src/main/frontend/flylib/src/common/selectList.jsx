import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./selectList.css"
export default function SelectList ({endpoint, setSelectOptionValue}) {
    // Auth
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Available data for selectlist
    const [selectListData, setSelectListData] = useState([]);

    //Get data from DB
    useEffect(() => {
        axios
            .get(`/api/${endpoint}`, config)
            .then((response) => {
                setSelectListData(response.data);
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    return(
        <select className="select-type"
                onChange={e => setSelectOptionValue(e.target.value)}
        >
            {selectListData.map((type) =>
                <option key={type.id} value={type.name}>{type.name}</option>
            )}
        </select>
    )

}