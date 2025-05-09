import React, { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./TableAdminChat.css";
import { emojiList } from "./Helper-Functions";
import {
  addAdminMessage,
  editAdminMessage,
  removeAdminMessage,
} from "../../services/user.services";
import { MIN_LETTERS_EDIT_MESSAGE } from "../../common/common";
import { useState } from "react";
import { Box, Card } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { Button, Modal } from "@mui/base";
import { LoggedInUser } from "../../context/AuthContext.ts";

export interface Message {
  username: string;
  avatar: string;
  time: number;
  content: string;
  id: string;
}
interface TableAdminChat {
  allMessages: Message[];
  user: string | undefined;
  avatar: string | undefined;
  filterAdmins: LoggedInUser[] | undefined;
  loadMoreMessages: () => void;
}

export const TableAdminChat: React.FC<TableAdminChat> = ({
  allMessages,
  user,
  avatar,
  filterAdmins,
  loadMoreMessages
}) => {
  const [incomeMessage, setIncomeMessage] = useState("");
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [messageID, setMessageID] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const handleMessage = async (user: string, avatar: string, incomeMessage: string) => {
    await addAdminMessage(user, avatar, incomeMessage);
    setIncomeMessage("");
  };
  const lastMessageRef: React.RefObject<HTMLElement> = useRef(null);


  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const insertEmoji = (emoji: string) => {
    setIncomeMessage((prevMessage) => prevMessage + emoji);
  };
  const toggleEmojiModal = () => {
    setShowEmojiModal(!showEmojiModal);
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ textAlign: 'center', marginLeft: '10px', color: 'gray' }}>Admin Chat</Typography>
          <hr style={{ marginBottom: '50px' }} />
        </Grid>
      </Grid>
      <Grid container component={Paper} className="chat-section">
        <Grid item xs={3}>
          <Divider />
          <List className="sidebar">
            <div style={{ fontSize: '1.5em' }}>Members</div>
            <hr />
            {filterAdmins?.map((user: LoggedInUser) => (
              <ListItem key={crypto.randomUUID()}>
                <ListItemIcon>
                  <Avatar alt={user.username} src={user.profilePictureURL} />
                </ListItemIcon>
                <ListItemText primary={user.username}>
                  {user.username}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className="message-area">
            {allMessages.length % 10 === 0 &&
              <Button style={{ backgroundColor: 'transparent', border: 'none', color: 'blue' }} onClick={() => loadMoreMessages()}>Load More</Button>
            }
            {allMessages.map((message: Message, index: number) => (
              <ListItem key={message.id} ref={index === allMessages.length - 1 ? lastMessageRef : null}>
                <div>
                  <Avatar alt={message.username} src={message.avatar} />
                  {message.username === user ? (
                    <span
                      style={{
                        color: "gray",
                        fontSize: "15px",
                        marginLeft: "8px",
                        marginRight: "20px",
                      }}
                    >
                      you
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "gray",
                        fontSize: "15px",
                        marginRight: "20px",
                      }}
                    >
                      {message.username}
                    </span>
                  )}
                </div>
                <span>
                  <div style={{ textAlign: "left", marginTop: "5px", marginLeft: '5px' }}>
                    <span style={{ color: "gray", fontSize: "10px" }}>
                      {new Date(message.time).toLocaleString()}
                    </span>
                  </div>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <Card>
                      <ListItemText primary={message.content} />
                    </Card>
                    {message.username === user && (
                      <>
                        <Button
                          style={{
                            fontSize: "2px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => removeAdminMessage(message.id)}
                        >
                          <DeleteIcon style={{ fontSize: "20px" }} />
                        </Button>
                        <Button
                          style={{
                            fontSize: "2px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsSendMessageModalOpen(true);
                            setMessageID(message.id);
                            setMessageContent(message.content)
                          }}
                        >
                          <EditIcon style={{ fontSize: "20px" }} />
                        </Button>
                      </>
                    )}
                  </span>
                </span>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={1}>
              <EmojiEmotionsIcon
                style={{ cursor: "pointer" }}
                onClick={toggleEmojiModal}
              />
              {showEmojiModal && (
                <Dialog open={showEmojiModal} onClose={toggleEmojiModal}>
                  <DialogContent>
                    <div>
                      {emojiList.map((emoji) => (
                        <span
                          key={crypto.randomUUID()}
                          onClick={() => insertEmoji(emoji)}
                          className="emoji"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="outlined-basic-email"
                placeholder="Type your message..."
                fullWidth
                value={incomeMessage}
                onChange={(e) => setIncomeMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && incomeMessage.length > 0) {
                    handleMessage(user, avatar, incomeMessage);
                  }
                }}
              />
            </Grid>
            <Grid item xs={1}>
              {incomeMessage.length > 0 && (
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={() => handleMessage(user, avatar, incomeMessage)}
                >
                  <SendIcon />
                </Fab>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={isSendMessageModalOpen}
        onClose={() => setIsSendMessageModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#EBECF0",
            boxShadow: 24,
            p: 4,
            maxWidth: 350,
            borderRadius: "5%",
          }}
        >
          <h2>Edit message</h2>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder={messageContent}
            rows={7}
            cols={35}
          />
          {messageContent.length > MIN_LETTERS_EDIT_MESSAGE && (
            <Button
              onClick={() => {
                editAdminMessage(messageID, messageContent);
                setIsSendMessageModalOpen(false);
                setMessageContent("");
                setMessageID("");
              }}
              style={{ textAlign: "center" }}
            >
              Edit
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};
