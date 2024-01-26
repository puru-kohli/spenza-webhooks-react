import { useEffect, useState, Fragment } from "react";
import io from "socket.io-client";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { notify } from "../../utils/notify";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.sourceUrl}
        </TableCell>
        <TableCell align="right">{row.callbackUrl}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              {row.contents.map((content) => {
                return <p>{JSON.stringify(content.content)}</p>;
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

function WebhooksDetails() {
  const [webhooks, setWebhooks] = useState([]);

  useEffect(() => {
    const webhooksDetails = async () => {
      const res = await fetch(
        "http://localhost:3000/webhooks/webhooksDetails",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      if (res.ok === true) {
        console.log("sss", data, data.webhookDetails);
        setWebhooks(data.webhookDetails);
      } else {
        notify(data.message, "error");
      }
    };

    webhooksDetails();

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("socket connected");
      fetch("http://localhost:3000/socket/registerUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          socketId: socket.id,
        }),
      });
    });

    socket.on("message", (message) => {
      switch (message.type) {
        case "newWebhookEvent":
          setWebhooks((oldwebhooks) =>
            [...oldwebhooks].map((oldwebhook) => {
              if (oldwebhook.sourceUrl === message.sourceUrl) {
                return {
                  ...oldwebhook,
                  contents: [
                    ...oldwebhook.contents,
                    { content: message.content },
                  ],
                };
              } else return oldwebhook;
            })
          );
          break;
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <b>Source Url</b>
            </TableCell>
            <TableCell align="right">
              <b>Callbck Url</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {webhooks &&
            webhooks.map((webhook) => (
              <Row key={webhook.sourceUrl} row={webhook} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default WebhooksDetails;
