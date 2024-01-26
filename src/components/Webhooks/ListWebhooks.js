import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import { notify } from "../../utils/notify";

const columns = [
  { id: "sourceUrl", label: "Source Url", minWidth: 170 },
  { id: "callbackUrl", label: "Callback Url", minWidth: 100 },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right",
  },
];

function ListWebhooks() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [webhooksList, setWebhooksList] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const unsubscribe = async (sourceUrl, callbackUrl) => {
    const res = await fetch("http://localhost:3000/webhooks/unsubscribe", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        sourceUrl,
        callbackUrl,
      }),
    });

    if (res.ok === true) {
      notify("Unsubscribed successfully");
      fetchWebhooks();
    } else {
      const data = await res.json();
      notify(data.message, "error");
    }
  };

  const fetchWebhooks = async () => {
    const res = await fetch("http://localhost:3000/webhooks/listall", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();

    if (res.ok === true) {
      setWebhooksList(data);
    } else {
      notify("Could not fetch webhooks list", "error");
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <b>{column.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooksList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      if (column.id == "action") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <DeleteIcon
                              onClick={() => {
                                unsubscribe(row.sourceUrl, row.callbackUrl);
                              }}
                            />
                          </TableCell>
                        );
                      }
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={webhooksList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
export default ListWebhooks;
