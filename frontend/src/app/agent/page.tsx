'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../util/api';
import Conversation from '../../model/Conversation';
import { Client } from '@stomp/stompjs';
import Message from '../../model/Message';
import Constants from '@/util/constants';

const topic = "/topic/read_public"

const Agent = () => {
    const searchParams = useSearchParams()
    const [userId, userName] = searchParams.values()
    const [latestMessages, setLatestMessages] = useState<{ conversation: Conversation, message: Message }[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    
    useEffect(() => {
        fetchLatestMessages()
    }, [userId]);


    useEffect(() => {
        const stompClient = new Client({
            brokerURL: Constants.BASE_WS_URL,
            reconnectDelay: 5000,
        });

        stompClient.onConnect = function (frame) {
            stompClient.subscribe(topic, function (payload) {
                console.log("current messages")
                console.log(latestMessages)
                const message: Message = JSON.parse(payload.body)
                // check conversation already exists. if it does, remove that pair. if it doesnt, fetch it
                const existingIndex = latestMessages.findIndex(it => it.conversation.id === message.conversationId)
                if (existingIndex === -1) {
                    fetchConversationById(message.conversationId).then(conversation => {
                        updateMessages([{conversation, message}])
                    })
                } else {
                    const updatedMessages = [...latestMessages];
                    const foundConversation  = updatedMessages[existingIndex].conversation;
                    const newPair: { conversation: Conversation, message: Message } = { conversation: foundConversation, message: message };
                    updatedMessages.splice(existingIndex, 1); // Remove existing entry
                    updateMessages([...updatedMessages, newPair]);
                }
                
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

    const fetchConversationById = async (id: Number): Promise<Conversation> => {
        const response = await api.get(`${Constants.CONVERSATION_ENDPOINT}/${id}`)
        const data = await response.data
        return data
    }

    const fetchLatestMessages = async () => {
        const response = await api.get(Constants.CONVERSATION_ENDPOINT);
        const conversations: Conversation[] = response.data;

        const messagePromises = conversations.map(async (conversation) => {
            const message_response = await api.get(`${Constants.CONVERSATION_ENDPOINT}/latest/${conversation.id}`);
            const message: Message = await message_response.data[0];
            return { conversation, message };
        });

        const messagesWithConversations = await Promise.all(messagePromises);
        messagesWithConversations.sort((a, b) => {
            const timeStampA = new Date(a.message.timeStamp) as Date;
            const timeStampB = new Date(b.message.timeStamp) as Date;
            return timeStampB.getTime() - timeStampA.getTime();
        });
        setLatestMessages(prev => [...prev, ...messagesWithConversations]);
    }


    const updateMessages = (items: {conversation: Conversation, message: Message}[]) => {
        setLatestMessages(prev => items)
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
                    latestMessages.map(({ conversation, message }, index) => (
                        <a className='flex flex-col w-full h-full bg-blue-102 px-10 py-5 border-t border-b border-blue-103 border-solid ' key={index} href={`/conversation?userId=${userId}&receiverId=${message.author}&conversationId=${conversation.id}&userName=${userName}&userType=agent`} style={{ textDecoration: 'none' }}>
                            <div className='flex flex-col w-full h-full '>
                                <p>{message.timeStamp}</p>
                                <p>{conversation.id}</p>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    );
}

export default Agent;
