'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../util/api';
import Conversation from '../../model/Conversation';
import {Client} from '@stomp/stompjs';
import Message from '../../model/Message';
import Constants from '@/util/constants';

const topic = "/topic/read_public"

const Agent = () => {
    const searchParams = useSearchParams()
    const [userId, userName] = searchParams.values()
    const [latestMessages, setLatestMessages] = useState<Message[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: Constants.BASE_WS_URL,
            reconnectDelay: 5000,
        });
        
        stompClient.onConnect = function (frame) {
            stompClient.subscribe(topic, function (payload) {
                const message: Message = JSON.parse(payload.body)
                updateMessages(message)
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
        fetchLatestMessages()
    }, []);

    const fetchLatestMessages = async () => {
        console.log("fetching messages...")
        const response = await api.get(Constants.CONVERSATION_ENDPOINT);
        const conversations: Conversation[] = response.data;

        const messagePromises = conversations.map(async (conversation) => {
            const message_response = await api.get(`${Constants.CONVERSATION_ENDPOINT}/latest/${conversation.id}`);
            const message: Message = await message_response.data[0];
            return message;
        });
        const messages = await Promise.all(messagePromises);
        setLatestMessages(prev => [...latestMessages, ...messages])
    }


    const updateMessages = (message: Message) => {
        const duplicate = latestMessages.find(val => val.conversationId === message.conversationId)
        if (duplicate !== undefined) { // if a message of that conversationId exists, remove it. we just want to show latest
            console.log("removing duplicate")
            const duplicate_removed = latestMessages.filter(val => val.conversationId !== message.conversationId)
            const updated = [message, ...duplicate_removed]
            setLatestMessages(updated)
        } else {
            const update = [message, ...latestMessages]
            setLatestMessages(update)
        }
    }

    return (
        <div className="bg-blue-100 text-blue-101 h-screen flex flex-col items-center">
            <div className="flex flex-row w-full justify-between px-12 py-8">
                <div>
                    <h2>agent account</h2>
                </div>
                <div className='flex justify-end'>
                    <h3>Logged in as {userName}</h3>
                </div>
            </div>
            <div className='flex flex-col w-full px-20 h-16'>
                {
                    latestMessages.map((message, index) => (
                        //  [userId, receiverId,conversationId,userName,userType] 
                        <a className='flex flex-col w-full h-full bg-blue-102 px-10 py-5 border-t border-b border-blue-103 border-solid ' key={index} href={`/conversation?userId=${userId}&receiverId=${message.author}&conversationId=${message.conversationId}&userName=${userName}&userType=agent`} style={{ textDecoration: 'none' }}>
                            <div className='flex flex-col w-full h-full '>
                                <p>{message.text}</p>
                            </div>
                        </a>
                    )
                    )
                }
            </div>
        </div>
    );
}

export default Agent;
