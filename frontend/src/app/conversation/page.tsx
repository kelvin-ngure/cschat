'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../util/api';
import Message from '../../model/Message';
import Conversation from '../../model/Conversation';
import User from '../../model/User';
import { Client } from '@stomp/stompjs';
import { getCurrentTimestamp } from '@/util/timeUtils';
import Constants from '@/util/constants';
import StockMessage from '@/model/StockMessage';

const Conversation = () => {
    const searchParams = useSearchParams()
    const [userId, receiverId, conversationId, userName, userType] = searchParams.values()


    // configure topics and receivers based on user type
    const app = userType === 'customer' ? '/app/send_to_agents' : `/app/send_to_customer`;
    const topic = userType === 'customer' ? `/user/${userId}/private` : '/topic/read_public';

    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation_id, setConversationId] = useState(conversationId) // only used by customer since agent only replies

    const [messageText, setMessageText] = useState("")
    const [client, setClient] = useState<Client | null>(null);

    const [stockMessages, setStockMessages] = useState<StockMessage[]>([])

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: Constants.BASE_WS_URL,
            reconnectDelay: 5000,
        });

        stompClient.onConnect = function (frame) {
            stompClient.subscribe(topic, function (payload) {
                const message = JSON.parse(payload.body);
                setMessages(prev => [...prev, message]);
            });
        };

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [topic]);

    useEffect(() => {
        if (userType === "agent") {
            fetchStockMessages()
        }
        if (conversation_id === "\"\"") { // cant be null for agent
            fetchConversation(userId).then(id => { if (id) { fetchMessages(id) } })
        } else {
            fetchMessages(conversation_id) // case for agent since id is present. case for returning customer
        }
    }, [conversationId]);

    const fetchStockMessages = async () => {
        const response = await api.get(`/message/stock`)
        const data = await response.data
        console.log(data)
        setStockMessages(data)
    }

    const fetchConversation = async (userId: string) => {
        const response = await api.get(`/conversation/customer/${userId}`)
        const data = await response.data
        const conversation = await data.id
        await setConversationId(conversation)
        return Promise.resolve(conversation)
    }

    const createConversation = async (userId: string) => {
        const customer: User = { id: parseInt(userId), name: userName }
        const response = await api.post("/conversation", customer)
        const conversation: Conversation = response.data
        await setConversationId(conversation.id! + "")
        return Promise.resolve(conversation)
    }

    const sendMessage = async () => {
        let tid = conversation_id;
        if (tid === undefined) {
            const response = await createConversation(userId)
            tid = response.id!
        }

        try {
            const message: Message = {
                conversationId: tid,
                text: messageText,
                author: userId,
                recipient: receiverId,
                timeStamp: getCurrentTimestamp()
            };
            client.publish({
                destination: app,
                body: JSON.stringify(message)
            })
            setMessageText("")
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    }

    const fetchMessages = async (conversationId: number) => {
        try {
            console.log("fetching messos")
            const response = await api.get(`/conversation/${conversationId}/messages`);
            const data = await response.data;
            setMessages(data)
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    return (
        <div className="bg-blue-100 text-blue-101 h-screen flex flex-col">
            <div className="flex flex-row w-full justify-between px-12 py-8 flex-grow">
                <div>
                    <h2>{userType} account</h2>
                </div>
                <div>
                    <a href={`/customer?userId=${receiverId}&userType=customer`}>View customer profile</a>
                </div>
                <div className='flex justify-end'>
                    <h3>Logged in as {userName}</h3>
                </div>
            </div>

            <div className='px-20'>
                {messages.map((message, index) => (
                    <div key={index} className={`flex flex-row w-full ${message.author + "" === userId ? `justify-end` : `justify-start`}`}>
                        <p className={`${message.author + "" === userId ? 'bg-green-100 text-blue-101 text-right p-3 pl-8 m-3 rounded-lg' : 'bg-blue-101 text-blue-100 text-left p-3 pr-8 m-3 rounded-lg'}`}>{message.text}</p>
                    </div>
                ))}
            </div>

            <div className='flex flex-col justify-center px-10'>

                <div className='flex flex-row justify-center px-10'>
                    {stockMessages.map((message, index) => (
                        <div key={message.id}>
                            <p>{message.text}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row justify-center px-10'>
                    <input className="flex-grow p-2 m-3 rounded-lg border border-gray-300" type="text" id="agent" name="agent" placeholder="message" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                    <button className="bg-blue-200 text-blue-500 p-2 m-3 rounded-lg font-semibold" onClick={sendMessage}> send message </button>
                </div>
            </div>
        </div>
    );
}

export default Conversation;
