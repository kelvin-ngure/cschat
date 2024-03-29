'use client';
import { useEffect, useState } from 'react';
import api from '../util/api';
import User from '../model/User';
import Constants from '@/util/constants';


export default function Page() {
        const [customers, setCustomers] = useState<User[]>([]);
        const [agents, setAgents] = useState<User[]>([]);

        const [customerInput, setCustomerInput] = useState("");
        const [agentInput, setAgentInput] = useState("");

        const fetchCustomers = async () => {
                try {
                        const response = await api.get(Constants.CUSTOMER_ENDPOINT);
                        const data = await response;
                        console.log(data.data)
                        setCustomers(data.data);
                } catch (error) {
                        console.error('Error fetching customers:', error);
                }
        }

        const fetchAgents = async () => {
                try {
                        const response = await api.get(Constants.AGENT_ENDPOINT);
                        const data = await response;
                        console.log(data.data)
                        setAgents(data.data);
                } catch (error) {
                        console.error('Error fetching agents:', error);
                }
        }

        const createAgent = async () => {
                const agent: User = { name: agentInput }
                const response = await api.post(Constants.AGENT_ENDPOINT, agent)
                const newAgent: User = response.data;
                setAgentInput("")
                setAgents(prevAgents => [...prevAgents, newAgent]);
        }
        const createCustomer = async () => {
                const customer: User = { name: customerInput }
                const response = await api.post(Constants.CUSTOMER_ENDPOINT, customer);
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
                                        You can also open a different tab as a different customer to verify that a customer can only see their conversation but an agent can see all conversations.<br />
                                </p>
                        </div>

                        <div className='flex items-center justify-center w-full h-full'>
                                <div className="flex-1 flex-col justify-center">
                                        <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-lg font-semibold">Create customer</h3>
                                                <input className="rounded-lg border border-gray-300 p-2" type="text" id="customer" name="customer" placeholder="Customer name" value={customerInput} onChange={(e) => setCustomerInput(e.target.value)} />
                                                <button className="bg-blue-200 text-blue-500 py-2 px-4 rounded-lg font-semibold mt-4" onClick={() => createCustomer()}>Add customer</button>

                                                <h3 className="mt-8 text-lg font-semibold">Customer List</h3>
                                                <ul className="max-h-40 overflow-y-auto">
                                                        {customers.map((value, index) => (
                                                                <li key={index} className="py-1">
                                                                        <a href={`/conversation?userId=${value.id}&receiverId=0&conversationId=""&assignedTo=""&userName=${value.name}&userType=customer`} className="text-blue-500 hover:underline">{value.name}</a>
                                                                </li>
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
                                                                <li key={index}><a href={`/agent?userId=${value.id}&userName=${value.name}`}>{value.name}</a></li>
                                                        ))}
                                                </ul>
                                        </div>
                                </div>

                        </div>
                </div>
        );
}
