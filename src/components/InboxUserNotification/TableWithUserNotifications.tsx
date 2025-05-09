import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Modal, Paper, Typography, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { deleteNotification } from "../../services/user.services";

interface Notification {
  time: number;
  content: string;
  id: string;
}

interface TableWithNotificationsProps {
  incomeNotifications: Notification[];
  user: string;
}

export const TableWithNotifications: React.FC<TableWithNotificationsProps> = ({ incomeNotifications, user }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setModalOpen(false);
  };

  return (
    <div>
      {incomeNotifications.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeNotifications.map((notification) => (
              <TableRow key={notification.time}>
                <TableCell>{new Date(notification.time).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => openModal(notification)}>Click here to read content</Button>
                </TableCell>
                <TableCell style={{cursor: 'pointer'}}><ClearIcon  onClick={() => deleteNotification(user, notification.id)}/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h3>There are currently no notifications!</h3>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="notification-modal"
        aria-describedby="notification-modal-description"
      >
        <Paper sx={{ position: 'absolute', width: 400, height: 200, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 2 }}>
          <Typography variant="h6" id="notification-modal">Notification Content
          <Button variant="outlined" onClick={closeModal} style={{ marginLeft: '115px', border: 'none' }}>
            X
          </Button></Typography>
          <hr />
          {selectedNotification && (
            <Typography variant="body2" id="notification-modal-description">
              {selectedNotification.content}
            </Typography>
          )}
        </Paper>
      </Modal>
    </div>
  );
};
