"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
   const { messages, input, handleInputChange, handleSubmit } = useChat();

   const [files, setFiles] = useState<FileList | undefined>(undefined);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   return (
     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
       <div className="mb-[180px] overflow-y-auto">
         {messages.map((m) => (
           <div key={m.id} className="whitespace-pre-wrap mb-4">
             {m.role === "user" ? "User: " : "AI: "}
             {m.content}
             <div>
               {m?.experimental_attachments
                 ?.filter((attachment) => attachment?.contentType?.startsWith("image/"))
                 .map((attachment, index) => (
                   <img
                     key={`${m.id}-${index}`}
                     src={attachment.url}
                     width={500}
                     alt={attachment.name}
                   />
                 ))}
             </div>
           </div>
         ))}
         <div ref={messagesEndRef} />
       </div>

       <form
         className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2 bg-white"
         onSubmit={(event) => {
           handleSubmit(event, {
             experimental_attachments: files,
           });

           setFiles(undefined);

           if (fileInputRef.current) {
             fileInputRef.current.value = "";
           }
         }}
       >
         <input
           type="file"
           className=""
           onChange={(event) => {
             if (event.target.files) {
               setFiles(event.target.files);
             }
           }}
           multiple
           ref={fileInputRef}
         />
         <input
           className="w-full p-2 text-black"
           value={input}
           placeholder="Say something..."
           onChange={handleInputChange}
         />
       </form>
     </div>
   );
}