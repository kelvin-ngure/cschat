'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../util/api';
import Constants from '@/util/constants';

const Customer = () => {
    const searchParams = useSearchParams()
    const [userId, userType] = searchParams.values()
    const [userName, setUserName] = useState("")
    

    useEffect(() => {
       fetchCustomerDetails()
    }, [userId]);

    const fetchCustomerDetails = async () => {
        const response = await api.get(`${Constants.CUSTOMER_ENDPOINT}/${userId}`)
        console.log(response)
        const data = await response.data
        const name = await data.name
        setUserName(name)
    }

    return (
        <div className="bg-blue-100 text-blue-101 h-screen flex flex-col">
           <p>Customer details fetched</p>
           <p>name: {userName}</p>
        </div>
    );
}

export default Customer;
