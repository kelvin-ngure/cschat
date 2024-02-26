'use client';
import { useEffect, useState } from 'react';
import api from '../util/api';
import User from '../model/User';


export default function Page() {
        const [customers, setCustomers] = useState<User[]>([]);
        const [agents, setAgents] = useState<User[]>([]);

        const [customerInput, setCustomerInput] = useState("");
        const [agentInput, setAgentInput] = useState("");

        const fetchCustomers = async () => {
                try {
                        const response = await api.get("/customer");
                        const data = await response;
                        console.log(data.data)
                        setCustomers(data.data);
                } catch (error) {
                        console.error('Error fetching customers:', error);
                }
        }

        const fetchAgents = async () => {
                try {
                        const response = await api.get("/agent");
                        const data = await response;
                        console.log(data.data)
                        setAgents(data.data);
                } catch (error) {
                        console.error('Error fetching agents:', error);
                }
        }

        const createAgent = async () => {
                const agent: User = { name: agentInput }
                const response = await api.post("/agent", agent)
                const newAgent: User = response.data;
                setAgentInput("")
                setAgents(prevAgents => [...prevAgents, newAgent]);
        }
        const createCustomer = async () => {
                const customer: User = { name: customerInput }
                const response = await api.post("/customer", customer);
                const newCustomer: User = response.data;
                setCustomerInput("")
                setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        }

        useEffect(() => {
                fetchCustomers();
                fetchAgents();
        }, []);

        return (
                <div className="bg-blue-100 text-blue-101 h-screen flex flex-col items-center">
                        <div className='flex flex-col items-center'>
                                <h2>Instructions</h2>
                                <p>
                                        For ease of use and testing, create a customer and an agent. Then click on the customer's name on the list of customers to login as them.<br />
                                        Then open a new tab to this base url. Click on an agent's name to login as them.<br />
                                        You can also open a different tab as a different customer to verify that a customer can only see their message thread but an agent can see all message threads.<br />
                                </p>
                        </div>

                        <div className='flex items-center justify-center w-full h-full'>
                                <div className="flex-1 flex-col justify-center">
                                        <div className="flex flex-col items-center justify-center">
                                                <h3>Create customer</h3>
                                                <input className="rounded-lg border border-gray-300 p-2" type="text" id="customer" name="customer" placeholder="customer name"  value={customerInput} onChange={(e) => setCustomerInput(e.target.value)} />
                                                <button className="bg-blue-200 text-blue-500 py-2 px-4 rounded-lg font-semibold mt-12" onClick={() => createCustomer()}>Add customer</button>

                                                <h3 className="mt-12">Customer List</h3>
                                                <ul>
                                                        {customers.map((value, index) => (
                                                                // [userId, receiverId,threadId,userName,userType] 
                                                                <li key={index}><a href={`/conversation?userId=${value.id}&receiverId=0&threadId=""&userName=${value.name}&userType=customer`}>{value.name}</a></li>
                                                        ))}
                                                </ul>

                                        </div>

                                </div>

                                <div className="flex-1 flex-col justify-center">
                                <div className="flex flex-col items-center justify-center">
                                        <h3>Create agent</h3>
                                        <input className="rounded-lg border border-gray-300 p-2" type="text" id="agent" name="agent" placeholder="agent name" value={agentInput} onChange={(e) => setAgentInput(e.target.value)} />
                                        <button className="bg-blue-200 text-blue-500 py-2 px-4 rounded-lg font-semibold mt-12" onClick={() => createAgent()}>Add agent</button>

                                        <h3 className="mt-12">Agent List</h3>
                                        <ul>
                                                {agents.map((value, index) => (
                                                        <li key={index}><a href={`/agent?id=${value.id}&name=${value.name}`}>{value.name}</a></li>
                                                ))}
                                        </ul>
                                        </div>
                                </div>

                        </div>
                </div>
        );
}
