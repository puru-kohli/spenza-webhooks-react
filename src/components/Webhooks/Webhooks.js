import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../ResponsiveAppBar";
import Subscribe from "./Subscribe";
import ListWebhooks from "./ListWebhooks";
import WebhooksDetails from "./WebhooksDetails";
import { isTokenExpired } from "../../auth/checkAuth";

function Webhooks() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired()) {
      navigate("/login");
    }
  }, []);

  const [selectedPage, setSelectedPage] = useState();

  const pages = ["Subscribe", "List All", "Details"];
  return (
    <>
      <ResponsiveAppBar
        pages={pages}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      {selectedPage === "Subscribe" && <Subscribe />}
      {selectedPage === "List All" && <ListWebhooks />}
      {selectedPage === "Details" && <WebhooksDetails />}
    </>
  );
}
export default Webhooks;
