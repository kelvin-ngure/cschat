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
    const [newMessage,setNewMessage] = useState<Message>()


    useEffect(() => {
        fetchLatestMessages()
    }, [userId]);

    useEffect(() => {
        console.log("new message")
        console.log(newMessage)
        if(newMessage) updateMessages(newMessage)
    }, [newMessage]);



    useEffect(() => {
        const stompClient = new Client({
            brokerURL: Constants.BASE_WS_URL,
            reconnectDelay: 5000,
        });

        stompClient.onConnect = function (frame) {
            stompClient.subscribe(topic, function (payload) {
                console.log("the new message")
                const message: Message = JSON.parse(payload.body)
                setNewMessage(message)

            });
        };

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [topic, latestMessages]);

    const fetchConversationById = async (id: Number): Promise<Conversation> => {
        const response = await api.get(`${Constants.CONVERSATION_ENDPOINT}/${id}`)
        const data = await response.data
        return data
    }

    const fetchLatestMessages = async () => {
        console.log("called again")
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
        console.log(messagesWithConversations)
        console.log("before")
        console.log(latestMessages)
        setLatestMessages(prev => [...messagesWithConversations]);
    }


    const updateMessages = (message: Message) => {
        // check conversation for this message already exists. if it does, replace. its message. if it doesnt, fetch it
        console.log("message that came in")
        console.log(message)

        console.log("latest messages")
        console.log(latestMessages)
        let latest = latestMessages
        const existingPair = latest.findIndex(it => it.conversation.id === message.conversationId)

        if(existingPair === -1) {
            fetchConversationById(message.conversationId).then(conversation => {
                setLatestMessages(prev => [...prev, {conversation, message}])
            })
        } else {
            latest[existingPair].message =  message
            setLatestMessages([...latest])
        }
    }

    const selfAssignConversation = async (conv: Conversation) => {
        const response = await api.post(`${Constants.CONVERSATION_ENDPOINT}/assign/${userId}`, conv)
        const conversation: Conversation = await JSON.parse(response.data)
        // find latest message in this conversation and update it
        const conv_message = latestMessages.find(it => it.conversation.id === conversation.id)
        updateMessages([{ conversation: conversation, message: conv_message.message }])
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
            <div className='flex flex-col w-full px-20 h-20'>
                {
                    latestMessages.map(({ conversation, message }, index) => (
                        <a className='flex flex-col w-full h-full bg-blue-102 px-10 pb-5 pt-5 border-t border-b border-blue-103 border-solid ' key={index} href={`/conversation?userId=${userId}&receiverId=${message.author}&conversationId=${conversation.id}&userName=${userName}&userType=agent`} style={{ textDecoration: 'none' }}>
                            <div className='grid grid-cols-6 gap-4'>
                                <p className='col-span-1'>{message.author}</p>
                                <p className='col-span-3'>{message.text}</p>
                                <p className='col-span-1'>{message.timeStamp}</p>
                                {conversation.assignedTo ? (
                                    <p className='col-span-1' style={{ backgroundColor: 'yellow', color: 'black', textAlign: 'center' }}>{conversation.assignedTo}</p>
                                ) : (
                                    <button onClick={() => { selfAssignConversation(conversation) }} style={{ backgroundColor: 'green', color: 'black' }}>self-assign</button>
                                )

                                }
                            </div>
                        </a>
                    ))
                }

            </div>
        </div>
    );
}

export default Agent;
