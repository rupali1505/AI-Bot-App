import { Box, Stack, Typography } from "@mui/material";
import InitialChat from "../../Components/InitialChat/InitialChat";
import ChatInput from "../../Components/ChatInput/ChatInput";
import ChattingCard from "../../Components/ChattingCard/ChattingCard";
import FeedbackModal from "../../Components/FeedbackModal/FeedbackModal";
import { useEffect, useRef, useState } from "react";
import data from "../../aiData/sampleData.json";
import { useOutletContext } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { ThemeContext } from "../../Theme/ThemeContext";
import { useContext } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const listRef = useRef(null);
  const [chatId, setChatId] = useState(1);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const { chat, setChat } = useOutletContext();
  const { mode } = useContext(ThemeContext);

 
  const generateResponse = (input) => {
    const response = data.find(
      (item) => input.toLowerCase() == item.question.toLowerCase()
    );

    let answer = "Sorry, Did not understand your query!";

    if (response != undefined) {
      answer = response.response;
    }

    setChat((prev) => [
      ...prev,
      {
        type: "Human",
        text: input,
        time: new Date(),
        id: chatId,
      },
      {
        type: "AI",
        text: answer,
        time: new Date(),
        id: chatId + 1,
      },
    ]);

    setChatId((prev) => prev + 2);
  };

  
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [scrollToBottom]);
return (
  <Box height="100vh" display="flex" flexDirection="column" mt={0}>
   
    <Navbar />

    
    <Stack
      height="100%"
      flexGrow={1}
      justifyContent="space-between"
      sx={{
        "@media (max-width:767px)": {
          background:
            mode == "light" ? "linear-gradient(#F9FAFA 60%, #EDE4FF)" : "",
        },
      }}
    >
      {chat.length === 0 && <InitialChat generateResponse={generateResponse} />}

      {chat.length > 0 && (
        <Stack
          flexGrow={1}
          p={{ xs: 2, md: 3 }}
          spacing={{ xs: 2, md: 3 }}
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 10 },
          }}
          ref={listRef}
        >
          {chat.map((item, index) => (
            <ChattingCard
              details={item}
              key={index}
              updateChat={setChat}
              setSelectedChatId={setSelectedChatId}
              showFeedbackModal={() => setShowModal(true)}
            />
          ))}
        </Stack>
      )}

      <ChatInput
        generateResponse={generateResponse}
        setScroll={setScrollToBottom}
        chat={chat}
        clearChat={() => setChat([])}
      />
    </Stack>

    <FeedbackModal
      open={showModal}
      updateChat={setChat}
      chatId={selectedChatId}
      handleClose={() => setShowModal(false)}
    />
  </Box>
);

}
